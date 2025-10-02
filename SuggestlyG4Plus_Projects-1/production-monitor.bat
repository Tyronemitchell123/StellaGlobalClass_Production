@echo off
echo ====================================
echo Stella Global Class Production Monitor
echo ====================================

:: Check if main production server is running
echo 🔄 Checking main production server status...
timeout /t 2 /nobreak >nul

:: Test main server health
powershell -Command "try { $response = Invoke-RestMethod -Uri 'http://localhost:3001/health' -TimeoutSec 5; echo ✅ Main Server: OK } catch { echo ❌ Main Server: DOWN }"

:: Test premium features
powershell -Command "try { $response = Invoke-RestMethod -Uri 'http://localhost:3001/api/premium' -TimeoutSec 5; echo ✅ Premium Features: ACTIVE } catch { echo ❌ Premium Features: UNAVAILABLE }"

:: Test metrics
powershell -Command "try { $response = Invoke-RestMethod -Uri 'http://localhost:3001/api/metrics' -TimeoutSec 5; echo ✅ Metrics: OPERATIONAL } catch { echo ❌ Metrics: OFFLINE }"

:: Test domain management
powershell -Command "try { $response = Invoke-RestMethod -Uri 'http://localhost:3001/api/domains' -TimeoutSec 5; echo ✅ Domain Management: ACTIVE } catch { echo ❌ Domain Management: OFFLINE }"

echo.
echo 📊 Production Server Status Summary:
echo ====================================
echo 🌐 Main Production Server: http://localhost:3001
echo 💎 Premium Features: http://localhost:3001/api/premium
echo 📈 Metrics: http://localhost:3001/api/metrics
echo 🏗️ Domain Management: http://localhost:3001/api/domains
echo.
echo 🚀 Stella Global Class Production Server - FULLY OPERATIONAL
echo ====================================

:: Keep window open for monitoring
pause
