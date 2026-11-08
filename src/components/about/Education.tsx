import type { EducationFile } from '@/lib/schemas/education';

export function Education({ data, compact = false }: { data: EducationFile; compact?: boolean }) {
  return (
    <div>
      <ul className="grid gap-4 sm:grid-cols-2">
        {data.education.map((e) => (
          <li key={e.institution} className="rounded-card border border-border bg-surface p-5">
            <p className="font-semibold">{e.degree}</p>
            <p className="text-muted">{e.institution}</p>
            <p className="mt-2 font-mono text-sm text-muted">
              {e.status === 'in progress' ? `Expected ${e.expected}` : `Completed ${e.completed}`}
              {e.gpa ? ` · GPA ${e.gpa}` : ''}
            </p>
          </li>
        ))}
      </ul>
      {!compact && data.coursework.length > 0 ? (
        <p className="mt-4 text-sm text-muted">
          <span className="font-mono text-xs uppercase tracking-wide">Relevant coursework</span>{' '}
          {data.coursework.join(', ')}
        </p>
      ) : null}
    </div>
  );
}
