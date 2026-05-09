import { z } from 'zod';
import { ConsultationMode } from '../../../database/entities/doctor.entity';

const TIME_RE = /^\d{2}:\d{2}$/;

export const EducationEntrySchema = z.object({
  degree: z.string().min(1).max(100),
  institution: z.string().min(1).max(200),
  year: z.number().int().min(1950).max(new Date().getFullYear()),
});

const DayScheduleSchema = z.object({
  start: z.string().regex(TIME_RE, 'Time must be HH:MM'),
  end: z.string().regex(TIME_RE, 'Time must be HH:MM'),
  slotDurationMinutes: z.number().int().min(10).max(120).default(30),
  breakStart: z.string().regex(TIME_RE, 'Time must be HH:MM').optional(),
  breakEnd: z.string().regex(TIME_RE, 'Time must be HH:MM').optional(),
});

export const AvailabilityScheduleSchema = z
  .object({
    monday: DayScheduleSchema.optional(),
    tuesday: DayScheduleSchema.optional(),
    wednesday: DayScheduleSchema.optional(),
    thursday: DayScheduleSchema.optional(),
    friday: DayScheduleSchema.optional(),
    saturday: DayScheduleSchema.optional(),
    sunday: DayScheduleSchema.optional(),
  })
  .default({});

export const RegisterDoctorSchema = z
  .object({
    specialization: z.string().trim().min(2, 'At least 2 characters').max(100),
    licenseNumber: z.string().trim().min(5, 'At least 5 characters').max(50),
    experienceYears: z.number().int().min(0).max(60).default(0),
    bio: z.string().max(1000).optional(),
    consultationFee: z.number().min(0).default(0),
    languages: z
      .array(z.string().trim().min(1))
      .min(1, 'At least one language required')
      .default(['English']),
    education: z.array(EducationEntrySchema).default([]),
    availabilitySchedule: AvailabilityScheduleSchema,
    city: z.string().trim().max(100).optional(),
    consultationMode: z.nativeEnum(ConsultationMode).default(ConsultationMode.BOTH),
  })
  .strict();

export type RegisterDoctorDto = z.infer<typeof RegisterDoctorSchema>;
