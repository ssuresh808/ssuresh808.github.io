import fs from 'node:fs';
import path from 'node:path';

const ATTR_RE = /\b(?:href|src)=["']([^"']+)["']/g;

export function extractLocalLinks(html: string): string[] {
  const out: string[] = [];
  for (const m of html.matchAll(ATTR_RE)) {
    const raw = m[1];
    if (!raw.startsWith('/') || raw.startsWith('//')) continue;
    const clean = raw.split('#')[0].split('?')[0];
    if (clean) out.push(clean);
  }
  return out;
}

export function resolveToFile(href: string, outDir: string): string | null {
  const decoded = decodeURIComponent(href);
  const candidates = decoded.endsWith('/')
    ? [path.join(outDir, decoded, 'index.html')]
    : [path.join(outDir, decoded), path.join(outDir, decoded, 'index.html'), path.join(outDir, `${decoded}.html`)];
  for (const c of candidates) if (fs.existsSync(c) && fs.statSync(c).isFile()) return c;
  return null;
}

function walkHtml(dir: string, base = dir): string[] {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((d) => {
    const full = path.join(dir, d.name);
    if (d.isDirectory()) return walkHtml(full, base);
    return d.name.endsWith('.html') ? [path.relative(base, full)] : [];
  });
}

export function checkOutDir(outDir: string): { checked: number; missing: { page: string; href: string }[] } {
  const missing: { page: string; href: string }[] = [];
  let checked = 0;
  for (const page of walkHtml(outDir).sort()) {
    const html = fs.readFileSync(path.join(outDir, page), 'utf8');
    for (const href of [...new Set(extractLocalLinks(html))]) {
      checked++;
      if (!resolveToFile(href, outDir)) missing.push({ page, href });
    }
  }
  return { checked, missing };
}

const URL_RE = /https:\/\/[^\s"'<>)\]\\]+/g;

function walkAll(dir: string): string[] {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((d) => {
    const full = path.join(dir, d.name);
    return d.isDirectory() ? walkAll(full) : [full];
  });
}

export function collectExternalUrls(contentDir: string, outDir: string): string[] {
  const urls = new Set<string>();
  const files = [...walkAll(contentDir), ...walkHtml(outDir).map((p) => path.join(outDir, p))];
  for (const f of files) {
    for (const m of fs.readFileSync(f, 'utf8').matchAll(URL_RE)) {
      const u = m[0].replace(/[.,;:\\]+$/, '');
      if (!u.includes('ssuresh808.github.io') && !u.includes('schema.org') && !u.includes('w3.org')) urls.add(u);
    }
  }
  return [...urls].sort();
}
