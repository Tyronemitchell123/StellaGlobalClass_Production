@echo off
echo 🚀 Deploying Next.js App to Vercel...
echo.

REM Switch to Next.js branch
echo Switching to nextjs-app branch...
git checkout nextjs-app 2>nul
if %errorlevel% neq 0 (
    echo ❌ Failed to switch to nextjs-app branch
    echo Please ensure the branch exists: git checkout -b nextjs-app
    pause
    exit /b 1
)

echo ✅ Switched to nextjs-app branch
echo.

REM Navigate to Next.js directory
cd SuggestlyG4Plus_Projects-1\domains\newdomain

REM Check if Vercel CLI is available
where vercel >nul 2>nul
if %errorlevel% equ 0 (
    echo Vercel CLI found - deploying from Next.js directory...
    vercel --prod --yes
    echo ✅ Next.js app deployed to Vercel
) else (
    echo ⚠️  Vercel CLI not found - deploy manually:
    echo    1. Go to: https://vercel.com
    echo    2. Import Project
    echo    3. Select: StellaGlobalClass_Production
    echo    4. Branch: nextjs-app
    echo    5. Root Directory: SuggestlyG4Plus_Projects-1/domains/newdomain
    echo    6. Deploy
)

REM Switch back to main branch
cd ..\..\..
git checkout main 2>nul

echo.
echo 🌐 Live at: https://stella-global-class-production.vercel.app
echo.
pause
