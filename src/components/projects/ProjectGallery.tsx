'use client';

import { useMemo, useState } from 'react';
import { ProjectCard } from './ProjectCard';
import { CATEGORY_LABELS, type Category } from '@/lib/schemas/project';
import type { ProjectCardData } from '@/lib/projects';

type Filter = 'all' | Category;

export function ProjectGallery({ projects }: { projects: ProjectCardData[] }) {
  const [filter, setFilter] = useState<Filter>('all');

  const counts = useMemo(() => {
    const c: Partial<Record<Category, number>> = {};
    for (const p of projects) c[p.category] = (c[p.category] ?? 0) + 1;
    return c;
  }, [projects]);

  const visible = filter === 'all' ? projects : projects.filter((p) => p.category === filter);
  const options: { value: Filter; label: string; count: number }[] = [
    { value: 'all', label: 'All', count: projects.length },
    ...(Object.keys(counts) as Category[]).map((c) => ({ value: c, label: CATEGORY_LABELS[c], count: counts[c] ?? 0 })),
  ];

  return (
    <div>
      <div role="group" aria-label="Filter by category" className="flex flex-wrap gap-2">
        {options.map((o) => {
          const active = o.value === filter;
          return (
            <button
              key={o.value}
              type="button"
              aria-pressed={active}
              onClick={() => setFilter(o.value)}
              className={`rounded-full border px-3 py-1.5 text-sm font-medium transition-colors ${
                active ? 'border-accent bg-accent text-white' : 'border-border bg-surface text-ink hover:border-accent'
              }`}
            >
              {o.label} <span className="font-mono text-xs opacity-80">{o.count}</span>
            </button>
          );
        })}
      </div>
      <p role="status" aria-live="polite" className="mt-4 text-sm text-muted">
        {visible.length} {visible.length === 1 ? 'project' : 'projects'}
        {filter === 'all' ? '' : ` in ${CATEGORY_LABELS[filter]}`}
      </p>
      <ul className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((p) => (
          <li key={p.slug} className="h-full">
            <ProjectCard project={p} />
          </li>
        ))}
      </ul>
    </div>
  );
}
