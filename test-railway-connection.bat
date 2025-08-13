@echo off
echo ===================================
echo Railway MySQL Connection Test
echo ===================================
echo.

:: Check if Node.js is installed
where node >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo Error: Node.js is not installed.
    echo Please install Node.js and try again.
    exit /b 1
)

:: Check if mysql2 is installed
cd server
echo Checking required packages...
call npm list mysql2 >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo Installing mysql2 package...
    call npm install mysql2 dotenv
)

:: Check if .env file exists
if not exist .env (
    echo Warning: .env file not found in the server directory.
    echo.
    echo Would you like to create one? (Y/N)
    set /p CREATE_ENV=
    if /i "%CREATE_ENV%"=="Y" (
        echo Creating .env file...
        echo # Railway MySQL Connection > .env
        echo DB_HOST= >> .env
        echo DB_USER= >> .env
        echo DB_PASSWORD= >> .env
        echo DB_DATABASE= >> .env
        echo DB_PORT=3306 >> .env
        echo DB_SSL=true >> .env
        echo.
        echo Please edit the .env file with your Railway connection details.
        echo Then run this script again.
        echo.
        notepad .env
        exit /b 0
    )
)

:: Run the test script
echo.
echo Running connection test...
echo.
node railway-test.js

echo.
echo ===================================
echo Test Complete
echo ===================================
pause
