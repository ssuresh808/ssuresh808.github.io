import path from 'node:path';
import { validateContent } from '../src/lib/validate';

const root = process.cwd();
const errors = validateContent({
  contentDir: path.join(root, 'content'),
  snapshotPath: path.join(root, 'data', 'github-snapshot.json'),
  publicDir: path.join(root, 'public'),
});

if (errors.length > 0) {
  console.error(`Content validation failed with ${errors.length} error(s):\n`);
  for (const e of errors) console.error(`  - ${e}`);
  process.exit(1);
}
console.log('Content validation passed.');
