"use server";

import { prisma } from "@/lib/prisma";

const DEFAULT_CONFIG_ID = "school-config-default";

const FALLBACK_CONFIG = {
  schoolName: "SMP IT Masjid Syuhada",
  academicYear: "2025/2026",
  address: "Jl. Masjid Syuhada No.1, Yogyakarta",
  contactEmail: "info@smpitsyuhada.sch.id",
  logoUrl: "/logo.png",
};

export async function getSchoolConfig() {
  const existing = await prisma.schoolConfig.findUnique({
    where: { id: DEFAULT_CONFIG_ID },
  });

  if (existing) {
    return existing;
  }

  return prisma.schoolConfig.create({
    data: {
      id: DEFAULT_CONFIG_ID,
      ...FALLBACK_CONFIG,
    },
  });
}

export type SchoolConfigData = Awaited<ReturnType<typeof getSchoolConfig>>;

