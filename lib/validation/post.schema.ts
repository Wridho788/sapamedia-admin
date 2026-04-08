import { z } from 'zod';

export const postSchema = z.object({
  title: z.string().min(3, 'Title minimal 3 karakter'),
  slug: z.string().min(3, 'Slug minimal 3 karakter'),
  excerpt: z.string().optional(),
  content: z.string().min(10, 'Content terlalu pendek'),
  status: z.enum(['draft', 'published']),
  category_id: z.string().optional(),
  cover_image: z.string().url('Cover image harus URL valid').optional().or(z.literal('')),
  image_urls: z.array(z.string().url()).optional(),
});

export type PostFormValues = z.infer<typeof postSchema>;
