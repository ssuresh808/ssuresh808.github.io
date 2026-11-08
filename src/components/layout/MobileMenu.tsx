'use client';

import { useRef, type ReactNode } from 'react';

/**
 * Native <details> disclosure for the phone navigation. The only JavaScript
 * closes the menu after a link is chosen or Escape is pressed; without JS the
 * menu still opens and closes natively.
 */
export function MobileMenu({ label, children }: { label: string; children: ReactNode }) {
  const ref = useRef<HTMLDetailsElement>(null);
  const close = () => {
    if (ref.current) ref.current.open = false;
  };
  return (
    <details
      ref={ref}
      className="relative sm:hidden"
      onKeyDown={(e) => {
        if (e.key === 'Escape') {
          close();
          ref.current?.querySelector('summary')?.focus();
        }
      }}
      onClick={(e) => {
        if ((e.target as HTMLElement).closest('a')) close();
      }}
    >
      <summary className="cursor-pointer list-none rounded-button border border-border bg-surface px-3 py-1.5 text-sm font-medium [&::-webkit-details-marker]:hidden">
        {label}
      </summary>
      <div className="absolute right-0 mt-2 w-56 rounded-card border border-border bg-surface p-4 shadow-lg">{children}</div>
    </details>
  );
}
