import {
  Entity,
  Column,
  Index,
  OneToOne,
  JoinColumn,
  OneToMany,
  Relation,
} from 'typeorm';
import { BaseEntity } from './base.entity';
import { User } from './user.entity';
import { TimeSlot } from './time-slot.entity';
import { Appointment } from './appointment.entity';
import { Review } from './review.entity';

export enum ConsultationMode {
  ONLINE = 'ONLINE',
  OFFLINE = 'OFFLINE',
  BOTH = 'BOTH',
}

export interface EducationEntry {
  degree: string;
  institution: string;
  year: number;
}

export interface DaySchedule {
  start: string;
  end: string;
  slotDurationMinutes: number;
  breakStart?: string;
  breakEnd?: string;
}

export type AvailabilitySchedule = Partial<
  Record<
    'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday',
    DaySchedule
  >
>;

@Entity('doctors')
@Index(['userId'])
@Index(['specialization'])
@Index(['rating'])
export class Doctor extends BaseEntity {
  @Column({ type: 'uuid', name: 'user_id', unique: true })
  userId: string;

  @Column({ type: 'varchar', length: 100 })
  specialization: string;

  @Column({ type: 'varchar', name: 'license_number', length: 50, unique: true })
  licenseNumber: string;

  @Column({ type: 'int', name: 'experience_years', default: 0 })
  experienceYears: number;

  @Column({ type: 'text', nullable: true })
  bio?: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, name: 'consultation_fee', default: 0 })
  consultationFee: number;

  @Column({ type: 'simple-array', default: '' })
  languages: string[];

  @Column({ type: 'jsonb', default: '[]' })
  education: EducationEntry[];

  @Column({ type: 'decimal', precision: 3, scale: 2, default: 0 })
  rating: number;

  @Column({ type: 'int', name: 'review_count', default: 0 })
  reviewCount: number;

  @Column({ type: 'boolean', name: 'is_verified', default: false })
  isVerified: boolean;

  @Column({ type: 'jsonb', name: 'availability_schedule', default: '{}' })
  availabilitySchedule: AvailabilitySchedule;

  @Index()
  @Column({ type: 'varchar', length: 100, nullable: true })
  city?: string;

  @Column({ type: 'boolean', name: 'is_available_today', default: true })
  isAvailableToday: boolean;

  @Column({
    type: 'enum',
    enum: ConsultationMode,
    name: 'consultation_mode',
    default: ConsultationMode.BOTH,
  })
  consultationMode: ConsultationMode;

  @OneToOne(() => User, (user) => user.doctor, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: Relation<User>;

  @OneToMany(() => TimeSlot, (slot) => slot.doctor)
  timeSlots?: Relation<TimeSlot[]>;

  @OneToMany(() => Appointment, (appointment) => appointment.doctor)
  appointments?: Relation<Appointment[]>;

  @OneToMany(() => Review, (review) => review.doctor)
  reviews?: Relation<Review[]>;
}
