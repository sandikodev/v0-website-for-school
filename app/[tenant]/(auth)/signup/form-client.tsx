"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, ArrowLeft, ArrowRight } from "lucide-react";
import { ProgressSteps } from "@/components/signup/ProgressSteps";
import { StepPersonal } from "@/components/signup/StepPersonal";
import { StepParent } from "@/components/signup/StepParent";
import { StepSchool } from "@/components/signup/StepSchool";
import { StepConfirm } from "@/components/signup/StepConfirm";
import { ConfirmSubmitDialog } from "@/components/signup/ConfirmSubmitDialog";
import { useSignupForm } from "@/hooks/useSignupForm";
import { useSchoolConfig } from "@/hooks/useSchoolConfig";
import { useWhatsAppContact } from "@/hooks/useWhatsAppContact";
import type { SPMBSettings } from "@/lib/spmb/getSPMBSettings";

const SuccessClient = dynamic(() => import("./success-client"), {
  ssr: false,
});

interface FormClientProps {
  initialSPMBSettings: SPMBSettings;
}

export default function FormClient({ initialSPMBSettings }: FormClientProps) {
  const { step, totalSteps, schema, state, status, summary, handlers } =
    useSignupForm();
  const { config } = useSchoolConfig();
  const [showConfirmDialog, setShowConfirmDialog] = React.useState(false);
  const whatsAppContact = useWhatsAppContact("admissions");

  const handleSubmitClick = () => {
    setShowConfirmDialog(true);
  };

  const handleConfirmedSubmit = () => {
    setShowConfirmDialog(false);
    handlers.submit();
  };

  if (status.phase === "success" && status.registrationNumber) {
    return (
      <SuccessClient
        registrationNumber={status.registrationNumber}
        uploadedFiles={state.uploadedFiles}
        onReset={handlers.reset}
      />
    );
  }

  return (
    <div className="py-10">
      <div className="mx-auto max-w-4xl px-4">
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-3xl font-bold text-emerald-800">
            {initialSPMBSettings.heroTitle || "Formulir Pendaftaran Online"}
          </h1>
          <p className="text-gray-600">
            {initialSPMBSettings.heroSubtitle ||
              `${config.schoolName} – Tahun Pelajaran ${config.academicYear}`}
          </p>
          {initialSPMBSettings.heroDescription && (
            <p className="mt-2 text-sm text-gray-500 max-w-2xl mx-auto">
              {initialSPMBSettings.heroDescription}
            </p>
          )}
        </div>

        <ProgressSteps currentStep={step} totalSteps={totalSteps} />

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {summary.title}
            </CardTitle>
            <CardDescription>{summary.subtitle}</CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Step Content */}
            {step === 1 && (
              <StepPersonal
                values={state.values}
                schema={schema}
                onChange={handlers.updateField}
              />
            )}
            {step === 2 && (
              <StepParent
                values={state.values}
                schema={schema}
                onChange={handlers.updateField}
              />
            )}
            {step === 3 && (
              <StepSchool
                values={state.values}
                schema={schema}
                uploadedFiles={state.uploadedFiles}
                uploadState={state.upload}
                onChange={handlers.updateField}
                onUpload={handlers.handleUpload}
                onRemoveFile={handlers.removeFile}
                jalurData={initialSPMBSettings.jalurData}
                gelombangData={initialSPMBSettings.gelombangData}
              />
            )}
            {step === 4 && (
              <StepConfirm
                values={state.values}
                schema={schema}
                uploadedFiles={state.uploadedFiles}
                onToggleAgreement={handlers.toggleAgreement}
              />
            )}

            {/* Error Alert */}
            {status.error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{status.error}</AlertDescription>
              </Alert>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between gap-3 border-t pt-6">
              <Button
                variant="outline"
                onClick={handlers.prevStep}
                disabled={step === 1 || status.pending}
                className="min-w-[120px]"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Sebelumnya
              </Button>

              {step < totalSteps ? (
                <Button
                  onClick={handlers.nextStep}
                  disabled={!summary.allowNext || status.pending}
                  className="min-w-[120px] bg-emerald-600 hover:bg-emerald-700"
                >
                  Selanjutnya
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmitClick}
                  disabled={!state.values.persetujuan || status.pending}
                  className="min-w-[160px] bg-emerald-600 hover:bg-emerald-700"
                >
                  {status.pending ? "Mengirim..." : "Kirim Pendaftaran"}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Confirmation Dialog */}
        <ConfirmSubmitDialog
          open={showConfirmDialog}
          onOpenChange={setShowConfirmDialog}
          onConfirm={handleConfirmedSubmit}
          isPending={status.pending}
          whatsAppContact={whatsAppContact}
        />

        <Card className="mt-6 border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="mt-0.5 h-5 w-5 text-blue-600" />
              <div className="text-sm text-blue-800">
                <p className="mb-1 font-medium">Informasi Penting:</p>
                <ul className="space-y-1 text-xs">
                  <li>• Pastikan semua data yang dimasukkan sudah benar.</li>
                  <li>
                    • Setelah mengirim formulir, Anda akan mendapat nomor
                    pendaftaran.
                  </li>
                  <li>
                    • Tim kami akan menghubungi Anda dalam 1-2 hari kerja untuk
                    proses lanjutan.
                  </li>
                  <li>• Pertanyaan? Hubungi WA Center: 085878958029.</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

