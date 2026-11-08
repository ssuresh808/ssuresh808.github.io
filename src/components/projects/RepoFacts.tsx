import { formatIsoDate } from '@/lib/text';
import type { RepoFacts as Facts } from '@/lib/github-snapshot';

export function RepoFacts({ facts }: { facts: Facts | null }) {
  if (!facts) return null;
  return (
    <section aria-labelledby="repo-heading" className="rounded-card border border-border bg-surface p-5">
      <h2 id="repo-heading" className="font-mono text-xs uppercase tracking-[0.12em] text-muted">
        Repository
      </h2>
      <dl className="mt-3 space-y-2 text-sm">
        {facts.primaryLanguage ? (
          <div className="flex justify-between gap-4">
            <dt className="text-muted">Primary language</dt>
            <dd>{facts.primaryLanguage}</dd>
          </div>
        ) : null}
        <div className="flex justify-between gap-4">
          <dt className="text-muted">Repository last updated</dt>
          <dd>{formatIsoDate(facts.updatedAt)}</dd>
        </div>
        {facts.showStars && facts.stars !== null ? (
          <div className="flex justify-between gap-4">
            <dt className="text-muted">Stars</dt>
            <dd>{facts.stars}</dd>
          </div>
        ) : null}
      </dl>
      <p className="mt-3 text-xs text-muted">
        From a GitHub snapshot taken {formatIsoDate(facts.asOf)}
        {facts.stale ? ' (older than 30 days; volatile numbers hidden)' : ''}.
      </p>
    </section>
  );
}
