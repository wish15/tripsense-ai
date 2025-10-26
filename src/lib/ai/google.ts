import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Google AI
const apiKey = process.env.GOOGLE_API_KEY;

if (!apiKey) {
  console.error("❌ GOOGLE_API_KEY is not set in .env.local");
  throw new Error("GOOGLE_API_KEY environment variable is required. Please add it to .env.local file.");
}

const genAI = new GoogleGenerativeAI(apiKey);

// Use Gemini 2.0 Flash for fast, reliable responses
export const model = genAI.getGenerativeModel({ 
  model: "gemini-2.0-flash-exp",
});

export async function generateWithGemini(prompt: string): Promise<string> {
  try {
    const result = await model.generateContent(prompt);
    const response = result.response;
    return response.text();
  } catch (error) {
    console.error("Google AI Error:", error);
    throw new Error("Failed to generate content with Google AI");
  }
}

export async function generateJSONWithGemini<T>(prompt: string): Promise<T> {
  const fullPrompt = `${prompt}\n\nIMPORTANT: Respond with ONLY valid JSON, no additional text or markdown. Do not wrap in code blocks.`;
  
  try {
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: fullPrompt }] }],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 8000,
        responseMimeType: "application/json",
      },
    });
    
    const response = result.response;
    const text = response.text();
    
    // Clean up response (remove markdown code blocks if present)
    let cleanedText = text.trim();
    if (cleanedText.startsWith("```json")) {
      cleanedText = cleanedText.slice(7);
    } else if (cleanedText.startsWith("```")) {
      cleanedText = cleanedText.slice(3);
    }
    if (cleanedText.endsWith("```")) {
      cleanedText = cleanedText.slice(0, -3);
    }
    
    return JSON.parse(cleanedText.trim());
  } catch (error) {
    console.error("Google AI JSON Error:", error);
    throw new Error("Failed to generate JSON with Google AI");
  }
}
