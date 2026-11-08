import Link from 'next/link';
import type { SkillGroup } from '@/lib/schemas/skills';
import type { ExperienceEntry } from '@/lib/schemas/experience';

interface Props {
  groups: SkillGroup[];
  experience: ExperienceEntry[];
  projectTitles: Record<string, string>; // slug -> title
  compact?: boolean;
}

function evidenceTarget(ref: string, experience: ExperienceEntry[], titles: Record<string, string>) {
  if (ref.startsWith('experience:')) {
    const id = ref.slice('experience:'.length);
    const e = experience.find((x) => x.id === id);
    return e ? { href: `/about/#experience-${id}`, label: e.organization } : null;
  }
  return titles[ref] ? { href: `/projects/${ref}/`, label: titles[ref] } : null;
}

export function SkillEvidence({ groups, experience, projectTitles, compact = false }: Props) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {groups.map((g) => {
        const headingId = `skills-${g.group.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
        return (
          <section key={g.group} aria-labelledby={headingId} className="rounded-card border border-border bg-surface p-5">
            <h3 id={headingId} className="font-mono text-xs uppercase tracking-[0.12em] text-muted">
              {g.group}
            </h3>
            <ul className="mt-3 space-y-2 text-sm">
              {g.items.map((item) => {
                const first = item.evidence.map((r) => evidenceTarget(r, experience, projectTitles)).find(Boolean);
                return (
                  <li key={item.name} className="flex flex-wrap items-baseline justify-between gap-x-3">
                    {first ? (
                      <Link
                        href={first.href}
                        className="text-ink underline decoration-border underline-offset-4 hover:decoration-accent"
                        title={`Evidence: ${first.label}`}
                      >
                        {item.name}
                      </Link>
                    ) : (
                      <span>{item.name}</span>
                    )}
                    {!compact && first ? <span className="text-xs text-muted">{first.label}</span> : null}
                  </li>
                );
              })}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
