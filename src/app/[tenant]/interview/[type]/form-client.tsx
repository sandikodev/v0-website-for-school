"use client";

import { useMemo } from "react";
import type { InterviewConfig, InterviewValues } from "@/lib/interview/config";
import { useInterviewForm } from "@/hooks/useInterviewForm";
import { InterviewProgress } from "@/components/interview/InterviewProgress";
import { InterviewStepFields } from "@/components/interview/InterviewStepFields";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, ArrowLeft, ArrowRight, CheckCircle } from "lucide-react";

interface InterviewFormClientProps {
  sessionId: string;
  config: InterviewConfig;
  initialValues?: InterviewValues | null;
  applicantName?: string | null;
  registrationNumber?: string | null;
  interviewTypeName: string;
}

export function InterviewFormClient({
  sessionId,
  config,
  initialValues,
  applicantName,
  registrationNumber,
  interviewTypeName,
}: InterviewFormClientProps) {
  const {
    step,
    totalSteps,
    steps,
    values,
    status,
    summary,
    handlers,
  } = useInterviewForm({
    sessionId,
    config,
    initialValues,
  });

  const candidateInfo = useMemo(
    () => ({
      applicantName: applicantName ?? "Peserta tanpa nama",
      registrationNumber: registrationNumber ?? "Tidak tersedia",
    }),
    [applicantName, registrationNumber],
  );

  if (status.phase === "success") {
    return (
      <div className="py-10">
        <div className="mx-auto max-w-4xl px-4">
          <Card className="border-emerald-200 bg-emerald-50">
            <CardHeader className="space-y-3 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                <CheckCircle className="h-10 w-10" />
              </div>
              <CardTitle className="text-2xl font-semibold text-emerald-800">
                Hasil interview tersimpan
              </CardTitle>
              <CardDescription className="text-base text-emerald-700">
                Terima kasih! Evaluasi {candidateInfo.applicantName} telah berhasil disimpan.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-4 pb-8 text-sm text-emerald-700">
              <div className="rounded-lg border border-emerald-300 bg-white px-4 py-3 text-center">
                <p className="font-medium">Nomor Pendaftaran</p>
                <p className="text-lg font-semibold text-emerald-900">
                  {candidateInfo.registrationNumber}
                </p>
              </div>
              <Button variant="outline" onClick={handlers.reset}>
                Isi ulang formulir
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="py-10">
      <div className="mx-auto max-w-5xl px-4">
        <div className="mb-8 space-y-4 text-center">
          <div className="flex flex-col gap-2 text-sm text-slate-600 sm:flex-row sm:items-center sm:justify-center sm:gap-4">
            <span className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 font-medium text-emerald-700">
              {interviewTypeName}
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1">
              Nomor Pendaftaran:
              <span className="font-semibold text-slate-700">
                {candidateInfo.registrationNumber}
              </span>
            </span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900">
            Formulir Interview {interviewTypeName}
          </h1>
          <p className="text-sm text-slate-600">
            Nilai setiap bagian secara berurutan. Progres akan tersimpan otomatis meskipun halaman ditutup.
          </p>
        </div>

        <InterviewProgress steps={steps} currentStep={step} />

        <Card className="border-slate-200 shadow-lg">
          <CardHeader>
            <CardTitle className="flex flex-col gap-1 text-xl font-semibold text-slate-900 sm:flex-row sm:items-center sm:justify-between">
              <span>{summary.title}</span>
              <span className="text-sm font-normal text-slate-500">
                {summary.completedFields} dari {summary.totalFields} pertanyaan terisi
              </span>
            </CardTitle>
            {summary.description && (
              <CardDescription className="text-slate-600">
                {summary.description}
              </CardDescription>
            )}
          </CardHeader>
          <CardContent className="space-y-6">
            {status.error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{status.error}</AlertDescription>
              </Alert>
            )}

            <InterviewStepFields
              step={steps[step - 1]}
              values={values}
              onChange={{
                updateField: handlers.updateField,
                updateTextarea: handlers.updateTextarea,
                selectOption: handlers.selectOption,
                toggleCheckbox: handlers.toggleCheckbox,
                updateOtherField: handlers.updateOtherField,
              }}
              disabled={status.pending}
            />

            <div className="flex flex-col gap-2 border-t border-slate-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
              <Button
                variant="outline"
                onClick={handlers.prevStep}
                disabled={step === 1 || status.pending}
                className="w-full sm:w-auto"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Sebelumnya
              </Button>

              {step < totalSteps ? (
                <Button
                  onClick={handlers.nextStep}
                  disabled={!summary.allowNext || status.pending}
                  className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700"
                >
                  Selanjutnya
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button
                  onClick={handlers.submit}
                  disabled={status.pending || !summary.allowNext}
                  className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700"
                >
                  {status.pending ? "Menyimpan..." : "Simpan Hasil Interview"}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


