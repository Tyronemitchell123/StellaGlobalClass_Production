@echo off
echo 🚀 Comprehensive Automated Deployment
echo ======================================
echo.

REM Colors
set "GREEN=[92m"
set "BLUE=[94m"
set "RESET=[0m"

REM Run static site deployment
echo Deploying Static Site...
call deploy-github-pages.bat
echo.

REM Switch to Next.js branch and deploy
echo Deploying Next.js Application...
git show-ref --verify --quiet refs/heads/nextjs-app >nul 2>nul
if %errorlevel% equ 0 (
    git checkout nextjs-app >nul 2>nul
    call deploy-vercel.bat
    git checkout main >nul 2>nul
) else (
    echo ⚠️  nextjs-app branch not found - create it first
)

echo.
echo 🎉 Deployment Complete!
echo Static Site: https://tyronemitchell123.github.io/StellaGlobalClass_Production/
echo Next.js App: https://stella-global-class-production.vercel.app
echo.
pause
