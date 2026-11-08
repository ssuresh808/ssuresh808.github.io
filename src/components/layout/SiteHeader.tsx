import Link from 'next/link';
import { Download } from 'lucide-react';
import { navItems } from '@/config/navigation';
import { site } from '@/config/site';

interface Props {
  resumeHref: string;
  resumeDownloadName: string;
}

function NavLinks({ stacked = false }: { stacked?: boolean }) {
  return (
    <ul className={stacked ? 'flex flex-col gap-3' : 'flex gap-6'}>
      {navItems.map((item) => (
        <li key={item.href}>
          <Link href={item.href} className="text-sm font-medium text-ink hover:text-accent">
            {item.label}
          </Link>
        </li>
      ))}
    </ul>
  );
}

export function SiteHeader({ resumeHref, resumeDownloadName }: Props) {
  const resume = (
    <a
      href={resumeHref}
      download={resumeDownloadName}
      className="inline-flex items-center gap-1.5 rounded-button bg-accent px-3 py-1.5 text-sm font-medium text-white hover:opacity-90"
    >
      <Download size={16} aria-hidden="true" />
      Résumé
    </a>
  );
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-bg/95 backdrop-blur">
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <div className="mx-auto flex max-w-site items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="font-semibold tracking-tight text-ink">
          {site.name}
        </Link>
        <div className="hidden items-center gap-6 sm:flex">
          <nav aria-label="Primary">
            <NavLinks />
          </nav>
          {resume}
        </div>
        <details className="relative sm:hidden">
          <summary className="cursor-pointer list-none rounded-button border border-border bg-surface px-3 py-1.5 text-sm font-medium [&::-webkit-details-marker]:hidden">
            Menu
          </summary>
          <div className="absolute right-0 mt-2 w-56 rounded-card border border-border bg-surface p-4 shadow-lg">
            <nav aria-label="Primary">
              <NavLinks stacked />
            </nav>
            <div className="mt-4">{resume}</div>
          </div>
        </details>
      </div>
    </header>
  );
}
