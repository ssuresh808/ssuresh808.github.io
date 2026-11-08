import type { ReactNode } from 'react';

interface SectionProps {
  id?: string;
  eyebrow: string;
  title?: string;
  children: ReactNode;
  className?: string;
}

export function Section({ id, eyebrow, title, children, className = '' }: SectionProps) {
  const headingId = id && title ? `${id}-heading` : undefined;
  return (
    <section id={id} aria-labelledby={headingId} className={`py-12 sm:py-16 ${className}`}>
      <div className="mx-auto max-w-site px-4 sm:px-6 lg:px-8">
        <p className="font-mono text-xs uppercase tracking-[0.12em] text-muted">{eyebrow}</p>
        {title ? (
          <h2 id={headingId} className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
            {title}
          </h2>
        ) : null}
        <div className="mt-6">{children}</div>
      </div>
    </section>
  );
}
