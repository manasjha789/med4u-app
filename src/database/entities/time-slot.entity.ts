import { Entity, Column, Index, ManyToOne, JoinColumn, OneToOne, Relation } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Doctor } from './doctor.entity';
import { Appointment } from './appointment.entity';

@Entity('time_slots')
@Index(['doctorId', 'date'])
@Index(['doctorId', 'isBooked'])
export class TimeSlot extends BaseEntity {
  @Column({ type: 'uuid', name: 'doctor_id' })
  doctorId: string;

  @Column({ type: 'date' })
  date: Date;

  @Column({ type: 'time', name: 'start_time' })
  startTime: string;

  @Column({ type: 'time', name: 'end_time' })
  endTime: string;

  @Column({ type: 'boolean', name: 'is_booked', default: false })
  isBooked: boolean;

  @ManyToOne(() => Doctor, (doctor) => doctor.timeSlots, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'doctor_id' })
  doctor: Relation<Doctor>;

  @OneToOne(() => Appointment, (appointment) => appointment.slot)
  appointment?: Relation<Appointment>;
}
