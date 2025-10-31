import { z } from 'zod';

// Doctor create/update validation schema
export const doctorCreateSchema = z.object({
  firstName: z.string().min(2, 'Ism kamida 2 ta harf bo\'lishi kerak').max(50),
  lastName: z.string().min(2, 'Familiya kamida 2 ta harf bo\'lishi kerak').max(50),
  slug: z.string().min(3).max(100).regex(/^[a-z0-9-]+$/, 'Slug faqat kichik harflar, raqamlar va - bo\'lishi mumkin'),
  bio: z.string().max(1000).optional(),
  photoUrl: z.string().url().optional().or(z.literal('')),
  specialtyIds: z.array(z.string()).min(1, 'Kamida 1 ta mutaxassislik tanlang'),
  clinicId: z.string().optional(),
  yearsOfExp: z.number().min(0).max(70).optional(),
  priceMin: z.number().min(0).optional(),
  priceMax: z.number().min(0).optional(),
  isActive: z.boolean().optional(),
});

export const doctorUpdateSchema = doctorCreateSchema.partial();

// Doctor query params validation
export const doctorQuerySchema = z.object({
  search: z.string().optional(),
  clinicId: z.string().optional(),
  specialtyId: z.string().optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
  sortBy: z.enum(['createdAt', 'firstName', 'yearsOfExp']).optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export type DoctorCreateInput = z.infer<typeof doctorCreateSchema>;
export type DoctorUpdateInput = z.infer<typeof doctorUpdateSchema>;
export type DoctorQueryParams = z.infer<typeof doctorQuerySchema>;
