# CPRE English Study

An unofficial, mobile-first study web app for people taking the IREB CPRE Foundation Level examination in English.

## Features

- English-only navigation, instructions, question stems, and answer choices
- Japanese explanations shown only after answering and in the review queue
- Seven educational units mapped to the CPRE Foundation Level syllabus
- 45 independently written questions across single-choice, multiple-choice, and true/false formats
- 45-question, 75-minute mock exam with scoring based on the published examination rules
- Wrong-answer review, unit completion, bookmarks, and mock history
- Private GitHub-backed progress and active-exam synchronization across devices
- Browser storage used as an offline cache, with snapshot links as an additional backup
- Responsive dark interface designed for Android and desktop browsers
- Visible source, version, chapter, and educational-objective references

## Official-source policy

Only enabled entries in [`sources/manifest.json`](sources/manifest.json) may be used. The manifest pins the official IREB URL, English document version, publication date, media type, and SHA-256.

Downloaded files and extracted text are written to `data/raw` and `data/extracted`. Both directories are ignored by Git and must not be placed in public assets or build output.

```bash
npm run sources:propose   # show observed hashes for manual review
npm run sources:download  # download only when every pinned hash matches
npm run sources:extract   # extract local page text and structural candidates
```

The application does not reproduce official long-form passages, figures, tables, glossary definitions, or official practice questions. Questions and explanations are independently written from the syllabus learning objectives. See [`PLAN.md`](PLAN.md) for the complete content and copyright policy.

## Local setup

Requirements: Node.js 24 or later and npm.

```bash
npm ci --ignore-scripts
npm run dev
```

Open the local URL printed by the development server.

## Quality checks

```bash
npm run lint
npm run content:validate
npm run test
```

`content:validate` checks the 45-question inventory, unique IDs, English-only exam fields, answer integrity, pinned source metadata, and Git exclusion of source files. `test` builds the deployable worker and tests the rendered application shell.

## Deployment

- Sites: `npm run build` produces the Cloudflare Worker-compatible `dist` output used by the included hosting configuration.
- Vercel: `vercel.json` uses the standard Next.js build path.
- GitHub Actions: `.github/workflows/ci.yml` runs lint, content validation, tests, and build on pull requests and `main`.

## Data and synchronization

The server API stores study progress and active-exam state as `progress.json` in the private `masakasakasama/CPRE-data` repository. Each save creates Git history. The GitHub token is server-side only and must be restricted to Contents read/write access for that single repository.

Browser keys `cpre-english-study:v1` and `cpre-english-study:exam:v1` remain as an offline cache. On launch the app loads the private GitHub record; changes are debounced and committed back through `/api/progress`. Snapshot links remain available for manual backup.

Required server environment variables are documented in `.env.example`. Owner-only Sites deployments may set `OAI_SITE_AUTH=true`; other deployments must provide a server-side `CPRE_SYNC_KEY` and send it from the session-only sync field. Never expose `GITHUB_PROGRESS_TOKEN` to client code.

## Limitations

- This is not an official IREB product and is not endorsed by IREB e.V.
- The app does not guarantee an official examination result.
- The first release contains one 45-question bank; a larger bank and independent language review are planned.
- Source-status refresh verifies reachability while the scheduled workflow verifies pinned file hashes.
- GitHub Pages cannot host the synchronization API; use Sites or Vercel for the synchronized app.

Continue development from [`handoff.md`](handoff.md).
