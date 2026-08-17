# Google OAuth Implementation Code Snippets

This file contains the exact code to add to your frontend for Google OAuth integration.

## Add This to `frontend/js/app.js`

Add the following code **after the API class definition** and **before the event listeners section**:

```javascript
// ============================================================
// Google OAuth Configuration
// ============================================================

// IMPORTANT: Replace with your actual Google Client ID
// Get it from: https://console.cloud.google.com/
const GOOGLE_CLIENT_ID = 'YOUR_GOOGLE_CLIENT_ID_HERE';

/**
 * Handles the response from Google Sign-In
 * @param {Object} response - JWT response from Google
 */
function handleCredentialResponse(response) {
  try {
    // Decode the JWT from Google
    const base64Url = response.credential.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    const googleUser = JSON.parse(jsonPayload);
    
    console.log('Google Sign-In successful:', googleUser);
    
    // Send to backend for verification and JWT generation
    authenticateWithGoogle(googleUser);
  } catch (error) {
    console.error('Error decoding Google credential:', error);
    showMessage('Error processing Google sign-in', 'error');
  }
}

/**
 * Authenticates user with backend using Google credentials
 * @param {Object} googleUser - User data from Google
 */
async function authenticateWithGoogle(googleUser) {
  try {
    // Call backend Google auth endpoint
    const result = await API.googleAuth(
      googleUser.email, 
      googleUser.name, 
      'tenant',  // Default role; users can be promoted to admin by admin
      googleUser.sub  // Google's unique user ID
    );
    
    if (result.token) {
      // Store authentication data
      localStorage.setItem('token', result.token);
      localStorage.setItem('userRole', result.user.role);
      currentUser = result.user;
      
      showMessage('Google sign-in successful!', 'success');
      
      // Reload page after 1 second to trigger dashboard load
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } else {
      showMessage(result.message || 'Google authentication failed', 'error');
    }
  } catch (error) {
    console.error('Google authentication error:', error);
    showMessage('Error during authentication', 'error');
  }
}

/**
 * Initialize Google Sign-In when the page loads
 */
window.addEventListener('load', () => {
  if (window.google && window.google.accounts && window.google.accounts.id) {
    google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: handleCredentialResponse,
      // Show One Tap UX if user is not signed in
      auto_select: false
    });
  } else {
    console.warn('Google Sign-In library not loaded');
  }
});

// ============================================================
// End Google OAuth Configuration
// ============================================================
```

---

## Update the Login Page HTML

In `frontend/index.html`, replace the existing Google login button section with:

```html
<!-- In the login-page div, find and replace this section: -->

<!-- OLD CODE (Remove this):
<button type="button" id="google-login-btn" class="btn btn-google btn-block">Continue with Google</button>
-->

<!-- NEW CODE (Add this): -->
<div id="google-signin-button" class="google-signin-container"></div>

<!-- Script to render Google Button -->
<script>
  window.addEventListener('load', () => {
    // Render the Google Sign-In button
    if (window.google && window.google.accounts && window.google.accounts.id) {
      google.accounts.id.renderButton(
        document.getElementById('google-signin-button'),
        { 
          theme: 'outline', 
          size: 'large', 
          width: '100%',
          type: 'standard',
          text: 'signin_with'
        }
      );
    }
  });
</script>
```

---

## Update CSS (Optional - for styling)

Add this to `frontend/css/style.css` to style the Google button container:

```css
.google-signin-container {
  display: flex;
  justify-content: center;
  margin: 20px 0;
  width: 100%;
}

.google-signin-container > div {
  width: 100% !important;
}

.google-signin-container iframe {
  width: 100% !important;
}
```

---

## How It Works

1. **User clicks Google button** → Google Sign-In popup appears
2. **User signs in with Google** → Google returns JWT token
3. **`handleCredentialResponse()` is called** → Decodes Google JWT
4. **`authenticateWithGoogle()` is called** → Sends email & name to backend
5. **Backend creates/finds user** → Returns JWT token
6. **Token is stored** → localStorage saves token and user role
7. **Page reloads** → App reads token from localStorage
8. **Dashboard loads** → User sees their dashboard based on role

---

## Testing the Flow

### Locally:

```bash
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Frontend
cd frontend
python -m http.server 8000
```

1. Visit `http://localhost:8000`
2. Click "Sign in with Google" button
3. Follow Google sign-in flow
4. You should see success message and be redirected to dashboard

### Production:

Once you've:
1. ✅ Set up Google OAuth credentials
2. ✅ Updated `GOOGLE_CLIENT_ID` in your code
3. ✅ Added authorization URLs in Google Cloud Console
4. ✅ Deployed to Vercel and Render

Visit your Vercel URL and follow the same flow.

---

## Troubleshooting

### "Google is not defined"
- Ensure `https://accounts.google.com/gsi/client` is loaded in `index.html`
- Check browser console for script loading errors
- Try hard refresh: `Ctrl+Shift+R`

### "Invalid Client ID"
- Go to Google Cloud Console
- Copy the exact Client ID again
- Paste it (without extra spaces) as `GOOGLE_CLIENT_ID`
- Hard refresh browser

### Google button not rendering
- Verify the `<div id="google-signin-button">` exists in HTML
- Check that Google library is loaded: type `google` in console
- Verify `GOOGLE_CLIENT_ID` is set (not the placeholder text)

### CORS error when calling backend
- Ensure Vercel URL is added to CORS origins in `backend/server.js`
- Check backend is running and accessible
- Verify API URL in `frontend/js/api.js` is correct

### User creates account but no dashboard appears
- Check browser console for errors
- Verify backend is returning token
- Check localStorage has `token` and `userRole` saved
- Try manual page reload

---

## What Gets Saved

When a user signs in with Google, the following is created/updated:

**In Database:**
- `email`: From Google account
- `full_name`: From Google account
- `password`: Hashed placeholder (for Google auth users)
- `role`: Defaults to 'tenant' (admin can promote)
- `created_at`: Current timestamp

**In Browser (localStorage):**
- `token`: JWT for API authentication
- `userRole`: 'admin' or 'tenant' (for routing)

**User sees:**
- Admin dashboard if `role === 'admin'`
- Tenant dashboard if `role === 'tenant'`

