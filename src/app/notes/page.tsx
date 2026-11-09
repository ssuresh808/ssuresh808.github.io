import type { Metadata } from 'next';
import Link from 'next/link';
import { Chip } from '@/components/common/Chip';
import { getPublishedNotes } from '@/lib/notes';
import { formatIsoDate } from '@/lib/text';

export const metadata: Metadata = {
  title: 'Notes',
  description: 'Short engineering notes from Suraj Suresh on single results and the decisions that followed.',
  alternates: { canonical: '/notes/' },
};

export default function NotesPage() {
  const notes = getPublishedNotes();
  return (
    <div className="mx-auto max-w-site px-4 py-12 sm:px-6 lg:px-8">
      <p className="font-mono text-xs uppercase tracking-[0.12em] text-muted">Writing</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Notes</h1>
      <p className="mt-4 max-w-prose text-muted">
        Short notes on single results: what the numbers showed, what I changed because of them, and what I still want to check.
      </p>
      <ul className="mt-8 max-w-3xl space-y-6">
        {notes.map((n) => (
          <li key={n.slug} className="rounded-card border border-border bg-surface p-6">
            <div className="flex flex-wrap items-center gap-2">
              <time dateTime={n.publishedAt} className="font-mono text-xs text-muted">
                {formatIsoDate(n.publishedAt)}
              </time>
              {n.tags.map((t) => (
                <Chip key={t}>{t}</Chip>
              ))}
            </div>
            <h2 className="mt-3 text-xl font-semibold leading-snug">
              <Link href={`/notes/${n.slug}/`} className="hover:text-accent">
                {n.title}
              </Link>
            </h2>
            <p className="mt-2 text-muted">{n.summary}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
