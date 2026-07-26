import type { Question } from "./data.ts";

export const MOCK_EXAM_SIZE = 45;
export const MOCK_BLUEPRINT: Readonly<Record<number, number>> = {
  1: 3,
  2: 4,
  3: 18,
  4: 11,
  5: 3,
  6: 5,
  7: 1,
};

function shuffled<T>(items: readonly T[], random: () => number) {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapWith = Math.floor(random() * (index + 1));
    [copy[index], copy[swapWith]] = [copy[swapWith], copy[index]];
  }
  return copy;
}

export function selectMockExamQuestions(bank: readonly Question[], random: () => number = Math.random): Question[] {
  const selected = Object.entries(MOCK_BLUEPRINT).flatMap(([unit, count]) =>
    shuffled(bank.filter((question) => question.unit === Number(unit)), random).slice(0, count),
  );
  if (selected.length !== MOCK_EXAM_SIZE) {
    throw new Error(`Mock blueprint requires ${MOCK_EXAM_SIZE} questions, selected ${selected.length}`);
  }
  return shuffled(selected, random);
}
