import Image from 'next/image';
import { Chip } from '@/components/common/Chip';
import { CATEGORY_LABELS } from '@/lib/schemas/project';
import { formatIsoDate } from '@/lib/text';
import type { Project } from '@/lib/projects';

export function ProjectHeader({ project }: { project: Project }) {
  return (
    <header className="border-b border-border bg-surface">
      <div className="mx-auto max-w-site px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center gap-2">
          <Chip tone="accent">{CATEGORY_LABELS[project.category]}</Chip>
          <Chip>{project.period}</Chip>
          <Chip>{project.collaboration === 'solo' ? 'Solo build' : project.collaboration}</Chip>
          <Chip>Published {formatIsoDate(project.publishedAt)}</Chip>
        </div>
        <h1 className="mt-4 max-w-4xl text-3xl font-semibold tracking-tight sm:text-4xl">{project.title}</h1>
        <p className="mt-3 max-w-3xl text-lg text-muted">{project.tagline}</p>
        <p className="mt-5 max-w-3xl rounded-card border border-border bg-bg p-4 text-sm leading-relaxed">
          <span className="font-mono text-xs uppercase tracking-[0.12em] text-muted">My contribution</span>
          <br />
          {project.contribution}
        </p>
        <ul className="mt-4 flex flex-wrap gap-2" aria-label="Technologies">
          {project.tags.map((t) => (
            <li key={t}>
              <Chip>{t}</Chip>
            </li>
          ))}
        </ul>
        <figure className="mt-8 overflow-hidden rounded-card border border-border bg-accent-tint">
          <Image src={project.coverImage} alt={project.coverAlt} width={1200} height={750} priority className="h-auto w-full" />
        </figure>
      </div>
    </header>
  );
}
