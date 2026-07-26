export type Confidence = "low" | "medium" | "high";
export type AttemptRecord = {
  selected: number[];
  correct: boolean;
  at: string;
  confidence?: Confidence;
  intervalDays?: number;
  dueAt?: string;
};
export type AnswerRecord = { selected: number[]; correct: boolean; lastAt: string; attempts: AttemptRecord[] };
export type MockResult = { at: string; percent: number; correct: number; points: number; total: number };
export type LastLearningActivity = {
  type: "study" | "practice";
  at: string;
  unit?: number | "all";
  questionId?: string;
};

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
  lastActivity?: LastLearningActivity;
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

export type AnswerStats = {
  attempts: number;
  correctCount: number;
  incorrectCount: number;
  consecutiveCorrect: number;
  lastCorrectAt: string | null;
  nextReviewAt: string | null;
  due: boolean;
};

export type ReviewSchedule = {
  intervalDays: number;
  dueAt: string;
  factor: number;
  isFirstCorrect: boolean;
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
    const attempts: AttemptRecord[] = [];
    if (raw.attempts !== undefined) {
      if (!Array.isArray(raw.attempts)) return null;
      for (const attempt of raw.attempts) {
        if (!isRecord(attempt) || !numberArray(attempt.selected) || typeof attempt.correct !== "boolean" || typeof attempt.at !== "string") return null;
        const confidence = attempt.confidence;
        if (confidence !== undefined && confidence !== "low" && confidence !== "medium" && confidence !== "high") return null;
        if (attempt.intervalDays !== undefined && !Number.isFinite(attempt.intervalDays)) return null;
        if (attempt.dueAt !== undefined && typeof attempt.dueAt !== "string") return null;
        attempts.push({
          selected: attempt.selected,
          correct: attempt.correct,
          at: attempt.at,
          ...(confidence ? { confidence } : {}),
          ...(Number.isFinite(attempt.intervalDays) ? { intervalDays: Number(attempt.intervalDays) } : {}),
          ...(typeof attempt.dueAt === "string" ? { dueAt: attempt.dueAt } : {}),
        });
      }
    }
    answered[id] = {
      selected: raw.selected,
      correct: raw.correct,
      lastAt: raw.lastAt,
      attempts: attempts.length ? attempts.slice(-50) : [{ selected: raw.selected, correct: raw.correct, at: raw.lastAt }],
    };
  }

  const mockHistory: MockResult[] = [];
  for (const raw of value.mockHistory) {
    if (!isRecord(raw) || typeof raw.at !== "string" || !Number.isFinite(raw.percent) || !Number.isFinite(raw.correct) || !Number.isFinite(raw.points) || !Number.isFinite(raw.total)) return null;
    mockHistory.push({ at: raw.at, percent: Number(raw.percent), correct: Number(raw.correct), points: Number(raw.points), total: Number(raw.total) });
  }

  let lastActivity: LastLearningActivity | undefined;
  if (value.lastActivity !== undefined) {
    if (!isRecord(value.lastActivity) || (value.lastActivity.type !== "study" && value.lastActivity.type !== "practice") || typeof value.lastActivity.at !== "string") return null;
    const unit = value.lastActivity.unit;
    if (unit !== undefined && unit !== "all" && (!Number.isInteger(unit) || Number(unit) < 1 || Number(unit) > 7)) return null;
    if (value.lastActivity.questionId !== undefined && typeof value.lastActivity.questionId !== "string") return null;
    lastActivity = {
      type: value.lastActivity.type,
      at: value.lastActivity.at,
      ...(unit === "all" || Number.isInteger(unit) ? { unit: unit as number | "all" } : {}),
      ...(typeof value.lastActivity.questionId === "string" ? { questionId: value.lastActivity.questionId } : {}),
    };
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
    ...(lastActivity ? { lastActivity } : {}),
  };
}

