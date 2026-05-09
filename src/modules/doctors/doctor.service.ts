import { Inject, Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { REDIS_CLIENT } from '../../redis/redis.constants';
import { getPaginationParams } from '../../common/utils/pagination.util';
import { PaginatedResponse } from '../../common/utils/pagination.util';
import { DoctorRepository } from './doctor.repository';
import { TimeSlotRepository } from './time-slot.repository';
import { RegisterDoctorDto } from './dto/register-doctor.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';
import { ListDoctorsQueryDto } from './dto/list-doctors-query.dto';
import { DoctorListItem, DoctorDetailResponse, TimeSlotResponse } from './doctor.types';

const CACHE_TTL_SEC = 3600;

@Injectable()
export class DoctorService {
  constructor(
    private readonly doctorRepo: DoctorRepository,
    private readonly slotRepo: TimeSlotRepository,
    @Inject(REDIS_CLIENT) private readonly redis: Redis,
  ) {}

  // ── GET /api/v1/doctors ────────────────────────────────────────────────────

  async list(query: ListDoctorsQueryDto): Promise<PaginatedResponse<DoctorListItem>> {
    const { page, limit, skip } = getPaginationParams(query);

    const cacheKey = `doctors:list:${JSON.stringify({ ...query, page, limit })}`;
    const cached = await this.redis.get(cacheKey);
    if (cached) return JSON.parse(cached) as PaginatedResponse<DoctorListItem>;

    const [doctors, total] = await this.doctorRepo.findAll({
      specialization: query.specialization,
      city: query.city,
      minRating: query.minRating,
      maxFee: query.maxFee,
      consultationMode: query.consultationMode,
      sortBy: query.sortBy,
      skip,
      take: limit,
    });

    const result = new PaginatedResponse(
      doctors.map((d) => this.doctorRepo.toListItem(d)),
      total,
      page,
      limit,
    );

    await this.redis.setex(cacheKey, CACHE_TTL_SEC, JSON.stringify(result));
    return result;
  }

  // ── GET /api/v1/doctors/:id ────────────────────────────────────────────────

  async getById(id: string): Promise<DoctorDetailResponse> {
    const cacheKey = `doctors:detail:${id}`;
    const cached = await this.redis.get(cacheKey);
    if (cached) return JSON.parse(cached) as DoctorDetailResponse;

    const doctor = await this.doctorRepo.requireById(id);
    const result = this.doctorRepo.toDetailResponse(doctor);

    await this.redis.setex(cacheKey, CACHE_TTL_SEC, JSON.stringify(result));
    return result;
  }

  // ── GET /api/v1/doctors/:id/availability ──────────────────────────────────

  async getAvailability(doctorId: string, date: string): Promise<TimeSlotResponse[]> {
    const cacheKey = `doctors:avail:${doctorId}:${date}`;
    const cached = await this.redis.get(cacheKey);
    if (cached) return JSON.parse(cached) as TimeSlotResponse[];

    const slots = await this.slotRepo.findByDoctorAndDate(doctorId, date);
    const result = slots.map((s) => this.slotRepo.toResponse(s));

    await this.redis.setex(cacheKey, 300, JSON.stringify(result));
    return result;
  }

  // ── POST /api/v1/doctors/register ─────────────────────────────────────────

  async register(userId: string, dto: RegisterDoctorDto): Promise<DoctorDetailResponse> {
    const doctor = await this.doctorRepo.create(userId, dto);
    await this.invalidateDoctorListCache();
    return this.doctorRepo.toDetailResponse(doctor);
  }

  // ── PATCH /api/v1/doctors/me ──────────────────────────────────────────────

  async updateMe(userId: string, dto: UpdateDoctorDto): Promise<DoctorDetailResponse> {
    const doctor = await this.doctorRepo.requireByUserId(userId);
    const updated = await this.doctorRepo.update(doctor.id, dto);

    await Promise.all([
      this.redis.del(`doctors:detail:${doctor.id}`),
      this.invalidateDoctorListCache(),
    ]);

    return this.doctorRepo.toDetailResponse(updated);
  }

  // ── Cache helpers ──────────────────────────────────────────────────────────

  private async invalidateDoctorListCache(): Promise<void> {
    const keys: string[] = [];
    let cursor = '0';
    do {
      const [next, found] = await this.redis.scan(cursor, 'MATCH', 'doctors:list:*', 'COUNT', 100);
      cursor = next;
      keys.push(...found);
    } while (cursor !== '0');

    if (keys.length > 0) await this.redis.del(keys);
  }
}
