import {
  ForbiddenException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import Redis from 'ioredis';
import { REDIS_CLIENT } from '../../redis/redis.constants';
import {
  Appointment,
  AppointmentStatus,
} from '../../database/entities/appointment.entity';

// ── Redis key helpers ──────────────────────────────────────────────────────────

const PARTICIPANTS_KEY = (roomId: string) =>
  `consultation:room:${roomId}:participants`;
const STATUS_KEY = (roomId: string) =>
  `consultation:room:${roomId}:status`;
const STARTED_AT_KEY = (roomId: string) =>
  `consultation:room:${roomId}:startedAt`;

/** 4-hour TTL on every room key */
const ROOM_TTL = 4 * 3600;

// ── Public types ───────────────────────────────────────────────────────────────

export interface StunServer {
  urls: string;
}

export interface TurnServer {
  urls: string;
  username: string;
  credential: string;
}

export interface ConsultationJoinResponse {
  roomId: string;
  token: string;
  stunServers: StunServer[];
  turnServers: TurnServer[];
}

export type RoomStatus = 'waiting' | 'active' | 'ended';

export interface ConsultationStatusResponse {
  status: RoomStatus;
  participants: number;
  startedAt: string | null;
}

// ── Service ────────────────────────────────────────────────────────────────────

@Injectable()
export class ConsultationService {
  private readonly logger = new Logger(ConsultationService.name);

  constructor(
    @InjectRepository(Appointment)
    private readonly appointmentRepo: Repository<Appointment>,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    @Inject(REDIS_CLIENT) private readonly redis: Redis,
  ) {}

  // ── REST handlers ──────────────────────────────────────────────────────────

  /**
   * Validate the requesting user is a participant, then return room credentials
   * including a short-lived room JWT and ICE server configuration.
   */
  async join(
    userId: string,
    appointmentId: string,
  ): Promise<ConsultationJoinResponse> {
    await this.requireParticipant(userId, appointmentId);

    const secret =
      this.configService.get<string>('CONSULTATION_TOKEN_SECRET') ??
      'consultation-secret';
    const expiresIn =
      this.configService.get<string>('CONSULTATION_TOKEN_EXPIRY') ?? '2h';

    const token = this.jwtService.sign(
      { sub: userId, roomId: appointmentId, type: 'consultation' },
      { secret, expiresIn },
    );

    this.logger.log(`join: userId=${userId} room=${appointmentId}`);

    return {
      roomId: appointmentId,
      token,
      stunServers: this.buildStunServers(),
      turnServers: this.buildTurnServers(),
    };
  }

  /**
   * Return the live call status by reading the Redis room keys.
   * Falls back to "ended" when no room key exists (call never started or already finished).
   */
  async getStatus(
    userId: string,
    appointmentId: string,
  ): Promise<ConsultationStatusResponse> {
    await this.requireParticipant(userId, appointmentId);

    const [statusRaw, count, startedAt] = await Promise.all([
      this.redis.get(STATUS_KEY(appointmentId)),
      this.redis.scard(PARTICIPANTS_KEY(appointmentId)),
      this.redis.get(STARTED_AT_KEY(appointmentId)),
    ]);

    const status: RoomStatus = (statusRaw as RoomStatus | null) ?? 'ended';

    return { status, participants: count, startedAt };
  }

  // ── Room lifecycle (called by SocketGateway) ───────────────────────────────

  /**
   * Add a userId to the room's participant set.
   * Returns the new participant count.
   */
  async addParticipant(roomId: string, userId: string): Promise<number> {
    const key = PARTICIPANTS_KEY(roomId);
    await this.redis.sadd(key, userId);
    await this.redis.expire(key, ROOM_TTL);
    return this.redis.scard(key);
  }

  /**
   * Remove a userId from the room's participant set.
   * Returns the remaining participant count.
   */
  async removeParticipant(roomId: string, userId: string): Promise<number> {
    await this.redis.srem(PARTICIPANTS_KEY(roomId), userId);
    return this.redis.scard(PARTICIPANTS_KEY(roomId));
  }

  /** Return the current number of participants without modifying state. */
  async getParticipantCount(roomId: string): Promise<number> {
    return this.redis.scard(PARTICIPANTS_KEY(roomId));
  }

  /**
   * Transition room to "waiting" (1 participant present).
   * Called on first join or when one of two participants leaves.
   */
  async onRoomWaiting(roomId: string): Promise<void> {
    await this.redis.setex(STATUS_KEY(roomId), ROOM_TTL, 'waiting');
    this.logger.log(`room:waiting room=${roomId}`);
  }

  /**
   * Transition room to "active" (both participants joined).
   * Records call start time in Redis and persists to the appointment's callLog.
   */
  async onRoomActive(roomId: string): Promise<void> {
    const now = new Date().toISOString();
    await Promise.all([
      this.redis.setex(STATUS_KEY(roomId), ROOM_TTL, 'active'),
      this.redis.setex(STARTED_AT_KEY(roomId), ROOM_TTL, now),
    ]);
    await this.appointmentRepo.update(roomId, {
      callLog: { startedAt: now },
    });
    this.logger.log(`room:active room=${roomId} startedAt=${now}`);
  }

  /**
   * Clean up after the room empties.
   * If the call was active, persists endedAt and durationSeconds to the appointment
   * and marks it COMPLETED. Always removes all Redis room keys.
   */
  async onRoomEmpty(roomId: string): Promise<void> {
    const startedAt = await this.redis.get(STARTED_AT_KEY(roomId));

    if (startedAt) {
      const endedAt = new Date().toISOString();
      const durationSeconds = Math.round(
        (Date.now() - new Date(startedAt).getTime()) / 1000,
      );
      await this.appointmentRepo.update(roomId, {
        callLog: { startedAt, endedAt, durationSeconds },
        status: AppointmentStatus.COMPLETED,
      });
      this.logger.log(
        `room:ended room=${roomId} duration=${durationSeconds}s`,
      );
    }

    await this.redis.del(
      PARTICIPANTS_KEY(roomId),
      STATUS_KEY(roomId),
      STARTED_AT_KEY(roomId),
    );
  }

  // ── Shared validation ──────────────────────────────────────────────────────

  /**
   * Verify appointment exists and that userId is either the patient
   * or the doctor's linked user. Throws 404 or 403 on failure.
   */
  async requireParticipant(
    userId: string,
    appointmentId: string,
  ): Promise<Appointment> {
    const appt = await this.appointmentRepo.findOne({
      where: { id: appointmentId },
      relations: ['doctor'],
    });

    if (!appt) {
      throw new NotFoundException({
        code: 'APPOINTMENT_NOT_FOUND',
        message: 'Appointment not found.',
      });
    }

    const isPatient = appt.patientId === userId;
    const isDoctorUser = appt.doctor?.userId === userId;

    if (!isPatient && !isDoctorUser) {
      throw new ForbiddenException({
        code: 'NOT_A_PARTICIPANT',
        message: 'You are not a participant of this appointment.',
      });
    }

    return appt;
  }

  // ── ICE server builders ────────────────────────────────────────────────────

  private buildStunServers(): StunServer[] {
    const url =
      this.configService.get<string>('STUN_SERVER_URL') ??
      'stun:stun.l.google.com:19302';
    return [{ urls: url }];
  }

  private buildTurnServers(): TurnServer[] {
    const url = this.configService.get<string>('TURN_SERVER_URL');
    if (!url) return [];
    return [
      {
        urls: url,
        username:
          this.configService.get<string>('TURN_SERVER_USERNAME') ?? '',
        credential:
          this.configService.get<string>('TURN_SERVER_CREDENTIAL') ?? '',
      },
    ];
  }
}
