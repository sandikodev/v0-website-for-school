import { Suspense } from "react";
import type { Metadata } from "next";

import { RegistrarClient } from "@/components/registrar/RegistrarClient";
import { getSubmissionByRegistrationNumber } from "@/lib/registrar/getSubmission";
import { listInterviewSessions } from "@/lib/interview/session-service";
import { mapSubmissionToDTO, mapSessionToDTO } from "@/lib/registrar/mappers";
import {
  RegistrarHeaderSkeleton,
  SearchCardSkeleton,
  StatusCardSkeleton,
  InterviewListSkeleton,
  SubmissionDetailsSkeleton,
} from "@/components/registrar/RegistrarSkeletons";

interface RegistrarPageProps {
  searchParams?: Promise<{
    id?: string | string[];
  }>;
}

export async function generateMetadata({
  searchParams,
}: RegistrarPageProps): Promise<Metadata> {
  const resolvedParams = (await searchParams) ?? {};
  const idParam = resolvedParams.id;
  const registrationNumber =
    typeof idParam === "string" ? idParam.toUpperCase() : "";

  if (registrationNumber) {
    const submission = await getSubmissionByRegistrationNumber(
      registrationNumber
    );
    if (submission) {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://www.smpitmasjidsyuhada.sch.id";
      return {
        title: `Status Pendaftaran ${registrationNumber} - SPMB SMP IT Masjid Syuhada`,
        description: `Cek status pendaftaran SPMB untuk ${submission.namaLengkap} dengan nomor pendaftaran ${registrationNumber}. Lihat status interview, dokumen, dan informasi pendaftaran lainnya.`,
        openGraph: {
          title: `Status Pendaftaran ${registrationNumber}`,
          description: `Status pendaftaran SPMB untuk ${submission.namaLengkap}`,
          type: "website",
          url: `${baseUrl}/registrar?id=${encodeURIComponent(registrationNumber)}`,
          siteName: "SMP IT Masjid Syuhada",
        },
        twitter: {
          card: "summary",
          title: `Status Pendaftaran ${registrationNumber}`,
          description: `Status pendaftaran SPMB untuk ${submission.namaLengkap}`,
        },
      };
    }
  }

  return {
    title: "Cek Status Pendaftaran - SPMB SMP IT Masjid Syuhada",
    description:
      "Cek status pendaftaran SPMB Anda dengan memasukkan nomor pendaftaran. Lihat status interview, dokumen, dan informasi pendaftaran lainnya.",
    openGraph: {
      title: "Cek Status Pendaftaran - SPMB SMP IT Masjid Syuhada",
      description:
        "Cek status pendaftaran SPMB Anda dengan memasukkan nomor pendaftaran. Lihat status interview, dokumen, dan informasi pendaftaran lainnya.",
      type: "website",
      url: `${process.env.NEXT_PUBLIC_BASE_URL || "https://www.smpitmasjidsyuhada.sch.id"}/registrar`,
      siteName: "SMP IT Masjid Syuhada",
    },
    twitter: {
      card: "summary",
      title: "Cek Status Pendaftaran - SPMB SMP IT Masjid Syuhada",
      description:
        "Cek status pendaftaran SPMB Anda dengan memasukkan nomor pendaftaran.",
    },
  };
}

export default async function RegistrarPage({
  searchParams,
}: RegistrarPageProps) {
  const resolvedParams = (await searchParams) ?? {};
  const idParam = resolvedParams.id;
  const registrationNumber =
    typeof idParam === "string" ? idParam.toUpperCase() : "";

  const submission = registrationNumber
    ? await getSubmissionByRegistrationNumber(registrationNumber)
    : null;
  const initialSessionsRaw =
    submission?.id && registrationNumber
      ? await listInterviewSessions({ submissionId: submission.id })
      : [];
  const submissionDTO = submission ? mapSubmissionToDTO(submission) : null;
  const initialSessions = Array.isArray(initialSessionsRaw)
    ? initialSessionsRaw.map(mapSessionToDTO)
    : [];

  return (
    <Suspense
      fallback={
        <div className="container mx-auto max-w-3xl px-4 py-12">
          <RegistrarHeaderSkeleton />
          <SearchCardSkeleton />
          <div className="space-y-6">
            <StatusCardSkeleton />
            <InterviewListSkeleton items={3} />
            <SubmissionDetailsSkeleton />
          </div>
        </div>
      }
    >
      <RegistrarClient
        initialQuery={registrationNumber}
        initialSubmission={submissionDTO}
        initialSessions={initialSessions}
      />
    </Suspense>
  );
}
