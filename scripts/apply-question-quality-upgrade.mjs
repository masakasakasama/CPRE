import { readFileSync, writeFileSync } from "node:fs";

const path = "app/data.ts";
let source = readFileSync(path, "utf8");

if (source.includes("function applyCalibratedContent(")) {
  console.log("Calibrated content already wired");
  process.exit(0);
}

const importNeedle = 'import { additionalQuestions } from "./additional-questions.ts";';
if (!source.includes(importNeedle)) {
  throw new Error("Expected additionalQuestions import was not found");
}
source = source.replace(
  importNeedle,
  `${importNeedle}\nimport { calibratedCoreQuestions } from "./calibrated-core-questions.ts";\nimport { calibratedQuestions } from "./calibrated-questions.ts";`,
);

const exportNeedle = "export const questions: Question[] = [...coreQuestions, ...additionalQuestions];";
if (!source.includes(exportNeedle)) {
  throw new Error("Expected questions export was not found");
}

const replacement = `function applyCalibratedContent(legacy: Question[], calibrated: Question[]): Question[] {
  const calibratedById = new Map(calibrated.map((question) => [question.id, question]));
  return legacy.map((question) => {
    const upgraded = calibratedById.get(question.id);
    if (!upgraded) return question;
    const gradingChanged =
      upgraded.kind !== question.kind ||
      upgraded.points !== question.points ||
      upgraded.correct.length !== question.correct.length ||
      upgraded.correct.some((value, index) => value !== question.correct[index]);
    if (gradingChanged) {
      throw new Error(\`Calibrated question \${question.id} changed grading metadata\`);
    }
    if (upgraded.options.length !== question.options.length) {
      throw new Error(\`Calibrated question \${question.id} changed option count\`);
    }
    return {
      ...question,
      prompt: upgraded.prompt,
      options: upgraded.options,
      keyword: upgraded.keyword,
      explanationJa: upgraded.explanationJa,
      source: upgraded.source,
    };
  });
}

const upgradedCoreQuestions = applyCalibratedContent(coreQuestions, calibratedCoreQuestions);
const upgradedAdditionalQuestions = applyCalibratedContent(additionalQuestions, calibratedQuestions);

export const questions: Question[] = [...upgradedCoreQuestions, ...upgradedAdditionalQuestions];`;
source = source.replace(exportNeedle, replacement);
writeFileSync(path, source);
console.log("Wired calibrated content while preserving question IDs and grading metadata");
