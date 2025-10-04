@echo off
echo 🚀 Deploying Static Site to GitHub Pages...
echo.

REM Ensure we're on main branch
git checkout main 2>nul
git pull origin main 2>nul

echo ✅ Static site deployment prepared
echo 🌐 Live at: https://tyronemitchell123.github.io/StellaGlobalClass_Production/
echo.
echo 📋 Manual GitHub Pages Setup:
echo 1. Go to: https://github.com/Tyronemitchell123/StellaGlobalClass_Production
echo 2. Settings → Pages
echo 3. Source: "Deploy from a branch"
echo 4. Branch: main, Folder: /
echo 5. Save
echo.
pause
