// Warn-only: transient internet faults must not fail a deploy.
import path from 'node:path';
import { collectExternalUrls } from '../src/lib/links';

async function main() {
  const urls = collectExternalUrls(path.join(process.cwd(), 'content'), path.join(process.cwd(), 'out'));
  let failures = 0;
  for (const url of urls) {
    try {
      const res = await fetch(url, {
        method: 'GET',
        redirect: 'follow',
        signal: AbortSignal.timeout(15_000),
        headers: { 'user-agent': 'portfolio-link-check' },
      });
      // LinkedIn answers automated requests with 999; a reachable profile is all we can check.
      const ok = res.status < 400 || (url.includes('linkedin.com') && (res.status === 999 || res.status < 500));
      console.log(`${ok ? 'ok  ' : 'WARN'} ${res.status} ${url}`);
      if (!ok) failures++;
    } catch (e) {
      console.log(`WARN err ${url} (${(e as Error).message})`);
      failures++;
    }
  }
  console.log(`${urls.length} external URLs checked, ${failures} warning(s).`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
