"use client";

import * as React from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
// import { Input } from "@/components/ui/input";
import {
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  ExternalLink,
  BookOpen,
  Brain,
  Users,
  FileText,
  Flame,
  Sparkles,
  RefreshCw,
  Upload,
  // X,
} from "lucide-react";
import { format, formatDistanceToNowStrict, parseISO, isBefore } from "date-fns";
import { id as localeID } from "date-fns/locale";
import { interviewConfigs } from "@/lib/interview/config";
import { useToast } from "@/hooks/use-toast";
import { StartInterviewModal } from "@/components/registrar/modals/StartInterviewModal";
import { UploadOfflineModal } from "@/components/registrar/modals/UploadOfflineModal";
import type { InterviewSessionDTO, InterviewSessionStatus as DTOStatus } from "@/lib/registrar/types";

interface InterviewNotificationProps {
  submissionId: string;
  registrationNumber: string;
  applicantName: string;
  initialSessions?: InterviewSessionDTO[];
}

type InterviewSessionStatus = DTOStatus;

interface ApiInterviewSession {
  id: string;
  submissionId: string;
  interviewTypeId: string;
  status: InterviewSessionStatus;
  scheduledDate: string | null;
  completedDate: string | null;
  notes?: string | null;
  interviewType: {
    id: string | null;
    name: string;
    googleFormUrl: string | null;
    defaultForm: {
      id: string;
      slug: string;
      title: string;
    } | null;
  } | null;
  result: {
    score: number | null;
    grade: string | null;
    feedback: string | null;
  } | null;
}

// Use DTO as base, extend if needed for backward compatibility
interface InterviewSession extends InterviewSessionDTO {
  interviewTypeId?: string; // kept for API response mapping
}

interface InterviewSessionsResponse {
  success: boolean;
  data?: {
    sessions: ApiInterviewSession[];
  };
  message?: string;
}

function normalizeName(value?: string | null) {
  if (!value) return null;
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "")
    .trim();
}

function findInterviewSlug(name?: string | null) {
  const normalizedName = normalizeName(name);
  if (!normalizedName) return null;

  for (const [slug, config] of Object.entries(interviewConfigs)) {
    const normalizedConfig = normalizeName(config.name);
    if (normalizedConfig === normalizedName) {
      return slug;
    }
  }

  return null;
}

