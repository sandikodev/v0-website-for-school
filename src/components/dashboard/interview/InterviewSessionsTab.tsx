"use client";

import { useCallback, useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  FileText,
  Download,
  Upload,
  ExternalLink,
  Eye,
} from "lucide-react";

interface InterviewSession {
  id: string;
  submissionId: string;
  applicantName: string;
  registrationNumber: string;
  interviewType: string;
  slug?: string | null;
  googleFormUrl?: string | null;
  status:
    | "PENDING"
    | "IN_PROGRESS"
    | "COMPLETED"
    | "REVIEWED"
    | "FAILED"
    | "RESCHEDULED";
  scheduledDate?: string;
  completedDate?: string;
  score?: number;
  grade?: string;
  feedback?: string;
}

interface ApiInterviewSession {
  id: string;
  submissionId: string;
  interviewTypeId: string;
  status: InterviewSession["status"];
  scheduledDate: string | null;
  completedDate: string | null;
  notes?: string | null;
  submission?: {
    namaLengkap: string;
    registrationNumber: string;
  };
  interviewType?: {
    name: string;
    googleFormUrl?: string | null;
    defaultForm?: {
      slug: string;
    } | null;
  };
  result?: {
    score: number | null;
    grade: string | null;
    feedback: string | null;
  } | null;
}

interface SessionsResponse {
  success: boolean;
  data?: {
    sessions: ApiInterviewSession[];
    stats: {
      total: number;
      pending: number;
      inProgress: number;
      completed: number;
      reviewed: number;
      failed: number;
      rescheduled: number;
    };
  };
  message?: string;
}

