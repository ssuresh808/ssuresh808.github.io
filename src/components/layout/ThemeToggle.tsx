'use client';

import { useSyncExternalStore } from 'react';
import { Moon, Sun } from 'lucide-react';

type Theme = 'light' | 'dark';

function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  return () => observer.disconnect();
}

function getSnapshot(): Theme {
  return document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light';
}

function getServerSnapshot(): Theme | null {
  return null; // unknown until the pre-paint script has run in the browser
}

/** Reads the theme the pre-paint script applied, and lets the reader flip and save it. */
export function ThemeToggle() {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const next: Theme = theme === 'dark' ? 'light' : 'dark';

  const apply = () => {
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem('theme', next);
    } catch {
      /* storage may be unavailable; the choice still applies for this page */
    }
  };

  const label = theme ? `Switch to ${next} theme` : 'Toggle color theme';
  return (
    <button
      type="button"
      onClick={apply}
      aria-label={label}
      title={label}
      className="inline-flex h-9 w-9 items-center justify-center rounded-button border border-border bg-surface text-ink hover:border-accent"
    >
      {theme === 'dark' ? <Sun size={16} aria-hidden="true" /> : <Moon size={16} aria-hidden="true" />}
    </button>
  );
}
