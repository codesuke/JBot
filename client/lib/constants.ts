// API Configuration
export const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080/api/v1';

// Model names
export const MODELS = {
  GEMINI_PRO: 'gemini-pro',
  GEMINI_FLASH: 'gemini-flash',
} as const;

// App routes
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  CHAT: '/chat',
  PROFILE: '/profile',
} as const;
