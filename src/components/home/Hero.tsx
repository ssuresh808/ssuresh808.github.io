import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Download, Mail } from 'lucide-react';
import { ExternalLink } from '@/components/common/ExternalLink';
import { GithubIcon, LinkedinIcon } from '@/components/common/BrandIcons';
import type { Profile } from '@/lib/schemas/profile';

export function Hero({ profile }: { profile: Profile }) {
  return (
    <section className="border-b border-border bg-surface">
      <div className="mx-auto grid max-w-site gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1fr_auto] lg:items-center lg:px-8 lg:py-24">
        <div className="max-w-3xl">
          <p className="font-mono text-xs uppercase tracking-[0.12em] text-muted">Engineering portfolio</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">{profile.name}</h1>
          <p className="mt-4 text-2xl font-medium leading-snug text-ink sm:text-3xl">{profile.headline}</p>
          <p className="mt-5 max-w-prose text-lg leading-relaxed text-muted">{profile.summary}</p>
          <p className="mt-4 max-w-prose text-base text-ink">{profile.roleLine}</p>
          {profile.location ? <p className="mt-1 text-sm text-muted">Based in {profile.location}</p> : null}
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href="/projects/"
              className="inline-flex items-center gap-2 rounded-button bg-accent px-4 py-2.5 text-sm font-medium text-white hover:opacity-90"
            >
              See projects <ArrowRight size={16} aria-hidden="true" />
            </Link>
            <a
              href={profile.resume.path}
              download={profile.resume.downloadName}
              className="inline-flex items-center gap-2 rounded-button border border-border bg-surface px-4 py-2.5 text-sm font-medium hover:border-accent"
            >
              <Download size={16} aria-hidden="true" /> Download résumé
            </a>
          </div>
          <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm">
            <li>
              <ExternalLink href={profile.links.github} className="inline-flex items-center gap-1.5 text-ink hover:text-accent">
                <GithubIcon size={16} /> GitHub
              </ExternalLink>
            </li>
            <li>
              <ExternalLink href={profile.links.linkedin} className="inline-flex items-center gap-1.5 text-ink hover:text-accent">
                <LinkedinIcon size={16} /> LinkedIn
              </ExternalLink>
            </li>
            <li>
              <a href={`mailto:${profile.email}`} className="inline-flex items-center gap-1.5 text-ink hover:text-accent">
                <Mail size={16} aria-hidden="true" /> Email
              </a>
            </li>
          </ul>
        </div>
        {profile.photo ? (
          <Image
            src={profile.photo}
            alt={`Portrait of ${profile.name}`}
            width={192}
            height={192}
            priority
            className="hidden h-48 w-48 rounded-card border border-border object-cover lg:block"
          />
        ) : null}
      </div>
    </section>
  );
}
