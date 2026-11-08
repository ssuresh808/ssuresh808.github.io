import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { z } from 'zod';
import { CONTENT_DIR, ContentError } from './content';
import { ProjectFrontmatterSchema, type ProjectFrontmatter } from './schemas/project';

export interface Project extends ProjectFrontmatter {
  body: string;
}

export type ProjectCardData = Pick<
  Project,
  | 'slug'
  | 'title'
  | 'tagline'
  | 'category'
  | 'tags'
  | 'coverImage'
  | 'coverAlt'
  | 'featured'
  | 'demoStatus'
  | 'period'
  | 'contribution'
  | 'collaboration'
>;

export function sortProjects(a: Project, b: Project): number {
  if (a.featured !== b.featured) return a.featured ? -1 : 1;
  if (a.order !== b.order) return a.order - b.order;
  return b.publishedAt.localeCompare(a.publishedAt);
}

export function loadAllProjects(dir: string = CONTENT_DIR): Project[] {
  const projectsDir = path.join(dir, 'projects');
  if (!fs.existsSync(projectsDir)) throw new ContentError(projectsDir, 'projects directory not found');
  const files = fs
    .readdirSync(projectsDir)
    .filter((f) => f.endsWith('.mdx'))
    .sort();
  const seen = new Map<string, string>();
  const projects = files.map((file) => {
    const filePath = path.join(projectsDir, file);
    const { data, content } = matter(fs.readFileSync(filePath, 'utf8'));
    const result = ProjectFrontmatterSchema.safeParse(data);
    if (!result.success) throw new ContentError(filePath, z.prettifyError(result.error));
    const fm = result.data;
    const expected = file.replace(/\.mdx$/, '');
    if (fm.slug !== expected) {
      throw new ContentError(filePath, `slug "${fm.slug}" must match the file name "${expected}"`);
    }
    const prior = seen.get(fm.slug);
    if (prior) throw new ContentError(filePath, `duplicate slug "${fm.slug}" (also in ${prior})`);
    seen.set(fm.slug, filePath);
    return { ...fm, body: content.trim() };
  });
  return projects.sort(sortProjects);
}

export function getPublishedProjects(dir: string = CONTENT_DIR): Project[] {
  return loadAllProjects(dir).filter((p) => p.published);
}

export function getFeaturedProjects(dir: string = CONTENT_DIR): Project[] {
  return getPublishedProjects(dir).filter((p) => p.featured);
}

export function getProjectBySlug(slug: string, dir: string = CONTENT_DIR): Project | null {
  return getPublishedProjects(dir).find((p) => p.slug === slug) ?? null;
}

export function getAllProjectSlugs(dir: string = CONTENT_DIR): string[] {
  return getPublishedProjects(dir).map((p) => p.slug);
}

export function toCardData(p: Project): ProjectCardData {
  return {
    slug: p.slug,
    title: p.title,
    tagline: p.tagline,
    category: p.category,
    tags: p.tags,
    coverImage: p.coverImage,
    coverAlt: p.coverAlt,
    featured: p.featured,
    demoStatus: p.demoStatus,
    period: p.period,
    contribution: p.contribution,
    collaboration: p.collaboration,
  };
}
