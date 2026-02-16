import type { InterviewSessionDTO, RegistrarSubmissionDTO, RegistrarStatus, InterviewSessionStatus } from "./types";
import type { FormSubmission } from "@prisma/client";

export function mapSubmissionToDTO(input: FormSubmission & { 
  uploadedFiles?: unknown;
  jalurPendaftaranName?: string | null;
  gelombangPendaftaranName?: string | null;
}): RegistrarSubmissionDTO {
  return {
    id: input.id,
    registrationNumber: input.registrationNumber,
    status: input.status as RegistrarStatus,
    namaLengkap: input.namaLengkap,
    jenisKelamin: input.jenisKelamin ?? null,
    tempatLahir: input.tempatLahir ?? null,
    tanggalLahir: input.tanggalLahir ?? null,
    alamatLengkap: input.alamatLengkap ?? null,
    email: input.email ?? null,
    noHP: input.noHP ?? null,
    noHPOrangtua: input.noHPOrangtua ?? null,
    namaAyah: input.namaAyah ?? null,
    pekerjaanAyah: input.pekerjaanAyah ?? null,
    namaIbu: input.namaIbu ?? null,
    pekerjaanIbu: input.pekerjaanIbu ?? null,
    asalSekolah: input.asalSekolah ?? null,
    alamatSekolah: input.alamatSekolah ?? null,
    jalurPendaftaran: input.jalurPendaftaran ?? null,
    jalurPendaftaranName: input.jalurPendaftaranName ?? null,
    gelombangPendaftaran: input.gelombangPendaftaran ?? null,
    gelombangPendaftaranName: input.gelombangPendaftaranName ?? null,
    prestasi: input.prestasi ?? null,
    uploadedFiles: Array.isArray(input.uploadedFiles)
      ? input.uploadedFiles.map((f: {
          filename?: string;
          originalName?: string;
          url?: string;
          size?: number;
          type?: string;
          verified?: boolean;
        }) => ({
          filename: f.filename ?? "",
          originalName: f.originalName ?? "",
          url: f.url ?? "",
          size: f.size ?? 0,
          type: f.type ?? "",
          verified: Boolean(f.verified),
        }))
      : [],
    createdAt:
      typeof input.createdAt === "string"
        ? input.createdAt
        : new Date(input.createdAt).toISOString(),
    reviewedAt: input.reviewedAt
      ? typeof input.reviewedAt === "string"
        ? input.reviewedAt
        : new Date(input.reviewedAt).toISOString()
      : null,
    reviewedBy: input.reviewedBy ?? null,
    notes: input.notes ?? null,
  };
}

interface InterviewSessionInput {
  id: string;
  status: string;
  scheduledDate?: Date | string | null;
  completedDate?: Date | string | null;
  notes?: string | null;
  interviewType?: {
    name?: string | null;
    defaultForm?: {
      slug?: string | null;
    } | null;
    googleFormUrl?: string | null;
  } | null;
  result?: {
    score?: number | null;
    grade?: string | null;
    feedback?: string | null;
  } | null;
}

export function mapSessionToDTO(input: InterviewSessionInput): InterviewSessionDTO {
  const typeName = input.interviewType?.name ?? "Interview";
  const slug = input.interviewType?.defaultForm?.slug ?? null;
  
  // Convert dates to strings
  const scheduledDateStr = input.scheduledDate 
    ? typeof input.scheduledDate === "string" 
      ? input.scheduledDate 
      : new Date(input.scheduledDate).toISOString()
    : undefined;
  
  const completedDateStr = input.completedDate 
    ? typeof input.completedDate === "string" 
      ? input.completedDate 
      : new Date(input.completedDate).toISOString()
    : undefined;
  
  return {
    id: input.id,
    type: typeName,
    status: input.status as InterviewSessionStatus,
    scheduledDate: scheduledDateStr,
    completedDate: completedDateStr,
    slug,
    googleFormUrl: input.interviewType?.googleFormUrl ?? "#",
    deadline: scheduledDateStr,
    score: input.result?.score ?? null,
    grade: input.result?.grade ?? null,
    feedback: input.result?.feedback ?? input.notes ?? null,
    notes: input.notes ?? null,
  };
}


