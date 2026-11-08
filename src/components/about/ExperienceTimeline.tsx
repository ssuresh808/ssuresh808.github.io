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
          <div>
            <h3 className="text-lg font-semibold">{e.title}</h3>
            <p className="text-muted">
              {e.organization}
              {e.descriptor ? ` (${e.descriptor})` : ''}
              {e.location ? `, ${e.location}` : ''}
            </p>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed">
              {(compact ? e.highlights.slice(0, 2) : e.highlights).map((h) => (
                <li key={h}>{h}</li>
              ))}
            </ul>
          </div>
        </li>
      ))}
    </ol>
  );
}
