import { z } from 'zod';
import { HttpsUrl } from './common';

export const ProfileSchema = z.object({
  name: z.string().min(2),
  headline: z.string().min(10).max(90),
  roleLine: z.string().min(10),
  summary: z.string().min(20),
  location: z.string().min(2).nullable(),
  availability: z.string().min(3),
  email: z.email(),
  links: z.object({ github: HttpsUrl, linkedin: HttpsUrl }),
  resume: z.object({
    path: z.literal('/resume.pdf'),
    downloadName: z.string().regex(/^[A-Za-z0-9_-]+\.pdf$/),
    updated: z.iso.date(),
  }),
  photo: z.string().regex(/^\/images\/[a-zA-Z0-9_-]+\.(webp|png|svg)$/).nullable(),
});
export type Profile = z.infer<typeof ProfileSchema>;
