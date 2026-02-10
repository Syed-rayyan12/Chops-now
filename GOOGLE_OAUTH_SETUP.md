# Google OAuth Setup & Troubleshooting

## Error: "invalid_grant" or "Bad Request"

This error typically occurs when there's a mismatch in OAuth configuration. Follow these steps to fix it:

### 1. Check Google Cloud Console Configuration

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project
3. Navigate to: **APIs & Services** > **Credentials**
4. Find your OAuth 2.0 Client ID

### 2. Verify Authorized Redirect URIs

**CRITICAL**: The redirect URIs must match EXACTLY (including http/https, port, trailing slash)

Add these redirect URIs to your OAuth client:

#### For Local Development:
```
http://localhost:3000/auth/callback
```

#### For Production:
```
https://yourdomain.com/auth/callback
```

**Note**: The redirect URI in the Google Console must match the one your app sends to Google.

### 3. Check Environment Variables

Make sure your `.env` file in the `Backend` folder has:

```env
GOOGLE_CLIENT_ID=your-client-id-here.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret-here
```

### 4. Common Causes of "invalid_grant"

1. **Redirect URI Mismatch**: 
   - ❌ Wrong: `http://localhost:3000` 
   - ✅ Correct: `http://localhost:3000/auth/callback`

2. **HTTP vs HTTPS**:
   - Local: Use `http://localhost:3000/auth/callback`
   - Production: Use `https://yourdomain.com/auth/callback`

3. **Authorization Code Already Used**:
   - Codes can only be used once
   - If page reloads, it tries to use the same code again
   - Solution: The app now prevents double processing

4. **Code Expired**:
   - Authorization codes expire in 10 minutes
   - Don't keep the callback page open too long

5. **Wrong Port Number**:
   - If your frontend runs on `http://localhost:3001`, use that in Google Console
   - Check your browser's address bar for the actual port

### 5. Testing OAuth Locally

1. Start Backend: `cd Backend && npm run dev`
2. Start Frontend: `npm run dev`
3. Note which port the frontend is running on (usually 3000)
4. Add `http://localhost:PORTNUMBER/auth/callback` to Google Console
5. Test the OAuth flow

### 6. Debug Logs

The application now shows detailed logs. Check your:

**Backend logs** (terminal running `npm run dev` in Backend folder):
```
🔑 OAuth Request Details:
- Role: RIDER
- Code (first 20 chars): 4/0AdEu5BW...
- Redirect URI: http://localhost:3000/auth/callback
- Client ID: 840672697083-...
```

**Frontend logs** (browser console, press F12):
```
🔄 Exchanging Google code for token...
Role: RIDER
Redirect URI: http://localhost:3000/auth/callback
```

**If you see an error**:
```
❌ Google token exchange failed:
- Status: 400
- Error: invalid_grant
- Description: Bad Request
- Redirect URI used: http://localhost:3000/auth/callback

⚠️ Common causes:
1. Redirect URI mismatch (must match exactly in Google Console)
2. Authorization code already used or expired
3. Client ID/Secret mismatch
```

### 7. Step-by-Step Fix

1. **Copy the exact redirect URI from the error log**
2. **Go to Google Cloud Console** → APIs & Services → Credentials
3. **Click on your OAuth 2.0 Client ID**
4. **Under "Authorized redirect URIs"**, add EXACTLY: 
   ```
   http://localhost:3000/auth/callback
   ```
5. **Click SAVE**
6. **Wait 5 minutes** for changes to propagate
7. **Try OAuth again**

### 8. Production Deployment

When deploying to production:

1. Add your production domain to Google Console:
   ```
   https://yourdomain.com/auth/callback
   ```

2. Update your environment variables with production values

3. Ensure your domain uses HTTPS (required by Google)

### 9. Testing Checklist

- [ ] Backend is running and shows `✅ OAuth routes loaded`
- [ ] Frontend is running on the correct port
- [ ] Redirect URI in Google Console matches EXACTLY
- [ ] Environment variables are set correctly
- [ ] Using the correct Google Client ID in the code
- [ ] Authorization code is fresh (not reused)
- [ ] Waited 5 minutes after changing Google Console settings

### 10. Still Not Working?

Check these:

1. **Clear browser cache** and cookies
2. **Try incognito/private mode**
3. **Verify the Google Client ID** in your code matches the one in Google Console
4. **Check if OAuth consent screen** is configured in Google Console
5. **Ensure your Google account** has access to the OAuth app

### Need Help?

If you're still stuck, check the console logs for specific error details. The app now provides comprehensive debugging information.
