"use client";

import { Award, BookOpen, GraduationCap } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function AboutTab() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Sejarah Sekolah
          </CardTitle>
          <CardDescription>
            Ceritakan sejarah dan perkembangan sekolah
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="SMP Syuhada didirikan pada tahun 1995 dengan tujuan memberikan pendidikan berkualitas tinggi untuk masyarakat Yogyakarta. Sekolah ini telah mengalami berbagai perkembangan dan pencapaian yang membanggakan..."
            rows={6}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Prestasi & Pencapaian
          </CardTitle>
          <CardDescription>
            Daftar prestasi dan pencapaian sekolah
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="achievement-1">Prestasi 1</Label>
              <Input
                id="achievement-1"
                placeholder="Juara 1 Olimpiade Matematika Tingkat Kota"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="achievement-2">Prestasi 2</Label>
              <Input
                id="achievement-2"
                placeholder="Sekolah Adiwiyata Tingkat Nasional"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="achievement-3">Prestasi 3</Label>
              <Input
                id="achievement-3"
                placeholder="Akreditasi A dari BAN-S/M"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="achievement-4">Prestasi 4</Label>
              <Input id="achievement-4" placeholder="Sekolah Ramah Anak" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5" />
            Program Unggulan
          </CardTitle>
          <CardDescription>
            Program-program unggulan yang ditawarkan sekolah
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="program-1">Program 1</Label>
              <Input
                id="program-1"
                placeholder="Program Tahfidz Al-Quran"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="program-2">Program 2</Label>
              <Input
                id="program-2"
                placeholder="Program Bahasa Inggris Intensif"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="program-3">Program 3</Label>
              <Input
                id="program-3"
                placeholder="Program STEM (Science, Technology, Engineering, Math)"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="program-4">Program 4</Label>
              <Input
                id="program-4"
                placeholder="Program Ekstrakurikuler Unggulan"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

