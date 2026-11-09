import { z } from 'zod';
import { HttpsUrl, OwnedRepo, Slug } from './common';

export const CategorySchema = z.enum(['ai-ml', 'backend', 'data', 'fullstack', 'other']);
export type Category = z.infer<typeof CategorySchema>;
export const CATEGORY_LABELS: Record<Category, string> = {
  'ai-ml': 'AI / ML',
  backend: 'Backend',
  data: 'Data',
  fullstack: 'Full stack',
  other: 'Tooling',
};

export const DemoStatusSchema = z.enum(['none', 'live', 'paused']);
export type DemoStatus = z.infer<typeof DemoStatusSchema>;

export const EvidenceSchema = z.object({
  label: z.string().min(3),
  value: z.string().min(1),
  method: z.string().min(10),
  sourceUrl: HttpsUrl.optional(),
});
export type Evidence = z.infer<typeof EvidenceSchema>;

export const ProjectLinkSchema = z.object({ label: z.string().min(2), url: HttpsUrl });
export type ProjectLink = z.infer<typeof ProjectLinkSchema>;

export const ProjectFrontmatterSchema = z
  .object({
    slug: Slug,
    title: z.string().min(3),
    shortTitle: z.string().min(2).max(20).optional(), // used where the full title would wrap (skill evidence labels)
    tagline: z.string().min(10).max(160),
    category: CategorySchema,
    featured: z.boolean().default(false),
    order: z.number().int().nonnegative().default(100),
    published: z.boolean().default(false),
    publishedAt: z.iso.date(),
    period: z.string().min(3),
    contribution: z.string().min(10),
    collaboration: z.enum(['solo', 'team', 'internship', 'open-source']),
    tags: z.array(z.string().min(1)).min(1).max(8),
    coverImage: z.string().regex(/^\/projects\/[a-zA-Z0-9/_-]+\.(webp|avif|png|svg)$/),
    coverAlt: z.string().min(10),
    repo: OwnedRepo.optional(),
    demoUrl: HttpsUrl.optional(),
    demoStatus: DemoStatusSchema.default('none'),
    demoNote: z.string().min(10).optional(),
    links: z.array(ProjectLinkSchema).max(6).default([]),
    evidence: z.array(EvidenceSchema).default([]),
  })
  .superRefine((p, ctx) => {
    if (p.demoStatus !== 'none' && !p.demoUrl) {
      ctx.addIssue({ code: 'custom', path: ['demoUrl'], message: 'demoUrl is required when demoStatus is live or paused' });
    }
    if (p.demoStatus === 'paused' && !p.demoNote) {
      ctx.addIssue({ code: 'custom', path: ['demoNote'], message: 'demoNote is required when demoStatus is paused' });
    }
    if (p.published && !p.repo && !p.demoUrl) {
      ctx.addIssue({ code: 'custom', path: ['repo'], message: 'a published project needs a repo or a demoUrl' });
    }
  });

export type ProjectFrontmatter = z.infer<typeof ProjectFrontmatterSchema>;
export type ProjectFrontmatterInput = z.input<typeof ProjectFrontmatterSchema>;
