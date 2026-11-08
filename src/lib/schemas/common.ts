import { z } from 'zod';

export const HttpsUrl = z.url({ protocol: /^https$/ });
export const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
export const REPO_RE = /^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/;
export const GITHUB_OWNER = 'ssuresh808';
export const OwnedRepo = z
  .string()
  .regex(REPO_RE)
  .refine((s) => s.startsWith(`${GITHUB_OWNER}/`), `repo must belong to ${GITHUB_OWNER}`);
export const Slug = z.string().regex(SLUG_RE, 'slug must be lowercase words joined by single hyphens');
