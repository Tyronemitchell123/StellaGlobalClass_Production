@echo off
echo 🚀 Deploying Next.js App to Vercel...
echo.

REM Check if Vercel CLI is available
where vercel >nul 2>nul
if %errorlevel% equ 0 (
    echo Vercel CLI found - deploying...
    vercel --prod --yes
    echo ✅ Next.js app deployed to Vercel
) else (
    echo ⚠️  Vercel CLI not found - deploy manually:
    echo    1. Go to: https://vercel.com
    echo    2. Import Project
    echo    3. Select: StellaGlobalClass_Production
    echo    4. Branch: nextjs-app
    echo    5. Deploy
)

echo.
echo 🌐 Live at: https://stella-global-class-production.vercel.app
echo.
pause
