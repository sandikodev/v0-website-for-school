import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET single contact setting by type
export async function GET(
  request: NextRequest,
  { params }: { params: { type: string } }
) {
  try {
    const setting = await prisma.contactSetting.findUnique({
      where: { type: params.type },
    })

    if (!setting) {
      return NextResponse.json(
        { success: false, message: 'Contact setting not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, data: setting })
  } catch (error) {
    console.error('Error fetching contact setting:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to fetch contact setting' },
      { status: 500 }
    )
  }
}

// PUT - Update contact setting
export async function PUT(
  request: NextRequest,
  { params }: { params: { type: string } }
) {
  try {
    const body = await request.json()
    const { phoneNumber, label, description, waTemplate, isActive } = body

    const setting = await prisma.contactSetting.update({
      where: { type: params.type },
      data: {
        phoneNumber,
        label,
        description,
        waTemplate,
        isActive,
      },
    })

    return NextResponse.json({ success: true, data: setting })
  } catch (error) {
    console.error('Error updating contact setting:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to update contact setting' },
      { status: 500 }
    )
  }
}

