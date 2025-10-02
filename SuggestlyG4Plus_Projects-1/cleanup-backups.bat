@echo off
echo ========================================
echo Stella Global Class - Repository Cleanup
echo ========================================
echo.
echo This will remove all backup and duplicate files.
echo.
pause

echo.
echo [1/4] Removing backup auto-start files...
del /Q "auto-start-production_20250930142949.js" 2>nul
del /Q "auto-start-production_20250930143005.js" 2>nul
del /Q "auto-start-production_20250930145548.js" 2>nul
del /Q "auto-start-production_20250930145550.js" 2>nul
del /Q "auto-start-production_20250930145555.js" 2>nul
del /Q "auto-start-production_20250930145803.js" 2>nul
del /Q "auto-start-production_20250930145805.js" 2>nul
del /Q "auto-start-production_20250930145814.js" 2>nul
del /Q "auto-start-production_20250930145816.js" 2>nul
del /Q "auto-start-production_20250930145822.js" 2>nul
del /Q "auto-start-production_20250930145826.js" 2>nul
echo ✓ Removed 11 backup auto-start files

echo.
echo [2/4] Removing backup package files...
del /Q "package_20250930143023.json" 2>nul
del /Q "package_20250930143029.json" 2>nul
del /Q "package_20250930143117.json" 2>nul
echo ✓ Removed 3 backup package files

echo.
echo [3/4] Removing backup README files...
del /Q "README-PRODUCTION_20250930150157.md" 2>nul
del /Q "README-PRODUCTION_20250930150219.md" 2>nul
del /Q "README-PRODUCTION_20250930150840.md" 2>nul
echo ✓ Removed 3 backup README files

echo.
echo [4/4] Removing backup start-production files...
del /Q "start-production_20250930145920.bat" 2>nul
del /Q "start-production_20250930145929.bat" 2>nul
del /Q "start-production_20250930145935.bat" 2>nul
del /Q "start-production_20250930145938.bat" 2>nul
echo ✓ Removed 4 backup start-production files

echo.
echo [5/4] Removing backup premium-production-setup files...
del /Q "premium-production-setup_20250930142548.js" 2>nul
del /Q "premium-production-setup_20250930142555.js" 2>nul
echo ✓ Removed 2 backup premium-production-setup files

echo.
echo [6/4] Removing enhanced-index.html (keeping index-with-live-data.html)...
del /Q "public\enhanced-index.html" 2>nul
echo ✓ Removed enhanced-index.html

echo.
echo ========================================
echo Cleanup Complete!
echo ========================================
echo.
echo Total files removed: 24
echo.
echo Remaining core files:
echo   - auto-start-production.js (original)
echo   - auto-start-production-enhanced.js (new with security)
echo   - package.json
echo   - public/index.html (enhanced with live data)
echo   - public/index-original-backup.html (backup)
echo   - All test files
echo   - All documentation
echo.
pause
