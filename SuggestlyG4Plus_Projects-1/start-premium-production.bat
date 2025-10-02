@echo off
echo 🚀 Starting Veridian Private Concierge Premium Production Server...
echo 📅 Date: %date%
echo ⏰ Time: %time%
echo.

REM Change to the script directory
cd /d "%~dp0"

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo ✅ Node.js found
echo 🎯 Launching premium production server...
echo 🌟 Veridian Private Concierge - Premium AI Lifestyle Management
echo.

REM Start the auto-start script
node auto-start-premium-production.js

if %errorlevel% neq 0 (
    echo ❌ Failed to start premium production server
    pause
    exit /b 1
)

echo ✅ Premium production server started successfully
echo 🌐 Server is running at http://localhost:3000
echo 📱 Professional landing page is active
echo.
echo Press Ctrl+C to stop the server
pause
