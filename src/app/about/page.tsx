import type { Metadata } from 'next';
import { Section } from '@/components/common/Section';
import { ExperienceTimeline } from '@/components/about/ExperienceTimeline';
import { Education } from '@/components/about/Education';
import { Training } from '@/components/about/Training';
import { SkillEvidence } from '@/components/about/SkillEvidence';
import { loadProfile, loadExperience, loadEducation, loadSkills } from '@/lib/content';
import { getPublishedProjects } from '@/lib/projects';

export const metadata: Metadata = {
  title: 'About',
  description: 'Background, experience, education, training, and skills of Suraj Suresh.',
  alternates: { canonical: '/about/' },
};

export default function AboutPage() {
  const profile = loadProfile();
  const experience = loadExperience();
  const education = loadEducation();
  const skills = loadSkills();
  const titles = Object.fromEntries(getPublishedProjects().map((p) => [p.slug, p.title]));

  return (
    <>
      <div className="border-b border-border bg-surface">
        <div className="mx-auto max-w-site px-4 py-12 sm:px-6 lg:px-8">
          <p className="font-mono text-xs uppercase tracking-[0.12em] text-muted">Background</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">About</h1>
          <p className="mt-4 max-w-prose text-lg leading-relaxed">{profile.summary}</p>
          <p className="mt-3 max-w-prose text-muted">{profile.roleLine}</p>
        </div>
      </div>
      <Section id="experience" eyebrow="Experience" title="Where I have worked">
        <ExperienceTimeline entries={experience} />
      </Section>
      <Section id="education" eyebrow="Education" title="Degrees" className="border-t border-border bg-surface">
        <Education data={education} />
      </Section>
      <Section id="training" eyebrow="Training" title="Structured programs">
        <Training entries={education.training} />
      </Section>
      <Section
        id="skills"
        eyebrow="Skills"
        title="Skills, each tied to the work that proves it"
        className="border-t border-border bg-surface"
      >
        <SkillEvidence groups={skills} experience={experience} projectTitles={titles} />
      </Section>
    </>
  );
}
