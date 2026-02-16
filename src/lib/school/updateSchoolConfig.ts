"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getSchoolConfig, type SchoolConfigData } from "./getSchoolConfig";

const DEFAULT_CONFIG_ID = "school-config-default";

const updateSchema = z.object({
  schoolName: z.string().min(1),
  academicYear: z.string().min(1),
  address: z.string().min(1).optional(),
  contactEmail: z.string().email().optional(),
  logoUrl: z.string().url().optional(),
});

export type UpdateSchoolConfigInput = z.infer<typeof updateSchema>;

export async function updateSchoolConfig(
  input: UpdateSchoolConfigInput,
): Promise<SchoolConfigData> {
  const data = updateSchema.parse(input);

  const updated = await prisma.schoolConfig.upsert({
    where: { id: DEFAULT_CONFIG_ID },
    update: data,
    create: {
      id: DEFAULT_CONFIG_ID,
      ...data,
    },
  });

  // Revalidate primary entry points that display school information
  revalidatePath("/");
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/school");
  revalidatePath("/signup");

  return updated;
}

export async function refreshSchoolConfig() {
  return getSchoolConfig();
}

