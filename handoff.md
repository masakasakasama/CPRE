# Handoff

## Current state

- English-only application UI and exam fields
- Japanese explanations shown only after answering or in review
- Seven syllabus units, 185 independently written questions, 75-minute mock exam
- Wrong-answer review, private GitHub progress sync, active-exam recovery, offline cache, snapshot backup
- Sync writes preserve existing answer-attempt history and merge mock history before updating the private data repository
- Official-source manifest, SHA verification, local-only PDF extraction pipeline
- Responsive dark UI, CI, Sites/Vercel build paths
- Web shell exposes the current app release as v0.13.0 from `app/app-config.ts`

## Constraints

- This is an unofficial study tool and does not reproduce official practice questions.
- `data/raw` and `data/extracted` must never be committed.
- `masakasakasama/CPRE-data` is the private source of truth for progress. Browser storage is cache only.
- Existing browser storage keys and progress schema must not change without an explicit migration.
- `GITHUB_PROGRESS_TOKEN` must stay server-side and be restricted to the private data repository.
- New content must use only enabled entries in `sources/manifest.json` and must pass `npm run content:validate`.

## Next work

- Continue calibrating distractor quality and mock difficulty while preserving question IDs and grading semantics.
- Add independent English-language and copyright similarity review.
- Improve true multi-device conflict handling beyond answer-attempt and mock-history preservation.
