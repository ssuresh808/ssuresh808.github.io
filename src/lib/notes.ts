import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { z } from 'zod';
import { CONTENT_DIR, ContentError } from './content';
import { NoteFrontmatterSchema, type NoteFrontmatter } from './schemas/note';

export interface Note extends NoteFrontmatter {
  body: string;
}

/** Newest first. An absent notes directory means no notes, not an error. */
export function loadAllNotes(dir: string = CONTENT_DIR): Note[] {
  const notesDir = path.join(dir, 'notes');
  if (!fs.existsSync(notesDir)) return [];
  const files = fs
    .readdirSync(notesDir)
    .filter((f) => f.endsWith('.mdx'))
    .sort();
  const notes = files.map((file) => {
    const filePath = path.join(notesDir, file);
    const { data, content } = matter(fs.readFileSync(filePath, 'utf8'));
    const result = NoteFrontmatterSchema.safeParse(data);
    if (!result.success) throw new ContentError(filePath, z.prettifyError(result.error));
    const expected = file.replace(/\.mdx$/, '');
    if (result.data.slug !== expected) {
      throw new ContentError(filePath, `slug "${result.data.slug}" must match the file name "${expected}"`);
    }
    return { ...result.data, body: content.trim() };
  });
  return notes.sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

export function getPublishedNotes(dir: string = CONTENT_DIR): Note[] {
  return loadAllNotes(dir).filter((n) => n.published);
}

export function getNoteBySlug(slug: string, dir: string = CONTENT_DIR): Note | null {
  return getPublishedNotes(dir).find((n) => n.slug === slug) ?? null;
}

export function getAllNoteSlugs(dir: string = CONTENT_DIR): string[] {
  return getPublishedNotes(dir).map((n) => n.slug);
}
