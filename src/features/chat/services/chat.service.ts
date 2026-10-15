import { generateGeminiResponse } from "../providers/gemini.provider"


export async function processChatMessage(message: string) {

    const geminiResponse = await generateGeminiResponse(message)
    return {
        geminiResponse,
        timestamp: new Date()
    }
}