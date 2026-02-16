"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

/**
 * Sanitize URL input
 * - Trim whitespace
 * - Remove control characters
 */
function sanitizeUrl(value: string): string {
  return value.trim().replace(/[\x00-\x1F\x7F]/g, "");
}

/**
 * Validate URL format (optional - can be Google Drive link, notes, etc.)
 */
function validateUrl(value: string): string | null {
  const sanitized = sanitizeUrl(value);
  if (!sanitized) {
    return "Link atau catatan tidak boleh kosong";
  }
  if (sanitized.length > 500) {
    return "Link atau catatan terlalu panjang (maksimal 500 karakter)";
  }
  // Allow any text (Google Drive link, notes, etc.)
  // Basic URL format check (optional)
  const urlPattern = /^(https?:\/\/|www\.|drive\.google\.com|notes?:|catatan?:)/i;
  const isLongText = sanitized.length > 100;
  if (!urlPattern.test(sanitized) && !isLongText && sanitized.includes(".")) {
    // If it looks like URL but doesn't start with http, suggest adding it
    if (sanitized.includes("://")) {
      return null; // Likely a valid URL
    }
  }
  return null;
}

export interface UploadOfflineModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  value: string;
  onChange: (value: string) => void;
  onConfirm: () => void;
  onCancelDraft?: () => void;
}

export function UploadOfflineModal({
  open,
  onOpenChange,
  value,
  onChange,
  onConfirm,
  onCancelDraft,
}: UploadOfflineModalProps) {
  const { toast } = useToast();
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 0);
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

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="upload-offline-title"
      aria-describedby="upload-offline-description"
      onClick={(e) => {
        // Close on backdrop click
        if (e.target === e.currentTarget) {
          onOpenChange(false);
        }
      }}
    >
      <div ref={containerRef} className="w-full max-w-lg rounded-xl bg-white p-4 shadow-xl">
        <div className="mb-2 flex items-center justify-between">
          <h4 id="upload-offline-title" className="text-sm font-semibold">
            Upload Bukti Offline
          </h4>
          <button
            type="button"
            className="rounded p-1 text-slate-500 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
            onClick={() => onOpenChange(false)}
            aria-label="Tutup dialog"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="space-y-2">
          <p id="upload-offline-description" className="text-xs text-slate-600">
            Tempel link Google Drive atau catatan bukti interview yang dikumpulkan manual.
          </p>
          <Input
            ref={inputRef}
            value={value}
            onChange={(e) => {
              const newValue = sanitizeUrl(e.target.value);
              onChange(newValue);
              // Clear error when user types
              if (error) {
                setError(null);
              }
            }}
            placeholder="Tempel link drive atau catatan bukti offline"
            aria-label="Input link bukti offline"
            aria-describedby={error ? "upload-offline-error upload-offline-description" : "upload-offline-description"}
            aria-invalid={error ? "true" : "false"}
            className={error ? "border-red-500 focus-visible:ring-red-500" : ""}
          />
          {error && (
            <div
              id="upload-offline-error"
              className="flex items-center gap-1.5 text-xs text-red-600"
              role="alert"
            >
              <AlertCircle className="h-3.5 w-3.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <Button
            variant="ghost"
            onClick={() => {
              onCancelDraft?.();
              onOpenChange(false);
            }}
          >
            Batal
          </Button>
          <Button
            className="bg-emerald-600 hover:bg-emerald-700"
            onClick={() => {
              const sanitized = sanitizeUrl(value);
              const validationError = validateUrl(sanitized);
              if (validationError) {
                setError(validationError);
                toast({
                  title: "Input Tidak Valid",
                  description: validationError,
                  variant: "destructive",
                });
                return;
              }
              setError(null);
              // Use sanitized value
              if (sanitized !== value) {
                onChange(sanitized);
              }
              onConfirm();
              onOpenChange(false);
            }}
          >
            Konfirmasi Upload
          </Button>
        </div>
      </div>
    </div>
  );
}


