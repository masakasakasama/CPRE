export const APP_VERSION = "0.13.0";

// Persisted key values are intentionally versioned independently from the app release.
// Changing these values would orphan existing browser progress, so keep them stable
// unless an explicit migration is implemented.
export const STORAGE_KEY = "cpre-english-study:v1";
export const EXAM_KEY = "cpre-english-study:exam:v1";
export const INTRO_KEY = "cpre-english-study:intro:v1";
export const LOCAL_SAVED_AT_KEY = "cpre-english-study:saved-at:v1";
export const SYNC_KEY_STORAGE = "cpre-english-study:sync-key";
export const GITHUB_TOKEN_STORAGE = "cpre-english-study:github-token";
