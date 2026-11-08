import path from 'node:path';
import fs from 'node:fs';
import { checkOutDir } from '../src/lib/links';

const outDir = path.join(process.cwd(), 'out');
if (!fs.existsSync(outDir)) {
  console.error('out/ not found; run npm run build first');
  process.exit(2);
}
const { checked, missing } = checkOutDir(outDir);
if (missing.length > 0) {
  console.error(`${missing.length} broken internal link(s) out of ${checked}:`);
  for (const m of missing) console.error(`  ${m.page} -> ${m.href}`);
  process.exit(1);
}
console.log(`All ${checked} internal links resolve.`);
