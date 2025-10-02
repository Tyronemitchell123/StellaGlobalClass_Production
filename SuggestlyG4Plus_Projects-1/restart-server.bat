@echo off
echo Restarting Stella Global Class Production Server...
echo.
echo Press Ctrl+C to stop the current server, then run this script again.
echo.
cd /d "%~dp0"
node auto-start-production-enhanced.js
