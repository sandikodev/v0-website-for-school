"use client";

import type { InterviewStep } from "@/lib/interview/config";
import { cn } from "@/lib/utils";

interface InterviewProgressProps {
  steps: InterviewStep[];
  currentStep: number;
}

export function InterviewProgress({ steps, currentStep }: InterviewProgressProps) {
  return (
    <div className="mb-8">
      <div className="mb-4 flex flex-col gap-4">
        <div className="flex flex-1 items-center justify-between gap-2">
          {steps.map((step, index) => {
            const stepNumber = index + 1;
            const isPast = stepNumber < currentStep;
            const isCurrent = stepNumber === currentStep;
            const isLast = stepNumber === steps.length;

            return (
              <div key={step.id} className="flex flex-1 items-center">
                <div className="flex flex-1 flex-col items-center">
                  <div
                    className={cn(
                      "mb-2 flex h-12 w-12 items-center justify-center rounded-full text-sm font-semibold transition-all",
                      isPast && "bg-emerald-500 text-white shadow-md",
                      isCurrent &&
                        "bg-emerald-600 text-white shadow-lg ring-4 ring-emerald-200",
                      !isPast && !isCurrent && "bg-slate-200 text-slate-500",
                    )}
                  >
                    {isPast ? "✓" : stepNumber}
                  </div>
                  <div className="space-y-1 text-center">
                    <p
                      className={cn(
                        "text-sm font-semibold",
                        stepNumber <= currentStep
                          ? "text-emerald-700"
                          : "text-slate-500",
                      )}
                    >
                      {step.title}
                    </p>
                    {step.description && (
                      <p className="hidden text-xs text-slate-500 sm:block">
                        {step.description}
                      </p>
                    )}
                  </div>
                </div>
                {!isLast && (
                  <div
                    className={cn(
                      "mx-2 hidden h-1 flex-1 rounded sm:block",
                      stepNumber < currentStep ? "bg-emerald-500" : "bg-slate-200",
                    )}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}


