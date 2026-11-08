import { describe, it, expect } from 'vitest';
import {
  validateAllowlist,
  mapRepo,
  mergeSnapshot,
  snapshotChanged,
  type ApiRepo,
  type FetchOutcome,
} from '@/lib/github-sync';
import type { Snapshot } from '@/lib/schemas/snapshot';

const api: ApiRepo = {
  full_name: 'ssuresh808/sortwise',
  html_url: 'https://github.com/ssuresh808/sortwise',
  description: 'A smart CLI tool',
  language: 'Python',
  stargazers_count: 3,
  pushed_at: '2026-03-25T20:10:59Z',
  private: false,
  fork: false,
};
const prev: Snapshot = {
  fetchedAt: '2026-10-01T00:00:00Z',
  repos: [{ ...mapRepo(api, 'W/"old"'), stars: 2 }],
};
const now = '2026-11-08T08:30:00Z';

describe('validateAllowlist', () => {
  it('accepts owned repos and rejects anything else', () => {
    expect(validateAllowlist(['ssuresh808/sortwise'])).toEqual(['ssuresh808/sortwise']);
    expect(() => validateAllowlist(['other/repo'])).toThrow(/ssuresh808/);
    expect(() => validateAllowlist(['not a repo'])).toThrow();
    expect(() => validateAllowlist('ssuresh808/sortwise')).toThrow();
    expect(() => validateAllowlist(['ssuresh808/a', 'ssuresh808/a'])).toThrow(/duplicate/);
  });
});

describe('mapRepo', () => {
  it('maps only the approved fields', () => {
    const r = mapRepo(api, 'W/"abc"');
    expect(r).toEqual({
      fullName: 'ssuresh808/sortwise',
      htmlUrl: 'https://github.com/ssuresh808/sortwise',
      description: 'A smart CLI tool',
      primaryLanguage: 'Python',
      stars: 3,
      updatedAt: '2026-03-25T20:10:59Z',
      etag: 'W/"abc"',
      stale: false,
    });
  });
  it('refuses private or forked repos', () => {
    expect(() => mapRepo({ ...api, private: true })).toThrow(/private/);
    expect(() => mapRepo({ ...api, fork: true })).toThrow(/fork/);
  });
});

describe('mergeSnapshot', () => {
  it('uses fresh records, reuses previous on 304, keeps previous and marks stale on failure', () => {
    const outcomes = new Map<string, FetchOutcome>([
      ['ssuresh808/sortwise', { kind: 'not-modified' }],
      [
        'ssuresh808/LifeLens',
        {
          kind: 'fresh',
          repo: mapRepo({ ...api, full_name: 'ssuresh808/LifeLens', html_url: 'https://github.com/ssuresh808/LifeLens' }),
        },
      ],
      ['ssuresh808/Gone', { kind: 'failed', reason: 'HTTP 404' }],
    ]);
    const previous: Snapshot = {
      ...prev,
      repos: [
        ...prev.repos,
        { ...mapRepo({ ...api, full_name: 'ssuresh808/Gone', html_url: 'https://github.com/ssuresh808/Gone' }), stars: 9 },
      ],
    };
    const { snapshot, warnings } = mergeSnapshot(
      previous,
      ['ssuresh808/sortwise', 'ssuresh808/LifeLens', 'ssuresh808/Gone'],
      outcomes,
      now,
    );
    expect(snapshot.fetchedAt).toBe(now);
    expect(snapshot.repos.map((r) => r.fullName)).toEqual(['ssuresh808/Gone', 'ssuresh808/LifeLens', 'ssuresh808/sortwise']);
    expect(snapshot.repos.find((r) => r.fullName === 'ssuresh808/sortwise')?.stars).toBe(2);
    expect(snapshot.repos.find((r) => r.fullName === 'ssuresh808/Gone')).toMatchObject({ stars: 9, stale: true });
    expect(warnings.join(' ')).toMatch(/Gone.*HTTP 404/);
  });
  it('omits a repo that failed with no previous record and warns', () => {
    const outcomes = new Map<string, FetchOutcome>([['ssuresh808/New', { kind: 'failed', reason: 'timeout' }]]);
    const { snapshot, warnings } = mergeSnapshot(null, ['ssuresh808/New'], outcomes, now);
    expect(snapshot.repos).toEqual([]);
    expect(warnings).toHaveLength(1);
  });
  it('drops repos that left the allowlist', () => {
    const { snapshot } = mergeSnapshot(prev, [], new Map(), now);
    expect(snapshot.repos).toEqual([]);
  });
});

describe('snapshotChanged', () => {
  it('ignores fetchedAt and detects any repo field change', () => {
    const same: Snapshot = { ...prev, fetchedAt: now };
    expect(snapshotChanged(prev, same)).toBe(false);
    expect(snapshotChanged(prev, { ...same, repos: [{ ...prev.repos[0], stars: 3 }] })).toBe(true);
    expect(snapshotChanged(null, same)).toBe(true);
  });
});

describe('shouldWriteSnapshot', () => {
  it('writes when repos changed, or when all repos succeeded and the previous fetchedAt is over 7 days old', async () => {
    const { shouldWriteSnapshot } = await import('@/lib/github-sync');
    const allOk = new Map<string, FetchOutcome>([['ssuresh808/sortwise', { kind: 'not-modified' }]]);
    const oneFailed = new Map<string, FetchOutcome>([['ssuresh808/sortwise', { kind: 'failed', reason: 'HTTP 500' }]]);
    const unchanged: Snapshot = { ...prev, fetchedAt: now };
    expect(shouldWriteSnapshot(prev, { ...unchanged, repos: [{ ...prev.repos[0], stars: 3 }] }, allOk, now)).toBe(true);
    expect(shouldWriteSnapshot(prev, unchanged, allOk, now)).toBe(true); // 2026-10-01 is 38 days before now
    expect(shouldWriteSnapshot({ ...prev, fetchedAt: '2026-11-05T00:00:00Z' }, unchanged, allOk, now)).toBe(false);
    expect(shouldWriteSnapshot(prev, unchanged, oneFailed, now)).toBe(false);
    expect(shouldWriteSnapshot(null, unchanged, allOk, now)).toBe(true);
  });
});
