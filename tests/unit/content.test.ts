import { describe, it, expect } from 'vitest';
import path from 'node:path';
import { loadProfile, loadExperience, ContentError } from '@/lib/content';
import { makeTempDir } from './helpers';

const goodProfile = `
name: Suraj Suresh
headline: I build and evaluate AI systems end to end.
roleLine: M.S. Data Science student seeking Summer 2027 internships.
summary: A year of production ML in fintech, then three AI systems built from scratch.
location: null
availability: Summer 2027 internships
email: mail2surajsuresh@gmail.com
links:
  github: https://github.com/ssuresh808
  linkedin: https://www.linkedin.com/in/suraj-suresh-profile/
resume:
  path: /resume.pdf
  downloadName: Suraj_Suresh_Resume.pdf
  updated: '2026-10-24'
photo: /images/suraj.webp
`;

describe('YAML loaders', () => {
  it('loads a valid profile', () => {
    const dir = makeTempDir({ 'profile.yaml': goodProfile });
    expect(loadProfile(dir).name).toBe('Suraj Suresh');
  });
  it('throws a ContentError naming the file and field on invalid YAML content', () => {
    const dir = makeTempDir({ 'profile.yaml': goodProfile.replace('mail2surajsuresh@gmail.com', 'not-an-email') });
    expect(() => loadProfile(dir)).toThrowError(ContentError);
    try {
      loadProfile(dir);
    } catch (e) {
      const msg = (e as Error).message;
      expect(msg).toContain(path.join(dir, 'profile.yaml'));
      expect(msg).toContain('email');
    }
  });
  it('loads experience entries', () => {
    const dir = makeTempDir({
      'experience.yaml': `
- id: fitbux
  organization: FitBUX
  title: Machine Learning Intern
  start: '2023-06'
  end: '2024-05'
  kind: internship
  highlights:
    - Fine-tuned BERT on a financial-text corpus and shipped it to production users.
`,
    });
    expect(loadExperience(dir)[0].organization).toBe('FitBUX');
  });
});
