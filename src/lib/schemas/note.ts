import { z } from 'zod';
import { Slug } from './common';

export const NoteFrontmatterSchema = z.object({
  slug: Slug,
  title: z.string().min(10).max(120),
  summary: z.string().min(20).max(240),
  publishedAt: z.iso.date(),
  published: z.boolean().default(false),
  tags: z.array(z.string().min(1)).min(1).max(6),
  project: Slug.optional(), // slug of the project this note belongs to
});
export type NoteFrontmatter = z.infer<typeof NoteFrontmatterSchema>;
