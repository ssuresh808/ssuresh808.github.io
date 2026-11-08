import { z } from 'zod';

export const EducationEntrySchema = z.object({
  institution: z.string().min(2),
  degree: z.string().min(2),
  gpa: z.string().regex(/^\d\.\d{1,2}\/\d\.\d$/).optional(),
  expected: z.string().min(4).optional(),
  completed: z.string().min(4).optional(),
  status: z.enum(['in progress', 'completed']),
});
export const TrainingEntrySchema = z.object({
  name: z.string().min(2),
  provider: z.string().min(2),
  period: z.string().min(4),
  detail: z.string().min(10),
});
export const EducationFileSchema = z.object({
  education: z.array(EducationEntrySchema).min(1),
  coursework: z.array(z.string().min(2)).default([]),
  training: z.array(TrainingEntrySchema).default([]),
});
export type EducationFile = z.infer<typeof EducationFileSchema>;
export type EducationEntry = z.infer<typeof EducationEntrySchema>;
export type TrainingEntry = z.infer<typeof TrainingEntrySchema>;
