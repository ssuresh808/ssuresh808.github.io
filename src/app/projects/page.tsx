import type { Metadata } from 'next';
import { ProjectGallery } from '@/components/projects/ProjectGallery';
import { getPublishedProjects, toCardData } from '@/lib/projects';

export const metadata: Metadata = {
  title: 'Projects',
  description:
    'Case studies from Suraj Suresh: an agentic RAG system, a multimodal assistant PWA, explainable face retrieval, and a CLI tool.',
  alternates: { canonical: '/projects/' },
};

export default function ProjectsPage() {
  const projects = getPublishedProjects().map(toCardData);
  return (
    <div className="mx-auto max-w-site px-4 py-12 sm:px-6 lg:px-8">
      <p className="font-mono text-xs uppercase tracking-[0.12em] text-muted">Selected work</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Projects</h1>
      <p className="mt-4 max-w-prose text-muted">
        Each write-up covers the problem, what I built, how it works, the decisions I made, what I measured and how,
        and what I would do next.
      </p>
      <div className="mt-8">
        <ProjectGallery projects={projects} />
      </div>
    </div>
  );
}
