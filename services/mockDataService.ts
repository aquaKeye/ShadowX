// COMMENTED OUT - Old Gemini API
// import { GoogleGenAI } from "@google/genai";
import { Tweet } from "../types";

// Groq API — ключ из .env.local (VITE_GROQ_API_KEY)
const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY ?? "";
const GROQ_BASE_URL = "https://api.groq.com/openai/v1/chat/completions";

export const fetchMockProfile = async (username: string): Promise<{ tweets: Tweet[], isVerified: boolean }> => {
  try {
    // COMMENTED OUT - Old Gemini Implementation
    // const apiKey = "";
    // const ai = new GoogleGenAI({ apiKey });

    const prompt = `Act as a Twitter data simulator. 
Generate 20 realistic, varied tweets for a hypothetical Twitter user with the username "@${username}".

Include a mix of:
1. Original thoughts.
2. Replies.
3. Retweets (Must start with "RT @").

If the username sounds like a crypto bot (e.g. contains "eth", "crypto", "pepe"), generate spammy crypto content.
If the username sounds generic, generate normal tweets.
If the username contains "toxic", generate angry/toxic tweets.

Return ONLY a JSON array of strings. No markdown formatting.
Example: ["tweet 1", "tweet 2", "RT @someone: repost text"]`;

    // Groq API Call (OpenAI-compatible, very fast inference)
    const response = await fetch(GROQ_BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "user",
            content: prompt
          }
        ],
        response_format: { type: "json_object" },
        temperature: 0.7
      })
    });

    if (!response.ok) {
      throw new Error(`Groq API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    let textData = data.choices[0]?.message?.content || "";

    // Default data structure
    const fallbackTweets = [
      "Just checking out the new features!",
      "Why is everyone so annoying today? #hate",
      "Check out this amazing giveaway! Claim now! http://scam.link"
    ];

    let tweetTexts: string[] = [];

    if (textData) {
      // Clean up markdown code blocks if the model includes them
      textData = textData.replace(/```json\n?|\n?```/g, '').trim();
      try {
        const parsed = JSON.parse(textData);
        // Handle both array format and object with tweets property
        tweetTexts = Array.isArray(parsed) ? parsed : (parsed.tweets || fallbackTweets);
      } catch (e) {
        tweetTexts = fallbackTweets;
      }
    } else {
      tweetTexts = fallbackTweets;
    }

    // Simulate Verification Status
    const isOfficial = username.toLowerCase().includes('official');
    const isVerified = isOfficial || Math.random() < 0.3;

    return {
      tweets: tweetTexts.map((text, index) => ({
        id: `t-${index}`,
        text: text,
        timestamp: new Date().toISOString()
      })),
      isVerified
    };

  } catch (error) {
    console.error("Simulation failed", error);
    throw error;
  }
};
