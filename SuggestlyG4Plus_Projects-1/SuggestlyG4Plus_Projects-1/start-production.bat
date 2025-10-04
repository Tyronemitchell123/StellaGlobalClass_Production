@echo off
echo ====================================
echo Starting Stella Global Class Production Server
echo ====================================

:: Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

:: Check if package.json exists
if not exist "package.json" (
    echo ❌ package.json not found in current directory
    echo Please navigate to the project directory first
    pause
    exit /b 1
)

:: Check if node_modules exists, if not run npm install
if not exist "node_modules" (
    echo 📦 Installing dependencies...
    call npm install
    if %errorlevel% neq 0 (
        echo ❌ Failed to install dependencies
        pause
        exit /b 1
    )
)

:: Set production environment
set NODE_ENV=production

:: Load production environment variables
if exist ".env.production" (
    echo ⚙️ Loading production configuration...
    :: For Windows, we need to load env variables differently
    for /f "tokens=1,2 delims==" %%a in (.env.production) do (
        set %%a=%%b
    )
)

echo 🚀 Starting Production Server...
echo ====================================
echo Server will be available at: http://localhost:3000
echo Health Check: http://localhost:3000/health
echo Premium Features: http://localhost:3000/api/premium
echo Metrics: http://localhost:3000/api/metrics
echo ====================================
echo Press Ctrl+C to stop the server
echo ====================================

:: Start the production server
call npm start

:: Keep the window open if the server stops
if %errorlevel% neq 0 (
    echo ❌ Server stopped with error code %errorlevel%
    pause
) else (
    echo ✅ Server stopped gracefully
    pause
)
