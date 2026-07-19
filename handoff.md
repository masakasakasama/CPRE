# Handoff

## Current state

- English-only application UI and exam fields
- Japanese explanations shown only after answering or in review
- Seven syllabus units, 45 independently written questions, 75-minute mock exam
- Wrong-answer review, private GitHub progress sync, active-exam recovery, offline cache, snapshot backup
- Official-source manifest, SHA verification, local-only PDF extraction pipeline
- Responsive dark UI, CI, Sites/Vercel build paths

## Constraints

- This is an unofficial study tool and does not reproduce official practice questions.
- `data/raw` and `data/extracted` must never be committed.
- `masakasakasama/CPRE-data` is the private source of truth for progress. Browser storage is cache only.
- `GITHUB_PROGRESS_TOKEN` must stay server-side and be restricted to the private data repository.
- New content must use only enabled entries in `sources/manifest.json` and must pass `npm run content:validate`.

## Next work

- Expand the question bank beyond the first 45 while preserving objective coverage.
- Add independent English-language and copyright similarity review.
- Add conflict-aware merging if the app is used concurrently on several devices.
