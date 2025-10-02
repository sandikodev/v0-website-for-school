import { NextRequest, NextResponse } from 'next/server'
import { AuthService } from '@/lib/auth'
import { LoginSchema, RegisterSchema } from '@/lib/validations'

// Login API endpoint
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate input
    const validatedData = LoginSchema.parse(body)
    
    // Authenticate user
    const user = await AuthService.login(validatedData)
    
    // Create response
    const response = NextResponse.json({
      success: true,
      message: 'Login berhasil',
      user,
    })
    
    // Set session cookie (simple implementation)
    response.cookies.set('user-session', JSON.stringify({
      id: user.id,
      username: user.username,
      role: user.role,
    }), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })
    
    return response
    
  } catch (error) {
    console.error('Login error:', error)
    
    if (error instanceof Error) {
      return NextResponse.json(
        { 
          success: false, 
          message: error.message 
        },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { 
        success: false, 
        message: 'Terjadi kesalahan server' 
      },
      { status: 500 }
    )
  }
}
