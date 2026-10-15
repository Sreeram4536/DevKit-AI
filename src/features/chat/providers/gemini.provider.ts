import { GoogleGenAI } from "@google/genai";
import { AppError } from "@/lib/errors/app-error";

export async function generateGeminiResponse(message: string): Promise<string> {
    const apiKey = process.env.GEMINI_API_KEY;
    const aimodel = process.env.GEMINI_MODEL;

    if (!apiKey) {
        throw new AppError("GEMINI_API_KEY is not configured in environment variables", 500, "MISSING_API_KEY");
    }
    if (!aimodel) {
        throw new AppError("GEMINI_MODEL is not configured in environment variables", 500, "MISSING_MODEL");
    }

    try {
        const ai = new GoogleGenAI({ apiKey });
        const response = await ai.models.generateContent({
            model: aimodel,
            contents: message,
            config: {
                maxOutputTokens: 1000,
            },
        });

        const answer = response.text;
        if (!answer) {
            throw new AppError("Gemini returned an empty response", 502, "EMPTY_AI_RESPONSE");
        }

        return answer;
    } catch (error: unknown) {
        if (error instanceof AppError) {
            throw error;
        }

        const message = error instanceof Error ? error.message : "Failed to communicate with Gemini API";
        throw new AppError(message, 502, "AI_PROVIDER_ERROR");
    }
}