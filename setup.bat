@echo off
REM Setup script for Ruther Homes on Windows

echo =========================================
echo   Ruther Homes - Setup Script
echo =========================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if errorlevel 1 (
    echo ❌ Node.js is not installed. Please install it from https://nodejs.org/
    exit /b 1
)

echo ✓ Node.js is installed

REM Check if npm is installed
where npm >nul 2>nul
if errorlevel 1 (
    echo ❌ npm is not installed. Please install Node.js
    exit /b 1
)

echo ✓ npm is installed

REM Check if PostgreSQL is installed
where psql >nul 2>nul
if errorlevel 1 (
    echo ❌ PostgreSQL is not installed. Please install it from https://www.postgresql.org/download/
    exit /b 1
)

echo ✓ PostgreSQL is installed
echo.

REM Backend setup
echo Setting up backend...
cd backend

if not exist ".env" (
    copy .env.example .env
    echo ✓ Created .env file
) else (
    echo ✓ .env file already exists
)

call npm install
echo ✓ Backend dependencies installed

cd ..
echo.

echo =========================================
echo ✓ Setup Complete!
echo =========================================
echo.
echo Next steps:
echo 1. Set up PostgreSQL database:
echo    psql -U postgres -f backend\database.sql
echo.
echo 2. Start backend server:
echo    cd backend ^&^& npm start
echo.
echo 3. In another terminal, start frontend:
echo    cd frontend ^&^& python -m http.server 8000
echo.
echo 4. Open browser: http://localhost:8000
echo.
echo For more details, see QUICKSTART.md
pause
