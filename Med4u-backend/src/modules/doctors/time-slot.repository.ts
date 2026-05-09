import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TimeSlot } from '../../database/entities/time-slot.entity';
import { TimeSlotResponse } from './doctor.types';

@Injectable()
export class TimeSlotRepository {
  constructor(
    @InjectRepository(TimeSlot) private readonly slots: Repository<TimeSlot>,
  ) {}

  findByDoctorAndDate(doctorId: string, date: string): Promise<TimeSlot[]> {
    return this.slots
      .createQueryBuilder('slot')
      .where('slot.doctorId = :doctorId', { doctorId })
      .andWhere('slot.date = :date', { date })
      .andWhere('slot.deletedAt IS NULL')
      .orderBy('slot.startTime', 'ASC')
      .getMany();
  }

  toResponse(slot: TimeSlot): TimeSlotResponse {
    // date column comes back as a string ('YYYY-MM-DD') from PostgreSQL
    const dateStr =
      typeof slot.date === 'string'
        ? slot.date
        : (slot.date as Date).toISOString().split('T')[0];

    return {
      id: slot.id,
      date: dateStr,
      startTime: slot.startTime,
      endTime: slot.endTime,
      isBooked: slot.isBooked,
    };
  }
}
