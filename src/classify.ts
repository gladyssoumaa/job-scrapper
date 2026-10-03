import "dotenv/config";
import { readFile } from "node:fs/promises";
import { saveJobs } from "./storage.js";
import { classifySeniority } from "./ai.js";
import { Job } from "./types.js";
import { delay } from "./utilis.js";

async function main() {
  const file = await readFile("data/jobs.json", "utf8");
  const jobs: Job[] = JSON.parse(file);

  console.log(`Loaded ${jobs.length} jobs.`);

  const classifiedJobs: Job[] = [];

  for (let i = 0; i < jobs.length; i++) {
    const job = jobs[i];

    console.log(
      `Classifying ${i + 1}/${jobs.length}: ${job.title}`
    );

    const seniority = await classifySeniority(job.title);

    classifiedJobs.push({
      ...job,
      seniority
    });

    await delay(1000);
  }

  await saveJobs(
    classifiedJobs,
    "data/jobs_with_seniority.json"
  );

  console.log(
    `\nSaved ${classifiedJobs.length} classified jobs to data/jobs_with_seniority.json`
  );
}

main().catch((error) => {
  console.error("Classification failed:", error);
});