import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSPMBSettings } from "@/lib/spmb/getSPMBSettings";

/**
 * Extract year from academic year string (e.g., "2025/2026" -> 2025)
 */
function extractYearFromAcademicYear(academicYear: string): number {
  // Format: "2025/2026" or "2026/2027"
  const match = academicYear.match(/^(\d{4})\/\d{4}$/);
  if (match) {
    return parseInt(match[1], 10);
  }
  // Fallback to current year if format is invalid
  return new Date().getFullYear();
}

// Generate registration number
function generateRegistrationNumber(year: number): string {
  const random = Math.floor(Math.random() * 9999)
    .toString()
    .padStart(4, "0");
  return `SPMB-${year}-${random}`;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Get first school
    const school = await prisma.school.findFirst();

    if (!school) {
      return NextResponse.json(
        { success: false, message: "School not found" },
        { status: 404 },
      );
    }

    // Get academic year from SPMB settings
    const spmbSettings = await getSPMBSettings();
    const registrationYear = extractYearFromAcademicYear(spmbSettings.academicYear);

    // Generate unique registration number
    let registrationNumber = generateRegistrationNumber(registrationYear);
    let existing = await prisma.formSubmission.findUnique({
      where: { registrationNumber },
    });

    // Regenerate if duplicate (very rare)
    while (existing) {
      registrationNumber = generateRegistrationNumber(registrationYear);
      existing = await prisma.formSubmission.findUnique({
        where: { registrationNumber },
      });
    }

    // Create submission
    const submission = await prisma.formSubmission.create({
      data: {
        registrationNumber,
        schoolId: school.id,

        // Data Siswa
        namaLengkap: body.namaLengkap || "",
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
        uploadedFiles: body.uploadedFiles
          ? JSON.stringify(body.uploadedFiles)
          : null,

        // Raw data (untuk custom fields)
        rawData: JSON.stringify(body),

        status: "pending",
      },
    });

    return NextResponse.json({
      success: true,
      message: "Pendaftaran berhasil dikirim",
      data: {
        id: submission.id,
        registrationNumber: submission.registrationNumber,
      },
    });
  } catch (error) {
    console.error("Error submitting form:", error);
    return NextResponse.json(
      { success: false, message: "Gagal mengirim pendaftaran" },
      { status: 500 },
    );
  }
}
