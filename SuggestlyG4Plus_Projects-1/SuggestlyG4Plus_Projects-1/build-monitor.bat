@echo off
echo === Build Performance Monitor ===
echo Starting build at: %date% %time%

REM Start timer
set start_time=%time%

REM Run build command
npm run build

REM End timer
set end_time=%time%

echo Build completed at: %date% %end_time%
echo Start time: %start_time%
echo End time: %end_time%

REM Log to file
echo %date%,%start_time%,%end_time% >> build-times.log

echo Build time logged to build-times.log
echo Press any key to close...
pause >nul
