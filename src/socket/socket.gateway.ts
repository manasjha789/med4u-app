import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server } from 'socket.io';
import { ConsultationService } from '../modules/consultations/consultation.service';
import {
  AuthenticatedSocket,
  SocketAuthMiddleware,
} from './socket.middleware';

// ── Payload interfaces ─────────────────────────────────────────────────────────

interface JoinRoomPayload {
  roomId: string;
  role: 'patient' | 'doctor';
}

/** SDP is forwarded opaquely — typed as a plain object to avoid DOM dependency */
interface SdpPayload {
  roomId: string;
  sdp: Record<string, unknown>;
}

interface IceCandidatePayload {
  roomId: string;
  candidate: Record<string, unknown>;
}

interface LeaveRoomPayload {
  roomId: string;
}

interface CallRejectedPayload {
  roomId: string;
  reason: string;
}

// ── Gateway ────────────────────────────────────────────────────────────────────

@WebSocketGateway({
  cors: { origin: '*', credentials: true },
})
export class SocketGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  private readonly server!: Server;

  private readonly logger = new Logger(SocketGateway.name);

  /**
   * In-memory map: socketId → { roomId, userId }.
   * Used for automatic leave-room cleanup on disconnect.
   */
  private readonly socketRoom = new Map<
    string,
    { roomId: string; userId: string }
  >();

  constructor(
    private readonly consultationService: ConsultationService,
    private readonly socketAuthMiddleware: SocketAuthMiddleware,
  ) {}

  // ── Lifecycle hooks ────────────────────────────────────────────────────────

  /** Attach JWT auth middleware to the default namespace after init. */
  afterInit(server: Server): void {
    server.use((socket, next) =>
      this.socketAuthMiddleware.use(socket as AuthenticatedSocket, next),
    );
    this.logger.log('SocketGateway initialised');
  }

  handleConnection(socket: AuthenticatedSocket): void {
    this.logger.debug(`connected  socketId=${socket.id}`);
  }

  /**
   * Auto-trigger leave logic when a socket drops without sending leave-room.
   * Safe to call even when the socket was never in a room.
   */
  handleDisconnect(socket: AuthenticatedSocket): void {
    this.logger.debug(`disconnected socketId=${socket.id}`);
    void this.handleLeave(socket);
  }

  // ── join-room ──────────────────────────────────────────────────────────────

  /**
   * Client joins a consultation room.
   * Enforces: user must be appointment participant, max 2 occupants.
   */
  @SubscribeMessage('join-room')
  async handleJoinRoom(
    @ConnectedSocket() socket: AuthenticatedSocket,
    @MessageBody() payload: JoinRoomPayload,
  ): Promise<void> {
    const { roomId, role } = payload;
    const userId = socket.data.user.sub;

    // 1 — Verify the appointment exists and this user belongs to it
    try {
      await this.consultationService.requireParticipant(userId, roomId);
    } catch (err) {
      socket.emit('error', { message: (err as Error).message });
      socket.disconnect(true);
      return;
    }

    // 2 — Enforce 2-participant cap (check BEFORE adding)
    const currentCount =
      await this.consultationService.getParticipantCount(roomId);
    if (currentCount >= 2) {
      socket.emit('room-full', {
        message: 'Room is full. Maximum 2 participants allowed.',
      });
      socket.disconnect(true);
      return;
    }

    // 3 — Join Socket.IO room + update Redis
    await socket.join(roomId);
    const newCount = await this.consultationService.addParticipant(
      roomId,
      userId,
    );

    // 4 — Track socket for disconnect cleanup
    this.socketRoom.set(socket.id, { roomId, userId });

    // 5 — Notify existing participant(s)
    socket.to(roomId).emit('user-joined', { userId, role });

    this.logger.log(
      `join-room userId=${userId} role=${role} room=${roomId} [${newCount}/2]`,
    );

    // 6 — Update room lifecycle state
    if (newCount === 1) {
      await this.consultationService.onRoomWaiting(roomId);
    } else if (newCount === 2) {
      await this.consultationService.onRoomActive(roomId);
    }
  }

  // ── offer ──────────────────────────────────────────────────────────────────

  /**
   * Relay a WebRTC SDP offer to the other participant in the room.
   */
  @SubscribeMessage('offer')
  handleOffer(
    @ConnectedSocket() socket: AuthenticatedSocket,
    @MessageBody() payload: SdpPayload,
  ): void {
    if (!this.socketRoom.has(socket.id)) {
      socket.emit('error', { message: 'You are not in a room.' });
      return;
    }
    socket
      .to(payload.roomId)
      .emit('offer', { sdp: payload.sdp, from: socket.data.user.sub });
  }

  // ── answer ─────────────────────────────────────────────────────────────────

  /**
   * Relay a WebRTC SDP answer to the other participant in the room.
   */
  @SubscribeMessage('answer')
  handleAnswer(
    @ConnectedSocket() socket: AuthenticatedSocket,
    @MessageBody() payload: SdpPayload,
  ): void {
    if (!this.socketRoom.has(socket.id)) {
      socket.emit('error', { message: 'You are not in a room.' });
      return;
    }
    socket
      .to(payload.roomId)
      .emit('answer', { sdp: payload.sdp, from: socket.data.user.sub });
  }

  // ── ice-candidate ──────────────────────────────────────────────────────────

  /**
   * Relay an ICE candidate to the other participant in the room.
   */
  @SubscribeMessage('ice-candidate')
  handleIceCandidate(
    @ConnectedSocket() socket: AuthenticatedSocket,
    @MessageBody() payload: IceCandidatePayload,
  ): void {
    if (!this.socketRoom.has(socket.id)) {
      socket.emit('error', { message: 'You are not in a room.' });
      return;
    }
    socket.to(payload.roomId).emit('ice-candidate', {
      candidate: payload.candidate,
      from: socket.data.user.sub,
    });
  }

  // ── leave-room ─────────────────────────────────────────────────────────────

  /**
   * Explicit leave. Triggers the same cleanup as a disconnect.
   */
  @SubscribeMessage('leave-room')
  async handleLeaveRoom(
    @ConnectedSocket() socket: AuthenticatedSocket,
    @MessageBody() _payload: LeaveRoomPayload,
  ): Promise<void> {
    await this.handleLeave(socket);
  }

  // ── call-rejected ──────────────────────────────────────────────────────────

  /**
   * Notify the room that the call was rejected, then leave.
   */
  @SubscribeMessage('call-rejected')
  async handleCallRejected(
    @ConnectedSocket() socket: AuthenticatedSocket,
    @MessageBody() payload: CallRejectedPayload,
  ): Promise<void> {
    socket.to(payload.roomId).emit('call-ended', { reason: payload.reason });
    await this.handleLeave(socket);
  }

  // ── Private helpers ────────────────────────────────────────────────────────

  /**
   * Core leave logic shared by leave-room event, call-rejected, and disconnect.
   * Idempotent — safe to call even if the socket was never tracked.
   */
  private async handleLeave(socket: AuthenticatedSocket): Promise<void> {
    const tracked = this.socketRoom.get(socket.id);
    if (!tracked) return;

    const { roomId, userId } = tracked;

    // Remove from in-memory map first to prevent double execution
    this.socketRoom.delete(socket.id);

    // Leave Socket.IO room
    socket.leave(roomId);

    // Update Redis and get remaining count
    const remaining = await this.consultationService.removeParticipant(
      roomId,
      userId,
    );

    this.logger.log(
      `leave-room userId=${userId} room=${roomId} [${remaining} remaining]`,
    );

    if (remaining === 0) {
      // Last participant — end the call
      await this.consultationService.onRoomEmpty(roomId);
    } else {
      // One participant remains — go back to waiting
      await this.consultationService.onRoomWaiting(roomId);
    }

    // Notify whoever is still in the room
    socket.to(roomId).emit('user-left', { userId });
  }
}
