"use server";

import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getSchoolConfig } from "@/lib/school/getSchoolConfig";
import { getSPMBSettings } from "@/lib/spmb/getSPMBSettings";
import {
  SignupUploadedFilePayload,
  SignupValues,
  SignupFormSchema,
  buildSignupSchema,
  signupSchema,
} from "./schema";

type PersistedSignupValues = {
  namaLengkap: string;
  tempatLahir: string;
  tanggalLahir: string;
  jenisKelamin: string;
  alamatLengkap: string;
  noHP: string;
  email: string;
  namaAyah: string;
  pekerjaanAyah: string;
  namaIbu: string;
  pekerjaanIbu: string;
  noHPOrangtua: string;
  asalSekolah: string;
  alamatSekolah: string;
  prestasi: string;
  jalurPendaftaran: string;
  gelombangPendaftaran: string;
  persetujuan: boolean;
};

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

function generateRegistrationNumber(year: number): string {
  const random = Math.floor(Math.random() * 9999)
    .toString()
    .padStart(4, "0");
  return `SPMB-${year}-${random}`;
}

async function ensureSchool() {
  const existing = await prisma.school.findFirst();
  if (existing) {
    return existing;
  }

  const config = await getSchoolConfig();

  return prisma.school.create({
    data: {
      name: config.schoolName,
      description: null,
      address: config.address ?? "",
      phone: null,
      email: config.contactEmail ?? null,
      website: null,
      logo: config.logoUrl ?? null,
    },
  });
}

export async function submitForm(
  values: SignupValues,
  uploadedFiles: SignupUploadedFilePayload[],
  schemaConfig?: SignupFormSchema,
) {
  const schema = schemaConfig ? buildSignupSchema(schemaConfig) : signupSchema;
  const parsed = schema.safeParse(values);
  if (!parsed.success) {
    console.error(parsed.error.flatten());
    throw new Error("Data formulir tidak valid. Mohon periksa kembali.");
  }

  const school = await ensureSchool();

  // Get academic year from SPMB settings
  const spmbSettings = await getSPMBSettings();
  const registrationYear = extractYearFromAcademicYear(spmbSettings.academicYear);

  let registrationNumber = generateRegistrationNumber(registrationYear);
  while (
    await prisma.formSubmission.findUnique({ where: { registrationNumber } })
  ) {
    registrationNumber = generateRegistrationNumber(registrationYear);
  }

  const submissionValues = parsed.data as PersistedSignupValues;

  const toNullable = (value?: string | null) =>
    value && value.trim().length > 0 ? value : null;

  const submissionPayload: Prisma.FormSubmissionUncheckedCreateInput = {
    registrationNumber,
    schoolId: school.id,
    namaLengkap: submissionValues.namaLengkap,
    tempatLahir: submissionValues.tempatLahir,
    tanggalLahir: submissionValues.tanggalLahir,
    jenisKelamin: submissionValues.jenisKelamin,
    alamatLengkap: submissionValues.alamatLengkap,
    noHP: toNullable(submissionValues.noHP),
    email: toNullable(submissionValues.email),
    namaAyah: submissionValues.namaAyah,
    pekerjaanAyah: submissionValues.pekerjaanAyah,
    namaIbu: submissionValues.namaIbu,
    pekerjaanIbu: submissionValues.pekerjaanIbu,
    noHPOrangtua: submissionValues.noHPOrangtua,
    asalSekolah: submissionValues.asalSekolah,
    alamatSekolah: toNullable(submissionValues.alamatSekolah),
    prestasi: toNullable(submissionValues.prestasi),
    jalurPendaftaran: submissionValues.jalurPendaftaran,
    gelombangPendaftaran: submissionValues.gelombangPendaftaran,
    uploadedFiles: uploadedFiles.length
      ? JSON.stringify(uploadedFiles)
      : null,
    rawData: JSON.stringify(parsed.data),
    status: "pending",
  };

  const submission = await prisma.formSubmission.create({
    data: submissionPayload,
  });

  return {
    id: submission.id,
    registrationNumber: submission.registrationNumber,
  };
}

