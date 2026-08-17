# Troubleshooting Guide

## Backend Issues

### 1. Server Won't Start

**Error**: `Port 5000 already in use`
```
Solution:
- Option A: Kill the process
  - Windows: netstat -ano | findstr :5000
           taskkill /PID <PID> /F
  - Mac/Linux: lsof -ti:5000 | xargs kill -9

- Option B: Change port in .env
  PORT=5001
  Then restart server
```

**Error**: `Cannot find module 'express'`
```
Solution:
cd backend
npm install
npm start
```

**Error**: `Cannot connect to database`
```
Solution:
1. Check PostgreSQL is running
   - Windows: Check Services
   - Mac: brew services list
   - Linux: sudo systemctl status postgresql

2. Verify .env credentials
   - DB_USER should be 'postgres' (or your username)
   - DB_PASSWORD should match your PostgreSQL password
   - DB_HOST should be 'localhost' if local

3. Test connection
   psql -U postgres -d ruthrahomes -c "SELECT 1"

4. If database doesn't exist
   psql -U postgres -f backend/database.sql
```

### 2. Database Connection Issues

**Error**: `password authentication failed`
```
Solution:
1. Reset PostgreSQL password:
   - Windows: Use pgAdmin tool
   - Mac/Linux: sudo -u postgres psql
              ALTER USER postgres WITH PASSWORD 'new_password';

2. Update .env with correct password
   DB_PASSWORD=new_password

3. Restart backend server
```

**Error**: `FATAL: database "ruthrahomes" does not exist`
```
Solution:
# Create database
psql -U postgres

CREATE DATABASE ruthrahomes;
\c ruthrahomes
\i backend/database.sql

# Or single command
psql -U postgres -f backend/database.sql
```

**Error**: `relation "users" does not exist`
```
Solution:
Make sure you've imported the schema:
psql -U postgres -d ruthrahomes -f backend/database.sql

Verify tables exist:
psql -U postgres -d ruthrahomes -c "\dt"
```

### 3. JWT Authentication Issues

**Error**: `No token provided` or `Invalid token`
```
Solution:
1. Clear browser localStorage
   - Open browser console (F12)
   - Type: localStorage.clear()
   - Refresh page

2. Check JWT_SECRET in .env matches
   JWT_SECRET=your_secret_key

3. Login again and get new token

4. For API testing, use actual token from login response
```

**Error**: `Token has expired`
```
Solution:
1. Logout and login again to get new token
   Token expires after: 7 days (default)
   Can change in .env: JWT_EXPIRE=30d

2. If token keeps expiring
   - Check server time is correct
   - Verify JWT_SECRET is consistent
```

### 4. Port and Connectivity Issues

**Error**: `Cannot GET http://localhost:5000/api/...`
```
Solution:
1. Verify backend is running
   - Check terminal shows "Server running on port 5000"
   
2. Check API_BASE in frontend/js/api.js
   const API_BASE = 'http://localhost:5000/api';

3. Test with browser
   http://localhost:5000/api/health
   Should return: {"status":"OK"}

4. Check firewall isn't blocking port 5000
   - Windows Defender Firewall
   - Mac System Preferences > Security
   - Linux: sudo ufw allow 5000
```

---

## Frontend Issues

### 1. Page Won't Load

**Error**: `Cannot GET /`
```
Solution:
1. Make sure you're running HTTP server in frontend directory
   cd frontend
   python -m http.server 8000

2. Access correct URL
   http://localhost:8000

3. Check browser console (F12) for errors
   Look for red error messages

4. Try direct file access
   file:///path/to/ruthrahomes/frontend/index.html
```

**Error**: `Blank page` or `styles not loading`
```
Solution:
1. Hard refresh browser
   Ctrl+Shift+Delete (or Cmd+Shift+Delete on Mac)

2. Clear browser cache
   Chrome: Settings > Privacy > Clear browsing data

3. Check console for 404 errors (F12)
   If CSS/JS not found, paths might be wrong

4. Verify all files exist
   - css/style.css
   - js/api.js
   - js/app.js
```

### 2. CORS Errors

**Error**: `Access to XMLHttpRequest has been blocked by CORS policy`
```
Solution:
1. Verify backend CORS is enabled
   In server.js should have:
   app.use(cors());

2. Check API_BASE URL matches backend address
   frontend/js/api.js: const API_BASE = 'http://localhost:5000/api';

3. If backend is on different machine
   Update API_BASE to backend URL
   const API_BASE = 'http://192.168.1.100:5000/api';

4. Backend might need CORS config update
   app.use(cors({
     origin: 'http://localhost:8000',
     credentials: true
   }));
```

