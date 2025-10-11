import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET SPMB settings
export async function GET() {
  try {
    let settings = await prisma.sPMBSetting.findUnique({
      where: { id: 'default' }
    })

    // If no settings exist, create default
    if (!settings) {
      settings = await prisma.sPMBSetting.create({
        data: {
          id: 'default',
          academicYear: '2025/2026',
          registrationOpen: true,
          heroTitle: 'SPMB SMP IT MASJID SYUHADA',
          heroSubtitle: 'TAHUN PELAJARAN 2025/2026',
          gelombangData: '[]',
          jalurData: '[]',
          biayaData: '{}',
          syaratData: '[]',
          wawancaraData: '{}'
        }
      })
    }

    // Parse JSON fields
    const parsed = {
      ...settings,
      gelombangData: JSON.parse(settings.gelombangData),
      jalurData: JSON.parse(settings.jalurData),
      biayaData: JSON.parse(settings.biayaData),
      syaratData: JSON.parse(settings.syaratData),
      wawancaraData: JSON.parse(settings.wawancaraData)
    }

    return NextResponse.json({ success: true, data: parsed })
  } catch (error) {
    console.error('Error fetching SPMB settings:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to fetch SPMB settings' },
      { status: 500 }
    )
  }
}

// PUT - Update SPMB settings
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      academicYear,
      registrationOpen,
      heroTitle,
      heroSubtitle,
      heroDescription,
      gelombangData,
      jalurData,
      biayaData,
      syaratData,
      wawancaraData,
      schoolAddress,
      schoolPhone,
      schoolEmail
    } = body

    const settings = await prisma.sPMBSetting.upsert({
      where: { id: 'default' },
      update: {
        academicYear,
        registrationOpen,
        heroTitle,
        heroSubtitle,
        heroDescription,
        gelombangData: JSON.stringify(gelombangData),
        jalurData: JSON.stringify(jalurData),
        biayaData: JSON.stringify(biayaData),
        syaratData: JSON.stringify(syaratData),
        wawancaraData: JSON.stringify(wawancaraData),
        schoolAddress,
        schoolPhone,
        schoolEmail
      },
      create: {
        id: 'default',
        academicYear,
        registrationOpen,
        heroTitle,
        heroSubtitle,
        heroDescription,
        gelombangData: JSON.stringify(gelombangData),
        jalurData: JSON.stringify(jalurData),
        biayaData: JSON.stringify(biayaData),
        syaratData: JSON.stringify(syaratData),
        wawancaraData: JSON.stringify(wawancaraData),
        schoolAddress,
        schoolPhone,
        schoolEmail
      }
    })

    return NextResponse.json({ success: true, data: settings })
  } catch (error) {
    console.error('Error updating SPMB settings:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to update SPMB settings' },
      { status: 500 }
    )
  }
}