export function getLastLearningActivity(progress: Progress): LastLearningActivity | null {
  if (progress.lastActivity) return progress.lastActivity;
  const latestAnswer = Object.entries(progress.answered)
    .filter(([, answer]) => Number.isFinite(new Date(answer.lastAt).getTime()))
    .sort(([, left], [, right]) => new Date(right.lastAt).getTime() - new Date(left.lastAt).getTime())[0];
  if (!latestAnswer) return null;
  return {
    type: "practice",
    at: latestAnswer[1].lastAt,
    unit: "all",
    questionId: latestAnswer[0],
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
  const mastered = answered.filter((answer) => getAnswerStats(answer).consecutiveCorrect >= 2).length;
  const questionDenominator = Math.max(1, totalQuestions);
  const coverage = clamp(answered.length / questionDenominator * 100);
  const accuracy = clamp(correct / questionDenominator * 100);
  const study = clamp(progress.completedUnits.length / Math.max(1, totalUnits) * 100);
  const review = clamp(mastered / questionDenominator * 100);
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

const firstCorrectIntervals: Record<Confidence, number> = { low: 1, medium: 2, high: 5 };
const correctFactors: Record<Confidence, number> = { low: 1.2, medium: 2.5, high: 3.25 };
const incorrectFactors: Record<Confidence, number> = { low: 0.25, medium: 0.15, high: 0.05 };

export function calculateNextReview(record: AnswerRecord | undefined, correct: boolean, confidence: Confidence, at = new Date()): ReviewSchedule {
  const attempts = record?.attempts ?? [];
  const previousInterval = attempts.at(-1)?.intervalDays ?? 0;
  const hasCorrectAttempt = attempts.some((attempt) => attempt.correct);
  const isFirstCorrect = correct && !hasCorrectAttempt;
  const factor = correct ? correctFactors[confidence] : incorrectFactors[confidence];
  const intervalDays = isFirstCorrect
    ? firstCorrectIntervals[confidence]
    : correct
      ? Math.max(previousInterval + 1, Math.round(Math.max(1, previousInterval) * factor))
      : Math.max(1, Math.round(Math.max(1, previousInterval) * factor));
  const due = new Date(at);
  due.setTime(due.getTime() + intervalDays * 86_400_000);
  return { intervalDays, dueAt: due.toISOString(), factor, isFirstCorrect };
}

export function upsertAnswerAttempt(
  record: AnswerRecord | undefined,
  selected: number[],
  correct: boolean,
  confidence: Confidence,
  at: string,
  replaceAttemptAt: string | null = null,
): AnswerRecord {
  const previousAttempts = (record?.attempts ?? []).filter((attempt) => attempt.at !== replaceAttemptAt);
  const scheduleBase = record ? { ...record, attempts: previousAttempts } : undefined;
  const schedule = calculateNextReview(scheduleBase, correct, confidence, new Date(at));
  return {
    selected,
    correct,
    lastAt: at,
    attempts: [...previousAttempts, {
      selected,
      correct,
      at,
      confidence,
      intervalDays: schedule.intervalDays,
      dueAt: schedule.dueAt,
    }].slice(-50),
  };
}

export function getAnswerStats(record?: AnswerRecord, now = new Date()): AnswerStats {
  if (!record) {
    return { attempts: 0, correctCount: 0, incorrectCount: 0, consecutiveCorrect: 0, lastCorrectAt: null, nextReviewAt: null, due: true };
  }
  const attempts: AttemptRecord[] = record.attempts?.length
    ? record.attempts
    : [{ selected: record.selected, correct: record.correct, at: record.lastAt }];
  const correctAttempts = attempts.filter((attempt) => attempt.correct);
  let consecutiveCorrect = 0;
  for (let index = attempts.length - 1; index >= 0 && attempts[index].correct; index -= 1) consecutiveCorrect += 1;
  const lastCorrectAt = correctAttempts.at(-1)?.at ?? null;
  const latestDueAt = attempts.at(-1)?.dueAt;
  if (latestDueAt) {
    return {
      attempts: attempts.length,
      correctCount: correctAttempts.length,
      incorrectCount: attempts.length - correctAttempts.length,
      consecutiveCorrect,
      lastCorrectAt,
      nextReviewAt: latestDueAt,
      due: new Date(latestDueAt).getTime() <= now.getTime(),
    };
  }
  if (!record.correct || !lastCorrectAt) {
    return {
      attempts: attempts.length,
      correctCount: correctAttempts.length,
      incorrectCount: attempts.length - correctAttempts.length,
      consecutiveCorrect,
      lastCorrectAt,
      nextReviewAt: null,
      due: true,
    };
  }
  const nextReview = new Date(lastCorrectAt);
  nextReview.setTime(nextReview.getTime() + 86_400_000);
  return {
    attempts: attempts.length,
    correctCount: correctAttempts.length,
    incorrectCount: attempts.length - correctAttempts.length,
    consecutiveCorrect,
    lastCorrectAt,
    nextReviewAt: nextReview.toISOString(),
    due: nextReview.getTime() <= now.getTime(),
  };
}

export function selectNextQuestionId(ids: string[], currentId: string | null, progress: Progress, now = new Date()): string | null {
  const candidates = ids
    .filter((id) => id !== currentId || ids.length === 1)
    .map((id, order) => {
      const record = progress.answered[id];
      const stats = getAnswerStats(record, now);
      const latestConfidence = record?.attempts?.at(-1)?.confidence;
      const misconceptionWeight = latestConfidence === "high" ? 0 : latestConfidence === "medium" ? 1 : 2;
      const priority = !record ? 10 : !stats.due ? 30 : !record.correct ? misconceptionWeight : 20;
      return { id, order, record, priority };
    })
    .filter((candidate) => candidate.priority < 30)
    .sort((a, b) => a.priority - b.priority
      || (a.record?.lastAt ?? "").localeCompare(b.record?.lastAt ?? "")
      || a.order - b.order);
  return candidates[0]?.id ?? null;
}
