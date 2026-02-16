import { KB_SIZE, DATE_FORMAT_OPTIONS } from "./constants";

export function formatFileSize(bytes: number): string {
  return `${(bytes / KB_SIZE).toFixed(1)} KB`;
}

export function formatDate(
  date: Date | string,
  locale = "id-ID"
): string {
  return new Date(date).toLocaleDateString(locale, DATE_FORMAT_OPTIONS);
}

export function formatDateTime(
  date: Date | string,
  locale = "id-ID"
): string {
  return new Date(date).toLocaleString(locale);
}

export function formatTTL(
  tempatLahir?: string | null,
  tanggalLahir?: string | null
): string {
  if (tempatLahir) {
    return tanggalLahir ? `${tempatLahir}, ${tanggalLahir}` : tempatLahir;
  }
  return tanggalLahir || "-";
}

