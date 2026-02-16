"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

type InterviewSessionStatus =
  | "PENDING"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "REVIEWED"
  | "FAILED"
  | "RESCHEDULED";

export interface StartInterviewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  interview: {
    id: string;
    type: string;
    status: InterviewSessionStatus;
  } | null;
  onConfirm?: (interviewId: string) => void;
}

export function StartInterviewModal({
  open,
  onOpenChange,
  interview,
  onConfirm,
}: StartInterviewModalProps) {
  const confirmRef = React.useRef<HTMLButtonElement | null>(null);
  const containerRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    if (open) {
      setTimeout(() => confirmRef.current?.focus(), 0);
    }
  }, [open]);

  // Focus trap + ESC
  React.useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onOpenChange(false);
        return;
      }
      if (e.key === "Tab") {
        const root = containerRef.current;
        if (!root) return;
        const focusables = root.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        const active = document.activeElement as HTMLElement | null;
        if (e.shiftKey) {
          if (active === first || !root.contains(active)) {
            last.focus();
            e.preventDefault();
          }
        } else {
          if (active === last) {
            first.focus();
            e.preventDefault();
          }
        }
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, onOpenChange]);

  if (!open || !interview) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="start-interview-title"
      aria-describedby="start-interview-description"
      onClick={(e) => {
        // Close on backdrop click
        if (e.target === e.currentTarget) {
          onOpenChange(false);
        }
      }}
    >
      <div ref={containerRef} className="w-full max-w-md rounded-xl bg-white p-4 shadow-xl">
        <div className="mb-2 flex items-center justify-between">
          <h4 id="start-interview-title" className="text-sm font-semibold">
            Konfirmasi {interview.status === "IN_PROGRESS" ? "Lanjutkan" : "Mulai"} Interview
          </h4>
          <button
            type="button"
            className="rounded p-1 text-slate-500 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
            onClick={() => onOpenChange(false)}
            aria-label="Tutup dialog"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <p id="start-interview-description" className="text-sm text-slate-600">
          Anda akan diarahkan ke form interview {interview.type}.
        </p>
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Batal
          </Button>
          <Button
            ref={confirmRef}
            className="bg-orange-600 hover:bg-orange-700"
            onClick={() => {
              onOpenChange(false);
              onConfirm?.(interview.id);
            }}
          >
            Buka Form
          </Button>
        </div>
      </div>
    </div>
  );
}


