import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Doctor } from './entities/doctor.entity';
import { TimeSlot } from './entities/time-slot.entity';
import { Appointment } from './entities/appointment.entity';
import { Prescription } from './entities/prescription.entity';
import { OtpCode } from './entities/otp-code.entity';
import { Session } from './entities/session.entity';
import { Review } from './entities/review.entity';
import { Notification } from './entities/notification.entity';
import { LabTest } from './entities/lab-test.entity';
import { LabBooking } from './entities/lab-booking.entity';
import { Generic } from './entities/generic.entity';
import { Medicine } from './entities/medicine.entity';
import { Variant } from './entities/variant.entity';
import { Price } from './entities/price.entity';
import { MedicalHistory } from './entities/medical-history.entity';

export const ALL_ENTITIES = [
  User,
  Doctor,
  TimeSlot,
  Appointment,
  Prescription,
  OtpCode,
  Session,
  Review,
  Notification,
  LabTest,
  LabBooking,
  Generic,
  Medicine,
  Variant,
  Price,
  MedicalHistory,
];

@Module({
  imports: [TypeOrmModule.forFeature(ALL_ENTITIES)],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
