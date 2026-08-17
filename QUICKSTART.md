# Quick Start Guide

This guide will help you get the Ruther Homes rental management system up and running.

## Step 1: Prerequisites Setup

### Install PostgreSQL
- **Windows**: Download from https://www.postgresql.org/download/windows/
- **Mac**: `brew install postgresql` or download from PostgreSQL website
- **Linux**: `sudo apt-get install postgresql`

Make sure PostgreSQL service is running.

### Install Node.js
Download from https://nodejs.org/ (LTS version recommended)

## Step 2: Clone/Setup Project

Navigate to your project directory:
```bash
cd ruthrahomes
```

## Step 3: Database Setup

### Using Command Line

```bash
# Connect to PostgreSQL (Windows)
psql -U postgres

# On Mac/Linux, you might need:
sudo -u postgres psql
```

### In PostgreSQL Terminal

```sql
-- Run the database setup script
\i backend/database.sql

-- Or copy-paste the contents of backend/database.sql directly
-- Verify database was created
\l

-- Connect to the new database
\c ruthrahomes

-- Verify tables were created
\dt
```

### If you get an error, alternative method:

```bash
# Create database
createdb -U postgres ruthrahomes

# Import schema
psql -U postgres -d ruthrahomes -f backend/database.sql
```

## Step 4: Backend Setup and Run

```bash
cd backend

# Install dependencies
npm install

# Create .env file from template
cp .env.example .env

# Edit .env if needed (default values should work if PostgreSQL is on localhost)
# On Windows, you can use notepad:
notepad .env

# Start the server
npm start
```

You should see:
```
Server running on port 5000
```

## Step 5: Frontend Setup and Run

Open a new terminal window and navigate to the frontend folder:

```bash
cd frontend

# Option 1: Using Python 3
python -m http.server 8000

# Option 2: Using Python 2
python -m SimpleHTTPServer 8000

# Option 3: Using Node.js (if npx is available)
npx http-server
```

Open your browser and go to:
```
http://localhost:8000
```

## Step 6: Create Test Accounts

### Admin Account
1. Click "Sign up"
2. Fill in details:
   - Name: Admin User
   - Email: admin@example.com
   - Password: admin123
   - Role: Admin
3. Click "Sign Up"
4. Click "Login" link and login with admin credentials

### Tenant Account
1. Click "Sign up"
2. Fill in details:
   - Name: John Doe
   - Email: tenant@example.com
   - Password: tenant123
   - Role: Tenant
3. Click "Sign Up"
4. You can now login with tenant credentials

## Step 7: Admin Dashboard Actions

### Add a Room
1. Login as Admin
2. Click "Rooms" in navigation
3. Click "Add New Room"
4. Fill in Room Number (e.g., "101") and Total Beds (e.g., 2)
5. Click "Add Room"

### Add a Tenant to Room
1. Click "Tenants" in navigation
2. Click "Add New Tenant"
3. Select the tenant user (created earlier)
4. Select the room (created earlier)
5. Fill in:
   - Move-in Date: e.g., 2026-08-01
   - Monthly Rent: e.g., 8000
6. Click "Add Tenant"

### Record a Rent Payment
1. Click "Rent Management" in navigation
2. The current month should be displayed
3. Click "Record Payment" button next to a tenant
4. Fill in:
   - Amount Paid: e.g., 8000
   - Payment Date: e.g., 2026-08-05
   - Payment Method: Select one (optional)
5. Click "Record Payment"

## Step 8: View Tenant Dashboard

1. Logout from Admin
2. Login as the Tenant (e.g., tenant@example.com)
3. You'll see:
   - Room Number and Monthly Rent
   - Upcoming rent for next 6 months
   - Rent status for each month

## Troubleshooting

### "Cannot connect to database"
- Check PostgreSQL is running
- Verify credentials in `.env` file
- Ensure `ruthrahomes` database exists
- Try: `psql -U postgres -d ruthrahomes -c "SELECT 1"`

### "Port 5000 already in use"
- Change PORT in `.env` file to another port (e.g., 5001)
- Or kill the process: `lsof -ti:5000 | xargs kill -9` (Mac/Linux)

### "Cannot GET /" on frontend
- Make sure you're running the HTTP server in frontend directory
- Check http://localhost:8000/index.html directly
- Ensure browser is accessing the correct port

### "CORS error"
- Verify backend is running on http://localhost:5000
- Check API_BASE in `frontend/js/api.js`
- Restart backend server

### Tables not appearing after login
- Refresh the page
- Check browser console (F12) for errors
- Verify API calls are working (Network tab)

## Quick Database Reset

If you need to reset the database:

```bash
# Connect to PostgreSQL
psql -U postgres

# Drop existing database
DROP DATABASE ruthrahomes;

# Run the setup script again
\i backend/database.sql
```

## API Testing

You can test API endpoints using curl or Postman:

```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123","full_name":"Test User","role":"admin"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'

# Get Dashboard (replace TOKEN with actual token)
curl -X GET http://localhost:5000/api/admin/dashboard \
  -H "Authorization: Bearer TOKEN"
```

## Important Notes

1. **Rent Due Date**: 7th of each month (automatic in system)
2. **Date Format**: The app uses YYYY-MM-DD format for dates
3. **Currency**: Indian Rupees (₹) - can be changed in CSS/API
4. **Current Date**: System uses browser's local date to determine status

## Next Steps

- Customize styling in `frontend/css/style.css`
- Add more admin features
- Implement email notifications
- Add payment gateway integration
- Deploy to production

For more details, see README.md
