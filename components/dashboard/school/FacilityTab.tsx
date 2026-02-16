"use client";

import {
  Building,
  Camera,
  Car,
  Dumbbell,
  Globe,
  Library,
  Microscope,
  Music,
  Shield,
  Utensils,
  Wifi,
  BookOpen,
  Computer,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const academicFacilities = [
  {
    icon: Library,
    label: "Perpustakaan",
    detail: "2 Ruang",
    iconClass: "text-blue-500",
  },
  {
    icon: Computer,
    label: "Lab Komputer",
    detail: "1 Ruang",
    iconClass: "text-green-500",
  },
  {
    icon: Microscope,
    label: "Lab IPA",
    detail: "2 Ruang",
    iconClass: "text-purple-500",
  },
  {
    icon: BookOpen,
    label: "Ruang Kelas",
    detail: "15 Ruang",
    iconClass: "text-orange-500",
  },
  {
    icon: Music,
    label: "Ruang Seni",
    detail: "1 Ruang",
    iconClass: "text-pink-500",
  },
  {
    icon: Camera,
    label: "Ruang Multimedia",
    detail: "1 Ruang",
    iconClass: "text-indigo-500",
  },
] as const;

const sportFacilities = [
  { label: "Lapangan Basket", detail: "1 Lapangan" },
  { label: "Lapangan Voli", detail: "1 Lapangan" },
  { label: "Lapangan Futsal", detail: "1 Lapangan" },
  { label: "Lapangan Badminton", detail: "2 Lapangan" },
  { label: "Lapangan Upacara", detail: "1 Lapangan" },
] as const;

const supportFacilities = [
  {
    icon: Utensils,
    label: "Kantin",
    detail: "2 Ruang",
    iconClass: "text-yellow-500",
  },
  {
    icon: Car,
    label: "Parkir",
    detail: "Area Luas",
    iconClass: "text-gray-500",
  },
  {
    icon: Wifi,
    label: "WiFi",
    detail: "Area Seluruh Sekolah",
    iconClass: "text-blue-500",
  },
  {
    icon: Shield,
    label: "Keamanan",
    detail: "24 Jam",
    iconClass: "text-green-500",
  },
  {
    icon: Globe,
    label: "Internet",
    detail: "High Speed",
    iconClass: "text-indigo-500",
  },
] as const;

export default function FacilityTab() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            Fasilitas Akademik
          </CardTitle>
          <CardDescription>
            Fasilitas pendukung kegiatan pembelajaran
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {academicFacilities.map(({ icon: Icon, label, detail, iconClass }) => (
              <div
                key={label}
                className="flex items-center space-x-3 rounded-lg border p-3"
              >
                <Icon className={`h-5 w-5 ${iconClass}`} />
                <div>
                  <p className="font-medium">{label}</p>
                  <p className="text-sm text-muted-foreground">{detail}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Dumbbell className="h-5 w-5" />
            Fasilitas Olahraga & Rekreasi
          </CardTitle>
          <CardDescription>
            Fasilitas untuk kegiatan olahraga dan rekreasi
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {sportFacilities.map((facility) => (
              <div
                key={facility.label}
                className="flex items-center space-x-3 rounded-lg border p-3"
              >
                <Dumbbell className="h-5 w-5 text-emerald-500" />
                <div>
                  <p className="font-medium">{facility.label}</p>
                  <p className="text-sm text-muted-foreground">
                    {facility.detail}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Fasilitas Pendukung
          </CardTitle>
          <CardDescription>Fasilitas pendukung lainnya</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {supportFacilities.map(({ icon: Icon, label, detail, iconClass }) => (
              <div
                key={label}
                className="flex items-center space-x-3 rounded-lg border p-3"
              >
                <Icon className={`h-5 w-5 ${iconClass}`} />
                <div>
                  <p className="font-medium">{label}</p>
                  <p className="text-sm text-muted-foreground">{detail}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

