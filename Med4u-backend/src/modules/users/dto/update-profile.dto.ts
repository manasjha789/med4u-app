import { z } from 'zod';
import { Gender, BloodGroup } from '../../../database/entities/user.entity';

export const UpdateProfileSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, 'Name must be at least 2 characters')
      .max(100, 'Name must be at most 100 characters')
      .optional(),

    email: z.string().email('Invalid email address').nullable().optional(),

    dob: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format')
      .refine((v) => !isNaN(Date.parse(v)), 'Invalid date')
      .nullable()
      .optional(),

    gender: z.nativeEnum(Gender).nullable().optional(),

    bloodGroup: z.nativeEnum(BloodGroup).nullable().optional(),

    avatarUrl: z.string().url('Invalid URL').nullable().optional(),
  })
  .strict();

export type UpdateProfileDto = z.infer<typeof UpdateProfileSchema>;
