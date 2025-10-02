import { NextRequest, NextResponse } from 'next/server'
import { AuthService } from '@/lib/auth'

// Create admin user API endpoint
export async function POST(request: NextRequest) {
  try {
    // Create default admin user
    const adminUser = await AuthService.register({
      username: 'admin',
      password: 'admin123',
      email: 'admin@school.local',
    })

    // Update user role to admin
    const updatedUser = await AuthService.updateUser(adminUser.id, {
      role: 'admin',
    })

    return NextResponse.json({
      success: true,
      message: 'Admin user created successfully',
      user: updatedUser,
    })
    
  } catch (error) {
    console.error('Create admin error:', error)
    
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
