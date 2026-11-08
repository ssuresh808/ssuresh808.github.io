import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ProjectHeader } from '@/components/projects/ProjectHeader';
import { EvidenceTable } from '@/components/projects/EvidenceTable';
import { ProjectLinks } from '@/components/projects/ProjectLinks';
import { RepoFacts } from '@/components/projects/RepoFacts';
import { getAllProjectSlugs, getProjectBySlug } from '@/lib/projects';
import { getRepoFacts, loadSnapshot } from '@/lib/github-snapshot';
import { renderMdx } from '@/lib/mdx';

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllProjectSlugs().map((slug) => ({ slug }));
}

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return {};
  return {
    title: project.title,
    description: project.tagline,
    alternates: { canonical: `/projects/${slug}/` },
    openGraph: {
      title: project.title,
      description: project.tagline,
      images: [{ url: `/og/${slug}.png`, width: 1200, height: 630, alt: project.title }],
    },
  };
}

export default async function ProjectPage({ params }: Params) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();
  const body = await renderMdx(project.body);
  const facts = project.repo ? getRepoFacts(loadSnapshot(), project.repo) : null;

  return (
    <article>
      <ProjectHeader project={project} />
      <div className="mx-auto grid max-w-site grid-cols-1 gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:px-8">
        <div className="min-w-0">
          <EvidenceTable evidence={project.evidence} />
          <div className="prose-site mt-10">{body}</div>
        </div>
        <aside className="min-w-0 space-y-6 lg:sticky lg:top-24 lg:self-start">
          <ProjectLinks project={project} />
          <RepoFacts facts={facts} />
        </aside>
      </div>
    </article>
  );
}
