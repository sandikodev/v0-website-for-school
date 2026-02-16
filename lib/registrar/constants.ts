import { CheckCircle, Clock, Eye, XCircle } from "lucide-react";

export const STATUS_CONFIG = {
  pending: {
    label: "Pending",
    badge: "border-yellow-200 bg-yellow-50 text-yellow-700",
    bg: "bg-yellow-50/50",
    text: "text-yellow-700",
    message: "Pendaftaran Anda sedang menunggu untuk ditinjau oleh tim kami.",
    icon: Clock,
  },
  reviewed: {
    label: "Sedang Ditinjau",
    badge: "border-blue-200 bg-blue-50 text-blue-700",
    bg: "bg-blue-50/50",
    text: "text-blue-700",
    message: "Pendaftaran Anda sedang dalam proses peninjauan.",
    icon: Eye,
  },
  approved: {
    label: "Diterima",
    badge: "border-green-200 bg-green-50 text-green-700",
    bg: "bg-green-50/50",
    text: "text-green-700",
    message:
      "Selamat! Pendaftaran Anda telah disetujui. Tim kami akan segera menghubungi Anda.",
    icon: CheckCircle,
  },
  rejected: {
    label: "Ditolak",
    badge: "border-red-200 bg-red-50 text-red-700",
    bg: "bg-red-50/50",
    text: "text-red-700",
    message: "Mohon maaf, pendaftaran Anda tidak dapat dilanjutkan saat ini.",
    icon: XCircle,
  },
} as const;

export const KB_SIZE = 1024;

export const DATE_FORMAT_OPTIONS = {
  day: "2-digit",
  month: "short",
  year: "numeric",
} as const;

export type SubmissionStatus = keyof typeof STATUS_CONFIG;

