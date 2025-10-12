import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // Dalam production, test koneksi ke Google API
    // Untuk demo, simulasi test berhasil
    
    // Simulasi delay
    await new Promise(resolve => setTimeout(resolve, 1000))

    return NextResponse.json({
      success: true,
      message: "Google connection test successful",
      data: {
        status: "connected",
        apiAccess: {
          drive: true,
          sheets: true,
          forms: true
        }
      }
    })
  } catch (error) {
    console.error('Error testing Google connection:', error)
    return NextResponse.json(
      { success: false, message: "Google connection test failed" },
      { status: 500 }
    )
  }
}
