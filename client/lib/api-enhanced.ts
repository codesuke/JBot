import { API_BASE_URL, MODELS } from './constants';

interface ChatResponse {
  id: number;
  content: string;
  role: string;
  model: string;
  timestamp: string;
}

interface ErrorResponse {
  errorCode: string;
  message: string;
  details: string;
  retryable: boolean;
  retryAfterSeconds?: number;
  timestamp: string;
}

class APIError extends Error {
  errorCode: string;
  retryable: boolean;
  retryAfter?: number;

  constructor(errorResponse: ErrorResponse) {
    super(errorResponse.message);
    this.errorCode = errorResponse.errorCode;
    this.retryable = errorResponse.retryable;
    this.retryAfter = errorResponse.retryAfterSeconds;
  }
}

async function fetchWithRetry(
  url: string,
  options: RequestInit,
  maxRetries: number = 3
): Promise<Response> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      // Check if online before making request
      if (!navigator.onLine) {
        throw new Error('No internet connection');
      }

      const response = await fetch(url, options);
      
      // If successful or client error (4xx), return immediately
      if (response.ok || (response.status >= 400 && response.status < 500)) {
        return response;
      }

      // For server errors (5xx) or network issues, retry with backoff
      if (attempt < maxRetries) {
        const backoffTime = Math.min(1000 * Math.pow(2, attempt), 8000);
        console.log(`Retry attempt ${attempt + 1}/${maxRetries} after ${backoffTime}ms`);
        await new Promise(resolve => setTimeout(resolve, backoffTime));
        continue;
      }

      return response;
    } catch (error) {
      lastError = error as Error;
      
      // Don't retry on network errors for last attempt
      if (attempt >= maxRetries) {
        throw lastError;
      }

      // Exponential backoff
      const backoffTime = Math.min(1000 * Math.pow(2, attempt), 8000);
      console.log(`Network error, retrying after ${backoffTime}ms`);
      await new Promise(resolve => setTimeout(resolve, backoffTime));
    }
  }

  throw lastError || new Error('Unknown error');
}

export async function sendMessage(
  content: string,
  userId: string,
  model: string = MODELS.GEMINI_FLASH
): Promise<ChatResponse> {
  try {
    const res = await fetchWithRetry(
      `${API_BASE_URL}/chat/send`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          content, 
          userId, 
          model 
        }),
      },
      3
    );

    if (!res.ok) {
      const errorData: ErrorResponse = await res.json();
      throw new APIError(errorData);
    }

    const data = await res.json();
    return data;
  } catch (error) {
    if (error instanceof APIError) {
      throw error;
    }
    
    // Network or other errors
    console.error('API Error:', error);
    throw new APIError({
      errorCode: 'NETWORK_ERROR',
      message: 'Failed to connect to server',
      details: error instanceof Error ? error.message : 'Unknown error',
      retryable: true,
      timestamp: new Date().toISOString()
    });
  }
}

export async function getChatHistory(userId: string): Promise<ChatResponse[]> {
  try {
    const res = await fetchWithRetry(
      `${API_BASE_URL}/chat/messages/${userId}`,
      {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      },
      2
    );
    
    if (!res.ok) {
      const errorData: ErrorResponse = await res.json();
      throw new APIError(errorData);
    }

    const data = await res.json();
    return data;
  } catch (error) {
    if (error instanceof APIError) {
      throw error;
    }
    
    console.error('API Error:', error);
    throw new APIError({
      errorCode: 'NETWORK_ERROR',
      message: 'Failed to fetch chat history',
      details: error instanceof Error ? error.message : 'Unknown error',
      retryable: true,
      timestamp: new Date().toISOString()
    });
  }
}

export { APIError };
export type { ErrorResponse };
