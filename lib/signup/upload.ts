"use server";

import { mkdir, writeFile } from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import { randomUUID } from "crypto";
import { SignupUploadedFilePayload } from "./schema";

const MAX_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "application/pdf",
]);

async function ensureUploadsDir(): Promise<string> {
  const uploadsDir = path.join(process.cwd(), "public", "uploads");
  if (!existsSync(uploadsDir)) {
    await mkdir(uploadsDir, { recursive: true });
  }
  return uploadsDir;
}

export async function uploadFiles(
  formData: FormData,
): Promise<SignupUploadedFilePayload[]> {
  const entries = formData.getAll("files");
  if (entries.length === 0) {
    throw new Error("Tidak ada file yang dikirim");
  }

  const uploadsDir = await ensureUploadsDir();
  const uploaded: SignupUploadedFilePayload[] = [];

  for (const entry of entries) {
    if (!(entry instanceof File)) {
      continue;
    }

    if (!ALLOWED_TYPES.has(entry.type)) {
      throw new Error(
        `Tipe file ${entry.name} tidak diizinkan. Gunakan JPG, PNG, WebP, atau PDF.`,
      );
    }

    if (entry.size > MAX_SIZE) {
      throw new Error(
        `Ukuran file ${entry.name} melebihi batas 5MB. Silakan kompres terlebih dahulu.`,
      );
    }

    const extension = entry.name.split(".").pop() ?? "dat";
    const filename = `${Date.now()}-${randomUUID()}.${extension}`;
    const filePath = path.join(uploadsDir, filename);
    const buffer = Buffer.from(await entry.arrayBuffer());

    await writeFile(filePath, buffer);

    uploaded.push({
      filename,
      originalName: entry.name,
      size: entry.size,
      type: entry.type,
      url: `/uploads/${filename}`,
    });
  }

  return uploaded;
}

