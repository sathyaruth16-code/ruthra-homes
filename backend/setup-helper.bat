@echo off
REM Ruther Homes - Quick Setup Script

echo.
echo ==========================================
echo   Ruther Homes - Installation Assistant
echo ==========================================
echo.

REM Check if we're in the right directory
if not exist "package.json" (
    echo Error: Please run this from the backend directory
    echo.
    echo cd c:\Users\Nandha\Desktop\ruthrahomes\backend
    echo setup-helper.bat
    exit /b 1
)

echo Step 1: Installing npm dependencies...
echo This may take 1-2 minutes...
echo.

call npm install

if errorlevel 1 (
    echo.
    echo Error installing dependencies. Trying alternative method...
    call npm install --legacy-peer-deps
)

echo.
echo ==========================================
echo Setup Complete!
echo ==========================================
echo.
echo Next Steps:
echo 1. Set up PostgreSQL database:
echo    psql -U postgres -f database.sql
echo.
echo 2. Start the backend server:
echo    npm start
echo.
echo 3. In another terminal, start frontend:
echo    cd ..\frontend
echo    python -m http.server 8000
echo.
echo 4. Open browser:
echo    http://localhost:8000
echo.
pause