export function InterviewSessionsTab() {
  const [sessions, setSessions] = useState<InterviewSession[]>([]);
  const [filteredSessions, setFilteredSessions] = useState<InterviewSession[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    completed: 0,
    reviewed: 0,
    failed: 0,
    rescheduled: 0,
  });
  const [typeOptions, setTypeOptions] = useState<
    { id: string; name: string }[]
  >([]);
  const [error, setError] = useState<string | null>(null);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearchTerm(searchTerm), 300);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const mapSessions = useCallback((apiSessions: ApiInterviewSession[]) => {
    return apiSessions.map<InterviewSession>((session) => ({
      id: session.id,
      submissionId: session.submissionId,
      applicantName: session.submission?.namaLengkap ?? "Peserta",
      registrationNumber: session.submission?.registrationNumber ?? "N/A",
      interviewType: session.interviewType?.name ?? "Interview",
      slug: session.interviewType?.defaultForm?.slug,
      googleFormUrl: session.interviewType?.googleFormUrl ?? null,
      status: session.status,
      scheduledDate: session.scheduledDate ?? undefined,
      completedDate: session.completedDate ?? undefined,
      score: session.result?.score ?? undefined,
      grade: session.result?.grade ?? undefined,
      feedback: session.result?.feedback ?? session.notes ?? undefined,
    }));
  }, []);

  const fetchSessions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (debouncedSearchTerm.trim()) params.set("search", debouncedSearchTerm.trim());
      if (statusFilter !== "all") params.set("status", statusFilter);
      if (typeFilter !== "all") params.set("interviewTypeId", typeFilter);

      const response = await fetch(
        `/api/interview/sessions${params.toString() ? `?${params.toString()}` : ""}`,
        { cache: "no-store" },
      );
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      const payload: SessionsResponse = await response.json();
      if (payload.success && payload.data) {
        const mapped = mapSessions(payload.data.sessions);
        setSessions(mapped);
        setStats(payload.data.stats);
      } else {
        setSessions([]);
        setStats({
          total: 0,
          pending: 0,
          inProgress: 0,
          completed: 0,
          reviewed: 0,
          failed: 0,
          rescheduled: 0,
        });
      }
    } catch (err) {
      console.error("Error fetching interview sessions:", err);
      setError("Gagal memuat daftar interview.");
      setSessions([]);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearchTerm, mapSessions, statusFilter, typeFilter]);

  useEffect(() => {
    void fetchSessions();
  }, [fetchSessions]);

  useEffect(() => {
    const fetchTypes = async () => {
      try {
        const response = await fetch("/api/interview/types");
        const payload = await response.json();
        if (payload.success && Array.isArray(payload.data)) {
          setTypeOptions(
            payload.data.map((type: { id: string; name: string }) => ({
              id: type.id,
              name: type.name,
            })),
          );
        }
      } catch (err) {
        console.error("Error fetching interview types:", err);
      }
    };
    void fetchTypes();
  }, []);

  useEffect(() => {
    let filtered = sessions;

    if (typeFilter !== "all") {
      const typeName =
        typeOptions.find((type) => type.id === typeFilter)?.name ?? typeFilter;
      filtered = filtered.filter((session) => session.interviewType === typeName);
    }
    if (statusFilter !== "all") {
      filtered = filtered.filter((session) => session.status === statusFilter);
    }
    if (debouncedSearchTerm.trim()) {
      const term = debouncedSearchTerm.trim().toLowerCase();
      filtered = filtered.filter(
        (session) =>
          session.applicantName.toLowerCase().includes(term) ||
          session.registrationNumber.toLowerCase().includes(term),
      );
    }
    setFilteredSessions(filtered);
  }, [sessions, statusFilter, typeFilter, typeOptions, debouncedSearchTerm]);

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      PENDING: { color: "bg-warning-muted text-warning-foreground", icon: Clock },
      IN_PROGRESS: { color: "bg-info-muted text-info-foreground", icon: Calendar },
      COMPLETED: { color: "bg-success-muted text-success-foreground", icon: CheckCircle },
      REVIEWED: { color: "bg-primary-muted text-primary-foreground", icon: Eye },
      FAILED: { color: "bg-error-muted text-error-foreground", icon: XCircle },
      RESCHEDULED: {
        color: "bg-warning-muted text-warning-foreground",
        icon: AlertCircle,
      },
    };

    const config = statusConfig[status as keyof typeof statusConfig];
    const Icon = config.icon;

    return (
      <Badge className={config.color}>
        <Icon className="mr-1 h-3 w-3" />
        {status.replace("_", " ")}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Card key={index}>
              <CardContent className="p-4">
                <div className="h-14 animate-pulse rounded bg-slate-100" />
              </CardContent>
            </Card>
          ))}
        </div>
        <Card>
          <CardContent className="space-y-4 p-6">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="h-24 animate-pulse rounded-xl bg-slate-100" />
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="rounded-lg border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Interview</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <FileText className="h-8 w-8 text-info" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold text-warning">
                  {stats.pending}
                </p>
              </div>
              <Clock className="h-8 w-8 text-warning" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold text-success">
                  {stats.completed}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Reviewed</p>
                <p className="text-2xl font-bold text-primary">
                  {stats.reviewed}
                </p>
              </div>
              <Eye className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Actions */}
      <Card>
        <CardHeader>
          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle>Interview Management</CardTitle>
            <div className="flex gap-2">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Upload className="mr-2 h-4 w-4" />
                    Import Google Forms
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Import Interview Data</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Upload CSV file dari Google Forms atau masukkan data manual.
                    </p>
                    <Button className="w-full">
                      <Upload className="mr-2 h-4 w-4" />
                      Upload CSV File
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>

              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Export Data
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="mb-6 flex flex-col gap-4 sm:flex-row">
            <div className="flex-1">
              <Input
                placeholder="Cari nama atau ID pendaftar..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Status</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                <SelectItem value="COMPLETED">Completed</SelectItem>
                <SelectItem value="REVIEWED">Reviewed</SelectItem>
                <SelectItem value="FAILED">Failed</SelectItem>
              </SelectContent>
            </Select>

            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full sm:w-[220px]">
                <SelectValue placeholder="Filter Tipe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Tipe</SelectItem>
                {typeOptions.map((type) => (
                  <SelectItem key={type.id} value={type.id}>
                    {type.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Interview Sessions Table */}
          <div className="space-y-4">
            {filteredSessions.length === 0 ? (
              <div className="py-8 text-center text-muted-foreground">
                Tidak ada data interview yang ditemukan.
              </div>
            ) : (
              filteredSessions.map((session) => (
                <Card
                  key={session.id}
                  className="transition-shadow hover:shadow-md"
                >
                  <CardContent className="p-4">
                    <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex-1">
                        <div className="mb-2 flex items-center gap-3">
                          <h3 className="font-semibold">
                            {session.applicantName}
                          </h3>
                          <Badge variant="outline">
                            {session.registrationNumber}
                          </Badge>
                          {getStatusBadge(session.status)}
                        </div>

                        <div className="grid gap-2 text-sm text-muted-foreground sm:grid-cols-3">
                          <div>
                            <span className="font-medium">Tipe Interview:</span>
                            <p>{session.interviewType}</p>
                          </div>
                          <div>
                            <span className="font-medium">Tanggal:</span>
                            <p>
                              {session.scheduledDate ||
                                session.completedDate ||
                                "Belum dijadwalkan"}
                            </p>
                          </div>
                          <div>
                            <span className="font-medium">Skor:</span>
                            <p>
                              {session.score
                                ? `${session.score} (${session.grade})`
                                : "Belum dinilai"}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            if (session.slug) {
                              window.open(
                                `/interview/${session.slug}?session=${session.id}`,
                                "_blank",
                              );
                            } else if (session.googleFormUrl) {
                              window.open(session.googleFormUrl, "_blank");
                            }
                          }}
                        >
                          <ExternalLink className="mr-2 h-4 w-4" />
                          Buka Form
                        </Button>

                        <Button
                          size="sm"
                          variant="outline"
                          className="border-primary text-primary hover:bg-primary/10"
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          Detail
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


