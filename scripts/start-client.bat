@echo off
REM Start Java ChatBot Client (Frontend)
REM This script starts the Next.js frontend on port 3000

title Java ChatBot - Client
echo.
echo ========================================
echo  🌐 Java ChatBot Client Startup
echo ========================================
echo.

REM Navigate to client directory
cd /d "%~dp0..\client"

REM Check if node_modules exists
if not exist "node_modules" (
    echo 📦 Installing dependencies... (this may take a few minutes)
    call npm install
    if errorlevel 1 (
        echo ❌ Installation failed!
        pause
        exit /b 1
    )
)

echo.
echo ✅ Starting client on http://localhost:3000
echo.
echo Waiting for server on http://localhost:8080
echo.
echo Press Ctrl+C to stop the client
echo.

REM Start the development server
call npm run dev

pause
