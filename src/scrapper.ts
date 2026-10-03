import axios from "axios";
import * as cheerio from "cheerio";
import { Job } from "./types.js";
import { delay } from "./utilis.js";

const BASE_URL = "https://weworkremotely.com";
const USER_AGENT = "StudentJobScraper/1.0";

export async function scrapeJobPage(url: string): Promise<Job[]> {
  console.log(`Fetching: ${url}`);

  const response = await axios.get(url, {
    headers: {
      "User-Agent": USER_AGENT
    },
    timeout: 15000
  });

  const $ = cheerio.load(response.data);
  const jobs: Job[] = [];

  $("li.new-listing-container").each((_, element) => {
    const listing = $(element);

    const link = listing.find("a.listing-link--unlocked").first();
    const href = link.attr("href");

    if (!href) {
      return;
    }

    const title = listing
      .find(".new-listing__header__title__text")
      .first()
      .text()
      .trim();

    const company = listing
      .find(".new-listing__company-name")
      .first()
      .clone()
      .children()
      .remove()
      .end()
      .text()
      .trim();

    const location = listing
      .find(".new-listing__company-headquarters")
      .first()
      .clone()
      .children()
      .remove()
      .end()
      .text()
      .trim();

    const date = listing
      .find(".new-listing__header__icons__date")
      .first()
      .text()
      .trim();

    const tags: string[] = [];

    listing
      .find(".new-listing__categories__category")
      .each((_, category) => {
        const value = $(category).text().replace(/\s+/g, " ").trim();

        if (value && !tags.includes(value)) {
          tags.push(value);
        }
      });

    const fullUrl = href.startsWith("http")
      ? href
      : `${BASE_URL}${href}`;

    if (!title || !company || !fullUrl) {
      return;
    }

    const job: Job = {
      id: fullUrl,
      title,
      company,
      location,
      date,
      description: `${title} at ${company}. Location: ${location}.`,
      url: fullUrl,
      tags
    };

    jobs.push(job);
  });

  return removeDuplicates(jobs);
}

function removeDuplicates(jobs: Job[]): Job[] {
  const seen = new Set<string>();
  const uniqueJobs: Job[] = [];

  for (const job of jobs) {
    if (!seen.has(job.url)) {
      seen.add(job.url);
      uniqueJobs.push(job);
    }
  }

  return uniqueJobs;
}

export async function scrapeWithDelay(url: string): Promise<Job[]> {
  const jobs = await scrapeJobPage(url);

  await delay(1000);

  return jobs;
}