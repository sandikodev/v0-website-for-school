import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

// PUT update school
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    
    const school = await prisma.school.update({
      where: { id: params.id },
      data: {
        name: body.name,
        description: body.description,
        address: body.address,
        phone: body.phone,
        email: body.email,
        website: body.website,
        logo: body.logo,
      },
    })
    
    console.log('✅ School updated:', school.id)
    
    return NextResponse.json({
      success: true,
      data: school,
      message: 'School updated successfully',
    })
    
  } catch (error) {
    console.error('❌ Error updating school:', error)
    
    return NextResponse.json(
      { 
        success: false,
        message: 'Failed to update school',
      },
      { status: 500 }
    )
  }
}

