import type { AnswerRecord, AttemptRecord, LastLearningActivity, Progress, SyncDocument } from "./progress.ts";

function byTime(left: { at: string }, right: { at: string }) {
  return new Date(left.at).getTime() - new Date(right.at).getTime();
}

function attemptsOf(record?: AnswerRecord): AttemptRecord[] {
  if (!record) return [];
  if (record.attempts?.length) return record.attempts;
  return [{ selected: record.selected, correct: record.correct, at: record.lastAt }];
}

function mergeAttempts(remote?: AnswerRecord, incoming?: AnswerRecord) {
  const merged = new Map<string, AttemptRecord>();
  for (const attempt of [...attemptsOf(remote), ...attemptsOf(incoming)]) {
    merged.set(attempt.at, attempt);
  }
  return [...merged.values()].sort(byTime).slice(-50);
}

function newerAnswer(remote?: AnswerRecord, incoming?: AnswerRecord) {
  if (!remote) return incoming;
  if (!incoming) return remote;
  return new Date(incoming.lastAt).getTime() >= new Date(remote.lastAt).getTime() ? incoming : remote;
}

function mergeAnswer(remote?: AnswerRecord, incoming?: AnswerRecord): AnswerRecord | undefined {
  const latest = newerAnswer(remote, incoming);
  if (!latest) return undefined;
  return { ...latest, attempts: mergeAttempts(remote, incoming) };
}

function mergeAnswers(remote: Progress["answered"], incoming: Progress["answered"]) {
  const ids = new Set([...Object.keys(remote), ...Object.keys(incoming)]);
  const answered: Progress["answered"] = {};
  for (const id of ids) {
    const merged = mergeAnswer(remote[id], incoming[id]);
    if (merged) answered[id] = merged;
  }
  return answered;
}

function mergeMockHistory(remote: Progress["mockHistory"], incoming: Progress["mockHistory"]) {
  const merged = new Map<string, Progress["mockHistory"][number]>();
  for (const result of [...remote, ...incoming]) merged.set(result.at, result);
  return [...merged.values()]
    .sort((left, right) => new Date(right.at).getTime() - new Date(left.at).getTime())
    .slice(0, 20);
}

function unique<T>(values: T[]) {
  return [...new Set(values)];
}

function newerActivity(remote?: LastLearningActivity, incoming?: LastLearningActivity) {
  if (!remote) return incoming;
  if (!incoming) return remote;
  return new Date(incoming.at).getTime() >= new Date(remote.at).getTime() ? incoming : remote;
}

function newerTimestamp(remote?: string, incoming?: string) {
  if (!remote) return incoming;
  if (!incoming) return remote;
  return new Date(incoming).getTime() >= new Date(remote).getTime() ? incoming : remote;
}

function newerDocument(remote: SyncDocument, incoming: SyncDocument) {
  return new Date(incoming.savedAt).getTime() >= new Date(remote.savedAt).getTime() ? incoming : remote;
}

function activeExam(remote: SyncDocument["activeExam"], incoming: SyncDocument["activeExam"]) {
  if (!remote) return incoming;
  if (!incoming) return remote;
  return incoming.endsAt >= remote.endsAt ? incoming : remote;
}

export function mergeSyncDocument(remote: SyncDocument | null, incoming: SyncDocument): SyncDocument {
  if (!remote) return incoming;

  const latest = newerDocument(remote, incoming);
  const older = latest === incoming ? remote : incoming;
  const lastActivity = newerActivity(remote.progress.lastActivity, incoming.progress.lastActivity);
  const lastSourceCheck = newerTimestamp(remote.progress.lastSourceCheck, incoming.progress.lastSourceCheck);

  return {
    ...latest,
    progress: {
      ...latest.progress,
      answered: mergeAnswers(remote.progress.answered, incoming.progress.answered),
      mockHistory: mergeMockHistory(remote.progress.mockHistory, incoming.progress.mockHistory),
      completedUnits: unique([...remote.progress.completedUnits, ...incoming.progress.completedUnits]).sort((a, b) => a - b),
      bookmarks: unique([...remote.progress.bookmarks, ...incoming.progress.bookmarks]),
      review: unique([...remote.progress.review, ...incoming.progress.review]),
      ...(latest.progress.targetExamDate || older.progress.targetExamDate
        ? { targetExamDate: latest.progress.targetExamDate || older.progress.targetExamDate }
        : {}),
      ...(latest.progress.planStartedAt || older.progress.planStartedAt
        ? { planStartedAt: latest.progress.planStartedAt || older.progress.planStartedAt }
        : {}),
      ...(lastActivity ? { lastActivity } : {}),
      ...(lastSourceCheck ? { lastSourceCheck } : {}),
    },
    activeExam: activeExam(remote.activeExam, incoming.activeExam),
  };
}
