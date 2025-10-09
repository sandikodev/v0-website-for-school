import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'

// Simple login API endpoint for testing
export async function POST(request: NextRequest) {
  try {
    console.log('🔐 Login request received')
    
    const body = await request.json()
    console.log('📋 Request body:', { username: body.username })
    
    const { username, password } = body
    
    if (!username || !password) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Username dan password harus diisi' 
        },
        { status: 400 }
      )
    }
    
    console.log('🔍 Finding user:', username)
    
    // Find user
    const user = await prisma.user.findUnique({
      where: { username: username.trim() },
    })
    
    console.log('👤 User found:', user ? 'Yes' : 'No')
    
    if (!user) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Username atau password salah' 
        },
        { status: 401 }
      )
    }
    
    // Check if user is active
    if (!user.isActive) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Akun tidak aktif' 
        },
        { status: 401 }
      )
    }
    
    console.log('🔑 Verifying password...')
    
    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password)
    
    console.log('✅ Password valid:', isValidPassword)
    
    if (!isValidPassword) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Username atau password salah' 
        },
        { status: 401 }
      )
    }
    
    // Remove password from response
    const { password: _, ...userWithoutPassword } = user
    
    console.log('✅ Login successful for user:', user.username)
    
    // Create response
    const response = NextResponse.json({
      success: true,
      message: 'Login berhasil',
      user: userWithoutPassword,
    })
    
    // Set session cookie
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
    console.error('❌ Login error:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        message: error instanceof Error ? error.message : 'Terjadi kesalahan server' 
      },
      { status: 500 }
    )
  }
}
