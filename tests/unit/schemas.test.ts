import { describe, it, expect } from 'vitest';
import { ProjectFrontmatterSchema } from '@/lib/schemas/project';
import { ProfileSchema } from '@/lib/schemas/profile';
import { SnapshotSchema } from '@/lib/schemas/snapshot';

const validProject = {
  slug: 'agentic-rag',
  title: 'Agentic RAG over LLM Inference-Optimization Literature',
  tagline: 'Answers questions over an arXiv corpus with a LangGraph agent and cited sources.',
  category: 'ai-ml',
  featured: true,
  order: 1,
  published: true,
  publishedAt: '2026-07-10',
  period: 'Jun to Jul 2026',
  contribution: 'Solo. Designed and built everything in the repo.',
  collaboration: 'solo',
  tags: ['Python', 'LangGraph'],
  coverImage: '/projects/agentic-rag-architecture.svg',
  coverAlt: 'Architecture diagram from corpus to cited answer',
  repo: 'ssuresh808/Agentic-RAG-System-over-LLM-Inference-Optimization-Literature',
  demoStatus: 'none',
  links: [],
  evidence: [
    {
      label: 'Hybrid retrieval MRR',
      value: '0.594 to 0.639',
      method: 'rag-mini-wikipedia, 300 factoid questions, answer-string containment',
      sourceUrl: 'https://github.com/ssuresh808/x/blob/main/docs/experiments.md',
    },
  ],
};

describe('ProjectFrontmatterSchema', () => {
  it('accepts a valid project and applies defaults', () => {
    const p = ProjectFrontmatterSchema.parse(validProject);
    expect(p.slug).toBe('agentic-rag');
    expect(p.demoStatus).toBe('none');
  });
  it('rejects an uppercase slug', () => {
    expect(ProjectFrontmatterSchema.safeParse({ ...validProject, slug: 'Agentic' }).success).toBe(false);
  });
  it('rejects a non-https source url', () => {
    const bad = { ...validProject, evidence: [{ ...validProject.evidence[0], sourceUrl: 'http://github.com/x' }] };
    expect(ProjectFrontmatterSchema.safeParse(bad).success).toBe(false);
  });
  it('rejects a tagline over 160 characters', () => {
    expect(ProjectFrontmatterSchema.safeParse({ ...validProject, tagline: 'x'.repeat(161) }).success).toBe(false);
  });
  it('requires demoNote when demoStatus is paused', () => {
    const r = ProjectFrontmatterSchema.safeParse({
      ...validProject,
      demoUrl: 'https://lifelens-two.vercel.app',
      demoStatus: 'paused',
    });
    expect(r.success).toBe(false);
    expect(JSON.stringify(r.error?.issues)).toContain('demoNote');
  });
  it('requires demoUrl when demoStatus is live', () => {
    expect(ProjectFrontmatterSchema.safeParse({ ...validProject, demoStatus: 'live' }).success).toBe(false);
  });
  it('rejects a cover image outside /projects/', () => {
    expect(ProjectFrontmatterSchema.safeParse({ ...validProject, coverImage: '/images/x.png' }).success).toBe(false);
  });
});

describe('ProfileSchema', () => {
  it('rejects a non-pdf download name', () => {
    const r = ProfileSchema.safeParse({
      name: 'Suraj Suresh',
      headline: 'I build and evaluate AI systems end to end.',
      roleLine: 'M.S. Data Science student seeking Summer 2027 internships.',
      summary: 'A year of production ML in fintech, then three AI systems built from scratch.',
      location: null,
      availability: 'Summer 2027 internships',
      email: 'mail2surajsuresh@gmail.com',
      links: { github: 'https://github.com/ssuresh808', linkedin: 'https://www.linkedin.com/in/suraj-suresh-profile/' },
      resume: { path: '/resume.pdf', downloadName: 'resume.docx', updated: '2026-10-24' },
      photo: '/images/suraj.webp',
    });
    expect(r.success).toBe(false);
  });
});

describe('SnapshotSchema', () => {
  it('rejects a repo outside the ssuresh808 account', () => {
    const r = SnapshotSchema.safeParse({
      fetchedAt: '2026-11-08T08:30:00Z',
      repos: [
        {
          fullName: 'someone-else/repo',
          htmlUrl: 'https://github.com/someone-else/repo',
          description: null,
          primaryLanguage: 'Python',
          stars: 0,
          updatedAt: '2026-09-15T06:29:54Z',
          stale: false,
        },
      ],
    });
    expect(r.success).toBe(false);
  });
});