### 3. API Calls Not Working

**Error**: `Failed to fetch from API`
```
Solution:
1. Open browser console (F12)
   Check Network tab for failed requests
   Click on failed request to see error details

2. Verify backend is running
   Try: http://localhost:5000/api/health

3. Check API_BASE is correct
   frontend/js/api.js

4. Verify JWT token is stored
   Console: localStorage.getItem('token')
   Should return a long string starting with 'ey'

5. Check request headers
   Should include:
   Authorization: Bearer <token>
```

**Error**: `404 Not Found` for API endpoint
```
Solution:
1. Verify endpoint exists
   Check routes/auth.js, routes/admin.js, etc.

2. Check request method (GET, POST, PUT)
   API.js should match backend routes

3. Verify URL is correct
   http://localhost:5000/api/admin/dashboard
   Not: http://localhost:5000/admin/dashboard

4. Check route mounting in server.js
   app.use('/api/admin', adminRoutes);
```

### 4. Login Not Working

**Error**: `Cannot login` or `Invalid email or password`
```
Solution:
1. Check you've registered first
   Click "Sign up" link and create account

2. Verify credentials are correct
   - Email should be lowercase
   - Password must match exactly

3. Check user exists in database
   psql -U postgres -d ruthrahomes
   SELECT * FROM users WHERE email = 'your@email.com';

4. Try registering a new account
   Use simple password like 'test123'
   Use simple email like 'test@example.com'

5. Clear browser data and try again
   localStorage.clear()
   Refresh page
```

**Error**: `Registration fails` or `Email already exists`
```
Solution:
1. Use different email address
   Each email must be unique

2. Try simpler email
   test@example.com

3. Check email format is valid
   Should include @ and domain

4. Verify no network errors
   Open console (F12) > Network tab
   Check response for error message
```

---

## Feature Issues

### 1. Dashboard Loads but No Data

**Error**: `Dashboard statistics showing 0`
```
Solution:
1. Make sure you've added rooms and tenants
   Click "Rooms" tab > "Add New Room"
   Click "Tenants" tab > "Add New Tenant"

2. Check data exists in database
   psql -U postgres -d ruthrahomes
   SELECT * FROM rooms;
   SELECT * FROM tenants;

3. Verify tenant is active
   Status should be 'active'

4. If adding tenant failed
   Check error message in console
   Might need to create user first
```

**Error**: `Rent statistics not updating`
```
Solution:
1. Refresh the page
   F5 or Cmd+R

2. Make sure you've recorded payments
   Click "Rent Management" > "Record Payment"

3. Check current date is set correctly
   Rent system uses browser's local date
   If date is wrong, status calculation will be wrong

4. Check rent records were created
   psql -U postgres -d ruthrahomes
   SELECT * FROM rent_payments;
```

### 2. Room/Tenant Not Adding

**Error**: `Add room/tenant button doesn't work`
```
Solution:
1. Check form is filled correctly
   All required fields must be completed
   Marked with * or "required"

2. Check browser console for errors
   F12 > Console tab
   Look for red error messages

3. Verify API response
   F12 > Network tab
   Click failed request > Response tab
   Check error message from server

4. If "Already exists" error
   Room number or email already in system
   Try with different values
```

**Error**: `Cannot add tenant - no users showing`
```
Solution:
1. Register tenant user first
   Logout
   Click "Sign up"
   Create account with role = "Tenant"
   This user will appear in dropdown

2. Reload page after registering
   F5 refresh

3. Create user as Admin first
   Not recommended but possible

4. Check database
   psql -U postgres -d ruthrahomes
   SELECT id, full_name, role FROM users WHERE role = 'tenant';
```

### 3. Payment Recording Issues

**Error**: `Cannot record payment`
```
Solution:
1. Check all fields are filled
   - Amount Paid (required)
   - Payment Date (required)

2. Amount paid should be ≤ expected rent
   If > expected, might be flagged

3. Check database connection
   Server logs should show any errors

4. Verify tenant exists
   Payment must be for existing tenant

5. Check rent month format
   Should be YYYY-MM
   E.g., 2026-08 for August 2026
```

**Error**: `Payment recorded but status not changing`
```
Solution:
1. Refresh page to see updated status
   F5

2. Check rent due date logic
   Due date is 7th of month
   Before 7th: Pending
   After 7th without payment: Overdue
   With payment: Paid

3. Verify current system date
   Rent status is calculated from TODAY's date
   If system date is wrong, status will be wrong

4. Try opening rent management section
   May need to manually refresh
```

---

## Database Issues

### 1. Cannot Connect

