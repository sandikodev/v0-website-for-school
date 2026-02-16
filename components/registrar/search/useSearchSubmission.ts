"use client";

import * as React from "react";
import type { RegistrarSubmissionDTO } from "@/lib/registrar/types";

type SearchState = {
  loading: boolean;
  data: RegistrarSubmissionDTO | null;
  error: string | null;
};

export function useSearchSubmission() {
  const [state, setState] = React.useState<SearchState>({
    loading: false,
    data: null,
    error: null,
  });
  const controllerRef = React.useRef<AbortController | null>(null);
  const debounceRef = React.useRef<number | null>(null);
  const lastQueryRef = React.useRef<string | null>(null);
  const retryCountRef = React.useRef<number>(0);
  const maxRetries = 3;

  const performSearch = React.useCallback(
    async (registrationNumber: string, retryAttempt: number) => {
      controllerRef.current?.abort();
      const ac = new AbortController();
      controllerRef.current = ac;
      setState((s) => ({ ...s, loading: true, error: null }));
      try {
        const res = await fetch(
          `/api/forms/submissions/by-registration/${encodeURIComponent(registrationNumber)}`,
          { signal: ac.signal, cache: "no-store" }
        );
        if (!res.ok) {
          // User-friendly error messages based on status code
          let errorMessage = "Terjadi kesalahan saat memuat data";
          if (res.status === 404) {
            errorMessage = "Nomor pendaftaran tidak ditemukan. Pastikan nomor pendaftaran sudah benar.";
          } else if (res.status === 429) {
            errorMessage = "Terlalu banyak permintaan. Mohon tunggu beberapa saat dan coba lagi.";
          } else if (res.status >= 500) {
            // Retry for server errors
            if (retryAttempt < maxRetries) {
              errorMessage = `Server sedang mengalami gangguan. Mencoba lagi (${retryAttempt + 1}/${maxRetries})...`;
              setState({ loading: false, data: null, error: errorMessage });
              retryCountRef.current = retryAttempt + 1;
              setTimeout(() => {
                if (lastQueryRef.current) {
                  performSearch(lastQueryRef.current, retryAttempt + 1);
                }
              }, Math.min(1000 * Math.pow(2, retryAttempt), 5000));
              return;
            }
            errorMessage = "Server sedang mengalami gangguan. Mohon coba lagi nanti.";
          } else if (res.status === 400) {
            errorMessage = "Format nomor pendaftaran tidak valid. Pastikan menggunakan format SPMB-YYYY-XXXX.";
          }
          setState({ loading: false, data: null, error: errorMessage });
          retryCountRef.current = 0;
          return;
        }
        const json = await res.json();
        if (json.success && json.data) {
          setState({ loading: false, data: json.data as RegistrarSubmissionDTO, error: null });
          retryCountRef.current = 0;
        } else {
          // Use user-friendly message from API or fallback
          const apiMessage = json.message;
          let errorMessage = "Nomor pendaftaran tidak ditemukan";
          if (apiMessage && typeof apiMessage === "string") {
            if (apiMessage.toLowerCase().includes("tidak ditemukan") || 
                apiMessage.toLowerCase().includes("not found")) {
              errorMessage = "Nomor pendaftaran tidak ditemukan. Pastikan nomor pendaftaran sudah benar atau pendaftaran sudah disubmit.";
            } else {
              errorMessage = apiMessage;
            }
          }
          setState({ loading: false, data: null, error: errorMessage });
          retryCountRef.current = 0;
        }
      } catch (e: unknown) {
        const err = e as Error;
        if (err.name === "AbortError") return;
        // Network errors - auto retry
        if (err.message.includes("fetch") || err.message.includes("network") || err.message.includes("Failed")) {
          if (retryAttempt < maxRetries) {
            setState({ 
              loading: false, 
              data: null, 
              error: `Koneksi terputus. Mencoba lagi (${retryAttempt + 1}/${maxRetries})...` 
            });
            retryCountRef.current = retryAttempt + 1;
            setTimeout(() => {
              if (lastQueryRef.current) {
                performSearch(lastQueryRef.current, retryAttempt + 1);
              }
            }, Math.min(1000 * Math.pow(2, retryAttempt), 5000)); // Exponential backoff, max 5s
          } else {
            setState({ 
              loading: false, 
              data: null, 
              error: "Koneksi internet terputus atau server tidak dapat diakses. Periksa koneksi internet Anda dan coba lagi." 
            });
            retryCountRef.current = 0;
          }
        } else {
          setState({ 
            loading: false, 
            data: null, 
            error: "Terjadi kesalahan saat memuat data. Mohon coba lagi atau hubungi admin jika masalah berlanjut." 
          });
          retryCountRef.current = 0;
        }
      }
    },
    []
  );

  const search = React.useCallback((registrationNumber: string, debounceMs = 0) => {
    if (debounceRef.current) {
      window.clearTimeout(debounceRef.current);
      debounceRef.current = null;
    }
    lastQueryRef.current = registrationNumber;
    retryCountRef.current = 0;
    const perform = () => {
      void performSearch(registrationNumber, 0);
    };
    if (debounceMs > 0) {
      debounceRef.current = window.setTimeout(perform, debounceMs);
    } else {
      perform();
    }
  }, [performSearch]);

  const retry = React.useCallback(() => {
    if (lastQueryRef.current && !state.loading) {
      retryCountRef.current = 0;
      void performSearch(lastQueryRef.current, 0);
    }
  }, [performSearch, state.loading]);

  React.useEffect(() => {
    return () => {
      controllerRef.current?.abort();
      if (debounceRef.current) {
        window.clearTimeout(debounceRef.current);
      }
    };
  }, []);

  return { ...state, search, retry };
}



