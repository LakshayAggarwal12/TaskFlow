const Groq = require("groq-sdk");

if (!process.env.GROQ_API_KEY) {
  console.warn("GROQ_API_KEY is not set — AI features will fail until it's added to .env");
}

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// Llama 3.3 70B — good quality/speed tradeoff on Groq's free tier for the
// kind of short, structured generations this app needs (task drafts,
// label suggestions, filter extraction, sprint summaries).
const MODEL = "openai/gpt-oss-120b";

// Plain text generation (used for the sprint summary narrative)
const generateText = async (prompt) => {
  const completion = await groq.chat.completions.create({
    model: MODEL,
    messages: [{ role: "user", content: prompt }],
  });
  return completion.choices[0].message.content.trim();
};

// JSON-mode generation — asks Groq to return ONLY valid JSON matching the
// shape described in the prompt, so the caller can safely JSON.parse it.
// Used for task drafting, label suggestion, and NL-search filter extraction.
const generateJSON = async (prompt) => {
  const completion = await groq.chat.completions.create({
    model: MODEL,
    messages: [{ role: "user", content: prompt }],
    response_format: { type: "json_object" },
  });

  try {
    return JSON.parse(completion.choices[0].message.content);
  } catch (error) {
    throw new Error("AI returned a response that could not be parsed as JSON");
  }
};

module.exports = { generateText, generateJSON };
