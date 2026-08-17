# ⚡ QUICK REFERENCE CARD

## 🚀 START HERE (Choose Your Path)

### Path A: I want step-by-step instructions
→ Read **WINDOWS_SETUP.md** (20 minutes)

### Path B: I'm familiar with development
→ Read **QUICKSTART.md** (10 minutes)

### Path C: I prefer watching a checklist
→ Follow **SETUP_OVERVIEW.md** section "Step-by-Step First Run"

---

## ⚙️ SETUP CHECKLIST

- [ ] **Node.js v14+** installed → `node --version`
- [ ] **PostgreSQL v12+** running → `psql --version`
- [ ] **Python 3** installed → `python --version`
- [ ] Project folder exists → `C:\Users\Nandha\Desktop\ruthrahomes`

---

## 📝 SETUP COMMANDS (Copy & Paste)

### 1. Install Backend Dependencies
```bash
cd C:\Users\Nandha\Desktop\ruthrahomes\backend
npm install
```

### 2. Create Database
```bash
psql -U postgres -f database.sql
```

### 3. Start Backend (Keep Open!)
```bash
cd C:\Users\Nandha\Desktop\ruthrahomes\backend
npm start
```
*Should show: "Server running on port 5000"*

### 4. Start Frontend (New Terminal)
```bash
cd C:\Users\Nandha\Desktop\ruthrahomes\frontend
python -m http.server 8000
```
*Should show: "Serving HTTP on 0.0.0.0 port 8000"*

### 5. Open Browser
```
http://localhost:8000
```

---

## 🔑 TEST LOGIN

```
Admin Account:
  Email: admin@example.com
  Password: admin123

Tenant Account:
  Email: tenant@example.com
  Password: tenant123
```

(Create these by clicking "Sign up" first)

---

## 📋 VERIFY EVERYTHING WORKS

| Check | Expected | Command |
|-------|----------|---------|
| Backend | Running | http://localhost:5000/api/health |
| Frontend | Loading | http://localhost:8000 |
| Database | Exists | `psql -U postgres -d ruthrahomes -c "SELECT 1"` |

---

## 🆘 EMERGENCY HELP

**Backend won't start?**
- Check PostgreSQL is running
- Check .env file has correct password
- Check port 5000 isn't in use

**Can't access frontend?**
- Check Python server is running
- Try http://127.0.0.1:8000
- Try http://localhost:8000/index.html

**Login not working?**
- Make sure you registered first
- Check email/password are exact
- Open console (F12) for error messages

**Database not found?**
- Run: `psql -U postgres -f backend\database.sql`
- Verify PostgreSQL service is running

---

## 📂 FILE STRUCTURE (30 seconds)

```
ruthrahomes/
├── backend/           ← Backend code (Node.js)
│   ├── server.js      ← Main server
│   ├── database.sql   ← Database schema
│   └── routes/        ← API endpoints
│
├── frontend/          ← Frontend code (HTML/CSS/JS)
│   ├── index.html     ← Main page
│   ├── css/           ← Styling
│   └── js/            ← Logic
│
└── docs/              ← Documentation
    ├── README.md      ← Overview
    ├── WINDOWS_SETUP.md ← Setup guide
    ├── API_DOCUMENTATION.md ← API ref
    └── TROUBLESHOOTING.md ← Help
```

---

## 🔗 IMPORTANT LINKS

| What | URL |
|------|-----|
| App | http://localhost:8000 |
| Backend API | http://localhost:5000/api |
| Health Check | http://localhost:5000/api/health |

---

## 📞 DOCUMENTATION QUICK MAP

| Need | Read |
|------|------|
| Setup instructions | WINDOWS_SETUP.md |
| API reference | API_DOCUMENTATION.md |
| Database help | DATABASE.md |
| Production deploy | DEPLOYMENT.md |
| Error solutions | TROUBLESHOOTING.md |
| Complete overview | PROJECT_SUMMARY.md |

---

## 🎯 FIRST FEATURES TO TEST

