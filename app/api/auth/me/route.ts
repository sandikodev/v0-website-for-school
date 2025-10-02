import { NextRequest, NextResponse } from 'next/server'
import { AuthService } from '@/lib/auth'

// Get current user API endpoint
export async function GET(request: NextRequest) {
  try {
    // Get session from cookie
    const sessionCookie = request.cookies.get('user-session')
    
    if (!sessionCookie) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Tidak ada sesi aktif' 
        },
        { status: 401 }
      )
    }
    
    // Parse session data
    const sessionData = JSON.parse(sessionCookie.value)
    
    // Get user data from database
    const user = await AuthService.getUserById(sessionData.id)
    
    if (!user) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'User tidak ditemukan' 
        },
        { status: 404 }
      )
    }
    
    return NextResponse.json({
      success: true,
      user,
    })
    
  } catch (error) {
    console.error('Get user error:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        message: 'Terjadi kesalahan server' 
      },
      { status: 500 }
    )
  }
}
