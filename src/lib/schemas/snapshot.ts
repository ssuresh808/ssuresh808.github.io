import { z } from 'zod';
import { HttpsUrl, OwnedRepo } from './common';

export const RepoSnapshotSchema = z.object({
  fullName: OwnedRepo,
  htmlUrl: HttpsUrl,
  description: z.string().nullable(),
  primaryLanguage: z.string().nullable(),
  stars: z.number().int().nonnegative(),
  updatedAt: z.iso.datetime(),
  etag: z.string().optional(),
  stale: z.boolean(),
});
export type RepoSnapshot = z.infer<typeof RepoSnapshotSchema>;
export const SnapshotSchema = z.object({
  fetchedAt: z.iso.datetime(),
  repos: z.array(RepoSnapshotSchema),
});
export type Snapshot = z.infer<typeof SnapshotSchema>;
