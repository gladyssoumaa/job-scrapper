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