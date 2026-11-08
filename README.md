# surajsuresh.com

Personal engineering portfolio for Suraj Suresh: three case studies with measured evidence, experience, education, and a résumé. Static site built with Next.js (static export) and Tailwind CSS, deployed to GitHub Pages.

## Develop

    npm ci
    npm run dev            # http://localhost:3000
    npm run build          # validates content, exports to out/
    npm start              # serves out/ on :3000
    npm test               # unit tests (Vitest)
    npm run test:e2e       # Playwright + axe against out/
    npm run check:links    # internal links in out/
    GITHUB_TOKEN=... npm run sync:github   # refresh data/github-snapshot.json

## Content

Prose and facts live in `content/` (YAML and MDX) and are validated at build time: no em or en dashes, no phone numbers, exactly three featured projects, every evidence number linked to its source, every cover image present. Repository metadata comes from a committed snapshot in `data/` refreshed weekly by a workflow; the site never calls GitHub at request time.
