import Link from 'next/link';
import { Chip } from '@/components/common/Chip';
import { formatRange } from '@/lib/text';
import type { ExperienceEntry } from '@/lib/schemas/experience';

const KIND_LABEL: Record<ExperienceEntry['kind'], string> = {
  internship: 'Internship',
  research: 'Research',
  volunteer: 'Volunteer',
  'full-time': 'Full time',
  'part-time': 'Part time',
};

export function ExperienceTimeline({ entries, compact = false }: { entries: ExperienceEntry[]; compact?: boolean }) {
  return (
    <ol className="space-y-8">
      {entries.map((e) => (
        <li key={e.id} id={`experience-${e.id}`} className="grid gap-3 sm:grid-cols-[200px_1fr]">
          <div>
            <p className="font-mono text-sm text-muted">{formatRange(e.start, e.end)}</p>
            <div className="mt-2">
              <Chip>{KIND_LABEL[e.kind]}</Chip>
            </div>
          </div>
          <div className="min-w-0">
            <h3 className="text-lg font-semibold">{e.title}</h3>
            <p className="text-muted">
              {e.organization}
              {e.descriptor ? ` (${e.descriptor})` : ''}
              {e.location ? `, ${e.location}` : ''}
            </p>
            {e.summary ? <p className="mt-3 max-w-prose leading-relaxed">{e.summary}</p> : null}
            <ul className="highlights mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed">
              {e.highlights.map((h) => (
                <li key={h}>{h}</li>
              ))}
            </ul>
            {e.stack && e.stack.length > 0 ? (
              <ul className="mt-4 flex flex-wrap gap-2" aria-label="Technologies used">
                {e.stack.map((t) => (
                  <li key={t}>
                    <Chip>{t}</Chip>
                  </li>
                ))}
              </ul>
            ) : null}
            {compact && e.sections ? (
              <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {e.sections.map((section) => (
                  <div key={section.heading} className="rounded-card border border-border bg-surface p-4">
                    <h4 className="font-mono text-xs uppercase tracking-[0.12em] text-muted">{section.heading}</h4>
                    <p className="mt-2 text-sm leading-relaxed">{section.brief ?? section.items[0]}</p>
                  </div>
                ))}
              </div>
            ) : null}
            {compact && e.sections ? (
              <p className="mt-5 text-sm">
                <Link href={`/about/#experience-${e.id}`} className="font-medium text-accent underline underline-offset-4">
                  Read the full account
                </Link>
              </p>
            ) : null}
            {!compact && e.sections ? (
              <div className="mt-6 rounded-card border border-border bg-surface p-5">
                {e.sections.map((section, i) => (
                  <section key={section.heading} className={i === 0 ? '' : 'mt-5'}>
                    <h4 className="font-mono text-xs uppercase tracking-[0.12em] text-muted">{section.heading}</h4>
                    <ul className="mt-2 list-disc space-y-2 pl-5 text-sm leading-relaxed">
                      {section.items.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </section>
                ))}
                {e.note ? <p className="mt-5 text-xs text-muted">{e.note}</p> : null}
              </div>
            ) : null}
          </div>
        </li>
      ))}
    </ol>
  );
}
