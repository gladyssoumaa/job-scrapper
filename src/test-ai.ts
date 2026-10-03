import "dotenv/config";
import { classifySeniority } from "./ai.js";

async function main() {
  const titles = [
    "Junior Software Developer",
    "Software Engineer",
    "Senior Backend Engineer",
    "Engineering Manager",
    "Director of Engineering"
  ];

  for (const title of titles) {
    const result = await classifySeniority(title);

    console.log(`${title} -> ${result}`);
  }
}

main().catch((error) => {
  console.error("AI test failed:", error);
});