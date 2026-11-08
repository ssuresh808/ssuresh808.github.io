import { describe, it, expect } from 'vitest';
import {
  loadAllProjects,
  getPublishedProjects,
  getFeaturedProjects,
  getProjectBySlug,
  getAllProjectSlugs,
  toCardData,
} from '@/lib/projects';
import { ContentError } from '@/lib/content';
import { makeTempDir } from './helpers';

function mdx(slug: string, extra: Record<string, unknown> = {}, body = '## Problem\n\nText.') {
  const fm: Record<string, unknown> = {
    slug,
    title: `Title ${slug}`,
    tagline: 'A tagline long enough to pass the minimum length rule.',
    category: 'ai-ml',
    featured: false,
    order: 100,
    published: true,
    publishedAt: '2026-01-01',
    period: 'Jan 2026',
    contribution: 'Solo. Built everything.',
    collaboration: 'solo',
    tags: ['Python'],
    coverImage: `/projects/${slug}.webp`,
    coverAlt: 'Cover image description',
    repo: `ssuresh808/${slug}`,
    ...extra,
  };
  const lines = Object.entries(fm).map(([k, v]) => `${k}: ${JSON.stringify(v)}`);
  return `---\n${lines.join('\n')}\n---\n\n${body}\n`;
}

describe('project loader', () => {
  it('loads, validates, and sorts featured first, then order, then newest publishedAt', () => {
    const dir = makeTempDir({
      'projects/c.mdx': mdx('c', { featured: true, order: 2 }),
      'projects/a.mdx': mdx('a', { featured: false, publishedAt: '2026-03-01' }),
      'projects/b.mdx': mdx('b', { featured: true, order: 1 }),
      'projects/d.mdx': mdx('d', { featured: false, publishedAt: '2026-02-01' }),
    });
    expect(loadAllProjects(dir).map((p) => p.slug)).toEqual(['b', 'c', 'a', 'd']);
  });
  it('excludes unpublished projects from published, featured, and slug lists', () => {
    const dir = makeTempDir({
      'projects/a.mdx': mdx('a', { featured: true, published: false }),
      'projects/b.mdx': mdx('b', { featured: true }),
    });
    expect(getPublishedProjects(dir).map((p) => p.slug)).toEqual(['b']);
    expect(getFeaturedProjects(dir).map((p) => p.slug)).toEqual(['b']);
    expect(getAllProjectSlugs(dir)).toEqual(['b']);
    expect(getProjectBySlug('a', dir)).toBeNull();
  });
  it('returns the body for a slug and null for unknown slugs', () => {
    const dir = makeTempDir({ 'projects/a.mdx': mdx('a', {}, '## Problem\n\nHello body.') });
    expect(getProjectBySlug('a', dir)?.body).toContain('Hello body.');
    expect(getProjectBySlug('zzz', dir)).toBeNull();
  });
  it('throws when the slug does not match the file name', () => {
    const dir = makeTempDir({ 'projects/wrong.mdx': mdx('a') });
    expect(() => loadAllProjects(dir)).toThrowError(ContentError);
  });
  it('throws on duplicate slugs across files', () => {
    const dir = makeTempDir({ 'projects/a.mdx': mdx('a'), 'projects/a2.mdx': mdx('a') });
    expect(() => loadAllProjects(dir)).toThrowError(/duplicate slug|must match the file name/);
  });
  it('throws a ContentError naming the file for invalid frontmatter', () => {
    const dir = makeTempDir({ 'projects/a.mdx': mdx('a', { tagline: 'short' }) });
    expect(() => loadAllProjects(dir)).toThrowError(/projects\/a\.mdx/);
  });
  it('produces card data without the body', () => {
    const dir = makeTempDir({ 'projects/a.mdx': mdx('a') });
    const card = toCardData(loadAllProjects(dir)[0]);
    expect(card).not.toHaveProperty('body');
    expect(card.slug).toBe('a');
  });
});
