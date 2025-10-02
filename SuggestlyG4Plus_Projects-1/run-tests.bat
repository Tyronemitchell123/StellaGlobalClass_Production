@echo off
echo ========================================
echo Stella Global Class - Test Suite Runner
echo ========================================
echo.

echo [1/5] Running Unit Tests...
echo ----------------------------------------
call npm run test:unit
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Unit tests failed!
    pause
    exit /b 1
)
echo.

echo [2/5] Running Integration Tests...
echo ----------------------------------------
call npm run test:integration
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Integration tests failed!
    pause
    exit /b 1
)
echo.

echo [3/5] Running E2E Tests...
echo ----------------------------------------
echo NOTE: Make sure the server is running on http://localhost:3000
call npm run test:e2e
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: E2E tests failed!
    pause
    exit /b 1
)
echo.

echo [4/5] Running Full Test Suite with Coverage...
echo ----------------------------------------
call npm test
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Full test suite failed!
    pause
    exit /b 1
)
echo.

echo [5/5] Generating Test Report...
echo ----------------------------------------
echo Test report generated in coverage/ directory
echo.

echo ========================================
echo All Tests Completed Successfully! ✓
echo ========================================
echo.
echo Coverage report: coverage/lcov-report/index.html
echo.
pause
