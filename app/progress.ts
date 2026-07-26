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
  targetExamDate?: string;
  planStartedAt?: string;
};

export type ReadinessBreakdown = {
  total: number;
  coverage: number;
  accuracy: number;
  study: number;
  review: number;
  mock: number;
};

export type ScheduleProgress = {
  daysLeft: number;
  expectedByToday: number;
  difference: number;
  questionsPerDay: number;
  status: "ahead" | "on-track" | "behind" | "due";
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
    ...(typeof value.targetExamDate === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value.targetExamDate) ? { targetExamDate: value.targetExamDate } : {}),
    ...(typeof value.planStartedAt === "string" ? { planStartedAt: value.planStartedAt } : {}),
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

function clamp(value: number, min = 0, max = 100) {
  return Math.min(max, Math.max(min, value));
}

export function calculateReadiness(progress: Progress, totalQuestions = 45, totalUnits = 7): ReadinessBreakdown {
  const answered = Object.values(progress.answered);
  const correct = answered.filter((answer) => answer.correct).length;
  const coverage = clamp(answered.length / totalQuestions * 100);
  const accuracy = answered.length ? correct / answered.length * 100 : 0;
  const study = clamp(progress.completedUnits.length / totalUnits * 100);
  const review = answered.length ? clamp((answered.length - progress.review.length) / answered.length * 100) : 0;
  const mock = clamp(progress.mockHistory[0]?.percent ?? 0);
  const total = Math.round(coverage * 0.25 + accuracy * 0.30 + study * 0.15 + review * 0.10 + mock * 0.20);
  return {
    total,
    coverage: Math.round(coverage),
    accuracy: Math.round(accuracy),
    study: Math.round(study),
    review: Math.round(review),
    mock: Math.round(mock),
  };
}

function dayNumber(value: string | Date) {
  const date = typeof value === "string" ? new Date(value) : value;
  return Math.floor(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / 86_400_000);
}

export function calculateSchedule(progress: Progress, readiness: number, now = new Date(), totalQuestions = 45): ScheduleProgress | null {
  if (!progress.targetExamDate) return null;
  const today = dayNumber(now);
  const target = dayNumber(`${progress.targetExamDate}T00:00:00`);
  const start = dayNumber(progress.planStartedAt || now);
  const daysLeft = Math.max(0, target - today);
  const totalDays = Math.max(1, target - start);
  const expectedByToday = clamp((today - start) / totalDays * 100);
  const difference = Math.round(readiness - expectedByToday);
  const remainingQuestions = Math.max(0, totalQuestions - Object.keys(progress.answered).length);
  const questionsPerDay = remainingQuestions ? Math.ceil(remainingQuestions / Math.max(1, daysLeft)) : 0;
  const status = daysLeft === 0
    ? "due"
    : difference >= 5
      ? "ahead"
      : difference <= -5
        ? "behind"
        : "on-track";
  return { daysLeft, expectedByToday: Math.round(expectedByToday), difference, questionsPerDay, status };
}
