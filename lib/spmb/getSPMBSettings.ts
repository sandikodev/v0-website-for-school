"use server";

import { prisma } from "@/lib/prisma";

export interface JalurData {
  id: string;
  name: string;
  quota?: number;
  description?: string;
}

export interface GelombangData {
  id: string;
  name: string;
  period: string;
  startDate?: string;
  endDate?: string;
  discount: string;
  price: string;
  description: string;
  color?: string;
  badge?: string;
}

export interface SPMBSettings {
  academicYear: string;
  heroTitle: string;
  heroSubtitle: string;
  heroDescription?: string | null;
  jalurData: JalurData[];
  gelombangData: GelombangData[];
}

export async function getSPMBSettings(): Promise<SPMBSettings> {
  let settings = await prisma.sPMBSetting.findUnique({
    where: { id: "default" },
  });

  // If no settings exist, create default
  if (!settings) {
    settings = await prisma.sPMBSetting.create({
      data: {
        id: "default",
        academicYear: "2025/2026",
        registrationOpen: true,
        heroTitle: "SPMB SMP IT MASJID SYUHADA",
        heroSubtitle: "TAHUN PELAJARAN 2025/2026",
        gelombangData: "[]",
        jalurData: "[]",
        biayaData: "{}",
        syaratData: "[]",
        wawancaraData: "{}",
      },
    });
  }

  // Parse JSON fields
  return {
    academicYear: settings.academicYear,
    heroTitle: settings.heroTitle,
    heroSubtitle: settings.heroSubtitle,
    heroDescription: settings.heroDescription,
    jalurData: JSON.parse(settings.jalurData) as JalurData[],
    gelombangData: JSON.parse(settings.gelombangData) as GelombangData[],
  };
}


