import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // Dalam production, test koneksi ke WordPress REST API
    // Untuk demo, simulasi test berhasil
    
    // Simulasi delay
    await new Promise(resolve => setTimeout(resolve, 1000))

    return NextResponse.json({
      success: true,
      message: "WordPress connection test successful",
      data: {
        status: "connected",
        apiVersion: "WP REST API v2",
        capabilities: {
          posts: true,
          media: true,
          categories: true,
          tags: true
        }
      }
    })
  } catch (error) {
    console.error('Error testing WordPress connection:', error)
    return NextResponse.json(
      { success: false, message: "WordPress connection test failed" },
      { status: 500 }
    )
  }
}
