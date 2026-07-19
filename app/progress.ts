export type AnswerRecord = { selected: number[]; correct: boolean; lastAt: string };
export type MockResult = { at: string; percent: number; correct: number; points: number; total: number };

export type Progress = {
  schema: 1;
  answered: Record<string, AnswerRecord>;
  review: string[];
  completedUnits: number[];
  bookmarks: string[];
  mockHistory: MockResult[];
  lastSourceCheck?: string;
};

export type ActiveExam = {
  order: string[];
  answers: Record<string, number[]>;
  index: number;
  endsAt: number;
};

export type SyncDocument = {
  schema: 1;
  savedAt: string;
  progress: Progress;
  activeExam: ActiveExam | null;
};

export const initialProgress: Progress = {
  schema: 1,
  answered: {},
  review: [],
  completedUnits: [],
  bookmarks: [],
  mockHistory: [],
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function stringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}

function numberArray(value: unknown): value is number[] {
  return Array.isArray(value) && value.every((item) => Number.isFinite(item));
}

export function parseProgress(value: unknown): Progress | null {
  if (!isRecord(value) || value.schema !== 1 || !isRecord(value.answered)) return null;
  if (!stringArray(value.review) || !numberArray(value.completedUnits) || !stringArray(value.bookmarks) || !Array.isArray(value.mockHistory)) return null;

  const answered: Record<string, AnswerRecord> = {};
  for (const [id, raw] of Object.entries(value.answered)) {
    if (!isRecord(raw) || !numberArray(raw.selected) || typeof raw.correct !== "boolean" || typeof raw.lastAt !== "string") return null;
    answered[id] = { selected: raw.selected, correct: raw.correct, lastAt: raw.lastAt };
  }

  const mockHistory: MockResult[] = [];
  for (const raw of value.mockHistory) {
    if (!isRecord(raw) || typeof raw.at !== "string" || !Number.isFinite(raw.percent) || !Number.isFinite(raw.correct) || !Number.isFinite(raw.points) || !Number.isFinite(raw.total)) return null;
    mockHistory.push({ at: raw.at, percent: Number(raw.percent), correct: Number(raw.correct), points: Number(raw.points), total: Number(raw.total) });
  }

  return {
    schema: 1,
    answered,
    review: value.review,
    completedUnits: value.completedUnits,
    bookmarks: value.bookmarks,
    mockHistory,
    ...(typeof value.lastSourceCheck === "string" ? { lastSourceCheck: value.lastSourceCheck } : {}),
  };
}

export function parseActiveExam(value: unknown): ActiveExam | null {
  if (value === null) return null;
  if (!isRecord(value) || !stringArray(value.order) || !isRecord(value.answers) || !Number.isInteger(value.index) || !Number.isFinite(value.endsAt)) return null;
  const answers: Record<string, number[]> = {};
  for (const [id, selected] of Object.entries(value.answers)) {
    if (!numberArray(selected)) return null;
    answers[id] = selected;
  }
  return { order: value.order, answers, index: Number(value.index), endsAt: Number(value.endsAt) };
}

export function parseSyncDocument(value: unknown): SyncDocument | null {
  if (!isRecord(value) || value.schema !== 1 || typeof value.savedAt !== "string") return null;
  const progress = parseProgress(value.progress);
  const activeExam = parseActiveExam(value.activeExam);
  if (!progress || (value.activeExam !== null && !activeExam)) return null;
  return { schema: 1, savedAt: value.savedAt, progress, activeExam };
}

export function makeSyncDocument(progress: Progress, activeExam: ActiveExam | null): SyncDocument {
  return { schema: 1, savedAt: new Date().toISOString(), progress, activeExam };
}
