import { NextRequest, NextResponse } from 'next/server'

// Mock storage (dalam production gunakan database)
let googleConfig = {
  clientId: "",
  clientSecret: "",
  redirectUri: "http://localhost:3000/api/auth/google/callback",
  accessToken: null,
  refreshToken: null,
  status: {
    connected: false,
    lastSync: null,
    accountEmail: null
  }
}

// Export function untuk update status dari callback
export function updateGoogleConnectionStatus(connected: boolean, email: string) {
  googleConfig.status = {
    connected,
    lastSync: connected ? new Date() : null,
    accountEmail: connected ? email : null
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { clientId, clientSecret, redirectUri } = body

    // Validasi
    if (!clientId || !clientSecret) {
      return NextResponse.json(
        { success: false, message: "Client ID and Client Secret are required" },
        { status: 400 }
      )
    }

    // Simpan konfigurasi
    googleConfig.clientId = clientId
    googleConfig.clientSecret = clientSecret
    googleConfig.redirectUri = redirectUri || googleConfig.redirectUri

    // Generate OAuth URL
    const scopes = [
      'https://www.googleapis.com/auth/drive.readonly',
      'https://www.googleapis.com/auth/spreadsheets.readonly',
      'https://www.googleapis.com/auth/userinfo.email'
    ]

    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
      `client_id=${encodeURIComponent(clientId)}` +
      `&redirect_uri=${encodeURIComponent(googleConfig.redirectUri)}` +
      `&response_type=code` +
      `&scope=${encodeURIComponent(scopes.join(' '))}` +
      `&access_type=offline` +
      `&prompt=consent`

    return NextResponse.json({
      success: true,
      data: {
        authUrl,
        message: "Configuration saved. Redirecting to Google..."
      }
    })
  } catch (error) {
    console.error('Error saving Google config:', error)
    return NextResponse.json(
      { success: false, message: "Failed to save Google configuration" },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Reset konfigurasi
    googleConfig = {
      clientId: "",
      clientSecret: "",
      redirectUri: "http://localhost:3000/api/auth/google/callback",
      accessToken: null,
      refreshToken: null,
      status: {
        connected: false,
        lastSync: null,
        accountEmail: null
      }
    }

    return NextResponse.json({
      success: true,
      message: "Google integration disconnected successfully"
    })
  } catch (error) {
    console.error('Error disconnecting Google:', error)
    return NextResponse.json(
      { success: false, message: "Failed to disconnect Google" },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    return NextResponse.json({
      success: true,
      data: {
        clientId: googleConfig.clientId ? `${googleConfig.clientId.substring(0, 20)}...` : "",
        redirectUri: googleConfig.redirectUri,
        status: googleConfig.status
      }
    })
  } catch (error) {
    console.error('Error fetching Google config:', error)
    return NextResponse.json(
      { success: false, message: "Failed to fetch Google configuration" },
      { status: 500 }
    )
  }
}
