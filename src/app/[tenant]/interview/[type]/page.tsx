import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  getInterviewConfig,
  buildConfigFromForm,
  type FormWithRelations,
} from "@/lib/interview/config";
import { getInterviewSessionById } from "@/lib/interview/getSession";
import { normalizeInterviewValues, type InterviewValues } from "@/lib/interview/schema";
import { InterviewFormClient } from "./form-client";
import { getInterviewFormBySlug } from "@/lib/interview/form-service";

interface InterviewPageProps {
  params: Promise<{
    type: string;
    tenant: string;
  }>;
  searchParams: Promise<{
    session?: string;
  }>;
}

export async function generateMetadata({
  params,
}: InterviewPageProps): Promise<Metadata> {
  const { type } = await params;
  const config = getInterviewConfig(type);
  if (!config) {
    return {
      title: "Interview tidak ditemukan",
    };
  }

  return {
    title: `Form Interview ${config.name}`,
    description:
      "Lengkapi hasil penilaian interview kandidat. Progres disimpan otomatis untuk kenyamanan Anda.",
  };
}

export default async function InterviewPage({
  params,
  searchParams,
}: InterviewPageProps) {
  const { session: sessionId } = await searchParams;
  if (!sessionId) {
    notFound();
  }

  const session = await getInterviewSessionById(sessionId);
  if (!session) {
    notFound();
  }

  const { type: formSlug } = await params;

  const [formFromSlug, defaultForm] = await Promise.all([
    getInterviewFormBySlug(formSlug),
    session.interviewType?.defaultForm ?? null,
  ]);

  const typedFormFromSlug = formFromSlug as FormWithRelations | null;
  const typedDefaultForm = defaultForm as FormWithRelations | null;

  const config =
    typedFormFromSlug && typedFormFromSlug.sections?.length
      ? buildConfigFromForm(typedFormFromSlug)
      : typedDefaultForm && typedDefaultForm.sections?.length
        ? buildConfigFromForm(typedDefaultForm)
        : getInterviewConfig(formSlug);

  if (!config) {
    notFound();
  }

  const rawValues =
    session.result?.responseData && typeof session.result.responseData === "object"
      ? (session.result.responseData as Record<string, unknown>)
      : null;

  const initialValues = normalizeInterviewValues(
    config,
    rawValues as InterviewValues | null,
  );

  return (
    <InterviewFormClient
      sessionId={session.id}
      config={config}
      initialValues={initialValues}
      applicantName={session.submission?.namaLengkap}
      registrationNumber={session.submission?.registrationNumber}
      interviewTypeName={formFromSlug?.title ?? session.interviewType.name}
    />
  );
}


