export interface ChatApiResponse {
  geminiResponse: string;
  timestamp: string | Date;
}

export interface ApiErrorResponse {
  success: false;
  error: {
    message: string;
    code: string;
    statusCode: number;
  };
}

export class ChatApiError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number,
    public readonly code: string
  ) {
    super(message);
    this.name = 'ChatApiError';
  }
}

/**
 * Sends a message to the backend /api/chat endpoint.
 * Supports cancellation via AbortSignal.
 */
export async function sendChatMessage(
  message: string,
  options?: { signal?: AbortSignal }
): Promise<ChatApiResponse> {
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ message }),
    signal: options?.signal,
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const errorPayload = data as ApiErrorResponse | null;
    const errorMessage =
      errorPayload?.error?.message || `Request failed with status ${response.status}`;
    const errorCode = errorPayload?.error?.code || 'API_REQUEST_FAILED';
    const statusCode = errorPayload?.error?.statusCode || response.status;

    throw new ChatApiError(errorMessage, statusCode, errorCode);
  }

  return data as ChatApiResponse;
}
