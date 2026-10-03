import { readFile, writeFile, mkdir } from "node:fs/promises";
import { Job } from "./types.js";

async function main() {
  const file = await readFile(
    "data/jobs_with_seniority.json",
    "utf8"
  );

  const jobs: Job[] = JSON.parse(file);

  const selectedJobs = jobs.slice(0, 30);

  await mkdir("validation", { recursive: true });

  const rows = [
    "title,ai_prediction,human_label,correct"
  ];

  for (const job of selectedJobs) {
    const escapedTitle = job.title.replace(/"/g, '""');

    rows.push(
      `"${escapedTitle}","${job.seniority || "Unknown"}","",""`
    );
  }

  await writeFile(
    "validation/manual_validation.csv",
    rows.join("\n"),
    "utf8"
  );

  console.log(
    `Created validation file with ${selectedJobs.length} jobs.`
  );
}

main().catch((error) => {
  console.error("Validation file creation failed:", error);
});