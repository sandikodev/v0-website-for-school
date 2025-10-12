import { NextRequest, NextResponse } from 'next/server'

// Import google config status
async function getGoogleStatus() {
  try {
    const response = await fetch('http://localhost:3000/api/settings/google', {
      cache: 'no-store'
    })
    const result = await response.json()
    return result.data
  } catch {
    return {
      clientId: "",
      redirectUri: "http://localhost:3000/api/auth/google/callback",
      status: {
        connected: false,
        lastSync: null,
        accountEmail: null
      }
    }
  }
}

// Mock storage untuk demo (dalam production gunakan database)
const mockSettings = {
  wordpress: {
    url: "",
    username: "",
    status: {
      connected: false,
      lastSync: null,
      accountName: null
    }
  },
  academic: {
    apiUrl: "",
    schoolCode: "",
    status: {
      connected: false,
      lastSync: null,
      accountName: null
    }
  }
}

export async function GET(request: NextRequest) {
  try {
    // Get Google status from its own storage
    const googleStatus = await getGoogleStatus()
    
    // Dalam production, ambil dari database berdasarkan user session
    return NextResponse.json({
      success: true,
      data: {
        google: googleStatus,
        ...mockSettings
      },
      message: "Settings retrieved successfully"
    })
  } catch (error) {
    console.error('Error fetching settings:', error)
    return NextResponse.json(
      { success: false, message: "Failed to fetch settings" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Update mock settings
    Object.assign(mockSettings, body)

    return NextResponse.json({
      success: true,
      data: mockSettings,
      message: "Settings updated successfully"
    })
  } catch (error) {
    console.error('Error updating settings:', error)
    return NextResponse.json(
      { success: false, message: "Failed to update settings" },
      { status: 500 }
    )
  }
}
