import sharp from 'sharp';

// PNG fallbacks for browsers that ignore SVG favicons (Safari) and for home-screen icons.
async function main() {
  const svg = 'public/favicon.svg';
  await sharp(svg, { density: 384 }).resize(32, 32).png().toFile('public/favicon-32.png');
  await sharp(svg, { density: 384 }).resize(180, 180).png().toFile('public/apple-touch-icon.png');
  console.log('wrote public/favicon-32.png and public/apple-touch-icon.png');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
