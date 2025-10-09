import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Get current user API endpoint
export async function GET(request: NextRequest) {
  try {
    console.log('👤 /api/auth/me request received')
    
    // Get session cookie
    const sessionCookie = request.cookies.get('user-session')
    
    if (!sessionCookie) {
      console.log('❌ No session cookie found')
      return NextResponse.json(
        { success: false, message: 'Not authenticated' },
        { status: 401 }
      )
    }
    
    const session = JSON.parse(sessionCookie.value)
    console.log('📋 Session:', { id: session.id, username: session.username })
    
    // Get user from database
    const user = await prisma.user.findUnique({
      where: { id: session.id },
    })
    
    if (!user) {
      console.log('❌ User not found in database')
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      )
    }
    
    if (!user.isActive) {
      console.log('❌ User is not active')
      return NextResponse.json(
        { success: false, message: 'User not active' },
        { status: 401 }
      )
    }
    
    // Remove password from response
    const { password: _, ...userWithoutPassword } = user
    
    console.log('✅ User authenticated:', user.username)
    
    return NextResponse.json({
      success: true,
      user: userWithoutPassword,
    })
    
  } catch (error) {
    console.error('❌ /api/auth/me error:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        message: error instanceof Error ? error.message : 'Internal server error' 
      },
      { status: 500 }
    )
  }
}
