import { Mail, FileText } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '@/components/common/BrandIcons';
import { ExternalLink } from '@/components/common/ExternalLink';
import type { Profile } from '@/lib/schemas/profile';

export function SiteFooter({ profile }: { profile: Profile }) {
  const linkClass = 'inline-flex items-center gap-2 text-sm text-ink hover:text-accent';
  return (
    <footer id="contact" className="border-t border-border bg-surface">
      <div className="mx-auto max-w-site px-4 py-12 sm:px-6 lg:px-8">
        <p className="font-mono text-xs uppercase tracking-[0.12em] text-muted">Let&apos;s connect</p>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight">Open to Summer 2027 internships</h2>
        <ul className="mt-6 flex flex-wrap gap-x-8 gap-y-3">
          <li>
            <a href={`mailto:${profile.email}`} className={linkClass}>
              <Mail size={16} aria-hidden="true" /> {profile.email}
            </a>
          </li>
          <li>
            <ExternalLink href={profile.links.linkedin} className={linkClass}>
              <LinkedinIcon size={16} /> LinkedIn
            </ExternalLink>
          </li>
          <li>
            <ExternalLink href={profile.links.github} className={linkClass}>
              <GithubIcon size={16} /> GitHub
            </ExternalLink>
          </li>
          <li>
            <a href={profile.resume.path} download={profile.resume.downloadName} className={linkClass}>
              <FileText size={16} aria-hidden="true" /> Résumé (PDF)
            </a>
          </li>
        </ul>
        <p className="mt-10 text-xs text-muted">{profile.name}. Built as a static site; no analytics, no cookies.</p>
      </div>
    </footer>
  );
}
