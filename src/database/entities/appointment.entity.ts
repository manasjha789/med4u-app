import {
  Entity,
  Column,
  Index,
  ManyToOne,
  OneToOne,
  JoinColumn,
  Relation,
} from 'typeorm';
import { BaseEntity } from './base.entity';
import { User } from './user.entity';
import { Doctor } from './doctor.entity';
import { TimeSlot } from './time-slot.entity';
import { Prescription } from './prescription.entity';

export enum AppointmentType {
  VIDEO = 'video',
  IN_PERSON = 'in_person',
}

export enum AppointmentStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled',
  COMPLETED = 'completed',
  RESCHEDULED = 'rescheduled',
}

export interface CallLog {
  startedAt?: string;
  endedAt?: string;
  durationSeconds?: number;
}

@Entity('appointments')
@Index(['patientId'])
@Index(['doctorId'])
@Index(['appointmentDate'])
@Index(['status'])
@Index(['doctorId', 'appointmentDate'])
export class Appointment extends BaseEntity {
  @Column({ type: 'uuid', name: 'patient_id' })
  patientId: string;

  @Column({ type: 'uuid', name: 'doctor_id' })
  doctorId: string;

  @Column({ type: 'uuid', name: 'slot_id' })
  slotId: string;

  @Column({ type: 'timestamptz', name: 'appointment_date' })
  appointmentDate: Date;

  @Column({ type: 'enum', enum: AppointmentType, default: AppointmentType.VIDEO })
  type: AppointmentType;

  @Column({ type: 'enum', enum: AppointmentStatus, default: AppointmentStatus.PENDING })
  status: AppointmentStatus;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @Column({ type: 'text', name: 'cancellation_reason', nullable: true })
  cancellationReason?: string;

  @Column({ type: 'uuid', name: 'rescheduled_from', nullable: true })
  rescheduledFrom?: string;

  @ManyToOne(() => User, (user) => user.appointments, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'patient_id' })
  patient: Relation<User>;

  @ManyToOne(() => Doctor, (doctor) => doctor.appointments, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'doctor_id' })
  doctor: Relation<Doctor>;

  @OneToOne(() => TimeSlot, (slot) => slot.appointment, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'slot_id' })
  slot: Relation<TimeSlot>;

  @ManyToOne(() => Appointment, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'rescheduled_from' })
  originalAppointment?: Relation<Appointment>;

  @Column({ type: 'jsonb', name: 'call_log', nullable: true })
  callLog?: CallLog;

  @OneToOne(() => Prescription, (prescription) => prescription.appointment)
  prescription?: Relation<Prescription>;
}
