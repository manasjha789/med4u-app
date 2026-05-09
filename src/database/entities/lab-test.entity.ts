import { Entity, Column, Index, OneToMany, Relation } from 'typeorm';
import { BaseEntity } from './base.entity';
import { LabBooking } from './lab-booking.entity';

@Entity('lab_tests')
@Index(['category'])
export class LabTest extends BaseEntity {
  @Column({ type: 'varchar', length: 150 })
  name: string;

  @Column({ type: 'varchar', length: 100 })
  category: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ type: 'int', name: 'turnaround_days' })
  turnaroundDays: number;

  @OneToMany(() => LabBooking, (booking) => booking.test)
  bookings?: Relation<LabBooking[]>;
}
