export interface StaffMember {
  nama: string
  jabatan: string
  mapel?: string
}

export interface PengurusYasma {
  nama: string
  jabatan: string
}

export interface WaliKelas {
  kelas: string
  nama: string
}

export interface StafPengajar extends StaffMember {
  mapel: string
}

export interface StaffStats {
  totalGuru: number
  totalStaff: number
  kualifikasi: string
}
