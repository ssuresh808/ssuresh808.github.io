import type { Metadata } from 'next';
import Link from 'next/link';
import { site } from '@/config/site';
import { Hero } from '@/components/home/Hero';
import { FeaturedProjectGrid } from '@/components/projects/FeaturedProjectGrid';
import { ExperienceTimeline } from '@/components/about/ExperienceTimeline';
import { Education } from '@/components/about/Education';
import { SkillEvidence } from '@/components/about/SkillEvidence';
import { Section } from '@/components/common/Section';
import { loadProfile, loadExperience, loadEducation, loadSkills } from '@/lib/content';
import { getFeaturedProjects, getPublishedProjects, toCardData } from '@/lib/projects';

export const metadata: Metadata = { alternates: { canonical: '/' } };

export default function HomePage() {
  const profile = loadProfile();
  const experience = loadExperience();
  const education = loadEducation();
  const skills = loadSkills();
  const featured = getFeaturedProjects().map(toCardData);
  const titles = Object.fromEntries(getPublishedProjects().map((p) => [p.slug, p.title]));
  const inProgress = education.education.filter((e) => e.status === 'in progress');
  const completed = education.education.filter((e) => e.status === 'completed');
  const personJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: profile.name,
    url: `${site.url}/`,
    email: `mailto:${profile.email}`,
    description: profile.roleLine,
    sameAs: [profile.links.github, profile.links.linkedin],
    affiliation: inProgress.map((e) => ({ '@type': 'CollegeOrUniversity', name: e.institution })),
    alumniOf: completed.map((e) => ({ '@type': 'CollegeOrUniversity', name: e.institution })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }} />
      <Hero profile={profile} />
      <Section id="work" eyebrow="Selected work" title="Three systems, each with evidence and documented decisions">
        <FeaturedProjectGrid projects={featured} />
        <p className="mt-6 text-sm">
          <Link href="/projects/" className="font-medium text-accent underline underline-offset-4">
            All projects
          </Link>
        </p>
      </Section>
      <Section
        id="experience"
        eyebrow="Experience"
        title="Production ML in fintech"
        className="border-t border-border bg-surface"
      >
        <ExperienceTimeline entries={experience} compact />
        <p className="mt-6 text-sm">
          <Link href="/about/#experience" className="font-medium text-accent underline underline-offset-4">
            Full experience and education
          </Link>
        </p>
      </Section>
      <Section id="skills" eyebrow="Skills" title="Every skill points at the work that proves it">
        <SkillEvidence groups={skills} experience={experience} projectTitles={titles} compact />
      </Section>
      <Section id="education" eyebrow="Education" className="border-t border-border bg-surface">
        <Education data={education} compact />
      </Section>
    </>
  );
}
