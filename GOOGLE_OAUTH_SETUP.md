# 🔐 Google OAuth Setup Guide

## ✅ OAuth Flow Sudah Terimplementasi

Callback endpoint sudah siap dan akan menangani response dari Google OAuth.

## 🔄 OAuth Flow

```
1. User mengisi Client ID & Client Secret
2. Klik "Hubungkan dengan Google"
3. Redirect ke Google OAuth consent screen
4. User authorize aplikasi
5. Google redirect ke: /api/auth/google/callback?code=...
6. Callback handler process authorization code
7. Exchange code untuk access & refresh tokens (production)
8. Simpan tokens ke database (production)
9. Redirect ke /dashboard/settings?tab=google&success=true
10. Settings page show success notification
```

## 🚀 Quick Test

### 1. Setup Google Cloud Console

1. Buka [Google Cloud Console](https://console.cloud.google.com)
2. Buat project baru atau pilih existing project
3. Enable APIs:
   - Google Drive API
   - Google Sheets API
   - Google Forms API (optional)

### 2. Create OAuth 2.0 Credentials

1. Navigate to: **APIs & Services** → **Credentials**
2. Click **Create Credentials** → **OAuth client ID**
3. Application type: **Web application**
4. Add Authorized redirect URIs:
   ```
   http://localhost:3000/api/auth/google/callback
   https://yourdomain.com/api/auth/google/callback
   ```
5. Copy **Client ID** and **Client Secret**

### 3. Configure in Application

1. Open: `http://localhost:3000/dashboard/settings?tab=google`
2. Paste Client ID and Client Secret
3. Click "Hubungkan dengan Google"
4. Authorize the application
5. You'll be redirected back with success message

## 📝 Scopes yang Diminta

OAuth request meminta permission untuk:

```javascript
const scopes = [
  'https://www.googleapis.com/auth/drive.readonly',       // Read Google Drive files
  'https://www.googleapis.com/auth/spreadsheets.readonly', // Read Google Sheets
  'https://www.googleapis.com/auth/userinfo.email'        // Get user email
]
```

## 🔧 Production Implementation

Untuk production, uncomment code di `app/api/auth/google/callback/route.ts`:

```typescript
// Exchange code untuk access token
const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
  method: 'POST',
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  body: new URLSearchParams({
    code,
    client_id: process.env.GOOGLE_CLIENT_ID!,
    client_secret: process.env.GOOGLE_CLIENT_SECRET!,
    redirect_uri: process.env.GOOGLE_REDIRECT_URI!,
    grant_type: 'authorization_code'
  })
})

const tokens = await tokenResponse.json()

// Get user info
const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
  headers: { Authorization: `Bearer ${tokens.access_token}` }
})

const userInfo = await userInfoResponse.json()

// Save to database
await prisma.integrationSettings.upsert({
  where: { schoolId: currentSchoolId },
  update: {
    googleAccessToken: tokens.access_token,
    googleRefreshToken: tokens.refresh_token,
    googleTokenExpiresAt: new Date(Date.now() + tokens.expires_in * 1000),
    googleConnected: true,
    googleUserEmail: userInfo.email
  },
  create: {
    schoolId: currentSchoolId,
    googleAccessToken: tokens.access_token,
    googleRefreshToken: tokens.refresh_token,
    // ... other fields
  }
})
```

## 🔐 Environment Variables

Add to `.env`:

```env
# Google OAuth
GOOGLE_CLIENT_ID=your_client_id_here.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-your_client_secret_here
GOOGLE_REDIRECT_URI=http://localhost:3000/api/auth/google/callback

# Production
# GOOGLE_REDIRECT_URI=https://yourdomain.com/api/auth/google/callback
```

## 🔄 Token Refresh

Access tokens expire after 1 hour. Implement refresh logic:

```typescript
async function refreshAccessToken(refreshToken: string) {
  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      refresh_token: refreshToken,
      grant_type: 'refresh_token'
    })
  })

  const tokens = await response.json()
  
  // Update access token in database
  await prisma.integrationSettings.update({
    where: { schoolId: currentSchoolId },
    data: {
      googleAccessToken: tokens.access_token,
      googleTokenExpiresAt: new Date(Date.now() + tokens.expires_in * 1000)
    }
  })

  return tokens.access_token
}
```

## 📊 Using Google APIs

### Read Google Sheets

```typescript
async function readGoogleSheet(spreadsheetId: string, range: string) {
  const accessToken = await getAccessToken() // with refresh logic
  
  const response = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}`,
    {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    }
  )

  const data = await response.json()
  return data.values // Returns 2D array
}

// Example usage
const interviewData = await readGoogleSheet(
  '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms',
  'Sheet1!A1:Z100'
)
```

### List Google Drive Files

```typescript
async function listDriveForms() {
  const accessToken = await getAccessToken()
  
  const response = await fetch(
    'https://www.googleapis.com/drive/v3/files?q=mimeType="application/vnd.google-apps.form"',
    {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    }
  )

  const data = await response.json()
  return data.files
}
```

## 🧪 Testing

### Test Connection

Already implemented at: `/api/settings/google/test`

```bash
curl http://localhost:3000/api/settings/google/test
```

### Manual OAuth Test

1. Generate auth URL manually:
```
https://accounts.google.com/o/oauth2/v2/auth?
  client_id=YOUR_CLIENT_ID&
  redirect_uri=http://localhost:3000/api/auth/google/callback&
  response_type=code&
  scope=https://www.googleapis.com/auth/drive.readonly%20https://www.googleapis.com/auth/spreadsheets.readonly&
  access_type=offline&
  prompt=consent
```

2. Paste in browser
3. Authorize
4. Check callback handling

## ⚠️ Common Issues

### Issue 1: "redirect_uri_mismatch"
**Solution**: Make sure redirect URI in code matches exactly what's in Google Console

### Issue 2: "invalid_client"
**Solution**: Check Client ID and Client Secret are correct

### Issue 3: "Access blocked: This app's request is invalid"
**Solution**: App needs to be verified by Google for production use

### Issue 4: Token expired
**Solution**: Implement token refresh logic

## 🔒 Security Best Practices

1. ✅ Never expose Client Secret in frontend code
2. ✅ Store tokens encrypted in database
3. ✅ Use environment variables for credentials
4. ✅ Implement token refresh before expiration
5. ✅ Revoke access when user disconnects
6. ✅ Use HTTPS in production
7. ✅ Implement rate limiting
8. ✅ Log all OAuth activities

## 📞 Support

- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Google Sheets API](https://developers.google.com/sheets/api)
- [Google Drive API](https://developers.google.com/drive/api)

---

**Status**: ✅ OAuth Callback Handler Implemented
**Next**: Implement token exchange and storage in production
