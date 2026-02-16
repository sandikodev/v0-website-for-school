"use client";

import { cn } from "@/lib/utils";

interface ProgressStepsProps {
  currentStep: number;
  totalSteps: number;
}

export function ProgressSteps({ currentStep, totalSteps }: ProgressStepsProps) {
  return (
    <div className="mb-8">
      <div className="mb-4 flex items-center justify-between">
        {Array.from({ length: totalSteps }, (_, index) => {
          const step = index + 1;
          const isPast = step < currentStep;
          const isCurrent = step === currentStep;

          return (
            <div key={step} className="flex flex-1 items-center">
              <div className="flex flex-1 flex-col items-center">
                <div
                  className={cn(
                    "mb-2 flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold transition-all",
                    isPast && "bg-emerald-500 text-white shadow-md",
                    isCurrent &&
                      "bg-emerald-600 text-white shadow-lg ring-4 ring-emerald-200",
                    !isPast && !isCurrent && "bg-gray-200 text-gray-500",
                  )}
                >
                  {isPast ? "✓" : step}
                </div>
                <span
                  className={cn(
                    "hidden text-center text-xs font-medium sm:block",
                    step <= currentStep ? "text-emerald-700" : "text-gray-400",
                  )}
                >
                  {step === 1 && "Data Siswa"}
                  {step === 2 && "Orangtua"}
                  {step === 3 && "Sekolah"}
                  {step === 4 && "Konfirmasi"}
                </span>
              </div>
              {step < totalSteps && (
                <div
                  className={cn(
                    "mx-2 h-1 flex-1 rounded transition-all",
                    step < currentStep ? "bg-emerald-500" : "bg-gray-200",
                  )}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

