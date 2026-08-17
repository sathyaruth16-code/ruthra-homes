#!/bin/bash

# Setup script for Ruther Homes

echo "========================================="
echo "  Ruther Homes - Setup Script"
echo "========================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install it from https://nodejs.org/"
    exit 1
fi

echo "✓ Node.js is installed"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install Node.js"
    exit 1
fi

echo "✓ npm is installed"

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo "❌ PostgreSQL is not installed. Please install it from https://www.postgresql.org/download/"
    exit 1
fi

echo "✓ PostgreSQL is installed"
echo ""

# Backend setup
echo "Setting up backend..."
cd backend

if [ ! -f ".env" ]; then
    cp .env.example .env
    echo "✓ Created .env file"
else
    echo "✓ .env file already exists"
fi

npm install
echo "✓ Backend dependencies installed"

cd ..
echo ""

echo "========================================="
echo "✓ Setup Complete!"
echo "========================================="
echo ""
echo "Next steps:"
echo "1. Set up PostgreSQL database:"
echo "   psql -U postgres -f backend/database.sql"
echo ""
echo "2. Start backend server:"
echo "   cd backend && npm start"
echo ""
echo "3. In another terminal, start frontend:"
echo "   cd frontend && python -m http.server 8000"
echo ""
echo "4. Open browser: http://localhost:8000"
echo ""
echo "For more details, see QUICKSTART.md"
