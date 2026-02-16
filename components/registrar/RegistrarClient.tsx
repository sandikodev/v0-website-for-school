"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw } from "lucide-react";
import type { RegistrarSubmissionDTO, InterviewSessionDTO } from "@/lib/registrar/types";
import InterviewNotification from "@/components/registrar/interview-notification";
import { StatusCard } from "./StatusCard";
import { SearchForm } from "./SearchForm";
import { LoadingCard } from "./LoadingCard";
import { NotFoundCard } from "./NotFoundCard";
import { PrintHeader } from "./PrintHeader";
import { PrintFooter } from "./PrintFooter";
import { NavigationBar } from "./NavigationBar";
import { MobileNavigation } from "./MobileNavigation";
import { DesktopNavigation } from "./DesktopNavigation";
import { SubmissionDetails } from "./SubmissionDetails";
import { SubmissionDetailsPrint } from "./SubmissionDetailsPrint";
import {
  StatusCardSkeleton,
  InterviewListSkeleton,
  SubmissionDetailsSkeleton,
  NavigationSkeleton,
} from "./RegistrarSkeletons";
import { useSearchSubmission } from "./search/useSearchSubmission";

interface RegistrarClientProps {
  initialQuery: string;
  initialSubmission: RegistrarSubmissionDTO | null;
  initialSessions?: InterviewSessionDTO[];
}

