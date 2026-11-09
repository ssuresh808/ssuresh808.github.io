import type { MetadataRoute } from 'next';
import { site } from '@/config/site';
import { getPublishedProjects } from '@/lib/projects';
import { getPublishedNotes } from '@/lib/notes';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const projects = getPublishedProjects();
  const notes = getPublishedNotes();
  const latest = projects.map((p) => p.publishedAt).sort().at(-1) ?? '2026-11-08';
  return [
    { url: `${site.url}/`, lastModified: latest, changeFrequency: 'monthly', priority: 1 },
    { url: `${site.url}/projects/`, lastModified: latest, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${site.url}/about/`, lastModified: latest, changeFrequency: 'monthly', priority: 0.7 },
    ...projects.map((p) => ({
      url: `${site.url}/projects/${p.slug}/`,
      lastModified: p.publishedAt,
      changeFrequency: 'yearly' as const,
      priority: p.featured ? 0.8 : 0.5,
    })),
    ...(notes.length > 0
      ? [{ url: `${site.url}/notes/`, lastModified: notes[0].publishedAt, changeFrequency: 'monthly' as const, priority: 0.6 }]
      : []),
    ...notes.map((n) => ({
      url: `${site.url}/notes/${n.slug}/`,
      lastModified: n.publishedAt,
      changeFrequency: 'yearly' as const,
      priority: 0.5,
    })),
  ];
}
