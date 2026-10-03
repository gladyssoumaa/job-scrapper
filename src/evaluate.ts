import { readFile } from "node:fs/promises";
import { parse } from "csv-parse/sync";

function normalizeLabel(label: string): string {
  return label
    .trim()
    .toLowerCase()
    .replace(/[\s_-]+/g, "");
}

async function main() {
  const file = await readFile(
    "validation/manual_validation.csv",
    "utf8"
  );

  const records = parse(file, {
    columns: true,
    skip_empty_lines: true,
    trim: true
  }) as {
    Title: string;
    Prediction: string;
    Human_label: string;
    "Correct/Incorrect": string;
  }[];

  let correct = 0;

  for (const record of records) {
    const aiPrediction = normalizeLabel(record.Prediction);
    const humanLabel = normalizeLabel(record.Human_label);

    const isCorrect = aiPrediction === humanLabel;

    if (isCorrect) {
      correct++;
    }

    console.log(
      `${isCorrect ? "✓" : "✗"} ${record.Title} | AI: ${record.Prediction} | Human: ${record.Human_label}`
    );
  }

  const total = records.length;
  const incorrect = total - correct;
  const accuracy = total === 0
    ? 0
    : (correct / total) * 100;

  console.log("\n--- Validation Results ---");
  console.log(`Total evaluated: ${total}`);
  console.log(`Correct predictions: ${correct}`);
  console.log(`Incorrect predictions: ${incorrect}`);
  console.log(`Accuracy: ${accuracy.toFixed(2)}%`);
}

main().catch((error) => {
  console.error("Evaluation failed:", error);
});