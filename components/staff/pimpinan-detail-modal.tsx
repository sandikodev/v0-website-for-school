"use client"

import * as React from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { GraduationCap, Crown, User, BookOpen, Mail, Phone } from "lucide-react"
import type { StaffMember } from "@/types/staff"

interface PimpinanDetailModalProps {
  pimpinan: StaffMember | null
  isOpen: boolean
  onClose: () => void
}

export default function PimpinanDetailModal({ pimpinan, isOpen, onClose }: PimpinanDetailModalProps) {
  if (!pimpinan) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
              <Crown className="h-8 w-8 text-primary" />
            </div>
            <div>
              <DialogTitle className="text-2xl font-bold">{pimpinan.nama}</DialogTitle>
              <DialogDescription className="text-primary font-medium mt-1">
                {pimpinan.jabatan}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Information */}
          <div className="bg-muted/30 rounded-lg p-4 space-y-4">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              Informasi Dasar
            </h3>
            
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-2">
                <span className="text-sm text-muted-foreground">Nama Lengkap:</span>
                <span className="col-span-2 text-sm font-medium">{pimpinan.nama}</span>
              </div>
              
              <div className="grid grid-cols-3 gap-2">
                <span className="text-sm text-muted-foreground">Jabatan:</span>
                <span className="col-span-2 text-sm font-medium">{pimpinan.jabatan}</span>
              </div>
              
              {pimpinan.mapel && (
                <div className="grid grid-cols-3 gap-2">
                  <span className="text-sm text-muted-foreground">Mata Pelajaran:</span>
                  <div className="col-span-2">
                    <Badge variant="secondary" className="text-xs">
                      <BookOpen className="h-3 w-3 mr-1" />
                      {pimpinan.mapel}
                    </Badge>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Role & Responsibilities */}
          <div className="bg-primary/5 rounded-lg p-4 space-y-3">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-primary" />
              Peran & Tanggung Jawab
            </h3>
            
            <div className="space-y-2 text-sm text-muted-foreground">
              {pimpinan.jabatan === "Kepala Sekolah" ? (
                <ul className="list-disc list-inside space-y-1.5 ml-2">
                  <li>Memimpin dan mengelola keseluruhan operasional sekolah</li>
                  <li>Menetapkan visi, misi, dan strategi pengembangan sekolah</li>
                  <li>Membina dan mengembangkan kompetensi tenaga pendidik</li>
                  <li>Menjalin kerjasama dengan stakeholder dan masyarakat</li>
                  <li>Memastikan kualitas pembelajaran dan pencapaian standar</li>
                </ul>
              ) : pimpinan.jabatan === "Wakil Kepala Sekolah" ? (
                <ul className="list-disc list-inside space-y-1.5 ml-2">
                  <li>Membantu Kepala Sekolah dalam pengelolaan sekolah</li>
                  <li>Mengkoordinasikan program kurikulum dan pembelajaran</li>
                  <li>Mengawasi pelaksanaan kegiatan akademik</li>
                  <li>Membina hubungan dengan komite dan wali murid</li>
                  <li>Mengelola administrasi dan dokumentasi sekolah</li>
                </ul>
              ) : (
                <p>Informasi tanggung jawab akan segera ditambahkan.</p>
              )}
            </div>
          </div>

          {/* Contact Information (Placeholder) */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-sm flex items-center gap-2 text-blue-800 mb-3">
              <Mail className="h-4 w-4" />
              Hubungi Pimpinan
            </h3>
            <p className="text-xs text-blue-700">
              Untuk komunikasi resmi dengan pimpinan sekolah, silakan menghubungi melalui kantor TU atau email resmi sekolah.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
