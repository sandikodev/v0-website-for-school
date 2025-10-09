import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

// GET all students
export async function GET(request: NextRequest) {
  try {
    console.log('📚 Fetching students...')
    
    const students = await prisma.student.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    })
    
    console.log(`✅ Found ${students.length} students`)
    
    return NextResponse.json({
      success: true,
      data: students,
    })
    
  } catch (error) {
    console.error('❌ Error fetching students:', error)
    
    return NextResponse.json(
      { 
        success: false,
        message: 'Failed to fetch students',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// POST create new student
export async function POST(request: NextRequest) {
  try {
    console.log('📝 Creating new student...')
    
    const body = await request.json()
    
    const student = await prisma.student.create({
      data: {
        name: body.name,
        email: body.email,
        phone: body.phone,
        grade: body.grade,
        birthDate: body.birthDate ? new Date(body.birthDate) : null,
        parentName: body.parentName,
        parentPhone: body.parentPhone,
        address: body.address,
        status: body.status || 'active',
        schoolId: body.schoolId, // Will need to get this from session/config
      },
    })
    
    console.log('✅ Student created:', student.id)
    
    return NextResponse.json({
      success: true,
      data: student,
      message: 'Student created successfully',
    }, { status: 201 })
    
  } catch (error) {
    console.error('❌ Error creating student:', error)
    
    return NextResponse.json(
      { 
        success: false,
        message: 'Failed to create student',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

