import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

export async function classifySeniority(
  jobTitle: string
): Promise<string> {
  const response = await groq.chat.completions.create({
    model: "openai/gpt-oss-20b",
    temperature: 0.2,
    messages: [
      {
        role: "system",
        content: `
You are a job classification assistant.

Classify the seniority level of a job based only on its title.

Use exactly one of these labels:
- Entry-Level
- Junior
- Mid-Level
- Senior
- Manager
- Executive
- Unknown

Return only the label and nothing else.
        `.trim()
      },
      {
        role: "user",
        content: `Job title: ${jobTitle}`
      }
    ]
  });

  return response.choices[0]?.message?.content?.trim() || "Unknown";
}

export async function extractSkills(
  jobText: string
): Promise<string[]> {
  const response = await groq.chat.completions.create({
    model: "openai/gpt-oss-20b",
    temperature: 0.2,
    messages: [
      {
        role: "system",
        content: `
You are a job skills extraction assistant.

Extract the technical and professional skills explicitly mentioned
in the provided job text.

Return only a JSON array of skill names.

Do not invent or infer skills that are not explicitly mentioned.
If no skills are mentioned, return an empty JSON array.

Example:
["Python", "FastAPI", "PostgreSQL", "Docker"]
        `.trim()
      },
      {
        role: "user",
        content: jobText
      }
    ]
  });

  const content =
    response.choices[0]?.message?.content?.trim() || "[]";

  try {
    const skills = JSON.parse(content);

    if (Array.isArray(skills)) {
      return skills
        .filter((skill) => typeof skill === "string")
        .map((skill) => skill.trim())
        .filter(Boolean);
    }

    return [];
  } catch {
    return [];
  }
}