import type { ReactNode } from 'react';

export function Chip({ children, tone = 'neutral' }: { children: ReactNode; tone?: 'neutral' | 'accent' | 'warn' }) {
  const tones = {
    neutral: 'border-border bg-surface text-muted',
    accent: 'border-transparent bg-accent-tint text-accent',
    warn: 'border-amber-300 bg-amber-50 text-amber-900',
  } as const;
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 font-mono text-xs ${tones[tone]}`}>
      {children}
    </span>
  );
}
