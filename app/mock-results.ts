import type { Question } from "./data.ts";
import { upsertAnswerAttempt, type ActiveExam, type MockResult, type Progress } from "./progress.ts";

export type MockSubmission = {
  result: MockResult;
  answered: Progress["answered"];
  wrong: string[];
};

function sameAnswer(left: number[], right: number[]) {
  if (left.length !== right.length) return false;
  const sortedLeft = [...left].sort((a, b) => a - b);
  const sortedRight = [...right].sort((a, b) => a - b);
  return sortedLeft.every((value, index) => value === sortedRight[index]);
}

function scoreQuestion(question: Question, selected: number[]) {
  if (selected.length > question.correct.length) return 0;
  if (question.kind !== "multiple") return sameAnswer(selected, question.correct) ? question.points : 0;
  const hits = selected.filter((option) => question.correct.includes(option)).length;
  return (hits / question.correct.length) * question.points;
}

export function scoreMockSubmission(
  target: ActiveExam,
  bank: readonly Question[],
  existingAnswers: Progress["answered"],
  submittedAt = new Date().toISOString(),
): MockSubmission {
  let points = 0;
  let correct = 0;
  let total = 0;
  const wrong: string[] = [];
  const answered = { ...existingAnswers };

  for (const id of target.order) {
    const question = bank.find((candidate) => candidate.id === id);
    if (!question) continue;
    const selected = target.answers[question.id] ?? [];
    const exact = sameAnswer(selected, question.correct);
    points += scoreQuestion(question, selected);
    total += question.points;
    if (exact) correct += 1;
    else wrong.push(question.id);

    answered[question.id] = upsertAnswerAttempt(
      answered[question.id],
      selected,
      exact,
      undefined,
      submittedAt,
    );
  }

  const result: MockResult = {
    at: submittedAt,
    percent: total > 0 ? Math.round((points / total) * 100) : 0,
    correct,
    points: Math.round(points * 10) / 10,
    total,
  };

  return { result, answered, wrong };
}
