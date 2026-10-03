import axios from "axios";
import robotsParser from "robots-parser";

const ROBOTS_URL = "https://weworkremotely.com/robots.txt";
const USER_AGENT = "StudentJobScraper/1.0";

export async function checkRobotsTxt(targetUrl: string): Promise<boolean> {
  console.log("Checking robots.txt...");

  const response = await axios.get(ROBOTS_URL, {
    headers: {
      "User-Agent": USER_AGENT
    }
  });

  const robots = robotsParser(ROBOTS_URL, response.data);

  const allowed = robots.isAllowed(targetUrl, USER_AGENT)?? false;

  if (allowed) {
    console.log(`Allowed to scrape: ${targetUrl}`);
  } else {
    console.log(`Scraping not allowed: ${targetUrl}`);
  }

  return allowed;
}

export function getCrawlDelay(): number {
  return 1000;
}