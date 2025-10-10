import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { defaultFormSchema } from '@/lib/form-schema'

export async function GET() {
  try {
    // Get first school
    const school = await prisma.school.findFirst()
    
    if (!school) {
      return NextResponse.json(
        { success: false, message: 'School not found' },
        { status: 404 }
      )
    }

    // Get active form configuration
    const activeConfig = await prisma.formConfiguration.findFirst({
      where: {
        schoolId: school.id,
        isActive: true,
      },
      orderBy: {
        updatedAt: 'desc',
      },
    })

    // If no active config, return default schema
    if (!activeConfig) {
      return NextResponse.json({
        success: true,
        data: {
          id: null,
          name: 'Default Form',
          schema: defaultFormSchema,
          isActive: false,
        },
      })
    }

    // Parse schema JSON
    const schema = JSON.parse(activeConfig.schema)

    return NextResponse.json({
      success: true,
      data: {
        id: activeConfig.id,
        name: activeConfig.name,
        description: activeConfig.description,
        schema,
        isActive: activeConfig.isActive,
        updatedAt: activeConfig.updatedAt,
      },
    })
  } catch (error) {
    console.error('Error fetching active form:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}

