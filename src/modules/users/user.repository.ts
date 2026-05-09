import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../database/entities/user.entity';
import {
  MedicalHistory,
  SurgeryRecord,
  MedicationRecord,
  FamilyHistoryRecord,
} from '../../database/entities/medical-history.entity';

export interface UserProfileRow {
  id: string;
  phone: string;
  name: string;
  email?: string | null;
  avatarUrl?: string | null;
  dob?: Date | null;
  gender?: string | null;
  bloodGroup?: string | null;
  role: string;
  isActive: boolean;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProfileUpdate {
  name?: string;
  email?: string | null;
  dob?: Date | null;
  gender?: string | null;
  bloodGroup?: string | null;
  avatarUrl?: string | null;
}

export interface MedicalHistoryUpdate {
  allergies?: string[];
  chronicConditions?: string[];
  pastSurgeries?: SurgeryRecord[];
  currentMedications?: MedicationRecord[];
  familyHistory?: FamilyHistoryRecord[];
  notes?: string | null;
}

/** Columns safe to return from the profile endpoint — no fcmToken, deletedAt. */
const PROFILE_SELECT = {
  id: true,
  phone: true,
  name: true,
  email: true,
  avatarUrl: true,
  dob: true,
  gender: true,
  bloodGroup: true,
  role: true,
  isActive: true,
  isVerified: true,
  createdAt: true,
  updatedAt: true,
} as const;

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
    @InjectRepository(MedicalHistory)
    private readonly histories: Repository<MedicalHistory>,
  ) {}

  // ── User queries ───────────────────────────────────────────────────────────

  findById(id: string): Promise<User | null> {
    return this.users.findOne({ where: { id } });
  }

  findProfileById(id: string): Promise<UserProfileRow | null> {
    return this.users.findOne({
      where: { id },
      select: PROFILE_SELECT,
    }) as Promise<UserProfileRow | null>;
  }

  async requireProfileById(id: string): Promise<UserProfileRow> {
    const user = await this.findProfileById(id);
    if (!user) {
      throw new NotFoundException({ code: 'USER_NOT_FOUND', message: 'User not found.' });
    }
    return user;
  }

  async existsByEmail(email: string, excludeUserId: string): Promise<boolean> {
    const count = await this.users
      .createQueryBuilder('u')
      .where('u.email = :email', { email })
      .andWhere('u.id != :id', { id: excludeUserId })
      .getCount();
    return count > 0;
  }

  async updateProfile(id: string, updates: ProfileUpdate): Promise<UserProfileRow> {
    const user = await this.users.findOneOrFail({ where: { id } });

    // Assign only provided keys (undefined = skip, null = clear)
    if (updates.name !== undefined) user.name = updates.name!;
    if ('email' in updates) user.email = updates.email ?? undefined;
    if ('dob' in updates) user.dob = updates.dob ?? undefined;
    if ('gender' in updates)
      user.gender = (updates.gender as User['gender']) ?? undefined;
    if ('bloodGroup' in updates)
      user.bloodGroup = (updates.bloodGroup as User['bloodGroup']) ?? undefined;
    if ('avatarUrl' in updates) user.avatarUrl = updates.avatarUrl ?? undefined;

    await this.users.save(user);
    return this.requireProfileById(id);
  }

  // ── Medical-history queries ────────────────────────────────────────────────

  findMedicalHistory(userId: string): Promise<MedicalHistory | null> {
    return this.histories.findOne({ where: { userId } });
  }

  async upsertMedicalHistory(
    userId: string,
    data: MedicalHistoryUpdate,
  ): Promise<MedicalHistory> {
    const existing = await this.histories.findOne({ where: { userId } });

    if (existing) {
      // Merge — only overwrite fields explicitly provided in data
      if (data.allergies !== undefined) existing.allergies = data.allergies;
      if (data.chronicConditions !== undefined)
        existing.chronicConditions = data.chronicConditions;
      if (data.pastSurgeries !== undefined) existing.pastSurgeries = data.pastSurgeries;
      if (data.currentMedications !== undefined)
        existing.currentMedications = data.currentMedications;
      if (data.familyHistory !== undefined) existing.familyHistory = data.familyHistory;
      if ('notes' in data) existing.notes = data.notes ?? undefined;

      return this.histories.save(existing);
    }

    const record = this.histories.create({
      userId,
      allergies: data.allergies,
      chronicConditions: data.chronicConditions,
      pastSurgeries: data.pastSurgeries,
      currentMedications: data.currentMedications,
      familyHistory: data.familyHistory,
      notes: data.notes ?? undefined,  // TypeORM DeepPartial doesn't accept null for optional string
    });
    return this.histories.save(record);
  }

  // ── Email uniqueness guard (called before update) ─────────────────────────

  async assertEmailAvailable(email: string, userId: string): Promise<void> {
    if (await this.existsByEmail(email, userId)) {
      throw new ConflictException({
        code: 'EMAIL_TAKEN',
        message: 'This email address is already registered to another account.',
      });
    }
  }
}
