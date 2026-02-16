import type { RegistrarSubmissionDTO } from "@/lib/registrar/types";

// Required fields for validation
export const REQUIRED_BIODATA: Array<keyof RegistrarSubmissionDTO> = [
  "namaLengkap",
  "jenisKelamin",
  "tanggalLahir",
  "noHP",
  "alamatLengkap",
  "email",
];

export const REQUIRED_PARENTS: Array<keyof RegistrarSubmissionDTO> = [
  "namaAyah",
  "pekerjaanAyah",
  "namaIbu",
  "pekerjaanIbu",
  "asalSekolah",
];

// Count missing required fields
export function countMissing(
  submission: RegistrarSubmissionDTO,
  fields: Array<keyof RegistrarSubmissionDTO>
): number {
  return fields.filter((key) => {
    const value = submission[key] as unknown as string | null | undefined;
    return !(typeof value === "string" ? value.trim() : value);
  }).length;
}

// Calculate missing counts
export function calculateMissingCounts(submission: RegistrarSubmissionDTO) {
  return {
    biodata: countMissing(submission, REQUIRED_BIODATA),
    parents: countMissing(submission, REQUIRED_PARENTS),
    documents: Math.max(0, 1 - (submission.uploadedFiles?.length ?? 0)),
  };
}

// Get badge className and text
export function getBadgeProps(missing: number, variant: "screen" | "print" = "screen") {
  const baseClasses =
    variant === "print"
      ? "print-badge rounded-full border px-2 py-0.5 text-xs font-medium"
      : "rounded-full px-2 py-0.5 text-xs font-medium";

  if (missing <= 0) {
    return {
      className:
        variant === "print"
          ? `${baseClasses} border-emerald-600 text-emerald-700`
          : `${baseClasses} bg-emerald-100 text-emerald-700`,
      text: "Lengkap",
    };
  }

  return {
    className:
      variant === "print"
        ? `${baseClasses} border-yellow-600 text-yellow-800`
        : `${baseClasses} bg-yellow-100 text-yellow-800`,
    text: `Perlu Data (${missing})`,
  };
}

// Get verification badge className and text
export function getVerificationBadgeProps(
  file: { verified?: boolean },
  variant: "screen" | "print" = "screen"
) {
  const baseClasses =
    variant === "print"
      ? "print-badge rounded-full border px-1.5 py-0.5 text-[10px] font-medium"
      : "rounded-full px-2 py-0.5 text-[11px] font-medium";

  if (!("verified" in file)) {
    return {
      className:
        variant === "print"
          ? `${baseClasses} border-slate-600 text-slate-700`
          : `${baseClasses} bg-slate-100 text-slate-700`,
      text: "Belum diverifikasi",
    };
  }

  if (file.verified) {
    return {
      className:
        variant === "print"
          ? `${baseClasses} border-emerald-600 text-emerald-700`
          : `${baseClasses} bg-emerald-100 text-emerald-700`,
      text: "Terverifikasi",
    };
  }

  return {
    className:
      variant === "print"
        ? `${baseClasses} border-yellow-600 text-yellow-800`
        : `${baseClasses} bg-yellow-100 text-yellow-800`,
    text: "Menunggu Verifikasi",
  };
}