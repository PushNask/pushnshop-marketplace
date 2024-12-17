import { z } from 'zod';

export const productSchema = z.object({
  title: z.string()
    .min(1, 'Title is required')
    .max(80, 'Title must be less than 80 characters'),
  description: z.string()
    .min(1, 'Description is required')
    .max(2000, 'Description must be less than 2000 characters'),
  price: z.number()
    .min(100, 'Price must be at least 100 XAF')
    .max(10000000, 'Price must be less than 10,000,000 XAF'),
  currency: z.enum(['XAF']),
  duration_hours: z.number()
    .int()
    .min(24)
    .max(120),
  images: z.array(z.any())
    .min(1, 'At least one image is required')
    .max(7, 'Maximum 7 images allowed'),
  whatsapp_number: z.string()
    .regex(/^\+?\d{9,15}$/, 'Invalid WhatsApp number'),
});

export type ProductFormValues = z.infer<typeof productSchema>;

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  images: string[];
  status: 'pending' | 'approved' | 'rejected' | 'active';
  seller_id: string;
  created_at: string;
  updated_at: string;
  is_verified: boolean;
}