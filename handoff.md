# Handoff

## Current state

- English-only application UI and exam fields
- Japanese explanations shown only after answering or in review
- Seven syllabus units, 45 independently written questions, 75-minute mock exam
- Wrong-answer review, local progress, active-exam recovery, snapshot sharing
- Official-source manifest, SHA verification, local-only PDF extraction pipeline
- Responsive dark UI, CI, Sites/Vercel build paths

## Constraints

- This is an unofficial study tool and does not reproduce official practice questions.
- `data/raw` and `data/extracted` must never be committed.
- Browser progress is local. Shared links transfer a snapshot and are not live synchronization.
- New content must use only enabled entries in `sources/manifest.json` and must pass `npm run content:validate`.

## Next work

- Expand the question bank beyond the first 45 while preserving objective coverage.
- Add independent English-language and copyright similarity review.
- Add optional server-backed sync only if the static-hosting constraint is changed.
