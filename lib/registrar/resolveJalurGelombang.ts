"use server";

import { getSPMBSettings } from "@/lib/spmb/getSPMBSettings";

/**
 * Resolve jalur ID to display name
 */
export async function resolveJalurName(
  jalurId: string | null | undefined,
): Promise<string> {
  if (!jalurId) return "-";

  const settings = await getSPMBSettings();
  const jalur = settings.jalurData.find((j) => j.id === jalurId);

  return jalur?.name || jalurId;
}

/**
 * Resolve gelombang ID to display name
 */
export async function resolveGelombangName(
  gelombangId: string | null | undefined,
): Promise<string> {
  if (!gelombangId) return "-";

  const settings = await getSPMBSettings();
  const gelombang = settings.gelombangData.find((g) => g.id === gelombangId);

  return gelombang?.name || gelombangId;
}

/**
 * Resolve both jalur and gelombang names
 */
export async function resolveJalurGelombangNames(
  jalurId: string | null | undefined,
  gelombangId: string | null | undefined,
): Promise<{ jalurName: string; gelombangName: string }> {
  const settings = await getSPMBSettings();

  const jalurName = jalurId
    ? settings.jalurData.find((j) => j.id === jalurId)?.name || jalurId
    : "-";

  const gelombangName = gelombangId
    ? settings.gelombangData.find((g) => g.id === gelombangId)?.name ||
      gelombangId
    : "-";

  return { jalurName, gelombangName };
}


