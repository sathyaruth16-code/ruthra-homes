# Google OAuth Setup & Production Deployment Guide

## 🔑 Phase 1: Google OAuth Configuration

### Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click **Select a Project** → **New Project**
3. Name it `Ruthra Homes` and click **Create**
4. Wait for the project to be created (1-2 minutes)

### Step 2: Enable Google Sign-In API

1. In Google Cloud Console, go to **APIs & Services** → **Library**
2. Search for **Google Identity Services**
3. Click **Google Identity Services** API
4. Click **Enable**

### Step 3: Create OAuth 2.0 Credentials

1. Go to **APIs & Services** → **Credentials**
2. Click **+ Create Credentials** → **OAuth 2.0 Client ID**
3. Choose **Web application**
4. Fill in the following:

**Name:** Ruthra Homes Frontend

**Authorized JavaScript origins:**
- `http://localhost:8000`
- `http://localhost:3000`
- `https://ruthrahomes.vercel.app` (update with your actual Vercel URL)

**Authorized redirect URIs:**
- `http://localhost:8000`
- `http://localhost:3000`
- `https://ruthrahomes.vercel.app`

5. Click **Create**
6. Copy your **Client ID** (you'll need this for the frontend)

---

## 🛠️ Phase 2: Frontend Setup

### Step 1: Get Google Client ID

Use the Client ID from Phase 1, Step 3, Step 6.

### Step 2: Update index.html

Add Google Sign-In library to your `frontend/index.html`:

```html
<!-- Add this inside the <head> tag, right before </head> -->
<script src="https://accounts.google.com/gsi/client" async defer></script>
```

### Step 3: Update API Configuration

In `frontend/js/api.js`, update your **Render backend URL**:

```javascript
const RENDER_BACKEND_URL = 'https://your-render-backend-url.onrender.com';
```

Replace `your-render-backend-url` with your actual Render service name.

### Step 4: Initialize Google Sign-In

Add this to `frontend/js/app.js` after the API class definition and before DOM event listeners:

```javascript
// Google OAuth Configuration
const GOOGLE_CLIENT_ID = 'YOUR_GOOGLE_CLIENT_ID_HERE';

function handleCredentialResponse(response) {
  // Decode JWT to get user info
  const base64Url = response.credential.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));
  const googleUser = JSON.parse(jsonPayload);
  
  // Send to backend for verification and JWT generation
  authenticateWithGoogle(googleUser);
}

async function authenticateWithGoogle(googleUser) {
  try {
    const result = await API.googleAuth(
      googleUser.email, 
      googleUser.name, 
      'tenant',
      googleUser.sub
    );
    
    if (result.token) {
      localStorage.setItem('token', result.token);
      localStorage.setItem('userRole', result.user.role);
      currentUser = result.user;
      
      showMessage('Google sign-in successful!', 'success');
      
      // Reload page to trigger proper dashboard load
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } else {
      showMessage(result.message || 'Google sign-in failed', 'error');
    }
  } catch (error) {
    console.error('Google auth error:', error);
    showMessage('Error during Google sign-in', 'error');
  }
}

window.onload = function() {
  // Initialize Google Sign-In button
  google.accounts.id.initialize({
    client_id: GOOGLE_CLIENT_ID,
    callback: handleCredentialResponse
  });
};
```

### Step 5: Update Login Page HTML

Replace the Google login button section with:

```html
<!-- In login-page div, replace the google button with: -->
<div id="google-signin-button" class="google-signin-container"></div>

<script>
window.addEventListener('load', () => {
  if (window.google && window.google.accounts && window.google.accounts.id) {
    google.accounts.id.renderButton(
      document.getElementById('google-signin-button'),
      { theme: 'outline', size: 'large', width: '100%' }
    );
  }
});
</script>
```

---

## 🚀 Phase 3: Backend Configuration

### Step 1: Update CORS Origins

In `backend/server.js`, update the CORS configuration with your actual Vercel URL:

```javascript
app.use(cors({
  origin: [
    'http://localhost:8000',
    'http://localhost:3000',
    'https://ruthrahomes.vercel.app'  // Update with your Vercel URL
  ],
  credentials: true
}));
```

### Step 2: Set Environment Variables

Create/update `.env` file in the backend folder:

```
JWT_SECRET=your_strong_jwt_secret_here
JWT_EXPIRE=7d
DATABASE_URL=postgresql://user:password@localhost:5432/ruthrahomes
PORT=5000
```

**Generate a strong JWT Secret** using PowerShell:
```powershell
-join ((65..90) + (97..122) | Get-Random -Count 32 | % {[char]$_})
```

### Step 3: Verify Google Auth Route

The backend already has the Google auth endpoint. Ensure `/api/auth/google` accepts:
- `email` (string)
- `full_name` (string)
- `role` (optional, defaults to 'tenant')
- `google_id` (optional, for reference)

---

## 📦 Phase 4: Render Deployment

### Step 1: Prepare Backend for Render

1. Push your code to GitHub
2. Go to [Render.com](https://render.com/)
3. Click **New +** → **Web Service**
4. Connect your GitHub repository
5. Fill in:
   - **Name:** `ruthrahomes-backend`
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`

### Step 2: Add Environment Variables on Render

In Render dashboard:
1. Go to your service → **Environment**
2. Add variables:
   - `JWT_SECRET`: [Use the one you generated]
   - `JWT_EXPIRE`: `7d`
   - `DATABASE_URL`: [Your PostgreSQL connection string]

### Step 3: Deploy

Click **Deploy** and wait for the build to complete (2-5 minutes)

**Copy your Render URL** (e.g., `https://ruthrahomes-backend.onrender.com`)

---

## 🌐 Phase 5: Vercel Deployment

### Step 1: Prepare Frontend for Vercel

1. Push your frontend code to GitHub (if not already done)
2. Go to [Vercel.com](https://vercel.com/)
3. Click **New Project** → Connect your repository
4. Select your frontend folder (or entire repo)
5. Click **Deploy**

### Step 2: Update Environment Variables in Vercel

After deployment:
1. Go to **Settings** → **Environment Variables**
2. Add: `VITE_API_BASE` or configure in your build

**Or**, update `frontend/js/api.js` with the Render URL you got in Phase 4, Step 3

### Step 3: Final Configuration

Update `frontend/js/api.js`:

```javascript
const RENDER_BACKEND_URL = 'https://ruthrahomes-backend.onrender.com';
```

And update `frontend/js/app.js` with your Google Client ID:

```javascript
const GOOGLE_CLIENT_ID = 'YOUR_CLIENT_ID_FROM_PHASE_1';
```

---

## 🔍 Phase 6: Testing

### Local Testing

1. **Backend:**
   ```bash
   cd backend
   npm install
   npm run dev
   ```

2. **Frontend:**
   - Open `frontend/index.html` in your browser at `http://localhost:8000`
   - Click "Continue with Google"
   - Verify login works and token is saved

### Production Testing

1. Visit `https://ruthrahomes.vercel.app`
2. Click "Continue with Google"
3. Verify authentication works

---

## 🐛 Troubleshooting

### Google Sign-In Button Not Appearing
- ✅ Check if `https://accounts.google.com/gsi/client` is loaded
- ✅ Verify `GOOGLE_CLIENT_ID` is correct
- ✅ Check browser console for errors

### CORS Errors
- ✅ Verify Vercel URL is added to backend CORS
- ✅ Check backend is running
- ✅ Verify `RENDER_BACKEND_URL` is correct

### Token Validation Fails
- ✅ Ensure `JWT_SECRET` is the same on frontend and backend
- ✅ Check token expiration in `.env`

### Google Auth Returns Error
- ✅ Verify Google credentials JSON is valid
- ✅ Check `/api/auth/google` endpoint is working
- ✅ Ensure user email is accessible from Google token

---

## 📋 Checklist for Production

- [ ] Google OAuth app created and credentials obtained
- [ ] `GOOGLE_CLIENT_ID` updated in `frontend/js/app.js`
- [ ] Google Sign-In library added to `index.html`
- [ ] `RENDER_BACKEND_URL` updated in `frontend/js/api.js`
- [ ] CORS origins updated in `backend/server.js`
- [ ] Environment variables set on Render
- [ ] Environment variables set on Vercel
- [ ] Backend deployed to Render
- [ ] Frontend deployed to Vercel
- [ ] Google Sign-In button tested on production
- [ ] Full login → dashboard flow tested

---

## 📞 Quick Reference URLs

| Service | URL | Purpose |
|---------|-----|---------|
| Google Cloud Console | https://console.cloud.google.com/ | OAuth setup |
| Render Dashboard | https://render.com/dashboard | Backend deployment |
| Vercel Dashboard | https://vercel.com/dashboard | Frontend deployment |
| Local Backend | http://localhost:5000 | Development API |
| Local Frontend | http://localhost:8000 | Development UI |

