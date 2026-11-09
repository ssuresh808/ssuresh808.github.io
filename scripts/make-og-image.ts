import fs from 'node:fs';
import sharp from 'sharp';
import { getPublishedProjects } from '../src/lib/projects';
import { CATEGORY_LABELS } from '../src/lib/schemas/project';

const esc = (t: string) => t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** Greedy word wrap for SVG text; `maxChars` is tuned per font size for a 1020px text column. */
function wrap(text: string, maxChars: number, maxLines: number): string[] {
  const lines: string[] = [];
  let line = '';
  for (const word of text.split(/\s+/)) {
    if ((line + ' ' + word).trim().length > maxChars && line) {
      lines.push(line);
      line = word;
    } else line = (line + ' ' + word).trim();
  }
  if (line) lines.push(line);
  if (lines.length > maxLines) {
    lines.length = maxLines;
    lines[maxLines - 1] = lines[maxLines - 1].replace(/[\s.,;:]+$/, '') + '...';
  }
  return lines;
}

function frame(inner: string): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <rect width="1200" height="630" fill="#f8fafc"/>
  <rect x="0" y="0" width="16" height="630" fill="#1d4ed8"/>
  ${inner}
</svg>`;
}

async function home() {
  // Composite of the three featured covers on the brand frame.
  const featured = getPublishedProjects().filter((p) => p.featured).slice(0, 3);
  const tileW = 300;
  const tileH = 188;
  const tiles = await Promise.all(
    featured.map(async (p) => {
      const file = `public${p.coverImage}`;
      const img = sharp(file, { density: 192 }).resize(tileW, tileH, { fit: 'cover', position: 'top' });
      return img.png().toBuffer();
    }),
  );
  const svg = frame(`
  <text x="90" y="110" font-family="Inter, system-ui, sans-serif" font-size="26" fill="#475569" letter-spacing="4">ENGINEERING PORTFOLIO</text>
  <text x="90" y="200" font-family="Inter, system-ui, sans-serif" font-size="76" font-weight="700" fill="#0f172a">Suraj Suresh</text>
  <text x="90" y="262" font-family="Inter, system-ui, sans-serif" font-size="32" fill="#0f172a">I build and evaluate AI systems end to end.</text>
  <text x="90" y="585" font-family="IBM Plex Mono, ui-monospace, monospace" font-size="24" fill="#1d4ed8">ssuresh808.github.io</text>`);
  const composites = tiles.map((input, i) => ({ input, left: 90 + i * (tileW + 30), top: 320 }));
  const frames = featured.map(() =>
    Buffer.from(
      `<svg xmlns="http://www.w3.org/2000/svg" width="${tileW + 4}" height="${tileH + 4}"><rect x="1" y="1" width="${tileW + 2}" height="${tileH + 2}" rx="12" fill="none" stroke="#e2e8f0" stroke-width="2"/></svg>`,
    ),
  );
  await sharp(Buffer.from(svg))
    .composite([
      ...frames.map((input, i) => ({ input, left: 88 + i * (tileW + 30), top: 318 })),
      ...composites,
    ])
    .png()
    .toFile('public/og-image.png');
  console.log('wrote public/og-image.png (composite of featured covers)');
}

async function projects() {
  fs.mkdirSync('public/og', { recursive: true });
  for (const p of getPublishedProjects()) {
    const title = wrap(p.title, 36, 3);
    const tagline = wrap(p.tagline, 62, 3);
    const titleSvg = title.map((l, i) => `<text x="90" y="${200 + i * 62}" font-family="Inter, system-ui, sans-serif" font-size="50" font-weight="700" fill="#0f172a">${esc(l)}</text>`).join('');
    const tagY = 200 + title.length * 62 + 24;
    const tagSvg = tagline.map((l, i) => `<text x="90" y="${tagY + i * 40}" font-family="Inter, system-ui, sans-serif" font-size="28" fill="#475569">${esc(l)}</text>`).join('');
    const svg = frame(`
  <text x="90" y="130" font-family="Inter, system-ui, sans-serif" font-size="26" fill="#475569" letter-spacing="4">${esc(CATEGORY_LABELS[p.category].toUpperCase())}  ·  CASE STUDY</text>
  ${titleSvg}
  ${tagSvg}
  <text x="90" y="560" font-family="IBM Plex Mono, ui-monospace, monospace" font-size="24" fill="#1d4ed8">Suraj Suresh  ·  ssuresh808.github.io/projects/${esc(p.slug)}/</text>`);
    const out = `public/og/${p.slug}.png`;
    await sharp(Buffer.from(svg)).png().toFile(out);
    console.log(`wrote ${out}`);
  }
}

async function main() {
  await home();
  await projects();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
