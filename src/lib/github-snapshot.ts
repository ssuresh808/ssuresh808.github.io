import fs from 'node:fs';
import path from 'node:path';
import { z } from 'zod';
import { SnapshotSchema, type Snapshot } from './schemas/snapshot';

export const SNAPSHOT_PATH = path.join(process.cwd(), 'data', 'github-snapshot.json');
export const STALE_AFTER_DAYS = 30;
export const MIN_STARS_TO_SHOW = 5;

export interface RepoFacts {
  fullName: string;
  htmlUrl: string;
  primaryLanguage: string | null;
  stars: number | null;
  showStars: boolean;
  updatedAt: string;
  asOf: string;
  stale: boolean;
}

export function loadSnapshot(filePath: string = SNAPSHOT_PATH): Snapshot {
  const raw = JSON.parse(fs.readFileSync(filePath, 'utf8')) as unknown;
  const result = SnapshotSchema.safeParse(raw);
  if (!result.success) throw new Error(`${filePath}\n${z.prettifyError(result.error)}`);
  return result.data;
}

export function getRepoFacts(snapshot: Snapshot, fullName: string, now: Date = new Date()): RepoFacts | null {
  const repo = snapshot.repos.find((r) => r.fullName === fullName);
  if (!repo) return null;
  const ageDays = (now.getTime() - new Date(snapshot.fetchedAt).getTime()) / 86_400_000;
  const stale = repo.stale || ageDays > STALE_AFTER_DAYS;
  const stars = stale ? null : repo.stars;
  return {
    fullName: repo.fullName,
    htmlUrl: repo.htmlUrl,
    primaryLanguage: repo.primaryLanguage,
    stars,
    showStars: stars !== null && stars >= MIN_STARS_TO_SHOW,
    updatedAt: repo.updatedAt,
    asOf: snapshot.fetchedAt.slice(0, 10),
    stale,
  };
}
