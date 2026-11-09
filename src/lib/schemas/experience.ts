import { z } from 'zod';
import { Slug } from './common';

const YearMonth = z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/, 'use YYYY-MM');

export const ExperienceEntrySchema = z.object({
  id: Slug,
  organization: z.string().min(2),
  descriptor: z.string().min(2).optional(),
  title: z.string().min(2),
  location: z.string().min(2).optional(),
  start: YearMonth,
  end: YearMonth.or(z.literal('present')),
  kind: z.enum(['internship', 'research', 'volunteer', 'full-time', 'part-time']),
  highlights: z.array(z.string().min(20)).min(1).max(4),
  caseStudy: z.boolean().default(false),
  // Optional fuller account, shown on /about/ only.
  summary: z.string().min(20).optional(),
  note: z.string().min(10).optional(),
  sections: z
    .array(
      z.object({
        heading: z.string().min(2).max(60),
        items: z.array(z.string().min(20)).min(1).max(6),
      }),
    )
    .max(8)
    .optional(),
});
export type ExperienceEntry = z.infer<typeof ExperienceEntrySchema>;
export const ExperienceFileSchema = z.array(ExperienceEntrySchema).min(1);
