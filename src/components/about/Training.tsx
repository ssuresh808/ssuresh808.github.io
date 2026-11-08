import type { TrainingEntry } from '@/lib/schemas/education';

export function Training({ entries }: { entries: TrainingEntry[] }) {
  if (entries.length === 0) return null;
  return (
    <ul className="grid gap-4 sm:grid-cols-2">
      {entries.map((t) => (
        <li key={t.name} className="rounded-card border border-border bg-surface p-5">
          <p className="font-semibold">{t.name}</p>
          <p className="text-muted">
            {t.provider} <span aria-hidden="true">·</span> <span className="font-mono text-sm">{t.period}</span>
          </p>
          <p className="mt-2 text-sm leading-relaxed">{t.detail}</p>
        </li>
      ))}
    </ul>
  );
}
