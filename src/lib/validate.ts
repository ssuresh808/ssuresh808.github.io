import fs from 'node:fs';
import path from 'node:path';
import { loadProfile, loadExperience, loadEducation, loadSkills, ContentError } from './content';
import { loadAllProjects } from './projects';
import { loadAllNotes } from './notes';
import { loadSnapshot } from './github-snapshot';
import { findDashes } from './text';

export interface ValidateOptions {
  contentDir: string;
  snapshotPath: string;
  publicDir: string;
}

/** US-style phone numbers in any common punctuation. */
export const PHONE_RE = /(?<!\d)\(?\d{3}\)?[ .-]?\d{3}[ .-]?\d{4}(?!\d)/;
const MIN_RESUME_BYTES = 10_000;

function walk(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((d) => {
    const full = path.join(dir, d.name);
    return d.isDirectory() ? walk(full) : [full];
  });
}

function scanProse(contentDir: string, errors: string[]): void {
  for (const file of walk(contentDir)) {
    const lines = fs.readFileSync(file, 'utf8').split('\n');
    lines.forEach((line, i) => {
      if (findDashes(line).length > 0) errors.push(`${file}:${i + 1} contains an em or en dash; use a comma, period, or "to"`);
      if (PHONE_RE.test(line)) errors.push(`${file}:${i + 1} looks like it contains a phone number`);
    });
  }
}

export function validateContent(opts: ValidateOptions): string[] {
  const errors: string[] = [];
  const attempt = <T>(fn: () => T): T | null => {
    try {
      return fn();
    } catch (e) {
      errors.push(e instanceof ContentError ? e.message : String((e as Error).message ?? e));
      return null;
    }
  };

  attempt(() => loadProfile(opts.contentDir));
  const experience = attempt(() => loadExperience(opts.contentDir)) ?? [];
  attempt(() => loadEducation(opts.contentDir));
  const skills = attempt(() => loadSkills(opts.contentDir)) ?? [];
  const projects = attempt(() => loadAllProjects(opts.contentDir)) ?? [];
  const snapshot = attempt(() => loadSnapshot(opts.snapshotPath));
  const notes = attempt(() => loadAllNotes(opts.contentDir)) ?? [];

  const published = projects.filter((p) => p.published);
  const featured = published.filter((p) => p.featured);
  if (projects.length > 0 && featured.length !== 3) {
    errors.push(`expected exactly 3 featured published projects, found ${featured.length}`);
  }

  const slugs = new Set(published.map((p) => p.slug));
  const experienceIds = new Set(experience.map((e) => `experience:${e.id}`));
  for (const group of skills) {
    for (const item of group.items) {
      for (const ref of item.evidence) {
        if (!slugs.has(ref) && !experienceIds.has(ref)) {
          errors.push(`skills.yaml: "${item.name}" references unknown evidence "${ref}"`);
        }
      }
    }
  }

  for (const n of notes) {
    if (n.published && n.project && !slugs.has(n.project)) {
      errors.push(`notes/${n.slug}.mdx: project "${n.project}" is not a published project`);
    }
  }

  for (const p of published) {
    const cover = path.join(opts.publicDir, p.coverImage);
    if (!fs.existsSync(cover)) errors.push(`${p.slug}: cover image ${p.coverImage} not found under public/ (expected ${cover})`);
    if (p.repo && snapshot && !snapshot.repos.some((r) => r.fullName === p.repo)) {
      errors.push(`${p.slug}: repo ${p.repo} is not in the GitHub snapshot; run npm run sync:github`);
    }
  }

  const resume = path.join(opts.publicDir, 'resume.pdf');
  if (!fs.existsSync(resume) || fs.statSync(resume).size < MIN_RESUME_BYTES) {
    errors.push(`public/resume.pdf is missing or smaller than ${MIN_RESUME_BYTES} bytes`);
  }

  scanProse(opts.contentDir, errors);
  return errors;
}
