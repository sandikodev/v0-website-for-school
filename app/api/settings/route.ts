import { NextRequest, NextResponse } from 'next/server'

// Mock storage untuk demo (dalam production gunakan database)
const mockSettings = {
  google: {
    clientId: "",
    clientSecret: "",
    redirectUri: "http://localhost:3000/api/auth/google/callback",
    status: {
      connected: false,
      lastSync: null,
      accountEmail: null
    }
  },
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
    // Dalam production, ambil dari database berdasarkan user session
    return NextResponse.json({
      success: true,
      data: mockSettings,
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
