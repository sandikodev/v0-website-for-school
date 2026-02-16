"use client";

import * as React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Calendar, Home, Paperclip, User, Copy, ExternalLink } from "lucide-react";
import type { RegistrarSubmissionDTO } from "@/lib/registrar/types";
import { formatFileSize, formatDateTime, formatTTL } from "@/lib/registrar/helpers";
import { useToast } from "@/hooks/use-toast";
import {
  calculateMissingCounts,
  getBadgeProps,
  getVerificationBadgeProps,
} from "./SubmissionDetails.utils";

interface SubmissionDetailsProps {
  submission: RegistrarSubmissionDTO;
}

export function SubmissionDetails({ submission }: SubmissionDetailsProps) {
  const { toast } = useToast();
  const { biodata, parents, documents } = calculateMissingCounts(submission);
  const [isAdmin, setIsAdmin] = React.useState<boolean>(false);

  // Check admin session
  React.useEffect(() => {
    const checkAdminSession = async () => {
      try {
        const response = await fetch("/api/auth/me");
        if (response.ok) {
          const data = await response.json();
          setIsAdmin(!!data.user);
        }
      } catch {
        // Ignore errors, user is not admin
        setIsAdmin(false);
      }
    };

    checkAdminSession();
  }, []);

  // Read default expand setting from localStorage
  const getDefaultValue = (): string[] => {
    if (typeof window === "undefined") return [];
    try {
      const stored = window.localStorage.getItem("admissions.defaultExpandAccordion");
      if (stored === "true") return ["biodata", "documents"];
    } catch {
      // ignore
    }
    return [];
  };

  const copyToClipboard = React.useCallback(
    async (text: string, label: string) => {
      if (!text) return;
      try {
        await navigator.clipboard.writeText(text);
        toast({
          title: "Berhasil Disalin",
          description: `${label} telah disalin ke clipboard`,
        });
      } catch {
        toast({
          title: "Gagal Menyalin",
          description: "Terjadi kesalahan saat menyalin teks",
          variant: "destructive",
        });
      }
    },
    [toast]
  );

  return (
    <Accordion
      type="multiple"
      defaultValue={getDefaultValue()}
      className="space-y-3 no-print"
      aria-label="Detail data pendaftaran"
    >
      <AccordionItem value="biodata" className="border rounded-lg px-0">
        <AccordionTrigger
          className="px-6 py-4 hover:no-underline [&[data-state=open]>svg]:rotate-180"
          id="biodata-heading"
        >
          <div className="flex items-center justify-between w-full pr-4">
            <div className="flex items-center gap-2">
              <User className="h-5 w-5" />
              <span className="font-semibold">Data Lengkap Pendaftar</span>
            </div>
            {(() => {
              const badge = getBadgeProps(biodata);
              return <span className={badge.className}>{badge.text}</span>;
            })()}
          </div>
        </AccordionTrigger>
        <AccordionContent className="px-6 pb-6">
          <div className="grid gap-3 md:grid-cols-3">
            <div className="md:col-span-3">
              <p className="text-sm text-gray-500">Nama Lengkap</p>
              <div className="flex items-center gap-2">
                <p className="font-medium text-gray-900">{submission.namaLengkap}</p>
                {submission.namaLengkap && (
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Salin nama"
                    title="Salin nama"
                    onClick={() => copyToClipboard(submission.namaLengkap!, "Nama lengkap")}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-500">Jenis Kelamin</p>
              <p className="font-medium text-gray-900">
                {submission.jenisKelamin || "-"}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">TTL</p>
              <p className="font-medium text-gray-900">
                {formatTTL(submission.tempatLahir, submission.tanggalLahir)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">No. HP</p>
              <div className="flex items-center gap-2">
                <p className="font-medium text-gray-900">{submission.noHP || "-"}</p>
                {submission.noHP && (
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Salin no HP"
                    title="Salin nomor HP"
                    onClick={() => copyToClipboard(submission.noHP!, "Nomor HP")}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
            <div className="md:col-span-3">
              <p className="text-sm text-gray-500">Alamat Lengkap</p>
              <p className="font-medium text-gray-900">
                {submission.alamatLengkap || "-"}
              </p>
            </div>
            <div className="md:col-span-2">
              <p className="text-sm text-gray-500">Email</p>
              <div className="flex items-center gap-2">
                <p className="font-medium text-gray-900">{submission.email || "-"}</p>
                {submission.email && (
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Salin email"
                    title="Salin email"
                    onClick={() => copyToClipboard(submission.email!, "Email")}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-500">No. HP Orangtua</p>
              <p className="font-medium text-gray-900">
                {submission.noHPOrangtua || "-"}
              </p>
            </div>
          </div>
          {isAdmin && (
            <div className="mt-4">
              <Button asChild variant="outline" size="sm">
                <a href="/dashboard/admissions?tab=applicants" target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  <span title="Buka halaman Dashboard (tab baru)">Edit di Dashboard</span>
                </a>
              </Button>
            </div>
          )}
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="parents" className="border rounded-lg px-0">
        <AccordionTrigger
          className="px-6 py-4 hover:no-underline [&[data-state=open]>svg]:rotate-180"
          id="parents-school-heading"
        >
          <div className="flex items-center justify-between w-full pr-4">
            <div className="flex items-center gap-2">
              <Home className="h-5 w-5" />
              <span className="font-semibold">Data Orangtua & Sekolah</span>
            </div>
            {(() => {
              const badge = getBadgeProps(parents);
              return <span className={badge.className}>{badge.text}</span>;
            })()}
          </div>
        </AccordionTrigger>
        <AccordionContent className="px-6 pb-6">
          <div className="grid gap-3 md:grid-cols-2">
            <div>
              <p className="text-sm text-gray-500">Nama Ayah</p>
              <p className="font-medium text-gray-900">
                {submission.namaAyah || "-"}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Pekerjaan Ayah</p>
              <p className="font-medium text-gray-900">
                {submission.pekerjaanAyah || "-"}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Nama Ibu</p>
              <p className="font-medium text-gray-900">
                {submission.namaIbu || "-"}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Pekerjaan Ibu</p>
              <p className="font-medium text-gray-900">
                {submission.pekerjaanIbu || "-"}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Asal Sekolah</p>
              <p className="font-medium text-gray-900">
                {submission.asalSekolah || "-"}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Alamat Sekolah</p>
              <p className="font-medium text-gray-900">
                {submission.alamatSekolah || "-"}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Jalur</p>
              <p className="font-medium text-gray-900">
                {submission.jalurPendaftaranName || submission.jalurPendaftaran || "-"}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Gelombang</p>
              <p className="font-medium text-gray-900">
                {submission.gelombangPendaftaranName || submission.gelombangPendaftaran || "-"}
              </p>
            </div>
            <div className="md:col-span-2">
              <p className="text-sm text-gray-500">Prestasi</p>
              <p className="font-medium text-gray-900">
                {submission.prestasi?.trim() ? submission.prestasi : "-"}
              </p>
            </div>
          </div>
          {isAdmin && (
            <div className="mt-4">
              <Button asChild variant="outline" size="sm">
                <a href="/dashboard/admissions?tab=applicants" target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  <span title="Buka halaman Dashboard (tab baru)">Edit di Dashboard</span>
                </a>
              </Button>
            </div>
          )}
        </AccordionContent>
      </AccordionItem>

      {submission.uploadedFiles.length > 0 && (
        <AccordionItem value="documents" className="border rounded-lg px-0">
          <AccordionTrigger
            className="px-6 py-4 hover:no-underline [&[data-state=open]>svg]:rotate-180"
            id="documents-heading"
          >
            <div className="flex items-center justify-between w-full pr-4">
              <div className="flex items-center gap-2">
                <Paperclip className="h-5 w-5" />
                <span className="font-semibold">Dokumen Terunggah</span>
              </div>
              {(() => {
                const badge = getBadgeProps(documents);
                return <span className={badge.className}>{badge.text}</span>;
              })()}
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-6 pb-6">
            <ul className="space-y-2">
              {submission.uploadedFiles.map((file) => (
                <li
                  key={file.filename}
                  className="flex items-center justify-between rounded border bg-white px-3 py-2"
                >
                  <div className="flex items-center gap-3">
                    <Paperclip className="h-4 w-4 text-emerald-500" />
                    <div>
                      <p className="font-medium text-gray-900">
                        {file.originalName}
                      </p>
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-xs text-gray-500">
                          {formatFileSize(file.size)} · {file.type}
                        </p>
                        {(() => {
                          const badge = getVerificationBadgeProps(
                            file as { verified?: boolean }
                          );
                          return <span className={badge.className}>{badge.text}</span>;
                        })()}
                      </div>
                    </div>
                  </div>
                  <Button variant="link" className="text-emerald-600" asChild>
                    <a
                      href={file.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Lihat
                    </a>
                  </Button>
                </li>
              ))}
            </ul>
          </AccordionContent>
        </AccordionItem>
      )}

      {submission.reviewedAt && (
        <AccordionItem value="timeline" className="border rounded-lg px-0">
          <AccordionTrigger
            className="px-6 py-4 hover:no-underline [&[data-state=open]>svg]:rotate-180"
            id="timeline-heading"
          >
            <div className="flex items-center justify-between w-full pr-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                <span className="font-semibold">Timeline</span>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-6 pb-6">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="mt-2 h-2 w-2 rounded-full bg-emerald-600" />
                <div>
                  <p className="text-sm font-medium">Pendaftaran Dibuat</p>
                  <p className="text-xs text-gray-500">
                    {formatDateTime(submission.createdAt)}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="mt-2 h-2 w-2 rounded-full bg-blue-600" />
                <div>
                  <p className="text-sm font-medium">
                    Ditinjau oleh {submission.reviewedBy || "Admin"}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatDateTime(submission.reviewedAt)}
                  </p>
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      )}
    </Accordion>
  );
}