export function RegistrarClient({
  initialQuery,
  initialSubmission,
  initialSessions,
}: RegistrarClientProps) {
  const router = useRouter();
  const [query, setQuery] = React.useState(initialQuery);
  const [result, setResult] = React.useState<RegistrarSubmissionDTO | null>(
    initialSubmission
  );
  const [notFound, setNotFound] = React.useState(
    Boolean(initialQuery && !initialSubmission)
  );
  const [notFoundQuery, setNotFoundQuery] = React.useState<string | null>(
    initialQuery && !initialSubmission ? initialQuery : null
  );
  const searchApi = useSearchSubmission();
  const isSearching = searchApi.loading;

  // Track if search was triggered to avoid overwriting initial data
  const searchTriggeredRef = React.useRef(false);
  // Track if we're updating query programmatically (to avoid re-sync)
  const isUpdatingFromSearchRef = React.useRef(false);

  // Sync with initialQuery only on mount or external navigation
  // (skip when we update URL ourselves after search)
  React.useEffect(() => {
    // Skip sync if we just updated query from successful search
    if (isUpdatingFromSearchRef.current) {
      isUpdatingFromSearchRef.current = false;
      return;
    }

    // Sync on mount or external navigation
    setQuery(initialQuery);
    setResult(initialSubmission);
    const shouldShowNotFound = Boolean(initialQuery && !initialSubmission);
    setNotFound(shouldShowNotFound);
    setNotFoundQuery(shouldShowNotFound ? initialQuery : null);
    
    // Reset search flag when navigating to empty page
    if (!initialQuery) {
      searchTriggeredRef.current = false;
    }
  }, [initialQuery, initialSubmission]);

  // Sync hook state to component state (only after search was triggered)
  React.useEffect(() => {
    if (!searchTriggeredRef.current) return;

    if (!searchApi.loading && searchApi.data !== null) {
      const dto = searchApi.data;
      setResult(dto);
      setNotFound(false);
      setNotFoundQuery(null);
      const trimmed = dto.registrationNumber;
      
      // Mark that we're updating from search to prevent re-sync
      isUpdatingFromSearchRef.current = true;
      // Update query and navigate
      setQuery(trimmed);
      router.push(`/registrar?id=${encodeURIComponent(trimmed)}`, { scroll: false });
    } else if (!searchApi.loading && searchApi.error) {
      // Only show not found if error indicates not found (404 or "tidak ditemukan")
      const isNotFoundError = searchApi.error.includes("tidak ditemukan") || 
                              searchApi.error.includes("not found");
      if (isNotFoundError) {
        setResult(null);
        setNotFound(true);
        setNotFoundQuery(query || null);
      }
      // For other errors, show error state but don't show not found card
    }
  }, [searchApi.loading, searchApi.data, searchApi.error, router, query]);

  const handleSearch = React.useCallback(
    (registrationNumber: string) => {
      const trimmed = registrationNumber.trim().toUpperCase();
      if (!trimmed) {
        return;
      }
      searchTriggeredRef.current = true;
      searchApi.search(trimmed);
    },
    [searchApi]
  );

  const handleReset = React.useCallback(() => {
    setQuery("");
    setResult(null);
    setNotFound(false);
    setNotFoundQuery(null);
    searchTriggeredRef.current = false;
    router.push("/registrar");
  }, [router]);

  const onSubmit = React.useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      handleSearch(query);
    },
    [handleSearch, query]
  );

  const showResult = React.useMemo(
    () => Boolean(result && !isSearching),
    [result, isSearching]
  );

  const showHeader = React.useMemo(
    () => !isSearching && !result,
    [isSearching, result]
  );

  return (
    <main 
      className="container mx-auto px-4 py-12 pb-20 md:pb-12"
      aria-label="Halaman cek status pendaftaran"
    >
      <div className="mx-auto max-w-3xl">
        <NavigationBar />

        {showHeader && (
          <header className="no-print mb-8 text-center">
            <h1 className="mb-2 text-3xl font-bold text-gray-900">
              Cek Status Pendaftaran
            </h1>
            <p className="text-gray-600">
              Masukkan nomor pendaftaran SPMB untuk melihat status Anda
            </p>
          </header>
        )}

        <section 
          className="no-print mb-6"
          aria-label="Form pencarian status pendaftaran"
        >
          <Card className="py-0">
            <CardContent className="space-y-6 p-6">
              {isSearching && (
                <div role="status" aria-live="polite" aria-label="Sedang mencari">
                  <LoadingCard />
                </div>
              )}

              {showResult && result && (
                <div role="status" aria-live="polite">
                  <StatusCard
                    status={result.status}
                    registrationNumber={result.registrationNumber}
                    notes={result.notes}
                    variant="screen"
                  />
                </div>
              )}

              <SearchForm
                query={query}
                isSearching={isSearching}
                onQueryChange={setQuery}
                onSubmit={onSubmit}
              />
            </CardContent>
          </Card>
        </section>

        {notFound && notFoundQuery && !isSearching && (
          <section 
            role="alert" 
            aria-live="assertive"
            aria-label="Hasil pencarian tidak ditemukan"
          >
            <NotFoundCard 
              query={notFoundQuery} 
              onReset={handleReset}
              onRetry={() => {
                searchTriggeredRef.current = true;
                searchApi.retry();
              }}
            />
          </section>
        )}

        {!notFound && searchApi.error && !isSearching && searchTriggeredRef.current && (
          <section 
            role="alert" 
            aria-live="assertive"
            aria-label="Error saat mencari data"
          >
            <Card className="no-print border-orange-200 bg-orange-50/50 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="shrink-0">
                    <AlertCircle className="h-6 w-6 text-orange-600" aria-hidden="true" />
                  </div>
                  <div className="flex-1 space-y-3">
                    <div>
                      <h3 className="mb-1 text-lg font-semibold text-orange-900">
                        Terjadi Kesalahan
                      </h3>
                      <p className="text-sm text-orange-700">
                        {searchApi.error}
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 pt-2">
                      <Button
                        variant="default"
                        onClick={() => {
                          searchTriggeredRef.current = true;
                          searchApi.retry();
                        }}
                        disabled={searchApi.loading}
                        className="bg-orange-600 hover:bg-orange-700"
                      >
                        <RefreshCw
                          className={`mr-2 h-4 w-4 ${searchApi.loading ? "animate-spin" : ""}`}
                          aria-hidden="true"
                        />
                        {searchApi.loading ? "Mencoba lagi..." : "Coba Lagi"}
                      </Button>
                      <Button variant="outline" onClick={handleReset}>
                        Pencarian Baru
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>
        )}

        {isSearching && (
          <div 
            className="space-y-6"
            role="status"
            aria-live="polite"
            aria-label="Memuat data pendaftaran"
          >
            <StatusCardSkeleton />
            <InterviewListSkeleton items={3} />
            <SubmissionDetailsSkeleton />
            <NavigationSkeleton />
          </div>
        )}

        {showResult && result && (
          <div className="space-y-6">
            <PrintHeader />

            <section 
              aria-labelledby="interview-status-heading"
              aria-label="Status interview pendaftar"
            >
              <InterviewNotification
                submissionId={result.id}
                registrationNumber={result.registrationNumber}
                applicantName={result.namaLengkap}
                initialSessions={initialSessions}
              />
            </section>

            <section aria-label="Status pendaftaran untuk cetak">
              <StatusCard
                status={result.status}
                registrationNumber={result.registrationNumber}
                notes={result.notes}
                variant="print"
              />
            </section>

            <SubmissionDetails submission={result} />
            
            {/* Print version - no accordion, always expanded */}
            <div className="hidden print:block">
              <SubmissionDetailsPrint submission={result} />
            </div>

            <nav aria-label="Navigasi halaman">
              <DesktopNavigation onReset={handleReset} />
            </nav>

            <PrintFooter />
          </div>
        )}

        {isSearching ? (
          <div className="mt-6">
            <NavigationSkeleton />
          </div>
        ) : (
          showResult && <MobileNavigation onReset={handleReset} />
        )}
      </div>
    </main>
  );
}
