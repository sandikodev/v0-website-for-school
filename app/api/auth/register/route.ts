import { NextRequest, NextResponse } from 'next/server'
import { AuthService } from '@/lib/auth'
import { RegisterSchema } from '@/lib/validations'

// Register API endpoint
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate input
    const validatedData = RegisterSchema.parse(body)
    
    // Register user
    const user = await AuthService.register(validatedData)
    
    return NextResponse.json({
      success: true,
      message: 'Registrasi berhasil',
      user,
    })
    
  } catch (error) {
    console.error('Register error:', error)
    
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
