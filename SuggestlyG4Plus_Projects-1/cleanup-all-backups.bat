@echo off
echo ========================================
echo Stella Global Class - Complete Cleanup
echo ========================================
echo.
echo Removing all backup and duplicate files...
echo.

cd /d "%~dp0"

echo [1/3] Removing backup .env files...
del /Q ".env_20250930145844.production" 2>nul
del /Q ".env_20250930145848.production" 2>nul
del /Q ".env_20250930145857.production" 2>nul
del /Q ".env_20250930145900.production" 2>nul
del /Q ".env_20250930145908.production" 2>nul
echo ✓ Removed 5 backup .env files

echo.
echo [2/3] Removing _archive_backups directory...
if exist "_archive_backups" (
    rmdir /S /Q "_archive_backups"
    echo ✓ Removed _archive_backups directory
) else (
    echo ℹ _archive_backups directory not found
)

echo.
echo [3/3] Removing enhanced-index.html...
if exist "public\enhanced-index.html" (
    del /Q "public\enhanced-index.html"
    echo ✓ Removed public\enhanced-index.html
) else (
    echo ℹ enhanced-index.html not found
)

echo.
echo ========================================
echo Cleanup Complete!
echo ========================================
echo.
echo Files removed successfully.
echo Repository is now clean and ready for Git commit.
echo.
pause
