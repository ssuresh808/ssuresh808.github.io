import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { Chip } from '@/components/common/Chip';
import { CATEGORY_LABELS } from '@/lib/schemas/project';
import type { ProjectCardData } from '@/lib/projects';

export function ProjectCard({ project, index = 0 }: { project: ProjectCardData; index?: number }) {
  const href = `/projects/${project.slug}/`;
  return (
    <article
      data-testid="project-card"
      data-featured={project.featured}
      data-reveal
      style={{ '--reveal-i': index } as React.CSSProperties}
      className="card-hover group relative flex h-full flex-col overflow-hidden rounded-card border border-border bg-surface focus-within:border-accent hover:border-accent"
    >
      <div className="relative aspect-[16/10] w-full border-b border-border bg-accent-tint">
        <Image
          src={project.coverImage}
          alt={project.coverAlt}
          fill
          sizes="(min-width: 1024px) 352px, (min-width: 640px) 50vw, 100vw"
          className="object-cover"
        />
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex flex-wrap items-center gap-2">
          <Chip tone="accent">{CATEGORY_LABELS[project.category]}</Chip>
          <Chip>{project.period}</Chip>
          {project.demoStatus === 'live' ? <Chip>Live demo</Chip> : null}
          {project.demoStatus === 'paused' ? <Chip tone="warn">Demo API paused</Chip> : null}
        </div>
        <h3 className="mt-3 text-lg font-semibold leading-snug">
          <Link href={href} className="after:absolute after:inset-0 after:content-[''] focus:outline-none">
            {project.title}
          </Link>
        </h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{project.tagline}</p>
        <p className="mt-3 text-xs text-muted">
          <span className="font-mono uppercase tracking-wide">Role</span>{' '}
          {project.collaboration === 'solo' ? 'Solo build' : project.collaboration}
          <span aria-hidden="true"> · </span>
          <span className="font-mono uppercase tracking-wide">Stack</span> {project.tags.slice(0, 4).join(', ')}
        </p>
        <p className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-accent">
          Case study{' '}
          <ArrowUpRight size={16} aria-hidden="true" className="transition-transform group-hover:translate-x-0.5" />
        </p>
      </div>
    </article>
  );
}
