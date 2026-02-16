import { InterviewFormStatus, type PrismaClient } from "@prisma/client";

import { prisma } from "@/lib/prisma";

type PrismaExecutor = PrismaClient;

export type DefaultInterviewTypeConfig = {
  key: string;
  name: string;
  description: string;
  googleFormUrl: string;
  isRequired?: boolean;
  defaultFormSlugPrefix?: string;
};

export const DEFAULT_INTERVIEW_TYPES: DefaultInterviewTypeConfig[] = [
  {
    key: "diniyah",
    name: "Interview Diniyah",
    description:
      "Interview untuk menilai kemampuan diniyah, hafalan Qur'an, dan aktivitas ibadah.",
    googleFormUrl: "https://forms.gle/diniyah-demo",
    isRequired: true,
    defaultFormSlugPrefix: "seleksi-diniyah",
  },
  {
    key: "kesiswaan",
    name: "Interview Kesiswaan",
    description:
      "Interview kesiswaan untuk menggali konsep diri, sosial, akademik, dan prestasi.",
    googleFormUrl: "https://forms.gle/kesiswaan-demo",
    isRequired: true,
    defaultFormSlugPrefix: "wawancara-kesiswaan",
  },
  {
    key: "observasi-karakter",
    name: "Observasi Karakter",
    description:
      "Observasi karakter dan sikap harian untuk memantau kedisiplinan serta interaksi sosial.",
    googleFormUrl: "https://forms.gle/observasi-demo",
    isRequired: false,
    defaultFormSlugPrefix: "observasi-karakter",
  },
  {
    key: "home-visit",
    name: "Kunjungan Rumah",
    description:
      "Home visit dan kolaborasi orang tua untuk menggali dukungan lingkungan belajar.",
    googleFormUrl: "https://forms.gle/home-visit-demo",
    isRequired: false,
    defaultFormSlugPrefix: "kunjungan-rumah",
  },
];

async function getExecutor(executor?: PrismaExecutor) {
  return executor ?? prisma;
}

export async function ensureDefaultInterviewTypes(executor?: PrismaExecutor) {
  const db = await getExecutor(executor);

  for (const config of DEFAULT_INTERVIEW_TYPES) {
    const existing = await db.interviewType.findFirst({
      where: { name: config.name },
    });

    if (existing) {
      continue;
    }

    await db.interviewType.create({
      data: {
        name: config.name,
        description: config.description,
        googleFormUrl: config.googleFormUrl,
        isRequired: config.isRequired ?? true,
      },
    });
  }
}

export async function syncDefaultInterviewForms(executor?: PrismaExecutor) {
  const db = await getExecutor(executor);

  for (const config of DEFAULT_INTERVIEW_TYPES) {
    const type = await db.interviewType.findFirst({
      where: { name: config.name },
      select: {
        id: true,
        defaultFormId: true,
      },
    });

    if (!type) {
      continue;
    }

    if (type.defaultFormId) {
      continue;
    }

    if (!config.defaultFormSlugPrefix) {
      continue;
    }

    const form = await db.interviewForm.findFirst({
      where: {
        slug: {
          startsWith: config.defaultFormSlugPrefix,
        },
        status: InterviewFormStatus.PUBLISHED,
      },
      select: { id: true },
      orderBy: { updatedAt: "desc" },
    });

    if (!form) {
      continue;
    }

    await db.interviewType.update({
      where: { id: type.id },
      data: {
        defaultFormId: form.id,
      },
    });
  }
}

