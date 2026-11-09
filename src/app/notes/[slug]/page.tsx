import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Chip } from '@/components/common/Chip';
import { getAllNoteSlugs, getNoteBySlug } from '@/lib/notes';
import { getProjectBySlug } from '@/lib/projects';
import { renderMdx } from '@/lib/mdx';
import { formatIsoDate } from '@/lib/text';

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllNoteSlugs().map((slug) => ({ slug }));
}

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const note = getNoteBySlug(slug);
  if (!note) return {};
  return {
    title: note.title,
    description: note.summary,
    alternates: { canonical: `/notes/${slug}/` },
    openGraph: { type: 'article', title: note.title, description: note.summary, publishedTime: note.publishedAt },
  };
}

export default async function NotePage({ params }: Params) {
  const { slug } = await params;
  const note = getNoteBySlug(slug);
  if (!note) notFound();
  const body = await renderMdx(note.body);
  const project = note.project ? getProjectBySlug(note.project) : null;

  return (
    <article className="mx-auto max-w-site px-4 py-12 sm:px-6 lg:px-8">
      <Link href="/notes/" className="inline-flex items-center gap-1 text-sm text-accent underline underline-offset-4">
        <ArrowLeft size={14} aria-hidden="true" /> All notes
      </Link>
      <header className="mt-6 max-w-3xl">
        <div className="flex flex-wrap items-center gap-2">
          <time dateTime={note.publishedAt} className="font-mono text-xs text-muted">
            {formatIsoDate(note.publishedAt)}
          </time>
          {note.tags.map((t) => (
            <Chip key={t}>{t}</Chip>
          ))}
        </div>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">{note.title}</h1>
        <p className="mt-4 text-lg text-muted">{note.summary}</p>
        {project ? (
          <p className="mt-4 text-sm">
            From the case study{' '}
            <Link href={`/projects/${project.slug}/`} className="font-medium text-accent underline underline-offset-4">
              {project.shortTitle ?? project.title}
            </Link>
          </p>
        ) : null}
      </header>
      <div className="prose-site mt-10">{body}</div>
    </article>
  );
}
