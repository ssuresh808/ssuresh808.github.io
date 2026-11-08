import { z } from 'zod';

// evidence entries are a project slug ("agentic-rag") or "experience:<id>" ("experience:fitbux")
export const SkillEvidenceRef = z.string().regex(/^(experience:)?[a-z0-9]+(?:-[a-z0-9]+)*$/);
export const SkillItemSchema = z.object({
  name: z.string().min(1),
  evidence: z.array(SkillEvidenceRef).default([]),
});
export const SkillGroupSchema = z.object({
  group: z.string().min(2),
  items: z.array(SkillItemSchema).min(1),
});
export const SkillsFileSchema = z.array(SkillGroupSchema).min(3).max(8);
export type SkillItem = z.infer<typeof SkillItemSchema>;
export type SkillGroup = z.infer<typeof SkillGroupSchema>;
