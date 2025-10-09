import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

// PUT update application status
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    
    const application = await prisma.application.update({
      where: { id: params.id },
      data: {
        status: body.status,
        notes: body.notes,
      },
    })
    
    console.log('✅ Application updated:', application.id, '- Status:', application.status)
    
    return NextResponse.json({
      success: true,
      data: application,
      message: 'Application status updated successfully',
    })
    
  } catch (error) {
    console.error('❌ Error updating application:', error)
    
    return NextResponse.json(
      { 
        success: false,
        message: 'Failed to update application',
      },
      { status: 500 }
    )
  }
}

