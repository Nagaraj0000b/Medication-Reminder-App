@echo off
echo ===================================
echo Railway Connection Test
echo ===================================
echo.

:: Check if Node.js is installed
where node >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo Error: Node.js is not installed.
    echo Please install Node.js and try again.
    exit /b 1
)

:: Change to server directory
cd server

:: Check if mysql2 is installed
echo Checking required packages...
call npm list mysql2 >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo Installing mysql2 package...
    call npm install mysql2 dotenv
)

:: Run the test script
echo.
echo Running Railway connection test...
echo.
node railway-connection-test.js

echo.
echo ===================================
echo Test Complete
echo ===================================
echo.
echo If the test was successful, copy the .env.railway file to .env:
echo    copy server\.env.railway server\.env
echo.

pause