1. **Register** - Create admin & tenant accounts
2. **Add Room** - Admin: Add a new room (e.g., "101")
3. **Add Tenant** - Admin: Add tenant to room
4. **View Dashboard** - Admin: See statistics
5. **Record Payment** - Admin: Record a rent payment
6. **Tenant Portal** - Tenant: View own rent info
7. **View History** - Admin/Tenant: View payment history

---

## ⏱️ EXPECTED TIME

- Setup: 5-10 minutes
- First account creation: 2 minutes
- First test: 2 minutes
- **Total: 10-15 minutes**

---

## 🎮 KEYBOARD SHORTCUTS

| Action | Shortcut |
|--------|----------|
| Open Console | F12 |
| Hard Refresh | Ctrl+Shift+Delete |
| Clear Cache | Ctrl+Shift+Delete |
| Stop Server | Ctrl+C (in terminal) |
| New Terminal | Ctrl+` (in VS Code) |

---

## 📊 DATABASE LOGIN

```
Host: localhost
Port: 5432
User: postgres
Password: (from PostgreSQL setup)
Database: ruthrahomes
```

To access:
```bash
psql -U postgres -d ruthrahomes
```

---

## 💾 DATABASE COMMANDS

```sql
-- View all users
SELECT * FROM users;

-- View all rooms
SELECT * FROM rooms;

-- View all tenants
SELECT * FROM tenants;

-- View all payments
SELECT * FROM rent_payments;

-- Check database size
SELECT pg_size_pretty(pg_database_size('ruthrahomes'));
```

---

## 🚨 TROUBLESHOOTING QUICK FIXES

| Problem | Solution |
|---------|----------|
| Port in use | Change PORT in `.env` |
| DB password error | Update DB_PASSWORD in `.env` |
| npm install fails | Try `npm install --legacy-peer-deps` |
| Can't access frontend | Check Python server is running |
| Data gone | Restore from backup or recreate DB |
| App won't load | Clear browser cache (Ctrl+Shift+Delete) |

---

## 📱 BROWSER CONSOLE DEBUGGING

```javascript
// Check if token exists
localStorage.getItem('token')

// Clear all data
localStorage.clear()

// Check current user
localStorage.getItem('user')

// View network requests
// Press F12 → Network tab
```

---

## 🎯 SUCCESS CRITERIA

✅ You're done when:
- [ ] Backend server running (port 5000)
- [ ] Frontend server running (port 8000)
- [ ] Can access http://localhost:8000
- [ ] Can register new account
- [ ] Can login
- [ ] Can add room
- [ ] Can add tenant
- [ ] Can record payment
- [ ] Can view dashboard

---

## 📞 STILL STUCK?

1. Read **TROUBLESHOOTING.md** for your specific issue
2. Check browser console (F12) for error messages
3. Check backend terminal for server errors
4. Verify prerequisites are installed
5. Try restarting backend and frontend
6. Delete `node_modules` and reinstall

---

## 🎓 LEARNING RESOURCES

- **JavaScript**: https://developer.mozilla.org/en-US/docs/Web/JavaScript
- **Express.js**: https://expressjs.com/
- **PostgreSQL**: https://www.postgresql.org/docs/
- **REST APIs**: https://restfulapi.net/

---

## 💡 PRO TIPS

1. Keep two terminal windows open (one for backend, one for frontend)
2. Don't close terminals until you're done working
3. Use Ctrl+F5 to hard refresh browser if things look wrong
4. Check console (F12) first if something doesn't work
5. Read error messages carefully - they often say what's wrong
6. Bookmark this card for quick reference

---

## 🏁 YOU'RE READY!

Follow the setup commands above and you'll have a fully working rental management system in 15 minutes.

**Enjoy coding!** 🚀

---

## 📋 NOTES SECTION

Write your own notes here:

```
_________________________________
_________________________________
_________________________________
_________________________________
_________________________________
```

---

**Last Updated**: 2026-08-15
**Version**: 1.0.0
**Status**: Complete & Ready
