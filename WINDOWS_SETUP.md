# Windows Setup Instructions - Ruther Homes

## Prerequisites Check

Before you start, make sure you have:

### 1. Node.js & npm
```
Check if installed:
node --version
npm --version
```

If not installed:
- Download from https://nodejs.org/ (LTS version)
- Install with default options
- Restart your computer after installation

### 2. PostgreSQL
```
Check if installed:
psql --version
```

If not installed:
- Download from https://www.postgresql.org/download/windows/
- During installation:
  - Set password for postgres user (remember this!)
  - Default port: 5432
- After installation, ensure PostgreSQL service is running

### 3. Python (for frontend server)
```
Check if installed:
python --version
```

If not installed:
- Download from https://www.python.org/downloads/
- During installation: **Check "Add Python to PATH"**
- Click "Install Now"

---

## Step-by-Step Setup

### Step 1: Navigate to Project Directory

Open Command Prompt (cmd.exe) and run:

```cmd
cd C:\Users\Nandha\Desktop\ruthrahomes
```

### Step 2: Install Backend Dependencies

```cmd
cd backend
npm install
```

This will download and install all required packages.

**If npm install fails:**
```cmd
npm install --legacy-peer-deps
```

**If still fails:**
- Delete `node_modules` folder
- Delete `package-lock.json` file
- Try `npm install` again

### Step 3: Configure Database Connection

Edit `.env` file in the `backend` folder:

```
PORT=5000
DB_USER=postgres
DB_PASSWORD=<your_postgres_password>
DB_HOST=localhost
DB_PORT=5432
DB_NAME=ruthrahomes
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=7d
```

**Change `<your_postgres_password>` to the password you set during PostgreSQL installation**

### Step 4: Create Database

Open a new Command Prompt and run:

```cmd
cd C:\Users\Nandha\Desktop\ruthrahomes\backend
psql -U postgres -f database.sql
```

When prompted, enter your PostgreSQL password.

**Verify database was created:**
```cmd
psql -U postgres -d ruthrahomes -c "SELECT 1"
```

Should return: `?column?` with value `1`

### Step 5: Start Backend Server

In Command Prompt, run:

```cmd
cd C:\Users\Nandha\Desktop\ruthrahomes\backend
npm start
```

You should see:
```
Server running on port 5000
```

**Keep this terminal open!**

### Step 6: Start Frontend Server

Open a NEW Command Prompt window and run:

```cmd
cd C:\Users\Nandha\Desktop\ruthrahomes\frontend
python -m http.server 8000
```

You should see:
```
Serving HTTP on 0.0.0.0 port 8000
```

**Keep this terminal open!**

### Step 7: Access Application

Open your web browser and go to:

```
http://localhost:8000
```

---

## Test the Application

### Create Admin Account
1. Click "Sign up"
2. Enter details:
   - Name: Admin User
   - Email: admin@test.com
   - Password: admin123
   - Role: Admin
3. Click "Sign Up"
4. Go to login page
5. Enter credentials and login

### Create Tenant Account
1. Logout
2. Click "Sign up"
3. Enter details:
   - Name: John Doe
   - Email: tenant@test.com
   - Password: tenant123
   - Role: Tenant
4. Click "Sign Up"

### Test Admin Features
1. Login as admin
2. Click "Rooms" - Add a new room (e.g., "101")
3. Click "Tenants" - Add tenant to room
4. Click "Rent Management" - Record a payment

---

## Troubleshooting

### npm install doesn't work
```
1. Check Node.js version:
   node --version
   (Should be v14+)

2. Try clearing npm cache:
   npm cache clean --force

3. Try installing again:
   npm install
```

### PostgreSQL connection error
```
1. Check PostgreSQL is running:
   - Windows Services > PostgreSQL service

2. Verify password in .env:
   DB_PASSWORD=your_password_here

3. Test connection:
   psql -U postgres -d ruthrahomes

4. If "database does not exist":
   psql -U postgres -f backend\database.sql
```

### Port 5000 or 8000 already in use
```
1. Change port in backend:
   Edit backend/.env
   PORT=5001

2. For frontend, use different port:
   python -m http.server 8001
```

### Can't access http://localhost:8000
```
1. Check Python is running:
   Terminal should show "Serving HTTP"

2. Try direct URL:
   http://127.0.0.1:8000

3. Try opening index.html directly:
   file:///C:/Users/Nandha/Desktop/ruthrahomes/frontend/index.html
```

### Login not working
```
1. Make sure you registered first
2. Check email is exact match
3. Check password is exact match
4. Open browser console (F12) for error messages
```

---

## File Structure Reference

```
ruthrahomes/
├── backend/                    # Node.js server
│   ├── config/database.js     # Database config
│   ├── middleware/auth.js     # Auth middleware
│   ├── routes/                # API routes
│   ├── .env                   # Configuration
│   ├── server.js              # Main server
│   ├── package.json           # Dependencies
│   └── database.sql           # Database schema
│
└── frontend/                   # Web interface
    ├── index.html             # Main page
    ├── css/style.css          # Styling
    └── js/                    # JavaScript
```

---

## Quick Reference

| Action | Command |
|--------|---------|
| Install dependencies | `npm install` |
| Start backend | `npm start` |
| Start frontend | `python -m http.server 8000` |
| Setup database | `psql -U postgres -f database.sql` |
| Check backend status | `http://localhost:5000/api/health` |
| Open app | `http://localhost:8000` |
| Stop server | `Ctrl+C` in terminal |

---

## Next Steps

1. ✅ Backend dependencies installed
2. ✅ Database created
3. ✅ Backend running (port 5000)
4. ✅ Frontend running (port 8000)
5. Create admin account
6. Create tenant account
7. Add rooms
8. Add tenants
9. Record payments
10. View dashboards

---

## Support

- **QUICKSTART.md** - Fast setup guide
- **README.md** - Feature overview
- **API_DOCUMENTATION.md** - API reference
- **TROUBLESHOOTING.md** - Problem solutions
- **DATABASE.md** - Database details

Refer to these files for detailed information.

---

## Tips

- Keep both terminal windows open while working
- Don't close them unless you want to stop the servers
- If you restart, repeat Steps 5 & 6 (start backend and frontend)
- Use http://localhost:8000 (not http://localhost:5000)
- Test with Ctrl+F5 if you see cache issues
- Check browser console (F12) if something doesn't work

---

Happy coding! 🚀
