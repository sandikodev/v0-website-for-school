"use server";

import { prisma } from "@/lib/prisma";
import { getSPMBSettings } from "@/lib/spmb/getSPMBSettings";

export interface RegistrarUploadedFile {
  filename: string;
  originalName: string;
  size: number;
  type: string;
  url: string;
}

export interface RegistrarSubmission {
  id: string;
  registrationNumber: string;
  namaLengkap: string;
  email: string | null;
  noHP: string | null;
  tempatLahir: string | null;
  tanggalLahir: string | null;
  jenisKelamin: string | null;
  alamatLengkap: string | null;
  namaAyah: string | null;
  pekerjaanAyah: string | null;
  namaIbu: string | null;
  pekerjaanIbu: string | null;
  noHPOrangtua: string | null;
  asalSekolah: string | null;
  alamatSekolah: string | null;
  prestasi: string | null;
  jalurPendaftaran: string | null;
  jalurPendaftaranName: string | null;
  gelombangPendaftaran: string | null;
  gelombangPendaftaranName: string | null;
  notes: string | null;
  status: string;
  createdAt: string;
  reviewedAt: string | null;
  reviewedBy: string | null;
  uploadedFiles: RegistrarUploadedFile[];
}

function parseUploadedFiles(value: string | null): RegistrarUploadedFile[] {
  if (!value) {
    return [];
  }

  try {
    const parsed = JSON.parse(value) as RegistrarUploadedFile[];
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed.filter(
      (file) =>
        typeof file === "object" &&
        file !== null &&
        typeof file.filename === "string" &&
        typeof file.originalName === "string" &&
        typeof file.url === "string",
    );
  } catch {
    return [];
  }
}

export async function getSubmissionByRegistrationNumber(
  registrationNumber: string,
): Promise<RegistrarSubmission | null> {
  if (!registrationNumber) {
    return null;
  }

  const submission = await prisma.formSubmission.findUnique({
    where: { registrationNumber },
  });

  if (!submission) {
    return null;
  }

  // Resolve jalur and gelombang names from settings
  const settings = await getSPMBSettings();
  const jalurName = submission.jalurPendaftaran
    ? settings.jalurData.find((j) => j.id === submission.jalurPendaftaran)
        ?.name || submission.jalurPendaftaran
    : null;
  const gelombangName = submission.gelombangPendaftaran
    ? settings.gelombangData.find(
        (g) => g.id === submission.gelombangPendaftaran,
      )?.name || submission.gelombangPendaftaran
    : null;

  return {
    id: submission.id,
    registrationNumber: submission.registrationNumber,
    namaLengkap: submission.namaLengkap,
    email: submission.email ?? null,
    noHP: submission.noHP ?? null,
    tempatLahir: submission.tempatLahir ?? null,
    tanggalLahir: submission.tanggalLahir ?? null,
    jenisKelamin: submission.jenisKelamin ?? null,
    alamatLengkap: submission.alamatLengkap ?? null,
    namaAyah: submission.namaAyah ?? null,
    pekerjaanAyah: submission.pekerjaanAyah ?? null,
    namaIbu: submission.namaIbu ?? null,
    pekerjaanIbu: submission.pekerjaanIbu ?? null,
    noHPOrangtua: submission.noHPOrangtua ?? null,
    asalSekolah: submission.asalSekolah ?? null,
    alamatSekolah: submission.alamatSekolah ?? null,
    prestasi: submission.prestasi ?? null,
    jalurPendaftaran: submission.jalurPendaftaran ?? null,
    jalurPendaftaranName: jalurName,
    gelombangPendaftaran: submission.gelombangPendaftaran ?? null,
    gelombangPendaftaranName: gelombangName,
    notes: submission.notes ?? null,
    status: submission.status,
    createdAt: submission.createdAt.toISOString(),
    reviewedAt: submission.reviewedAt
      ? submission.reviewedAt.toISOString()
      : null,
    reviewedBy: submission.reviewedBy ?? null,
    uploadedFiles: parseUploadedFiles(submission.uploadedFiles),
  };
}

