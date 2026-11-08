import { describe, it, expect } from 'vitest';
import { getRepoFacts, loadSnapshot } from '@/lib/github-snapshot';
import type { Snapshot } from '@/lib/schemas/snapshot';
import { makeTempDir } from './helpers';
import path from 'node:path';

const repo = {
  fullName: 'ssuresh808/LifeLens',
  htmlUrl: 'https://github.com/ssuresh808/LifeLens',
  description: 'desc',
  primaryLanguage: 'Python',
  stars: 12,
  updatedAt: '2026-08-31T18:26:00Z',
  stale: false,
};
const fresh: Snapshot = { fetchedAt: '2026-11-08T08:30:00Z', repos: [repo] };
const now = new Date('2026-11-10T00:00:00Z');

describe('getRepoFacts', () => {
  it('shows stars when fresh and at least 5', () => {
    const f = getRepoFacts(fresh, 'ssuresh808/LifeLens', now)!;
    expect(f.stars).toBe(12);
    expect(f.showStars).toBe(true);
    expect(f.asOf).toBe('2026-11-08');
  });
  it('hides stars below 5', () => {
    const f = getRepoFacts({ ...fresh, repos: [{ ...repo, stars: 0 }] }, 'ssuresh808/LifeLens', now)!;
    expect(f.showStars).toBe(false);
  });
  it('nulls stars and flags stale when the snapshot is older than 30 days', () => {
    const old: Snapshot = { ...fresh, fetchedAt: '2026-09-01T00:00:00Z' };
    const f = getRepoFacts(old, 'ssuresh808/LifeLens', now)!;
    expect(f.stars).toBeNull();
    expect(f.showStars).toBe(false);
    expect(f.stale).toBe(true);
  });
  it('treats a record marked stale by the sync as stale', () => {
    const f = getRepoFacts({ ...fresh, repos: [{ ...repo, stale: true }] }, 'ssuresh808/LifeLens', now)!;
    expect(f.stale).toBe(true);
    expect(f.stars).toBeNull();
  });
  it('returns null for a repo that is not in the snapshot', () => {
    expect(getRepoFacts(fresh, 'ssuresh808/nope', now)).toBeNull();
  });
});

describe('loadSnapshot', () => {
  it('reads and validates the JSON file', () => {
    const dir = makeTempDir({ 'snap.json': JSON.stringify(fresh) });
    expect(loadSnapshot(path.join(dir, 'snap.json')).repos).toHaveLength(1);
  });
  it('throws on an invalid file', () => {
    const dir = makeTempDir({ 'snap.json': JSON.stringify({ fetchedAt: 'nope', repos: [] }) });
    expect(() => loadSnapshot(path.join(dir, 'snap.json'))).toThrow();
  });
});
