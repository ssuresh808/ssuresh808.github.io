import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { validateContent } from '@/lib/validate';
import { makeTempDir } from './helpers';

const profile = `
name: Suraj Suresh
headline: I build and evaluate AI systems end to end.
roleLine: M.S. Data Science student seeking Summer 2027 internships.
summary: A year of production ML in fintech, then three AI systems built from scratch.
location: null
availability: Summer 2027 internships
email: mail2surajsuresh@gmail.com
links:
  github: https://github.com/ssuresh808
  linkedin: https://www.linkedin.com/in/suraj-suresh-profile/
resume:
  path: /resume.pdf
  downloadName: Suraj_Suresh_Resume.pdf
  updated: '2026-10-24'
photo: null
`;
const experience = `
- id: fitbux
  organization: FitBUX
  title: Machine Learning Intern
  start: '2023-06'
  end: '2024-05'
  kind: internship
  highlights:
    - Fine-tuned BERT on a financial-text corpus and shipped it to production users.
`;
const education = `
education:
  - institution: University of Colorado Boulder
    degree: M.S. in Data Science
    status: in progress
`;
const skills = `
- group: Languages
  items:
    - { name: Python, evidence: [p1] }
- group: ML
  items:
    - { name: PyTorch, evidence: ['experience:fitbux'] }
- group: Infra
  items:
    - { name: Docker, evidence: [] }
`;
function mdx(slug: string, featured = true, body = '## Problem\n\nText.') {
  return `---
slug: ${slug}
title: Title ${slug}
tagline: A tagline long enough to pass the minimum length rule.
category: ai-ml
featured: ${featured}
order: 1
published: true
publishedAt: '2026-01-01'
period: Jan 2026
contribution: Solo. Built everything.
collaboration: solo
tags: [Python]
coverImage: /projects/${slug}.webp
coverAlt: Cover image description
repo: ssuresh808/${slug}
---

${body}
`;
}
const snapshot = (slugs: string[]) =>
  JSON.stringify({
    fetchedAt: '2026-11-08T08:30:00Z',
    repos: slugs.map((s) => ({
      fullName: `ssuresh808/${s}`,
      htmlUrl: `https://github.com/ssuresh808/${s}`,
      description: null,
      primaryLanguage: 'Python',
      stars: 0,
      updatedAt: '2026-09-15T06:29:54Z',
      stale: false,
    })),
  });

function goodTree(overrides: Record<string, string> = {}) {
  const dir = makeTempDir({
    'content/profile.yaml': profile,
    'content/experience.yaml': experience,
    'content/education.yaml': education,
    'content/skills.yaml': skills,
    'content/projects/p1.mdx': mdx('p1'),
    'content/projects/p2.mdx': mdx('p2'),
    'content/projects/p3.mdx': mdx('p3'),
    'data/github-snapshot.json': snapshot(['p1', 'p2', 'p3']),
    'public/resume.pdf': 'x'.repeat(20_000),
    'public/projects/p1.webp': 'img',
    'public/projects/p2.webp': 'img',
    'public/projects/p3.webp': 'img',
    ...overrides,
  });
  return {
    contentDir: path.join(dir, 'content'),
    snapshotPath: path.join(dir, 'data/github-snapshot.json'),
    publicDir: path.join(dir, 'public'),
  };
}

describe('validateContent', () => {
  it('returns no errors for a good tree', () => {
    expect(validateContent(goodTree())).toEqual([]);
  });
  it('flags an em dash with file and line', () => {
    const errs = validateContent(goodTree({ 'content/projects/p1.mdx': mdx('p1', true, 'A — B') }));
    expect(errs.join('\n')).toMatch(/p1\.mdx:\d+.*dash/);
  });
  it('flags a phone number', () => {
    const errs = validateContent(goodTree({ 'content/projects/p1.mdx': mdx('p1', true, 'Call 408 915 6760') }));
    expect(errs.join('\n')).toMatch(/phone/);
  });
  it('requires exactly three featured published projects', () => {
    const errs = validateContent(goodTree({ 'content/projects/p3.mdx': mdx('p3', false) }));
    expect(errs.join('\n')).toMatch(/exactly 3 featured/);
  });
  it('flags a skills evidence reference that does not resolve', () => {
    const errs = validateContent(goodTree({ 'content/skills.yaml': skills.replace('[p1]', '[ghost]') }));
    expect(errs.join('\n')).toMatch(/ghost/);
  });
  it('flags a missing or tiny resume', () => {
    const errs = validateContent(goodTree({ 'public/resume.pdf': 'tiny' }));
    expect(errs.join('\n')).toMatch(/resume\.pdf/);
  });
  it('flags a missing cover image', () => {
    const opts = goodTree();
    fs.rmSync(path.join(opts.publicDir, 'projects/p2.webp'));
    expect(validateContent(opts).join('\n')).toMatch(/p2\.webp/);
  });
  it('flags a project repo missing from the snapshot', () => {
    const errs = validateContent(goodTree({ 'data/github-snapshot.json': snapshot(['p1', 'p2']) }));
    expect(errs.join('\n')).toMatch(/ssuresh808\/p3.*snapshot/);
  });
});
