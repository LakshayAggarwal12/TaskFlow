const { GoogleGenAI } = require("@google/genai");

if (!process.env.GEMINI_API_KEY) {
  console.warn("GEMINI_API_KEY is not set — AI features will fail until it's added to .env");
}

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const MODEL = "gemini-2.5-flash";

// Plain text generation (used for the sprint summary narrative)
const generateText = async (prompt) => {
  const response = await ai.models.generateContent({
    model: MODEL,
    contents: prompt,
  });
  return response.text.trim();
};

// JSON-mode generation — asks Gemini to return ONLY valid JSON matching the
// shape described in the prompt, so the caller can safely JSON.parse it.
// Used for task drafting, label suggestion, and NL-search filter extraction.
const generateJSON = async (prompt) => {
  const response = await ai.models.generateContent({
    model: MODEL,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
    },
  });

  try {
    return JSON.parse(response.text);
  } catch (error) {
    throw new Error("AI returned a response that could not be parsed as JSON");
  }
};

module.exports = { generateText, generateJSON };
