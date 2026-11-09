import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Page not found' };

export default function NotFound() {
  return (
    <div className="mx-auto max-w-site px-4 py-24 sm:px-6 lg:px-8">
      <p className="font-mono text-xs uppercase tracking-[0.12em] text-muted">404</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">Page not found</h1>
      <p className="mt-4 max-w-prose text-muted">
        There is nothing at that address. Try the projects or the résumé.
      </p>
      <div className="mt-8 flex gap-4">
        <Link href="/" className="rounded-button bg-accent px-4 py-2 text-sm font-medium text-on-accent">
          Back to home
        </Link>
        <Link href="/projects/" className="rounded-button border border-border bg-surface px-4 py-2 text-sm font-medium">
          See projects
        </Link>
      </div>
    </div>
  );
}
