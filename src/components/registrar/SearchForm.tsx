"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SearchFormProps {
  query: string;
  isSearching: boolean;
  onQueryChange: (value: string) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

// Format: SPMB-YYYY-XXXX (e.g., SPMB-2025-0935)
const REGISTRATION_NUMBER_REGEX = /^SPMB-\d{4}-\d{4}$/;

/**
 * Sanitize registration number input
 * - Trim whitespace
 * - Convert to uppercase
 * - Remove extra spaces
 * - Remove non-printable characters
 */
function sanitizeRegistrationNumber(value: string): string {
  return value
    .trim()
    .toUpperCase()
    .replace(/\s+/g, "")
    .replace(/[^\w-]/g, "");
}

/**
 * Validate registration number format
 */
function validateRegistrationNumber(value: string): string | null {
  const sanitized = sanitizeRegistrationNumber(value);
  if (!sanitized) {
    return "Nomor pendaftaran wajib diisi";
  }
  if (!REGISTRATION_NUMBER_REGEX.test(sanitized)) {
    return "Format nomor pendaftaran tidak valid. Gunakan format: SPMB-YYYY-XXXX (contoh: SPMB-2025-0935)";
  }
  return null;
}

export function SearchForm({
  query,
  isSearching,
  onQueryChange,
  onSubmit,
}: SearchFormProps) {
  const { toast } = useToast();
  const [error, setError] = React.useState<string | null>(null);

  const handleSubmit = React.useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      // Sanitize input before validation
      const sanitized = sanitizeRegistrationNumber(query);
      const validationError = validateRegistrationNumber(sanitized);
      if (validationError) {
        setError(validationError);
        toast({
          title: "Format Nomor Pendaftaran Salah",
          description: validationError,
          variant: "destructive",
        });
        return;
      }
      setError(null);
      // Use sanitized value
      if (sanitized !== query) {
        onQueryChange(sanitized);
      }
      onSubmit(e);
    },
    [query, onSubmit, toast, onQueryChange]
  );

  const handleChange = React.useCallback(
    (value: string) => {
      // Allow empty value (for deletion)
      // Sanitize on change (remove non-printable, normalize spaces)
      const sanitized = value
        .replace(/[^\w\s-]/g, "") // Remove non-word characters except spaces and hyphens
        .toUpperCase();
      onQueryChange(sanitized);
      // Clear error when user types
      if (error) {
        setError(null);
      }
    },
    [onQueryChange, error]
  );

  return (
    <div>
      <CardHeader className="px-0 pt-0">
        <CardTitle className="flex items-center gap-2">
          <Search className="h-5 w-5" />
          Nomor Pendaftaran
        </CardTitle>
        <CardDescription>
          Masukkan nomor pendaftaran yang Anda terima setelah mendaftar
        </CardDescription>
      </CardHeader>
      <div className="mt-4">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col items-stretch gap-2 sm:flex-row sm:items-center"
          noValidate
        >
          <div className="flex-1">
            <Input
              inputMode="search"
              placeholder="SPMB-2025-XXXX"
              value={query}
              onChange={(event) => handleChange(event.target.value)}
              className={`font-mono ${error ? "border-red-500 focus-visible:ring-red-500" : ""}`}
              disabled={isSearching}
              aria-invalid={error ? "true" : "false"}
              aria-describedby={error ? "registration-error" : undefined}
            />
            {error && (
              <div
                id="registration-error"
                className="mt-1.5 flex items-center gap-1.5 text-sm text-red-600"
                role="alert"
              >
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}
          </div>
          <Button
            type="submit"
            className="shrink-0 bg-primary hover:bg-primary-hover text-primary-foreground"
            disabled={isSearching}
          >
            {isSearching ? "Mencari..." : "Cari Status"}
          </Button>
        </form>
        {!query && !error && (
          <div className="mt-4 text-sm text-muted-foreground">
            <p className="mb-2">Contoh nomor pendaftaran:</p>
            <code className="rounded bg-muted px-3 py-1 font-mono text-primary">
              SPMB-2025-0935
            </code>
          </div>
        )}
      </div>
    </div>
  );
}

