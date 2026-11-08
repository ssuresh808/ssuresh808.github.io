import fs from 'node:fs';
import { z } from 'zod';
import { GITHUB_OWNER, OwnedRepo } from './schemas/common';
import { SnapshotSchema, type RepoSnapshot, type Snapshot } from './schemas/snapshot';

export interface ApiRepo {
  full_name: string;
  html_url: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  pushed_at: string;
  private: boolean;
  fork: boolean;
}

export type FetchOutcome =
  | { kind: 'fresh'; repo: RepoSnapshot }
  | { kind: 'not-modified' }
  | { kind: 'failed'; reason: string };

export function validateAllowlist(entries: unknown): string[] {
  const parsed = z.array(OwnedRepo).safeParse(entries);
  if (!parsed.success) {
    throw new Error(
      `invalid allowlist (every entry must be "${GITHUB_OWNER}/<repo>"):\n${z.prettifyError(parsed.error)}`,
    );
  }
  const dupes = parsed.data.filter((v, i, a) => a.indexOf(v) !== i);
  if (dupes.length > 0) throw new Error(`duplicate allowlist entries: ${dupes.join(', ')}`);
  return parsed.data;
}

export function readAllowlist(filePath: string): string[] {
  return validateAllowlist(JSON.parse(fs.readFileSync(filePath, 'utf8')));
}

export function mapRepo(api: ApiRepo, etag?: string): RepoSnapshot {
  if (api.private) throw new Error(`${api.full_name} is private and cannot enter the public snapshot`);
  if (api.fork) throw new Error(`${api.full_name} is a fork and is not published`);
  const record: RepoSnapshot = {
    fullName: api.full_name,
    htmlUrl: api.html_url,
    description: api.description,
    primaryLanguage: api.language,
    stars: api.stargazers_count,
    updatedAt: api.pushed_at,
    stale: false,
  };
  if (etag) record.etag = etag;
  return record;
}

export function mergeSnapshot(
  previous: Snapshot | null,
  allowlist: string[],
  outcomes: Map<string, FetchOutcome>,
  fetchedAt: string,
): { snapshot: Snapshot; warnings: string[] } {
  const warnings: string[] = [];
  const prevByName = new Map((previous?.repos ?? []).map((r) => [r.fullName, r]));
  const repos: RepoSnapshot[] = [];
  for (const name of allowlist) {
    const outcome = outcomes.get(name) ?? { kind: 'failed' as const, reason: 'no fetch outcome recorded' };
    const prior = prevByName.get(name);
    if (outcome.kind === 'fresh') repos.push(outcome.repo);
    else if (outcome.kind === 'not-modified' && prior) repos.push({ ...prior, stale: false });
    else if (outcome.kind === 'not-modified') warnings.push(`${name}: 304 without a cached record; omitted this run`);
    else if (prior) {
      repos.push({ ...prior, stale: true });
      warnings.push(`${name}: ${outcome.reason}; kept the previous record and marked it stale`);
    } else warnings.push(`${name}: ${outcome.reason}; no previous record, omitted`);
  }
  repos.sort((a, b) => a.fullName.localeCompare(b.fullName));
  const snapshot = SnapshotSchema.parse({ fetchedAt, repos });
  return { snapshot, warnings };
}

export function snapshotChanged(a: Snapshot | null, b: Snapshot): boolean {
  if (!a) return true;
  return JSON.stringify(a.repos) !== JSON.stringify(b.repos);
}
