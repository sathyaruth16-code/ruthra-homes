# 🚀 Backend Deployment Guide - Render

## Problem
Your Vercel frontend cannot connect to your Render backend due to:
1. Backend not deployed yet, OR
2. Backend deployed but environment variables not set

## ✅ Step 1: Check Your Render Service Status

1. Go to [Render Dashboard](https://render.com/dashboard)
2. Find your `ruthrahomes-backend` service
3. Check the status:
   - ✅ "Live" = Deployed and running
   - 🔄 "Building" = Currently deploying
   - ❌ "Failed" = Deployment failed
   - ⚠️ "Render Suspended" = Service sleeping (free tier)

## ✅ Step 2: Add Environment Variables to Render

**If your service is "Live":**

1. Click on your `ruthrahomes-backend` service
2. Go to **Settings** (left sidebar)
3. Scroll to **Environment Variables**
4. Add these variables:

| Key | Value | Example |
|-----|-------|---------|
| `DB_USER` | Your PostgreSQL username | `postgres` |
| `DB_PASSWORD` | Your PostgreSQL password | `your-password` |
| `DB_HOST` | Your PostgreSQL host | `localhost` or IP address |
| `DB_PORT` | PostgreSQL port | `5432` |
| `DB_NAME` | Database name | `ruthrahomes` |
| `JWT_SECRET` | 32+ character random string | See below to generate |
| `JWT_EXPIRE` | Token expiration | `7d` |
| `PORT` | Server port | `5000` |

**Generate a strong JWT_SECRET:**
```powershell
# Run this in PowerShell
-join ((65..90) + (97..122) | Get-Random -Count 32 | % {[char]$_})
```

5. Click **Save Changes**
6. Service will restart automatically

## ✅ Step 3: Redeploy Backend (if not deployed yet)

**If you don't have a service on Render yet:**

1. Go to [Render.com](https://render.com/)
2. Click **New +** → **Web Service**
3. Connect your GitHub repository
4. Fill in:
   - **Name:** `ruthrahomes-backend`
   - **Environment:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Plan:** Free
5. Click **Create Web Service**
6. Wait 5-10 minutes for deployment
7. Copy the URL (e.g., `https://ruthrahomes-backend.onrender.com`)

**If you already have a service:**

1. Go to Render Dashboard
2. Click your service
3. Click **Settings** (left sidebar)
4. Scroll to **Redeploy**
5. Click **Manual Deploy** → **Deploy latest commit**
6. Wait for deployment to complete

## ✅ Step 4: Update Frontend with Correct Backend URL

In `frontend/js/api.js`:

```javascript
// Update this with your actual Render backend URL
const RENDER_BACKEND_URL = 'https://ruthrahomes-backend.onrender.com';
```

Make sure it matches your actual Render service URL (not the placeholder).

## ✅ Step 5: Verify Backend is Working

### Test 1: Health Check
Open this in browser:
```
https://ruthrahomes-backend.onrender.com/api/health
```
You should see: `{"status":"OK"}`

### Test 2: Check CORS Headers
Run this in terminal:
```bash
curl -i https://ruthrahomes-backend.onrender.com/api/health
```

Look for:
```
Access-Control-Allow-Origin: https://ruthra-homes.vercel.app
```

## 🐛 Troubleshooting

### Error: "502 Bad Gateway" on Render

**Cause:** Backend is crashing, probably due to:
- Database connection failed
- Missing environment variables
- Port conflict

**Fix:**
1. Click your service on Render
2. Go to **Logs** tab
3. Look for error messages
4. Common fixes:
   - Verify DATABASE_URL is correct
   - Check JWT_SECRET is set
   - Ensure PostgreSQL is running

### Error: "CORS error" on Frontend

**Cause:** Backend doesn't have Vercel URL in CORS origins

**Fix:**
1. Check `backend/server.js` has `https://ruthra-homes.vercel.app`
2. Verify Vercel URL is spelled correctly
3. Redeploy backend to Render with `git push`
4. Wait 5 minutes for Render to redeploy

### Error: "Cannot reach database"

**Cause:** Database URL is wrong or database is down

**Fix:**
1. Verify PostgreSQL is running
2. Test connection locally: `psql -U username -h host -d ruthrahomes`
3. Update DB_* environment variables on Render
4. Restart service: Go to Settings → **Manual Restart**

## ✅ Deployment Checklist

- [ ] Backend deployed on Render (status = "Live")
- [ ] All environment variables set on Render:
  - [ ] DB_USER
  - [ ] DB_PASSWORD
  - [ ] DB_HOST
  - [ ] DB_PORT
  - [ ] DB_NAME
  - [ ] JWT_SECRET (32+ characters)
  - [ ] JWT_EXPIRE
- [ ] Frontend has correct RENDER_BACKEND_URL
- [ ] CORS includes `https://ruthra-homes.vercel.app`
- [ ] Backend redeploy done (`git push`)
- [ ] Health check returns `{"status":"OK"}`

## 📞 If Still Having Issues

1. **Check Render Logs:**
   - Service → Logs tab
   - Look for any error messages
   - Copy the error and share it

2. **Test Locally First:**
   ```bash
   cd backend
   npm run dev
   ```
   Visit `http://localhost:5000/api/health`
   Should show: `{"status":"OK"}`

3. **Check Network:**
   - Frontend DevTools → Network tab
   - Try signing in with Google
   - Look for the API request to `api/auth/google`
   - Check the response headers for `Access-Control-Allow-Origin`
