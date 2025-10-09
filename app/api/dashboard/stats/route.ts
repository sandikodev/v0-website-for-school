import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

// Get dashboard statistics
export async function GET() {
  try {
    console.log('📊 Fetching dashboard stats...')
    
    // Get counts from database
    const [
      totalStudents,
      totalApplications,
      totalMessages,
    ] = await Promise.all([
      prisma.student.count(),
      prisma.application.count({ where: { status: 'pending' } }),
      prisma.message.count({ where: { read: false } }),
    ])
    
    // For now, we'll use mock data for teachers
    const totalTeachers = 45 // TODO: Add Teacher model later
    
    const stats = {
      totalStudents,
      totalTeachers,
      totalApplications,
      totalMessages,
    }
    
    console.log('✅ Dashboard stats:', stats)
    
    return NextResponse.json({
      success: true,
      data: stats,
    })
    
  } catch (error) {
    console.error('❌ Error fetching dashboard stats:', error)
    
    return NextResponse.json(
      { 
        success: false,
        message: 'Failed to fetch dashboard statistics',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

