# JBot - Java ChatBot Application

## 🚀 Quick Start

Follow these steps to get the JBot application running on your local machine.

## 📋 Prerequisites

- **Node.js** (v18 or higher)
- **Java JDK** (v17 or higher)
- **Gradle** (latest version)
- **pnpm** (package manager)

## 🔧 Environment Setup

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd "Java ChatBot"
```

### 2. Environment Variables

Create the following environment files:

#### Client Environment (`client/.env.local`)
```env
NEXT_PUBLIC_SUPABASE_URL=https://ykxywddtdjjoxdtmmdxd.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlreHl3ZGR0ZGpqb3hkdG1tZHhkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIwMTI5MTIsImV4cCI6MjA3NzU4ODkxMn0.r-lKjVK63yVh5xvNrv2PL27Q2OO9bnc7FbajE9v1zsw
NEXT_PUBLIC_BACKEND_URL=http://localhost:8080/api/v1
```

#### Server Environment (`server/.env.local`)
```env
DATABASE_URL=postgresql://postgres:948fe603f61dc036b5c596dc09fe3ce3f3d30dc90f024c85f3c82db2ccab679d@db.ykxywddtdjjoxdtmmdxd.supabase.co:5432/postgres
GEMINI_API_KEY=your_gemini_api_key_here
```

## 🏃‍♂️ Running the Application

### Option 1: Using Scripts (Recommended)

#### Windows PowerShell
```powershell
# Run both client and server
.\scripts\run-all.ps1
```

#### Linux/Mac
```bash
# Run both client and server
./scripts/run-all.sh
```

### Option 2: Manual Setup

#### Start the Backend Server
```bash
cd server
./gradlew bootRun
```
The server will start on `http://localhost:8080`

#### Start the Frontend Client
```bash
cd client
pnpm install
pnpm dev
```
The client will start on `http://localhost:3000`

## 🌐 Access the Application

Once both services are running:
- **Frontend**: Open [http://localhost:3000](http://localhost:3000) in your browser
- **Backend API**: Available at [http://localhost:8080/api/v1](http://localhost:8080/api/v1)

## 🔧 Development Commands

### Client (Next.js)
```bash
cd client

# Install dependencies
pnpm install

# Development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Lint code
pnpm lint
```

### Server (Java Spring Boot)
```bash
cd server

# Development server
./gradlew bootRun

# Build application
./gradlew build

# Run tests
./gradlew test

# Clean build
./gradlew clean
```

## 🛠 Troubleshooting

### Common Issues

1. **Port conflicts**: Make sure ports 3000 and 8080 are available
2. **Java version**: Ensure you have JDK 17+ installed
3. **Node version**: Ensure you have Node.js 18+ installed
4. **Gradle issues**: Try `./gradlew clean` and rebuild

### Environment Variables
- Copy the exact keys from `Instructions/importantkeys.md`
- Ensure `.env.local` files are in the correct directories
- Restart services after changing environment variables

## 📁 Project Structure

```
Java ChatBot/
├── client/          # Next.js frontend
├── server/          # Java Spring Boot backend
├── Instructions/    # Setup documentation
├── scripts/         # Automation scripts
└── showcase/        # Demo files
```

## 🎯 Features

- 🤖 AI-powered chat with Gemini models
- 🔐 Supabase authentication
- 🎨 Modern UI with Tailwind CSS
- 📱 Responsive design
- ⚡ Real-time messaging
- 🌓 Dark/Light theme support

## 📞 Support

If you encounter any issues, check the `Instructions/` folder for detailed setup guides or contact the development team.