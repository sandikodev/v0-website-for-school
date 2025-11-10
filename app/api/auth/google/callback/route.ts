import { NextRequest, NextResponse } from 'next/server'
import { updateGoogleConnectionStatus } from '@/app/api/settings/google/route'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')
    const error = searchParams.get('error')

    // Handle error dari Google
    if (error) {
      console.error('Google OAuth error:', error)
      return NextResponse.redirect(
        new URL(`/dashboard/settings?tab=google&error=${encodeURIComponent(error)}`, request.url)
      )
    }

    // Validasi code
    if (!code) {
      return NextResponse.redirect(
        new URL('/dashboard/settings?tab=google&error=no_code', request.url)
      )
    }

    // Dalam production, exchange code untuk access token
    // const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    //   body: new URLSearchParams({
    //     code,
    //     client_id: process.env.GOOGLE_CLIENT_ID!,
    //     client_secret: process.env.GOOGLE_CLIENT_SECRET!,
    //     redirect_uri: process.env.GOOGLE_REDIRECT_URI!,
    //     grant_type: 'authorization_code'
    //   })
    // })

    // const tokens = await tokenResponse.json()

    // if (!tokenResponse.ok) {
    //   throw new Error(tokens.error_description || 'Failed to exchange code')
    // }

    // Get user info dari Google
    // const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
    //   headers: { Authorization: `Bearer ${tokens.access_token}` }
    // })

    // const userInfo = await userInfoResponse.json()

    // Simpan tokens dan user info ke database
    // await saveGoogleIntegration({
    //   accessToken: tokens.access_token,
    //   refreshToken: tokens.refresh_token,
    //   expiresAt: new Date(Date.now() + tokens.expires_in * 1000),
    //   userEmail: userInfo.email,
    //   userName: userInfo.name
    // })

    // Untuk demo, simulasi sukses
    console.log('Google OAuth callback received with code:', code.substring(0, 20) + '...')
    console.log('Scopes granted:', searchParams.get('scope'))

    // Update connection status di mock storage
    const email = searchParams.get('authuser') || 'user@gmail.com'
    updateGoogleConnectionStatus(true, email)

    // Redirect ke settings dengan success message
    return NextResponse.redirect(
      new URL(`/dashboard/settings?tab=google&success=true&email=${encodeURIComponent(email)}`, request.url)
    )
  } catch (error) {
    console.error('Error handling Google OAuth callback:', error)
    return NextResponse.redirect(
      new URL('/dashboard/settings?tab=google&error=callback_failed', request.url)
    )
  }
}