**Error**: `ECONNREFUSED - Connection refused`
```
Solution:
1. Start PostgreSQL service
   Windows: Services > PostgreSQL > Start
   Mac: brew services start postgresql
   Linux: sudo systemctl start postgresql

2. Check if running
   psql -U postgres -c "SELECT 1"
   Should return: 1

3. Verify port
   Default is 5432
   Check .env: DB_PORT=5432

4. If using remote database
   Verify hostname and credentials
   Check firewall allows connection
```

### 2. Tables Don't Exist

**Error**: `relation "users" does not exist`
```
Solution:
1. Import schema
   psql -U postgres -d ruthrahomes -f backend/database.sql

2. Verify tables created
   psql -U postgres -d ruthrahomes -c "\dt"
   Should show: users, rooms, tenants, rent_payments

3. If tables exist but error still occurs
   Check you're connected to correct database
   psql -U postgres -d ruthrahomes -c "SELECT * FROM users;"
```

### 3. Data Lost

**Error**: `All my data disappeared`
```
Solution:
1. Check database still exists
   psql -U postgres -c "SELECT datname FROM pg_database;"
   Look for 'ruthrahomes'

2. Check tables exist
   psql -U postgres -d ruthrahomes -c "\dt"

3. Restore from backup (if available)
   psql -U postgres -d ruthrahomes -f backup.sql

4. If no backup, data is lost
   Prevention for next time:
   - Regular backups: pg_dump -U postgres -d ruthrahomes -f backup.sql
   - Automated backups: Use cron job or backup service
```

---

## Performance Issues

### 1. Slow Loading

**Error**: `Page takes long time to load`
```
Solution:
1. Check network speed
   F12 > Network tab > see loading times

2. Check if backend is slow
   curl http://localhost:5000/api/health
   Should return quickly

3. Check database performance
   psql -U postgres -d ruthrahomes -c "VACUUM ANALYZE;"

4. Limit data display
   Consider adding pagination

5. Check for slow queries
   psql -U postgres -d ruthrahomes -c "SELECT * FROM pg_stat_statements LIMIT 10;"
```

### 2. High CPU/Memory

**Error**: `System running slow`
```
Solution:
1. Check Node.js process
   Windows: Task Manager > Processes
   Mac/Linux: ps aux | grep node

2. Restart backend
   Stop: Ctrl+C
   Start: npm start

3. Check database size
   psql -U postgres -d ruthrahomes -c "SELECT pg_size_pretty(pg_database_size('ruthrahomes'));"

4. Archive old data if large dataset
   Keep active data, move historical to archive
```

---

## Common Error Messages

| Error | Solution |
|-------|----------|
| `ENOENT: no such file` | File not found - check path |
| `EACCES: permission denied` | Run with sudo or check permissions |
| `ETIMEDOUT` | Connection timeout - check network |
| `ECONNREFUSED` | Connection refused - service not running |
| `Error: listen EADDRINUSE` | Port already in use - change PORT or kill process |
| `SyntaxError: Unexpected token` | JavaScript error - check console for details |
| `Unexpected token <` | Loading HTML instead of JSON - check API URL |
| `404 Not Found` | Endpoint doesn't exist - check route |
| `401 Unauthorized` | No/invalid token - login again |
| `403 Forbidden` | Wrong role - login as correct user |
| `500 Server Error` | Backend error - check server logs |

---

## Debugging Tips

### 1. Check Browser Console
```
F12 or Ctrl+Shift+I
Look for red error messages
Check Network tab for API calls
```

### 2. Check Server Logs
```
Terminal where backend is running
Should show all requests and errors
```

### 3. Check Database
```
psql -U postgres -d ruthrahomes

# See all data
SELECT * FROM users;
SELECT * FROM rooms;
SELECT * FROM tenants;
SELECT * FROM rent_payments;
```

### 4. Enable More Logging
```
In server.js add:
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});
```

### 5. API Testing Tools
```
Use curl or Postman to test API directly
Helps isolate frontend vs backend issues

curl -X GET http://localhost:5000/api/health
```

---

## Still Stuck?

1. **Check all documentation**
   - README.md
   - QUICKSTART.md
   - API_DOCUMENTATION.md

2. **Search error message online**
   - Copy exact error into Google
   - Usually has solutions

3. **Check code comments**
   - Detailed comments throughout codebase

4. **Review browser console**
   - Often shows what API returned

5. **Check backend terminal**
   - Shows server-side errors

6. **Reset everything**
   - Delete database: DROP DATABASE ruthrahomes;
   - Recreate: psql -U postgres -f backend/database.sql
   - Clear browser: localStorage.clear()
   - Restart backend: npm start
