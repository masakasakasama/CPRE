import type { Question } from "./data.ts";

export type Level = "L1" | "L2" | "L3";
export type Variant = readonly [prompt: string, correct: string, distractors: readonly [string, string, string]];
export type Concept = {
  unit: number;
  eo: string;
  section: string;
  level: Level;
  keyword: string;
  explanationJa: string;
  variants: readonly [Variant, Variant];
};

function rotateOptions(id: string, correct: string, distractors: readonly string[]) {
  const options = [correct, ...distractors];
  const shift = Array.from(id).reduce((sum, character) => sum + character.charCodeAt(0), 0) % options.length;
  const rotated = [...options.slice(shift), ...options.slice(0, shift)];
  return { options: rotated, correct: [rotated.indexOf(correct)] };
}

export function makeQuestions(concepts: readonly Concept[]): Question[] {
  return concepts.flatMap((concept) =>
    concept.variants.map((variant, index) => {
      const suffix = index === 0 ? "A" : "B";
      const id = `P${concept.eo.replace(/\D/g, "")}${suffix}`;
      const [prompt, correctAnswer, distractors] = variant;
      const answer = rotateOptions(id, correctAnswer, distractors);
      return {
        id,
        unit: concept.unit,
        eo: concept.eo,
        kind: "single",
        points: concept.level === "L1" ? 1 : concept.level === "L2" ? 2 : 3,
        prompt,
        options: answer.options,
        correct: answer.correct,
        keyword: concept.keyword,
        explanationJa: concept.explanationJa,
        source: `Syllabus 3.3.0 · ${concept.section}`,
      };
    }),
  );
}
