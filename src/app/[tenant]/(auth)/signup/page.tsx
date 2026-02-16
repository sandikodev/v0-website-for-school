import { Suspense } from "react";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { Metadata } from "next";
import FormClient from "./form-client";
import { getSPMBSettings } from "@/lib/spmb/getSPMBSettings";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSPMBSettings();

  return {
    title: settings.heroTitle || "Formulir Pendaftaran Online",
    description:
      settings.heroDescription ||
      `Lengkapi data pendaftaran ${settings.heroSubtitle || "siswa baru"}`,
  };
}

export default async function SignupPage() {
  const cookieStore = await cookies();
  const authenticated = cookieStore.get("auth_token");

  if (authenticated?.value === "admin") {
    redirect("/admin/dashboard");
  }

  // Fetch SPMB settings server-side
  const spmbSettings = await getSPMBSettings();

  return (
    <Suspense
      fallback={
        <div className="py-16 text-center text-sm text-gray-500">
          Memuat formulir...
        </div>
      }
    >
      <FormClient initialSPMBSettings={spmbSettings} />
    </Suspense>
  );
}
