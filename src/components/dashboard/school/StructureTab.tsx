"use client";

import { Building, Users } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

export default function StructureTab() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Kepemimpinan Sekolah
          </CardTitle>
          <CardDescription>
            Informasi kepemimpinan dan struktur organisasi
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="principal-name">Nama Kepala Sekolah</Label>
              <Input
                id="principal-name"
                placeholder="Dr. Ahmad Fauzi, M.Pd"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="principal-period">Masa Jabatan</Label>
              <Input id="principal-period" placeholder="2020 - Sekarang" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="vice-principal">Wakil Kepala Sekolah</Label>
              <Input id="vice-principal" placeholder="Siti Rahma, S.Pd" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="curriculum-coordinator">
                Koordinator Kurikulum
              </Label>
              <Input
                id="curriculum-coordinator"
                placeholder="Budi Setiawan, M.Pd"
              />
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="mb-4 text-lg font-semibold">Struktur Organisasi</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="academic-staff">Staf Akademik</Label>
                <Input id="academic-staff" placeholder="25 Guru" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="non-academic-staff">Staf Non-Akademik</Label>
                <Input id="non-academic-staff" placeholder="8 Orang" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="total-students">Total Siswa</Label>
                <Input id="total-students" placeholder="450 Siswa" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="total-classes">Total Kelas</Label>
                <Input id="total-classes" placeholder="15 Kelas" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            Komite Sekolah
          </CardTitle>
          <CardDescription>
            Informasi komite sekolah dan peranannya
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="committee-chairman">Ketua Komite</Label>
              <Input
                id="committee-chairman"
                placeholder="H. Muhammad Yusuf"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="committee-secretary">Sekretaris Komite</Label>
              <Input
                id="committee-secretary"
                placeholder="Dra. Fatimah Az-Zahra"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="committee-treasurer">Bendahara Komite</Label>
              <Input
                id="committee-treasurer"
                placeholder="Ahmad Rizki, S.E"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="committee-members">Anggota Komite</Label>
              <Input id="committee-members" placeholder="12 Orang" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

