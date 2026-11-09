import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const COVER_SRC = 'assets/covers';
const COVER_OUT = 'public/projects';
const COVER_WIDTH = 1200;
const COVER_HEIGHT = 750; // 16:10 to match the card aspect ratio
const CANVAS = '#eff6ff';

async function covers() {
  for (const file of fs.readdirSync(COVER_SRC).filter((f) => /\.(png|jpe?g)$/i.test(f))) {
    const name = file.replace(/\.(png|jpe?g)$/i, '');
    const out = path.join(COVER_OUT, `${name}.webp`);
    const img = sharp(path.join(COVER_SRC, file));
    const meta = await img.metadata();
    const portrait = (meta.height ?? 0) > (meta.width ?? 0);
    let buffer: Buffer;
    if (portrait) {
      // Phone screenshots are placed whole on a tinted canvas instead of being cropped.
      const inner = await img.resize({ height: COVER_HEIGHT, fit: 'inside' }).png().toBuffer();
      const innerMeta = await sharp(inner).metadata();
      const w = innerMeta.width ?? 0;
      const left = Math.max(0, Math.floor((COVER_WIDTH - w) / 2));
      buffer = await sharp(inner)
        .extend({ left, right: Math.max(0, COVER_WIDTH - w - left), top: 0, bottom: 0, background: CANVAS })
        .webp({ quality: 82 })
        .toBuffer();
    } else {
      buffer = await img
        .resize({ width: COVER_WIDTH, height: COVER_HEIGHT, fit: 'cover', position: 'top' })
        .webp({ quality: 82 })
        .toBuffer();
    }
    fs.writeFileSync(out, buffer);
    console.log(`wrote ${out} (${buffer.length} bytes)`);
  }
}

async function avatar() {
  // Optional: drop a real photo at assets/avatar.png to render it in the hero (set photo in content/profile.yaml).
  if (!fs.existsSync('assets/avatar.png')) {
    console.log('no assets/avatar.png; skipping hero photo');
    return;
  }
  fs.mkdirSync('public/images', { recursive: true });
  const out = 'public/images/suraj.webp';
  await sharp('assets/avatar.png').resize(384, 384, { fit: 'cover' }).webp({ quality: 85 }).toFile(out);
  console.log(`wrote ${out}`);
}

async function main() {
  fs.mkdirSync(COVER_OUT, { recursive: true });
  await covers();
  await avatar();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
