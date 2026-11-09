import { describe, it, expect } from 'vitest';
import { loadAllNotes, getPublishedNotes, getNoteBySlug } from '@/lib/notes';
import { makeTempDir } from './helpers';

function note(slug: string, extra = '') {
  return `---
slug: ${slug}
title: A note title that is long enough
summary: A one-sentence summary of what the note says and why it matters.
publishedAt: '2026-11-09'
published: true
tags: [RAG]
${extra}
---

## Heading

Body text.
`;
}

describe('notes loader', () => {
  it('loads notes newest first and filters unpublished ones', () => {
    const dir = makeTempDir({
      'notes/a.mdx': note('a').replace("'2026-11-09'", "'2026-01-01'"),
      'notes/b.mdx': note('b'),
      'notes/c.mdx': note('c').replace('published: true', 'published: false'),
    });
    expect(loadAllNotes(dir).map((n) => n.slug)).toEqual(['b', 'a', 'c']);
    expect(getPublishedNotes(dir).map((n) => n.slug)).toEqual(['b', 'a']);
    expect(getNoteBySlug('c', dir)).toBeNull();
    expect(getNoteBySlug('b', dir)?.body).toContain('Body text.');
  });
  it('rejects a slug that does not match the file name', () => {
    const dir = makeTempDir({ 'notes/x.mdx': note('y') });
    expect(() => loadAllNotes(dir)).toThrow(/must match the file name/);
  });
});
