import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

// GET all applications
export async function GET() {
  try {
    console.log('📋 Fetching applications...')
    
    const applications = await prisma.application.findMany({
      include: {
        student: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            grade: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
    
    console.log(`✅ Found ${applications.length} applications`)
    
    return NextResponse.json({
      success: true,
      data: applications,
    })
    
  } catch (error) {
    console.error('❌ Error fetching applications:', error)
    
    return NextResponse.json(
      { 
        success: false,
        message: 'Failed to fetch applications',
      },
      { status: 500 }
    )
  }
}

