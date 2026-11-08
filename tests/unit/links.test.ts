import { describe, it, expect } from 'vitest';
import path from 'node:path';
import { extractLocalLinks, resolveToFile, checkOutDir } from '@/lib/links';
import { makeTempDir } from './helpers';

describe('links', () => {
  it('extracts root-relative hrefs and srcs only', () => {
    const html = `<a href="/projects/">a</a><a href="https://x.y/">b</a><img src="/img/a.webp?x=1"><a href="//cdn/x">c</a><a href="/about/#experience">d</a>`;
    expect(extractLocalLinks(html)).toEqual(['/projects/', '/img/a.webp', '/about/']);
  });
  it('resolves directory routes, files, and the 404 page', () => {
    const out = makeTempDir({
      'index.html': '',
      'projects/index.html': '',
      'resume.pdf': '',
      '404.html': '',
    });
    expect(resolveToFile('/', out)).toBe(path.join(out, 'index.html'));
    expect(resolveToFile('/projects/', out)).toBe(path.join(out, 'projects/index.html'));
    expect(resolveToFile('/projects', out)).toBe(path.join(out, 'projects/index.html'));
    expect(resolveToFile('/resume.pdf', out)).toBe(path.join(out, 'resume.pdf'));
    expect(resolveToFile('/nope/', out)).toBeNull();
  });
  it('reports missing targets per page', () => {
    const out = makeTempDir({
      'index.html': '<a href="/projects/">ok</a><a href="/missing/">bad</a>',
      'projects/index.html': '<img src="/projects/x.webp">',
    });
    const result = checkOutDir(out);
    expect(result.checked).toBe(3);
    expect(result.missing).toEqual([
      { page: 'index.html', href: '/missing/' },
      { page: 'projects/index.html', href: '/projects/x.webp' },
    ]);
  });
});
