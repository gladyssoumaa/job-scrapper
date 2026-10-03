import { checkRobotsTxt } from "./robots.js";
import { scrapeWithDelay } from "./scrapper.js";
import { saveJobs } from "./storage.js";
import "dotenv/config";

const TARGET_URLS = [
  "https://weworkremotely.com/remote-jobs",
  "https://weworkremotely.com/remote-software-developer-jobs",
  "https://weworkremotely.com/remote-full-stack-programming-jobs",
  "https://weworkremotely.com/categories/remote-product-jobs/"

];

async function main() {
  const allJobs = [];

  for (const url of TARGET_URLS) {
    const allowed = await checkRobotsTxt(url);

    if (!allowed) {
      console.error(`Scraping not allowed for: ${url}`);
      continue;
    }

    const jobs = await scrapeWithDelay(url);

    console.log(`Jobs found on page: ${jobs.length}`);

    allJobs.push(...jobs);
  }

  const uniqueJobs = Array.from(
    new Map(allJobs.map((job) => [job.url, job])).values()
  );

  console.log(`\nUnique jobs collected: ${uniqueJobs.length}`);

  await saveJobs(uniqueJobs, "data/jobs.json");
  console.log("Jobs saved to data/jobs.json");


  if (uniqueJobs.length > 0) {
    console.log("\nFirst job:");
    console.log(JSON.stringify(uniqueJobs[0], null, 2));
  }
}

main().catch((error) => {
  console.error("Application failed:", error);
});