export default function InterviewNotification({
  submissionId,
  registrationNumber,
  applicantName,
  initialSessions = [],
}: InterviewNotificationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [interviews, setInterviews] = React.useState<InterviewSession[]>(initialSessions);
  const [isLoading, setIsLoading] = React.useState(initialSessions.length === 0);
  const [offlineUploadEnabled, setOfflineUploadEnabled] = React.useState(true);
  const [offlineDrafts, setOfflineDrafts] = React.useState<Record<string, string>>({});
  const [fetchError, setFetchError] = React.useState<string | null>(null);
  // const [lastSyncedAt, setLastSyncedAt] = React.useState<Date | null>(null);
  const [actionLoadingId, setActionLoadingId] = React.useState<string | null>(null);
  const { toast } = useToast();
  const [startModalFor, setStartModalFor] = React.useState<InterviewSession | null>(null);
  const [uploadModalFor, setUploadModalFor] = React.useState<InterviewSession | null>(null);
  const [expanded, setExpanded] = React.useState<Record<string, boolean>>({});
  const startConfirmRef = React.useRef<HTMLButtonElement | null>(null);
  const uploadInputRef = React.useRef<HTMLInputElement | null>(null);
  const [, startTransition] = React.useTransition();

  React.useEffect(() => {
    const fetchInterviews = async () => {
      try {
        setFetchError(null);
        const response = await fetch(
          `/api/interview/sessions?submissionId=${encodeURIComponent(submissionId)}`,
        );

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const payload: InterviewSessionsResponse = await response.json();

        if (payload.success && payload.data?.sessions) {
          const mappedSessions: InterviewSession[] = payload.data.sessions.map(
            (session) => {
              const typeName = session.interviewType?.name ?? "Interview";
              const slugFromType = session.interviewType?.defaultForm?.slug;
              return {
                id: session.id,
                type: typeName,
                interviewTypeId: session.interviewTypeId ?? session.interviewType?.id ?? undefined,
                status: session.status,
                scheduledDate: session.scheduledDate ?? undefined,
                completedDate: session.completedDate ?? undefined,
                googleFormUrl: session.interviewType?.googleFormUrl ?? "#",
                deadline: session.scheduledDate ?? undefined,
                feedback: session.result?.feedback ?? session.notes ?? undefined,
                score: session.result?.score ?? null,
                grade: session.result?.grade ?? null,
                slug:
                  slugFromType ??
                  findInterviewSlug(typeName),
              };
            },
          );
          setInterviews(mappedSessions);
          // Auto-expand interview prioritas: overdue atau PENDING pertama
          const now = new Date();
          let targetId: string | null = null;
          for (const item of mappedSessions) {
            if (item.deadline) {
              try {
                if (isBefore(parseISO(item.deadline), now)) {
                  targetId = item.id;
                  break;
                }
              } catch {
                // ignore parse error
              }
            }
          }
          if (!targetId) {
            const pending = mappedSessions.find((i) => i.status === "PENDING");
            targetId = pending?.id ?? null;
          }
          if (targetId) {
            setExpanded((prev) => ({ ...prev, [targetId as string]: true }));
          }
          // setLastSyncedAt(new Date());
        } else {
          setFetchError(payload.message ?? "Gagal memuat data interview");
        }
      } catch (error) {
        setFetchError(error instanceof Error ? error.message : "Terjadi kesalahan jaringan");
      } finally {
        setIsLoading(false);
      }
    };

    void fetchInterviews();
    const interval = setInterval(fetchInterviews, 30000); // Poll every 30 seconds
    return () => clearInterval(interval);
  }, [submissionId]);

  // Baca query ?session= untuk membuka detail tertentu saat halaman dibuka
  React.useEffect(() => {
    if (!searchParams) return;
    const sessionId = searchParams.get("session");
    if (sessionId) {
      setExpanded((prev) => ({ ...prev, [sessionId]: true }));
    }
  }, [searchParams]);

  // ESC untuk menutup modal, dan auto-focus elemen pertama yang relevan
  React.useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (startModalFor) setStartModalFor(null);
        if (uploadModalFor) setUploadModalFor(null);
      }
    };
    window.addEventListener("keydown", handler);
    // fokuskan tombol konfirmasi saat modal mulai interview terbuka
    if (startModalFor) {
      setTimeout(() => startConfirmRef.current?.focus(), 0);
    }
    // fokuskan input saat modal upload terbuka
    if (uploadModalFor) {
      setTimeout(() => uploadInputRef.current?.focus(), 0);
    }
    return () => window.removeEventListener("keydown", handler);
  }, [startModalFor, uploadModalFor]);

  React.useEffect(() => {
    if (typeof window === "undefined") return;

    const readSetting = () => {
      const stored = window.localStorage.getItem("admissions.offlineUploadEnabled");
      setOfflineUploadEnabled(stored !== "false");
    };

    readSetting();

    const handleStorage = (event: StorageEvent) => {
      if (event.key === "admissions.offlineUploadEnabled") {
        readSetting();
      }
    };

    const handleCustom = () => readSetting();

    window.addEventListener("storage", handleStorage);
    window.addEventListener(
      "admissions-offline-upload-changed",
      handleCustom as EventListener,
    );

    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener(
        "admissions-offline-upload-changed",
        handleCustom as EventListener,
      );
    };
  }, []);

  const handleOfflineDraftChange = (sessionId: string, value: string) => {
    setOfflineDrafts((prev) => ({ ...prev, [sessionId]: value }));
  };

  const handleOfflineDraftCancel = (sessionId: string) => {
    setOfflineDrafts((prev) => {
      const next = { ...prev };
      delete next[sessionId];
      return next;
    });
  };

  const handleOfflineDraftSubmit = (session: InterviewSession) => {
    const payload = offlineDrafts[session.id]?.trim();
    if (!payload) return;
    toast({
      title: "Bukti offline dicatat",
      description: "Tim admin akan memverifikasi unggahan manual.",
    });
    handleOfflineDraftCancel(session.id);
  };

  const getInterviewIcon = (type: string) => {
    switch (type) {
      case "Interview Diniyah":
        return <BookOpen className="h-5 w-5" />;
      case "Interview Akademik":
        return <Brain className="h-5 w-5" />;
      case "Interview Psikologis":
        return <Users className="h-5 w-5" />;
      default:
        return <FileText className="h-5 w-5" />;
    }
  };

  const openInterviewForm = (interview: InterviewSession) => {
    if (interview.slug) {
      router.push(`/interview/${interview.slug}?session=${interview.id}`);
      return;
    }
    window.open(interview.googleFormUrl, "_blank", "noopener,noreferrer");
  };

  const getVisualStyle = (
    status: InterviewSession["status"],
    isOverdue: boolean
  ) => {
    switch (status) {
      case "PENDING":
        return {
          accent: "from-orange-400/20 via-orange-100 to-orange-50",
          ring: "ring-2 ring-orange-200/70",
          chipBg: isOverdue
            ? "bg-red-100 text-red-700"
            : "bg-orange-100 text-orange-700",
          icon: isOverdue ? (
            <Flame className="h-4 w-4" />
          ) : (
            <Sparkles className="h-4 w-4" />
          ),
          label: isOverdue ? "Butuh Aksi Cepat" : "Yuk Selesaikan",
          buttonPulse: isOverdue,
        };
      case "IN_PROGRESS":
        return {
          accent: "from-blue-400/20 via-blue-100 to-blue-50",
          ring: "ring-2 ring-blue-200/70",
          chipBg: "bg-blue-100 text-blue-700",
          icon: <RefreshCw className="h-4 w-4" />,
          label: "Sedang Berjalan",
          buttonPulse: false,
        };
      case "COMPLETED":
      case "REVIEWED":
        return {
          accent: "from-green-400/20 via-emerald-100 to-emerald-50",
          ring: "ring-2 ring-emerald-200/70",
          chipBg: "bg-emerald-100 text-emerald-700",
          icon: <CheckCircle className="h-4 w-4" />,
          label: "Sudah Beres",
          buttonPulse: false,
        };
      case "FAILED":
        return {
          accent: "from-red-400/20 via-red-100 to-red-50",
          ring: "ring-2 ring-red-200/70",
          chipBg: "bg-red-100 text-red-700",
          icon: <XCircle className="h-4 w-4" />,
          label: "Perlu Evaluasi",
          buttonPulse: false,
        };
      case "RESCHEDULED":
        return {
          accent: "from-purple-400/20 via-purple-100 to-purple-50",
          ring: "ring-2 ring-purple-200/70",
          chipBg: "bg-purple-100 text-purple-700",
          icon: <AlertCircle className="h-4 w-4" />,
          label: "Dijadwalkan Ulang",
          buttonPulse: false,
        };
      default:
        return {
          accent: "from-slate-200 via-slate-100 to-white",
          ring: "ring-1 ring-slate-200/70",
          chipBg: "bg-slate-100 text-slate-700",
          icon: <Clock className="h-4 w-4" />,
          label: "Status Interview",
          buttonPulse: false,
        };
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      PENDING: {
        color: "bg-yellow-100 text-yellow-800 border-yellow-200",
        icon: Clock,
        text: "Menunggu Interview",
      },
      IN_PROGRESS: {
        color: "bg-blue-100 text-blue-800 border-blue-200",
        icon: Calendar,
        text: "Sedang Berlangsung",
      },
      COMPLETED: {
        color: "bg-green-100 text-green-800 border-green-200",
        icon: CheckCircle,
        text: "Selesai",
      },
      REVIEWED: {
        color: "bg-purple-100 text-purple-800 border-purple-200",
        icon: FileText,
        text: "Sudah Direview",
      },
      FAILED: {
        color: "bg-red-100 text-red-800 border-red-200",
        icon: XCircle,
        text: "Tidak Lulus",
      },
      RESCHEDULED: {
        color: "bg-orange-100 text-orange-800 border-orange-200",
        icon: AlertCircle,
        text: "Diundur",
      },
    };

    const config = statusConfig[status as keyof typeof statusConfig];
    const Icon = config.icon;

    return (
      <Badge className={`${config.color} border`}>
        <Icon className="h-3 w-3 mr-1" />
        {config.text}
      </Badge>
    );
  };

  const sortedInterviews = React.useMemo(
    () =>
      [...interviews].sort((left, right) => {
        const priorityOrder: Record<InterviewSession["status"], number> = {
          PENDING: 0,
          IN_PROGRESS: 1,
          RESCHEDULED: 2,
          COMPLETED: 3,
          REVIEWED: 4,
          FAILED: 5,
        };
        return priorityOrder[left.status] - priorityOrder[right.status];
      }),
    [interviews]
  );

  const pendingInterviews = sortedInterviews.filter(
    (i) => i.status === "PENDING"
  );
  const completedInterviews = sortedInterviews.filter(
    (i) => i.status === "COMPLETED" || i.status === "REVIEWED"
  );
  const failedInterviews = sortedInterviews.filter(
    (i) => i.status === "FAILED"
  );

  const formatDeadline = (deadline?: string) => {
    if (!deadline) return null;
    const deadlineDate = parseISO(deadline);
    const isExpired = isBefore(deadlineDate, new Date());
    const timeLabel = formatDistanceToNowStrict(deadlineDate, {
      locale: localeID,
      addSuffix: true,
    });
    return { label: isExpired ? `Lewat ${timeLabel}` : timeLabel, isExpired };
  };

  const formatDateTime = (value?: string) => {
    if (!value) return null;
    try {
      const parsed = parseISO(value);
      return format(parsed, "eeee, dd MMM yyyy HH.mm", { locale: localeID });
    } catch {
      return null;
    }
  };

  // Offline upload dipindahkan ke modal agar kartu lebih ringkas

  if (isLoading) {
    return (
      <div className="space-y-4">
        {/* Alert skeleton */}
        <div className="sticky top-1 z-40">
          <div className="h-16 w-full animate-pulse rounded-xl border border-slate-200 bg-white/70 shadow-sm backdrop-blur" />
        </div>

        {/* Header skeleton */}
        <div className="rounded-2xl border border-slate-200 bg-white/70 p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="h-5 w-5 animate-pulse rounded bg-slate-200" />
            <div className="h-5 w-40 animate-pulse rounded bg-slate-200" />
          </div>
          <div className="mt-2 h-4 w-72 animate-pulse rounded bg-slate-100" />
        </div>

        {/* Summary cards skeleton (3 columns) */}
        <div className="grid gap-3 sm:grid-cols-3">
          {[0, 1, 2].map((index) => (
            <div
              key={index}
              className="rounded-xl border border-slate-200 bg-white/80 p-4 shadow-sm"
            >
              <div className="mb-2 flex items-center gap-2">
                <div className="h-4 w-4 animate-pulse rounded bg-slate-200" />
                <div className="h-3 w-28 animate-pulse rounded bg-slate-200" />
              </div>
              <div className="flex items-center gap-3">
                <div className="h-8 w-10 animate-pulse rounded bg-slate-200" />
                <div className="h-3 w-36 animate-pulse rounded bg-slate-100" />
              </div>
              <div className="mt-2 h-3 w-full animate-pulse rounded bg-slate-100" />
            </div>
          ))}
        </div>

        {/* Interview list skeleton (3 items) */}
        <div className="space-y-3">
          {[0, 1, 2].map((index) => (
            <div
              key={index}
              className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 animate-pulse rounded-2xl bg-slate-200" />
                  <div className="space-y-2">
                    <div className="h-4 w-40 animate-pulse rounded bg-slate-200" />
                    <div className="flex gap-2">
                      <div className="h-4 w-28 animate-pulse rounded-full bg-slate-100" />
                      <div className="h-4 w-24 animate-pulse rounded-full bg-slate-100" />
                    </div>
                  </div>
                </div>
                <div className="h-7 w-24 animate-pulse rounded bg-slate-200" />
              </div>
              <div className="mt-3 grid gap-3 sm:grid-cols-3">
                <div className="h-12 animate-pulse rounded-xl bg-slate-100" />
                <div className="h-12 animate-pulse rounded-xl bg-slate-100" />
                <div className="h-12 animate-pulse rounded-xl bg-slate-100" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Pending Interviews Alert */}
      {pendingInterviews.length > 0 && (
        <a 
          href="#take-action-interview-card" 
          className="sticky top-1 z-50 block focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:ring-offset-2 rounded-xl no-print"
          aria-label={`Ada ${pendingInterviews.length} interview yang menunggu aksi, klik untuk melihat detail`}
        >
          <Alert 
            role="alert"
            aria-live="polite"
            className="border-orange-200 bg-linear-to-r from-orange-50 via-amber-50 to-yellow-50 shadow-sm transition-all duration-300 hover:translate-y-0.5 hover:shadow-md animate-in slide-in-from-top-3 fade-in motion-safe:animate-[pulse_3s_ease-in-out_infinite]"
          >
            <AlertCircle className="h-4 w-4 text-orange-600" aria-hidden="true" />
            <AlertDescription className="text-sm text-orange-800">
              <strong className="mr-1 uppercase tracking-wide text-xs">
                Perlu tindakan!
              </strong>
              <span>
                Ada {pendingInterviews.length} interview yang menunggu aksi kamu. Yuk
                selesaikan supaya proses pendaftaran{" "}
                <span className="font-semibold text-orange-900">{applicantName}</span>{" "}
                tetap lancar.
              </span>
            </AlertDescription>
          </Alert>
        </a>
      )}
      {fetchError && (
        <Alert className="border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-sm text-red-800">
            Gagal memuat data interview. {fetchError}{" "}
            <button
              type="button"
              className="ml-2 underline"
              onClick={() => {
                // trigger refetch by toggling isLoading
                setIsLoading(true);
                (async () => {
                  try {
                    const response = await fetch(
                      `/api/interview/sessions?submissionId=${encodeURIComponent(submissionId)}`,
                    );
                    if (response.ok) {
                      const payload: InterviewSessionsResponse = await response.json();
                      if (payload.success && payload.data?.sessions) {
                        setFetchError(null);
                        setIsLoading(false);
                      }
                    }
                  } catch {
                    setIsLoading(false);
                  }
                })();
              }}
            >
              Coba lagi
            </button>
          </AlertDescription>
        </Alert>
      )}

      {/* Interview Progress Overview */}
      <Card 
        id="interview-status-heading"
        className="no-print border-none bg-linear-to-br from-white via-slate-50 to-white shadow-lg"
        aria-labelledby="interview-status-title"
      >
        <CardHeader>
          <CardTitle 
            id="interview-status-title"
            className="flex items-center gap-2 text-xl"
          >
            <Calendar className="h-5 w-5 text-primary" aria-hidden="true" />
            Status Interview
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            Pantau progress interview dan kerjakan yang paling prioritas dulu.
            Nomor pendaftaran:{" "}
            <span className="font-semibold text-primary">
              {registrationNumber}
            </span>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          {/* Progress Summary */}
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-orange-200 bg-white/90 p-4 shadow-sm">
              <div className="mb-2 flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-orange-600">
                <Clock className="h-5 w-5 text-yellow-600" />
                <span className="font-semibold text-yellow-900">Status: Pending</span>
              </div>
              <div className="text-xs flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <p className="mt-1 text-3xl font-bold text-orange-600">
                    {pendingInterviews.length}
                  </p>
                  <p className=" text-orange-600/80">
                    Kerjakan segera supaya jadwal interview aman.
                  </p>
                </div>
                <p className=" text-yellow-800">
                  Pendaftaran Anda sedang dalam antrian untuk ditinjau. Harap
                  tunggu 1-2 hari kerja.
                </p>
              </div>
            </div>

            <div className="rounded-xl border border-emerald-200 bg-white/90 p-4 shadow-sm">
              <div className="mb-2 flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-red-600">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="font-semibold text-green-900">Status: Diterima</span>
              </div>
              <div className="text-xs flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <p className="mt-1 text-3xl font-bold text-emerald-600">
                    {completedInterviews.length}
                  </p>
                  <p className=" text-emerald-600/80">
                    Good job! Tetap ikuti instruksi dari panitia.
                  </p>
                </div>
                <p className=" text-emerald-800">
                  Selamat! Anda diterima. Tim kami akan menghubungi untuk proses
                  selanjutnya.
                </p>
              </div>
            </div>

            <div className="rounded-xl border border-red-200 bg-white/90 p-4 shadow-sm">
              <div className="mb-2 flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-red-600">
                <XCircle className="h-5 w-5 text-red-600" />
                <span className="font-semibold text-red-900">
                  Status: Ditolak/Masalah
                </span>
              </div>
              <div className="text-xs flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <p className="mt-1 text-3xl font-bold text-red-600">
                    {failedInterviews.length}
                  </p>
                  <p className=" text-red-600/80">
                    Hubungi panitia jika butuh jadwal ulang atau klarifikasi.
                  </p>
                </div>
                <p className=" text-red-800">
                  Jika ada masalah administrasi atau penolakan, lihat catatan di
                  halaman status atau hubungi kami.
                </p>
              </div>
            </div>
          </div>

          {/* Individual Interview Cards */}
          <div className="space-y-3 scroll-mt-26" id="take-action-interview-card">
            {sortedInterviews.map((interview) => {
              const deadlineMeta = formatDeadline(interview.deadline);
              const visual = getVisualStyle(
                interview.status,
                Boolean(deadlineMeta?.isExpired)
              );
              const isOverdue = Boolean(deadlineMeta?.isExpired);

              return (
                <div
                  key={interview.id}
                  className={`relative overflow-hidden rounded-2xl bg-white shadow-md transition-all hover:-translate-y-1 hover:shadow-lg ${visual.ring}`}
                  role="region"
                  aria-labelledby={`interview-heading-${interview.id}`}
                >
                  <div
                    className={`absolute inset-0 -z-10 bg-linear-to-br ${visual.accent}`}
                  />
                  <span
                    className={`absolute right-3 top-3 z-10 flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${visual.chipBg}`}
                  >
                    {visual.icon}
                    {visual.label}
                  </span>
                  <Card className="border-none bg-transparent">
                    <CardContent className="p-4 sm:p-6">
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex flex-1 flex-col gap-3">
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-center gap-3">
                              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-primary shadow">
                                {getInterviewIcon(interview.type)}
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <h3
                                    id={`interview-heading-${interview.id}`}
                                    className="text-base font-semibold text-gray-900"
                                  >
                                    {interview.type}
                                  </h3>
                                </div>
                                <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                                  {getStatusBadge(interview.status)}
                                  {deadlineMeta && (
                                    <span
                                      className={`flex items-center gap-1 rounded-full bg-white/60 px-2 py-0.5 text-[11px] font-medium uppercase tracking-wide ${deadlineMeta.isExpired ? "text-red-600" : "text-orange-600"}`}
                                    >
                                      <Clock className="h-3 w-3" />
                                      {deadlineMeta.label}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Compact mode: status messages hidden to keep card slim */}
                        </div>

                        <div className="flex flex-col gap-2 sm:items-end">
                          <div className="flex items-center gap-2">
                            {(interview.status === "PENDING" ||
                              interview.status === "IN_PROGRESS") && (
                            <Button
                                size="sm"
                                className={`bg-orange-600 hover:bg-orange-700 ${
                                  isOverdue && interview.status === "PENDING"
                                    ? "animate-pulse-slow"
                                    : ""
                                }`}
                                aria-label={interview.status === "PENDING" ? "Mulai Interview" : "Lanjutkan Interview"}
                                title={interview.status === "PENDING" ? "Mulai Interview" : "Lanjutkan Interview"}
                                onMouseEnter={() => {
                                  if (interview.slug) {
                                    router.prefetch(`/interview/${interview.slug}?session=${interview.id}`);
                                  }
                                }}
                                disabled={actionLoadingId === interview.id}
                                onClick={() => setStartModalFor(interview)}
                              >
                                <ExternalLink className="mr-2 h-4 w-4" />
                                {actionLoadingId === interview.id
                                  ? "Membuka…"
                                  : interview.status === "PENDING"
                                  ? "Mulai"
                                  : "Lanjutkan"}
                              </Button>
                            )}

                            {offlineUploadEnabled && (
                              <Button
                                size="sm"
                                variant="outline"
                                aria-label="Upload bukti offline"
                                title="Upload bukti offline"
                                onClick={() => setUploadModalFor(interview)}
                              >
                                <Upload className="mr-2 h-4 w-4" />
                                Upload Offline
                              </Button>
                            )}

                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => {
                                const current = Boolean(expanded[interview.id]);
                                const next = !current;
                                setExpanded((prev) => ({ ...prev, [interview.id]: next }));
                                const params = new URLSearchParams(searchParams ?? undefined);
                                if (next) {
                                  params.set("session", interview.id);
                                } else if (params.get("session") === interview.id) {
                                  params.delete("session");
                                }
                                startTransition(() => {
                                  router.replace(
                                    params.toString() ? `${pathname}?${params.toString()}` : pathname,
                                    { scroll: false }
                                  );
                                });
                              }}
                            >
                              {expanded[interview.id] ? "Sembunyikan" : "Detail"}
                            </Button>
                          </div>
                        </div>
                      </div>

                      {/* Offline upload dipindahkan ke modal */}

                      {/* Interview details - always visible in print */}
                      <div className={`mt-3 grid gap-3 text-xs text-slate-600 sm:grid-cols-3 ${expanded[interview.id] ? "" : "hidden"}`}>
                        <div className="flex items-start gap-2 rounded-xl border border-white/70 bg-white/70 p-3 shadow-inner">
                          <Calendar className="h-4 w-4 text-primary" />
                          <div>
                            <p className="text-[11px] font-semibold uppercase text-slate-500">
                              Jadwal Interview
                            </p>
                            <p className="font-semibold text-slate-900">
                              {formatDateTime(interview.scheduledDate) ?? "Belum dijadwalkan"}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-2 rounded-xl border border-white/70 bg-white/70 p-3 shadow-inner">
                          <CheckCircle className="h-4 w-4 text-emerald-600" />
                          <div>
                            <p className="text-[11px] font-semibold uppercase text-slate-500">
                              Skor & Predikat
                            </p>
                            <p className="font-semibold text-slate-900">
                              {typeof interview.score === "number"
                                ? `${interview.score}${interview.grade ? ` • ${interview.grade}` : ""}`
                                : interview.grade ?? "Menunggu hasil"}
                            </p>
                            {interview.feedback && (
                              <p className="text-[11px] text-slate-500">
                                {interview.feedback}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-start gap-2 rounded-xl border border-white/70 bg-white/70 p-3 shadow-inner">
                          <ExternalLink className="h-4 w-4 text-indigo-600" />
                          <div>
                            <p className="text-[11px] font-semibold uppercase text-slate-500">
                              Tautan Form
                            </p>
                            <p className="font-semibold text-slate-900">
                              {interview.slug
                                ? `/interview/${interview.slug}`
                                : "Google Form"}
                            </p>
                            <button
                              type="button"
                              className="mt-1 text-[11px] font-semibold text-indigo-600 hover:underline"
                              title="Buka tautan form interview"
                              onClick={() => {
                                if (interview.slug) {
                                  router.push(`/interview/${interview.slug}?session=${interview.id}`);
                                } else {
                                  window.open(interview.googleFormUrl, "_blank", "noopener,noreferrer");
                                }
                              }}
                            >
                              Buka Tautan
                            </button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <StartInterviewModal
        open={Boolean(startModalFor)}
        onOpenChange={(open) => !open && setStartModalFor(null)}
        interview={
          startModalFor
            ? { id: startModalFor.id, type: startModalFor.type, status: startModalFor.status }
            : null
        }
        onConfirm={(id) => {
          const target = interviews.find((i) => i.id === id);
          if (!target) return;
          setActionLoadingId(target.id);
          openInterviewForm(target);
          setTimeout(() => setActionLoadingId(null), 1000);
        }}
      />

      <UploadOfflineModal
        open={Boolean(uploadModalFor)}
        onOpenChange={(open) => !open && setUploadModalFor(null)}
        value={uploadModalFor ? (offlineDrafts[uploadModalFor.id] ?? "") : ""}
        onChange={(val) => {
          if (!uploadModalFor) return;
          handleOfflineDraftChange(uploadModalFor.id, val);
        }}
        onConfirm={() => {
          if (!uploadModalFor) return;
          handleOfflineDraftSubmit(uploadModalFor);
          setUploadModalFor(null);
        }}
        onCancelDraft={() => {
          if (!uploadModalFor) return;
          handleOfflineDraftCancel(uploadModalFor.id);
        }}
      />
    </div>
  );
}
