import { NextRequest, NextResponse } from 'next/server'

// Logout API endpoint
export async function POST(request: NextRequest) {
  try {
    // Create response
    const response = NextResponse.json({
      success: true,
      message: 'Logout berhasil',
    })
    
    // Clear session cookie
    response.cookies.set('user-session', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0, // Expire immediately
    })
    
    return response
    
  } catch (error) {
    console.error('Logout error:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        message: 'Terjadi kesalahan server' 
      },
      { status: 500 }
    )
  }
}
