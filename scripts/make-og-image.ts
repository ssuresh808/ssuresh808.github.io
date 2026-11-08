import sharp from 'sharp';

const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <rect width="1200" height="630" fill="#F7F8F6"/>
  <rect x="0" y="0" width="16" height="630" fill="#12665C"/>
  <text x="90" y="150" font-family="Inter, system-ui, sans-serif" font-size="30" fill="#52615D" letter-spacing="4">ENGINEERING PORTFOLIO</text>
  <text x="90" y="260" font-family="Inter, system-ui, sans-serif" font-size="88" font-weight="700" fill="#172321">Suraj Suresh</text>
  <text x="90" y="340" font-family="Inter, system-ui, sans-serif" font-size="40" fill="#172321">I build and evaluate AI systems end to end.</text>
  <text x="90" y="420" font-family="Inter, system-ui, sans-serif" font-size="30" fill="#52615D">Agentic RAG  ·  LifeLens  ·  Person of Interest</text>
  <text x="90" y="540" font-family="IBM Plex Mono, ui-monospace, monospace" font-size="26" fill="#12665C">github.com/ssuresh808</text>
</svg>`;

async function main() {
  await sharp(Buffer.from(svg)).png().toFile('public/og-image.png');
  console.log('wrote public/og-image.png');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
