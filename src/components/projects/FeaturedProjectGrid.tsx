import { ProjectCard } from './ProjectCard';
import type { ProjectCardData } from '@/lib/projects';

export function FeaturedProjectGrid({ projects }: { projects: ProjectCardData[] }) {
  return (
    <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {projects.map((p, i) => (
        <li key={p.slug} className="h-full">
          <ProjectCard project={p} index={i} />
        </li>
      ))}
    </ul>
  );
}
