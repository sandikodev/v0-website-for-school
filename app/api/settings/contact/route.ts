import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET all contact settings
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const type = searchParams.get('type') // 'call_center' or 'admissions'

    const where = type ? { type } : {}
    
    const settings = await prisma.contactSetting.findMany({
      where,
      orderBy: { type: 'asc' }
    })

    return NextResponse.json({ success: true, data: settings })
  } catch (error) {
    console.error('Error fetching contact settings:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to fetch contact settings' },
      { status: 500 }
    )
  }
}

// POST - Create new contact setting (optional, biasanya sudah dari seed)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, phoneNumber, label, description, waTemplate, isActive } = body

    const setting = await prisma.contactSetting.create({
      data: {
        type,
        phoneNumber,
        label,
        description,
        waTemplate: waTemplate || '',
        isActive: isActive ?? true,
      },
    })

    return NextResponse.json({ success: true, data: setting })
  } catch (error) {
    console.error('Error creating contact setting:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to create contact setting' },
      { status: 500 }
    )
  }
}

