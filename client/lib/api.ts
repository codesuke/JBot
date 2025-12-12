interface ChatResponse {
  id: number;
  content: string;
  role: string;
  model: string;
  timestamp: string;
}

export interface ApiError {
  error: string;
  message: string;
  errorCode: string;
  retryable: boolean;
  retryAfter?: number;
  timestamp: number;
}

export class NetworkError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NetworkError';
  }
}

export class RateLimitError extends Error {
  retryAfter: number;
  constructor(message: string, retryAfter: number) {
    super(message);
    this.name = 'RateLimitError';
    this.retryAfter = retryAfter;
  }
}

export class APIError extends Error {
  errorCode: string;
  retryable: boolean;
  constructor(message: string, errorCode: string, retryable: boolean) {
    super(message);
    this.name = 'APIError';
    this.errorCode = errorCode;
    this.retryable = retryable;
  }
}

import { API_BASE_URL, MODELS } from './constants';

// Check if browser is online
function isOnline(): boolean {
  return typeof navigator !== 'undefined' && navigator.onLine;
}

// Exponential backoff retry logic
async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  initialDelay: number = 1000
): Promise<T> {
  let lastError: Error;
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error: any) {
      lastError = error;
      
      // Don't retry on non-retryable errors
      if (error instanceof APIError && !error.retryable) {
        throw error;
      }
      
      // Don't retry on rate limits (handle separately)
      if (error instanceof RateLimitError) {
        throw error;
      }
      
      // If it's the last attempt, throw
      if (attempt === maxRetries - 1) {
        throw error;
      }
      
      // Calculate exponential backoff delay
      const delay = initialDelay * Math.pow(2, attempt);
      console.log(`Retry attempt ${attempt + 1}/${maxRetries} after ${delay}ms`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError!;
}

export async function sendMessage(content: string, userId: string, model: string = MODELS.GEMINI_FLASH): Promise<ChatResponse> {
  // Check network connectivity first
  if (!isOnline()) {
    throw new NetworkError('No internet connection. Please check your network and try again.');
  }
  
  return retryWithBackoff(async () => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30s timeout
      
      const res = await fetch(`${API_BASE_URL}/chat/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, userId, model }),
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);

      if (!res.ok) {
        const errorData: ApiError = await res.json().catch(() => ({
          error: 'Unknown Error',
          message: `HTTP ${res.status}: ${res.statusText}`,
          errorCode: 'UNKNOWN',
          retryable: res.status >= 500,
          timestamp: Date.now(),
        }));
        
        if (errorData.errorCode === 'RATE_LIMIT') {
          throw new RateLimitError(errorData.message, errorData.retryAfter || 60);
        }
        
        throw new APIError(errorData.message, errorData.errorCode, errorData.retryable);
      }

      const data = await res.json();
      return data;
    } catch (error: any) {
      if (error.name === 'AbortError') {
        throw new NetworkError('Request timed out. Please try again.');
      }
      
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new NetworkError('Unable to connect to server. Please check your connection.');
      }
      
      throw error;
    }
  });
}

export async function getChatHistory(userId: string) {
  try {
    const res = await fetch(`${API_BASE_URL}/chat/messages/${userId}`);
    
    if (!res.ok) {
      throw new Error('Failed to fetch chat history');
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}
