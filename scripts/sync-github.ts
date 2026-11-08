import fs from 'node:fs';
import path from 'node:path';
import {
  readAllowlist,
  mapRepo,
  mergeSnapshot,
  snapshotChanged,
  type ApiRepo,
  type FetchOutcome,
} from '../src/lib/github-sync';
import { SnapshotSchema, type Snapshot } from '../src/lib/schemas/snapshot';

const root = process.cwd();
const allowlistPath = path.join(root, 'config', 'github-allowlist.json');
const snapshotPath = path.join(root, 'data', 'github-snapshot.json');
const API = 'https://api.github.com';

async function main() {
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    console.error('GITHUB_TOKEN is required (read-only; public_repo scope is enough).');
    process.exit(2);
  }

  const allowlist = readAllowlist(allowlistPath);
  const previous: Snapshot | null = fs.existsSync(snapshotPath)
    ? SnapshotSchema.parse(JSON.parse(fs.readFileSync(snapshotPath, 'utf8')))
    : null;
  const prevEtags = new Map((previous?.repos ?? []).map((r) => [r.fullName, r.etag]));

  async function fetchOne(fullName: string): Promise<FetchOutcome> {
    const etag = prevEtags.get(fullName);
    const headers: Record<string, string> = {
      accept: 'application/vnd.github+json',
      authorization: `Bearer ${token}`,
      'x-github-api-version': '2022-11-28',
      'user-agent': 'ssuresh808-portfolio-sync',
    };
    if (etag) headers['if-none-match'] = etag;
    try {
      const res = await fetch(`${API}/repos/${fullName}`, { headers, signal: AbortSignal.timeout(15_000) });
      if (res.status === 304) return { kind: 'not-modified' };
      if (!res.ok) return { kind: 'failed', reason: `HTTP ${res.status}` };
      const data = (await res.json()) as ApiRepo;
      return { kind: 'fresh', repo: mapRepo(data, res.headers.get('etag') ?? undefined) };
    } catch (err) {
      return { kind: 'failed', reason: (err as Error).message };
    }
  }

  const outcomes = new Map<string, FetchOutcome>();
  for (const name of allowlist) outcomes.set(name, await fetchOne(name)); // four repos: sequential is fine

  const fetchedAt = new Date().toISOString().replace(/\.\d{3}Z$/, 'Z');
  const { snapshot, warnings } = mergeSnapshot(previous, allowlist, outcomes, fetchedAt);
  for (const w of warnings) console.warn(`::warning::${w}`);

  if (snapshotChanged(previous, snapshot)) {
    fs.writeFileSync(snapshotPath, JSON.stringify(snapshot, null, 2) + '\n');
    console.log(`updated ${snapshotPath} (${snapshot.repos.length} repos)`);
  } else {
    console.log('snapshot unchanged; nothing written');
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
