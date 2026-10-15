import { NextResponse } from "next/server";
import { chatRequestSchema } from "@/features/chat/schemas/chat.schema";
import { handleApiError } from "@/lib/errors/handle-api-error";
import { processChatMessage } from "@/features/chat/services/chat.service";

export async function POST(request: Request) {
    try {
        const body: unknown = await request.json();
        const { message } = chatRequestSchema.parse(body);

        const response = await processChatMessage(message);
        return NextResponse.json(response, { status: 200 });
    } catch (error: unknown) {
        return handleApiError(error);
    }
}
