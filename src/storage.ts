import { writeFile } from "node:fs/promises";
import { mkdir } from "node:fs/promises";
import { Job } from "./types.js";

export async function saveJobs(
  jobs: Job[],
  filePath: string
): Promise<void> {
  await mkdir("data", { recursive: true });

  await writeFile(
    filePath,
    JSON.stringify(jobs, null, 2),
    "utf8"
  );
}