export type RegistrarStatus = "PENDING" | "ACCEPTED" | "REJECTED";

export interface UploadedFileDTO {
  filename: string;
  originalName: string;
  url: string;
  size: number;
  type: string;
  verified?: boolean;
}

export interface RegistrarSubmissionDTO {
  id: string;
  registrationNumber: string;
  status: RegistrarStatus;
  namaLengkap: string;
  jenisKelamin?: string | null;
  tempatLahir?: string | null;
  tanggalLahir?: string | null;
  alamatLengkap?: string | null;
  email?: string | null;
  noHP?: string | null;
  noHPOrangtua?: string | null;
  namaAyah?: string | null;
  pekerjaanAyah?: string | null;
  namaIbu?: string | null;
  pekerjaanIbu?: string | null;
  asalSekolah?: string | null;
  alamatSekolah?: string | null;
  jalurPendaftaran?: string | null;
  jalurPendaftaranName?: string | null;
  gelombangPendaftaran?: string | null;
  gelombangPendaftaranName?: string | null;
  prestasi?: string | null;
  uploadedFiles: UploadedFileDTO[];
  createdAt: string;
  reviewedAt: string | null;
  reviewedBy?: string | null;
  notes?: string | null;
}

export type InterviewSessionStatus =
  | "PENDING"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "REVIEWED"
  | "FAILED"
  | "RESCHEDULED";

export interface InterviewSessionDTO {
  id: string;
  type: string;
  status: InterviewSessionStatus;
  scheduledDate?: string;
  completedDate?: string;
  slug?: string | null;
  googleFormUrl: string;
  deadline?: string;
  score?: number | null;
  grade?: string | null;
  feedback?: string | null;
  notes?: string | null;
}


