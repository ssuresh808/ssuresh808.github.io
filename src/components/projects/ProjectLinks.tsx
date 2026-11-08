import { ExternalLink as ExternalIcon, PauseCircle, Globe } from 'lucide-react';
import { ExternalLink } from '@/components/common/ExternalLink';
import { GithubIcon } from '@/components/common/BrandIcons';
import type { Project } from '@/lib/projects';

export function ProjectLinks({ project }: { project: Project }) {
  const linkClass = 'inline-flex items-center gap-2 text-sm font-medium text-accent underline underline-offset-4';
  return (
    <section aria-labelledby="links-heading" className="rounded-card border border-border bg-surface p-5">
      <h2 id="links-heading" className="font-mono text-xs uppercase tracking-[0.12em] text-muted">
        Links
      </h2>
      <ul className="mt-3 space-y-3">
        {project.repo ? (
          <li>
            <ExternalLink href={`https://github.com/${project.repo}`} className={linkClass}>
              <GithubIcon size={16} /> Source on GitHub
            </ExternalLink>
          </li>
        ) : null}
        {project.demoUrl && project.demoStatus === 'live' ? (
          <li>
            <ExternalLink href={project.demoUrl} className={linkClass}>
              <Globe size={16} aria-hidden="true" /> Live app
            </ExternalLink>
          </li>
        ) : null}
        {project.demoUrl && project.demoStatus === 'paused' ? (
          <li>
            <ExternalLink href={project.demoUrl} className={linkClass}>
              <Globe size={16} aria-hidden="true" /> Live app (API paused)
            </ExternalLink>
            <p className="mt-1 flex items-start gap-2 rounded-button border border-amber-300 bg-amber-50 p-2 text-sm text-amber-900">
              <PauseCircle size={16} aria-hidden="true" className="mt-0.5 shrink-0" />
              <span>{project.demoNote}</span>
            </p>
          </li>
        ) : null}
        {project.links.map((l) => (
          <li key={l.url}>
            <ExternalLink href={l.url} className={linkClass}>
              <ExternalIcon size={16} aria-hidden="true" /> {l.label}
            </ExternalLink>
          </li>
        ))}
      </ul>
    </section>
  );
}
