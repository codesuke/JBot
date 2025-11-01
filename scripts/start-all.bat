@echo off
REM Start Both Server and Client
REM This script launches both the backend and frontend in separate windows

title Java ChatBot - Launcher
echo.
echo ========================================
echo  🚀 Java ChatBot - Full Stack Startup
echo ========================================
echo.

REM Get the scripts directory
set SCRIPT_DIR=%~dp0

echo Starting components...
echo.

REM Start Server in a new window
echo 1️⃣  Launching Backend Server (port 8080)...
start "Java ChatBot - Server" cmd /k "%SCRIPT_DIR%start-server.bat"

REM Wait a moment for server to start
timeout /t 3 /nobreak

REM Start Client in a new window
echo 2️⃣  Launching Frontend Client (port 3000)...
start "Java ChatBot - Client" cmd /k "%SCRIPT_DIR%start-client.bat"

echo.
echo ========================================
echo ✅ Both services starting...
echo ========================================
echo.
echo 📱 Frontend: http://localhost:3000
echo 🔥 Backend:  http://localhost:8080
echo 🩺 Health:   http://localhost:8080/api/chat/health
echo.
echo Close these terminal windows to stop the services.
echo.
timeout /t 5 /nobreak
