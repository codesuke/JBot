# AI Chat Assistant - Client

A modern chat-based AI assistant web application built with Next.js 15, TailwindCSS V4, NextAuth, and Supabase.

## 🚀 Features

- ✅ Email/Password authentication via Supabase + NextAuth
- ✅ User signup and login
- ✅ Real-time chat interface with AI (Gemini)
- ✅ Chat history management
- ✅ Responsive design with dark mode support
- ✅ State management with Zustand
- ✅ API proxy to Java Spring Boot backend
- ✅ User profile management

## 📁 Project Structure

```
client/
├── app/
│   ├── (auth)/              # Authentication pages
│   │   ├── login/
│   │   └── layout.tsx
│   ├── (dashboard)/         # Protected dashboard pages
│   │   ├── chat/           # Main chat interface
│   │   ├── profile/        # User profile
│   │   └── layout.tsx
│   ├── api/                # API routes
│   │   ├── auth/           # NextAuth endpoints
│   │   └── chat/           # Chat proxy to backend
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Landing page (redirects)
├── components/
│   ├── chat/               # Chat UI components
│   ├── layout/             # Layout components
│   └── ui/                 # Reusable UI components
├── lib/
│   ├── api.ts              # API client functions
│   ├── auth.ts             # NextAuth configuration
│   ├── constants.ts        # App constants
│   ├── supabase.ts         # Supabase client
│   └── utils.ts            # Utility functions
├── store/
│   ├── useChatStore.ts     # Chat state management
│   └── useUserStore.ts     # User state management
└── types/                  # TypeScript type definitions
```

## 🛠️ Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Your `.env.local` file is already set up with:

```env
# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=gFC28kfSkKiUcxw442RsvS5QVba/HEhxVu0CzCUqltM=

# Supabase (Already configured)
NEXT_PUBLIC_SUPABASE_URL=https://ykxywddtdjjoxdtmmdxd.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-key-here

# Database URL (Already configured)
DATABASE_URL=postgresql://postgres:...@db.ykxywddtdjjoxdtmmdxd.supabase.co:5432/postgres

# Backend API
NEXT_PUBLIC_BACKEND_URL=http://localhost:8080/api/v1
```

All Supabase credentials are already configured! ✅

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🎯 User Flow

1. **Landing Page** (`/`) → Redirects to `/login` if not authenticated
2. **Signup** (`/signup`) → Create account with email/password
3. **Login** (`/login`) → Sign in with your credentials
4. **Chat** (`/chat`) → Main chat interface
   - Send messages to AI
   - View chat history
   - Switch between AI models
5. **Profile** (`/profile`) → View user information and logout

## 🔌 API Routes

### `/api/auth/[...nextauth]`
NextAuth authentication endpoints for Supabase email/password authentication.

### `/api/chat` (POST)
Proxies chat requests to the Java Spring Boot backend.

**Request:**
```json
{
  "prompt": "Hello, AI!",
  "userId": "user@example.com"
}
```

**Response:**
```json
{
  "response": "Hello! How can I help you?",
  "timestamp": "2025-11-01T12:00:00Z"
}
```

## 🧩 Key Components

### Chat Components
- **ChatHeader**: Top bar with logout and model selector
- **ChatHistory**: Scrollable message list
- **ChatMessage**: Individual message bubble
- **ChatInput**: Message input with auto-resize

### State Management
- **useChatStore**: Manages chat messages and loading state
- **useUserStore**: Manages user session data

## 📦 Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Styling**: TailwindCSS V4
- **Authentication**: NextAuth.js
- **Database**: Supabase
- **State Management**: Zustand
- **UI Components**: Radix UI + Custom components
- **Icons**: Lucide React

## 🚢 Deployment

### Deploy to Vercel

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

Update `NEXTAUTH_URL` to your production URL:
```env
NEXTAUTH_URL=https://your-app.vercel.app
```

## 📝 Notes

- The backend (Spring Boot + Gemini) is separate - this is frontend only
- Chat history is stored via the backend API
- Supabase is used for authentication and future chat storage
- All API calls go through Next.js API routes for security

## 🔗 Next Steps

1. ✅ Set up Google OAuth credentials
2. ✅ Configure Supabase project
3. ⏳ Connect Java Spring Boot backend
4. ⏳ Implement chat history from Supabase
5. ⏳ Add model selection functionality
6. ⏳ Deploy to Vercel

## 📄 License

This project is part of a larger Java ChatBot application.
