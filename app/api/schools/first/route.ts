import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

// GET first school
export async function GET() {
  try {
    const school = await prisma.school.findFirst()
    
    if (!school) {
      return NextResponse.json({
        success: false,
        message: 'No school found',
      }, { status: 404 })
    }
    
    return NextResponse.json({
      success: true,
      data: school,
    })
    
  } catch (error) {
    console.error('❌ Error fetching school:', error)
    
    return NextResponse.json(
      { 
        success: false,
        message: 'Failed to fetch school',
      },
      { status: 500 }
    )
  }
}

