import { z } from 'zod';

// Clinic create/update validation schema
export const clinicCreateSchema = z.object({
  name: z.string().min(3, 'Nom kamida 3 ta harf bo\'lishi kerak').max(100),
  slug: z.string().min(3).max(100).regex(/^[a-z0-9-]+$/, 'Slug faqat kichik harflar, raqamlar va - bo\'lishi mumkin'),
  description: z.string().max(2000).optional(),
  phone: z.string().min(9).max(20).optional(),
  email: z.string().email().optional().or(z.literal('')),
  website: z.string().url().optional().or(z.literal('')),
  address: z.string().max(500).optional(),
  city: z.string().max(50).optional(),
  country: z.string().max(50).optional(),
  logoUrl: z.string().url().optional().or(z.literal('')),
  lat: z.number().min(-90).max(90).optional(),
  lng: z.number().min(-180).max(180).optional(),
  isActive: z.boolean().optional(),
});

export const clinicUpdateSchema = clinicCreateSchema.partial();

// Clinic query params validation
export const clinicQuerySchema = z.object({
  search: z.string().optional(),
  city: z.string().optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
  sortBy: z.enum(['createdAt', 'name']).optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export type ClinicCreateInput = z.infer<typeof clinicCreateSchema>;
export type ClinicUpdateInput = z.infer<typeof clinicUpdateSchema>;
export type ClinicQueryParams = z.infer<typeof clinicQuerySchema>;
