@echo off
REM Start Java ChatBot Server
REM This script starts the Spring Boot backend on port 8080

title Java ChatBot - Server
echo.
echo ========================================
echo  🔥 Java ChatBot Server Startup
echo ========================================
echo.

REM Navigate to server directory
cd /d "%~dp0..\server"

REM Check if build exists
if not exist "build\libs\server-1.0.0.jar" (
    echo ⚙️  Building server... (this may take a minute)
    call gradle build -q
    if errorlevel 1 (
        echo ❌ Build failed!
        pause
        exit /b 1
    )
)

echo.
echo ✅ Starting server on http://localhost:8080
echo.
echo Press Ctrl+C to stop the server
echo.

REM Start the server
java -jar build/libs/server-1.0.0.jar

pause
