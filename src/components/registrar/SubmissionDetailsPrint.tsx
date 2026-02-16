import { Calendar, Home, Paperclip, User } from "lucide-react";
import type { RegistrarSubmissionDTO } from "@/lib/registrar/types";
import { formatFileSize, formatDateTime, formatTTL } from "@/lib/registrar/helpers";
import {
  calculateMissingCounts,
  getBadgeProps,
  getVerificationBadgeProps,
} from "./SubmissionDetails.utils";

interface SubmissionDetailsPrintProps {
  submission: RegistrarSubmissionDTO;
}

export function SubmissionDetailsPrint({ submission }: SubmissionDetailsPrintProps) {
  const { biodata, parents, documents } = calculateMissingCounts(submission);

  return (
    <div className="space-y-3 print-card">
      {/* Biodata & Parents Section - Two Columns Side by Side */}
      <div className="print-card border rounded-lg">
        <div className="grid grid-cols-2 gap-0 border-b">
          {/* Left Column: Biodata */}
          <div className="border-r">
            <div className="px-4 py-3 border-b">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span className="text-sm font-semibold">Data Lengkap Pendaftar</span>
                </div>
                {(() => {
                  const badge = getBadgeProps(biodata, "print");
                  return <span className={badge.className}>{badge.text}</span>;
                })()}
              </div>
            </div>
            <div className="px-4 py-3 space-y-2">
              <div>
                <p className="text-xs text-gray-500">Nama Lengkap</p>
                <p className="text-sm font-medium text-gray-900">{submission.namaLengkap}</p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="text-xs text-gray-500">Jenis Kelamin</p>
                  <p className="text-sm font-medium text-gray-900">
                    {submission.jenisKelamin || "-"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">TTL</p>
                  <p className="text-sm font-medium text-gray-900">
                    {formatTTL(submission.tempatLahir, submission.tanggalLahir)}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="text-xs text-gray-500">No. HP</p>
                  <p className="text-sm font-medium text-gray-900">{submission.noHP || "-"}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">HP Orangtua</p>
                  <p className="text-sm font-medium text-gray-900">
                    {submission.noHPOrangtua || "-"}
                  </p>
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-500">Email</p>
                <p className="text-sm font-medium text-gray-900">{submission.email || "-"}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Alamat Lengkap</p>
                <p className="text-sm font-medium text-gray-900">
                  {submission.alamatLengkap || "-"}
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Parents & School */}
          <div>
            <div className="px-4 py-3 border-b">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Home className="h-4 w-4" />
                  <span className="text-sm font-semibold">Data Orangtua & Sekolah</span>
                </div>
                {(() => {
                  const badge = getBadgeProps(parents, "print");
                  return <span className={badge.className}>{badge.text}</span>;
                })()}
              </div>
            </div>
            <div className="px-4 py-3 space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="text-xs text-gray-500">Nama Ayah</p>
                  <p className="text-sm font-medium text-gray-900">
                    {submission.namaAyah || "-"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Pekerjaan Ayah</p>
                  <p className="text-sm font-medium text-gray-900">
                    {submission.pekerjaanAyah || "-"}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="text-xs text-gray-500">Nama Ibu</p>
                  <p className="text-sm font-medium text-gray-900">
                    {submission.namaIbu || "-"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Pekerjaan Ibu</p>
                  <p className="text-sm font-medium text-gray-900">
                    {submission.pekerjaanIbu || "-"}
                  </p>
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-500">Asal Sekolah</p>
                <p className="text-sm font-medium text-gray-900">
                  {submission.asalSekolah || "-"}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Alamat Sekolah</p>
                <p className="text-sm font-medium text-gray-900">
                  {submission.alamatSekolah || "-"}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="text-xs text-gray-500">Jalur</p>
                  <p className="text-sm font-medium text-gray-900">
                    {submission.jalurPendaftaranName || submission.jalurPendaftaran || "-"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Gelombang</p>
                  <p className="text-sm font-medium text-gray-900">
                    {submission.gelombangPendaftaranName || submission.gelombangPendaftaran || "-"}
                  </p>
                </div>
              </div>
              {submission.prestasi?.trim() && (
                <div>
                  <p className="text-xs text-gray-500">Prestasi</p>
                  <p className="text-sm font-medium text-gray-900">{submission.prestasi}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Documents Section */}
      {submission.uploadedFiles.length > 0 && (
        <div className="print-card border rounded-lg">
          <div className="px-4 py-3 border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Paperclip className="h-4 w-4" />
                <span className="text-sm font-semibold">Dokumen Terunggah</span>
              </div>
              {(() => {
                const badge = getBadgeProps(documents, "print");
                return <span className={badge.className}>{badge.text}</span>;
              })()}
            </div>
          </div>
          <div className="px-4 py-3">
            <ul className="space-y-1.5">
              {submission.uploadedFiles.map((file) => (
                <li
                  key={file.filename}
                  className="flex items-center justify-between rounded border bg-white px-2 py-1.5"
                >
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <Paperclip className="h-3 w-3 text-emerald-500 shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {file.originalName}
                      </p>
                      <div className="flex flex-wrap items-center gap-1.5">
                        <p className="text-xs text-gray-500">
                          {formatFileSize(file.size)} · {file.type}
                        </p>
                        {(() => {
                          const badge = getVerificationBadgeProps(
                            file as { verified?: boolean },
                            "print"
                          );
                          return <span className={badge.className}>{badge.text}</span>;
                        })()}
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Timeline Section */}
      {submission.reviewedAt && (
        <div className="print-card border rounded-lg">
          <div className="px-4 py-3 border-b">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span className="text-sm font-semibold">Timeline</span>
            </div>
          </div>
          <div className="px-4 py-3">
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-emerald-600 shrink-0" />
                <div>
                  <p className="text-xs font-medium">Pendaftaran Dibuat</p>
                  <p className="text-xs text-gray-500">
                    {formatDateTime(submission.createdAt)}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-blue-600 shrink-0" />
                <div>
                  <p className="text-xs font-medium">
                    Ditinjau oleh {submission.reviewedBy || "Admin"}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatDateTime(submission.reviewedAt)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

