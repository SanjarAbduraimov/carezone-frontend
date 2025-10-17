import { z } from 'zod';

// Booking create validation schema
export const bookingCreateSchema = z.object({
  slotId: z.string().min(1, 'Slot ID kerak'),
  patientName: z.string().min(2, 'Bemor ismi kamida 2 ta harf bo\'lishi kerak').max(100),
  patientPhone: z.string().min(9, 'Telefon raqam noto\'g\'ri').max(20),
  patientEmail: z.string().email('Email noto\'g\'ri').optional().or(z.literal('')),
  notes: z.string().max(500).optional(),
});

export const bookingUpdateSchema = z.object({
  status: z.enum(['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED']),
  notes: z.string().max(500).optional(),
});

export type BookingCreateInput = z.infer<typeof bookingCreateSchema>;
export type BookingUpdateInput = z.infer<typeof bookingUpdateSchema>;
