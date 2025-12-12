// API Configuration
export const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080/api';

// Model names (matching Google's official model IDs - Dec 2025)
export const MODELS = {
  GEMINI_PRO: 'gemini-2.5-flash',
  GEMINI_FLASH: 'gemini-2.0-flash',
} as const;

// App routes
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  CHAT: '/chat',
  PROFILE: '/profile',
} as const;
