import { z } from 'zod';

export const SendOtpSchema = z.object({
  phone: z
    .string()
    .regex(/^\+[1-9]\d{6,14}$/, 'Phone must be in E.164 format (e.g. +919876543210)'),
});

export type SendOtpDto = z.infer<typeof SendOtpSchema>;
