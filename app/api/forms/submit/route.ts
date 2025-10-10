import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Generate registration number
function generateRegistrationNumber(): string {
  const year = new Date().getFullYear()
  const random = Math.floor(Math.random() * 9999).toString().padStart(4, '0')
  return `SPMB-${year}-${random}`
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Get first school
    const school = await prisma.school.findFirst()
    
    if (!school) {
      return NextResponse.json(
        { success: false, message: 'School not found' },
        { status: 404 }
      )
    }

    // Generate unique registration number
    let registrationNumber = generateRegistrationNumber()
    let existing = await prisma.formSubmission.findUnique({
      where: { registrationNumber },
    })

    // Regenerate if duplicate (very rare)
    while (existing) {
      registrationNumber = generateRegistrationNumber()
      existing = await prisma.formSubmission.findUnique({
        where: { registrationNumber },
      })
    }

    // Create submission
    const submission = await prisma.formSubmission.create({
      data: {
        registrationNumber,
        schoolId: school.id,
        
        // Data Siswa
        namaLengkap: body.namaLengkap || '',
        tempatLahir: body.tempatLahir,
        tanggalLahir: body.tanggalLahir,
        jenisKelamin: body.jenisKelamin,
        alamatLengkap: body.alamatLengkap,
        noHP: body.noHP,
        email: body.email,
        
        // Data Orangtua
        namaAyah: body.namaAyah,
        pekerjaanAyah: body.pekerjaanAyah,
        namaIbu: body.namaIbu,
        pekerjaanIbu: body.pekerjaanIbu,
        noHPOrangtua: body.noHPOrangtua,
        
        // Data Sekolah
        asalSekolah: body.asalSekolah,
        alamatSekolah: body.alamatSekolah,
        
        // Data Tambahan
        prestasi: body.prestasi,
        jalurPendaftaran: body.jalurPendaftaran,
        gelombangPendaftaran: body.gelombangPendaftaran,
        
        // Files
        uploadedFiles: body.uploadedFiles ? JSON.stringify(body.uploadedFiles) : null,
        
        // Raw data (untuk custom fields)
        rawData: JSON.stringify(body),
        
        status: 'pending',
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Pendaftaran berhasil dikirim',
      data: {
        id: submission.id,
        registrationNumber: submission.registrationNumber,
      },
    })
  } catch (error) {
    console.error('Error submitting form:', error)
    return NextResponse.json(
      { success: false, message: 'Gagal mengirim pendaftaran' },
      { status: 500 }
    )
  }
}

