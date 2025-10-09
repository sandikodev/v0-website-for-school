import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

// GET single student
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const student = await prisma.student.findUnique({
      where: { id: params.id },
      include: {
        school: true,
        applications: true,
        messages: true,
      },
    })
    
    if (!student) {
      return NextResponse.json({
        success: false,
        message: 'Student not found',
      }, { status: 404 })
    }
    
    return NextResponse.json({
      success: true,
      data: student,
    })
    
  } catch (error) {
    console.error('❌ Error fetching student:', error)
    
    return NextResponse.json(
      { 
        success: false,
        message: 'Failed to fetch student',
      },
      { status: 500 }
    )
  }
}

// PUT update student
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    
    const student = await prisma.student.update({
      where: { id: params.id },
      data: {
        name: body.name,
        email: body.email,
        phone: body.phone,
        grade: body.grade,
        birthDate: body.birthDate ? new Date(body.birthDate) : null,
        parentName: body.parentName,
        parentPhone: body.parentPhone,
        address: body.address,
        status: body.status,
      },
    })
    
    console.log('✅ Student updated:', student.id)
    
    return NextResponse.json({
      success: true,
      data: student,
      message: 'Student updated successfully',
    })
    
  } catch (error) {
    console.error('❌ Error updating student:', error)
    
    return NextResponse.json(
      { 
        success: false,
        message: 'Failed to update student',
      },
      { status: 500 }
    )
  }
}

// DELETE student
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Delete related records first
    await prisma.message.deleteMany({
      where: { studentId: params.id },
    })
    
    await prisma.application.deleteMany({
      where: { studentId: params.id },
    })
    
    // Delete student
    await prisma.student.delete({
      where: { id: params.id },
    })
    
    console.log('✅ Student deleted:', params.id)
    
    return NextResponse.json({
      success: true,
      message: 'Student deleted successfully',
    })
    
  } catch (error) {
    console.error('❌ Error deleting student:', error)
    
    return NextResponse.json(
      { 
        success: false,
        message: 'Failed to delete student',
      },
      { status: 500 }
    )
  }
}

