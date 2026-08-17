# 🚨 Backend Not Accessible - Diagnosis

## What We Know
✅ Backend code has `/api/health` endpoint (confirmed in server.js)
❌ Render returns 404 "not found"

## Possible Causes (in order of likelihood)

### 1. **Backend Service Not Deployed to Render Yet**
- Most likely if this is your first deployment
- Solution: Create a new Web Service on Render

### 2. **Backend Crashed at Startup**
- Probably due to missing environment variables or database connection failure
- Solution: Check Render Logs

### 3. **Wrong Render URL**
- Using incorrect service URL
- Solution: Verify URL matches your Render dashboard

---

## ✅ FIX: Deploy Backend to Render (Steps)

### Step 1: Check if Service Exists on Render

Go to https://render.com/dashboard

**You should see:**
- A service called `ruthrahomes-backend` OR
- A button to create a new service

If you see the service, go to **Step 2**
If you don't see it, follow **Step 3**

---

### Step 2: If Service Exists - Check Status & Logs

1. Click the `ruthrahomes-backend` service
2. Look at the top - what color is the status?
   - 🟢 Green "Live" = Deployed
   - 🟡 Yellow "Building" = Currently deploying
   - 🔴 Red "Failed" = Deployment error
   - ⚫ Gray = Not running

3. Click the **Logs** tab (on the right)
4. Scroll down - what's the last message?
   - Look for errors like "Cannot connect to database"
   - Or "Error: listen EADDRINUSE" (port already in use)
   - Share the error message if you see one

---

### Step 3: If Service Doesn't Exist - Create It

1. Go to https://render.com/dashboard
2. Click **New +** button (top right)
3. Select **Web Service**
4. Sign in with GitHub
5. Find your repo: `ruthrahomes` (or search by name)
6. Click **Connect**
7. Fill in:
   - **Name:** `ruthrahomes-backend`
   - **Branch:** `main`
   - **Root Directory:** `backend` ← IMPORTANT!
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Plan:** `Free`

8. Click **Create Web Service**
9. Go to **Step 4** below

---

### Step 4: Add Environment Variables

1. Go to your service on Render
2. Click **Settings** (left sidebar)
3. Scroll to **Environment Variables**
4. Click **Add Environment Variable** for each:

| Key | Value |
|-----|-------|
| `DB_USER` | `postgres` |
| `DB_PASSWORD` | `password` |
| `DB_HOST` | `localhost` (or your actual PostgreSQL IP) |
| `DB_PORT` | `5432` |
| `DB_NAME` | `ruthrahomes` |
| `JWT_SECRET` | Generate below ↓ |
| `JWT_EXPIRE` | `7d` |
| `PORT` | `5000` |

**Generate JWT_SECRET (PowerShell):**
```powershell
-join ((65..90) + (97..122) | Get-Random -Count 32 | % {[char]$_})
```
Copy the output (random string) and paste as JWT_SECRET value.

5. Click **Save Changes**
6. Service will restart automatically
7. Wait 3-5 minutes for deployment

---

### Step 5: Verify Backend is Running

Wait 5 minutes, then:

1. Visit: `https://ruthrahomes-backend.onrender.com/api/health`
2. You should see: `{"status":"OK"}`
3. If still 404, check Render Logs for errors

---

## 🔍 Troubleshooting

### Error: "Cannot GET /api/health"
- Backend is running but route not found
- **Fix:** Make sure you're using correct URL (check Render dashboard for actual URL)

### Error: "502 Bad Gateway"
- Backend crashed on startup
- **Fix:** Check Render Logs for error messages

### Error: "Blank page / no response"
- Backend not deployed yet OR taking time to build
- **Fix:** Wait 5 minutes, refresh page

### Error: "Cannot connect to database"
- PostgreSQL connection failed
- **Fix:** Verify DB_* environment variables are correct, PostgreSQL is running

---

## 📋 Checklist

- [ ] Service `ruthrahomes-backend` exists on Render
- [ ] Service status is 🟢 "Live"
- [ ] All environment variables added (DB_*, JWT_SECRET)
- [ ] Logs show: "Server running on port 5000"
- [ ] `/api/health` returns `{"status":"OK"}`

**Do these steps and let me know if you still get 404!**
