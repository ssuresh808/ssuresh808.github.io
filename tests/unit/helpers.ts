import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

/** Writes `files` (relative path -> contents) into a fresh temp dir and returns its path. */
export function makeTempDir(files: Record<string, string>): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'portfolio-test-'));
  for (const [rel, contents] of Object.entries(files)) {
    const full = path.join(dir, rel);
    fs.mkdirSync(path.dirname(full), { recursive: true });
    fs.writeFileSync(full, contents);
  }
  return dir;
}
