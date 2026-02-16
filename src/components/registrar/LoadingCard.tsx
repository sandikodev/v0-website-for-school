"use client";

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Loader2 } from "lucide-react";

interface LoadingCardProps {
  message?: string;
  showProgress?: boolean;
}

export function LoadingCard({ 
  message = "Mencari data pendaftaran...",
  showProgress = false 
}: LoadingCardProps = {}) {
  const [progress, setProgress] = React.useState(0);

  React.useEffect(() => {
    if (!showProgress) return;
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) return prev;
        return prev + Math.random() * 15;
      });
    }, 300);
    return () => clearInterval(interval);
  }, [showProgress]);

  return (
    <Card className="print-card border-0 shadow-none bg-slate-50/50">
      <CardContent className="p-8 text-center">
        <div className="mx-auto mb-4 relative">
          <div className="h-12 w-12 mx-auto relative">
            <Loader2 className="h-12 w-12 animate-spin text-emerald-600" />
            <Search className="h-6 w-6 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-emerald-700" />
          </div>
        </div>
        <p className="text-gray-700 font-medium mb-2">{message}</p>
        {showProgress && (
          <div className="mt-4 w-full max-w-xs mx-auto">
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-600 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${Math.min(progress, 90)}%` }}
                role="progressbar"
                aria-valuenow={Math.round(progress)}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label="Progress pencarian"
              />
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {Math.round(progress)}%
            </p>
          </div>
        )}
        <p className="text-xs text-gray-500 mt-3">
          Mohon tunggu sebentar...
        </p>
      </CardContent>
    </Card>
  );
}

