"use client";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FileText } from "lucide-react";
import { STATUS_CONFIG, type SubmissionStatus } from "@/lib/registrar/constants";

interface StatusCardProps {
  status: string;
  registrationNumber: string;
  notes?: string | null;
  variant?: "screen" | "print" | "both";
}

export function StatusCard({
  status,
  registrationNumber,
  notes,
  variant = "both",
}: StatusCardProps) {
  const config = STATUS_CONFIG[status as SubmissionStatus] || STATUS_CONFIG.pending;
  const Icon = config.icon;

  const baseClasses = "border-0 shadow-none";
  const statusBgClasses = config.bg;

  const visibilityClasses =
    variant === "screen"
      ? "" // No print classes, visible on screen only
      : variant === "print"
        ? "hidden print:block" // Hidden on screen, visible on print
        : "print-card"; // Visible on both screen and print

  return (
    <Card
      className={`${baseClasses} ${statusBgClasses} ${visibilityClasses}`}
      aria-label={`Status pendaftaran: ${config.label}`}
    >
      <CardHeader>
        <div className="mb-2 flex items-center justify-between">
          <CardTitle id="status-title">Status Pendaftaran</CardTitle>
          <Badge 
            variant="outline" 
            className={config.badge}
            aria-label={`Status: ${config.label}`}
          >
            <Icon className="mr-1 h-3 w-3" aria-hidden="true" />
            {config.label}
          </Badge>
        </div>
        <CardDescription 
          id="status-description"
          className={`text-base font-medium ${config.text}`}
          aria-live="polite"
        >
          {config.message}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="rounded-lg border bg-white p-4">
            <div className="mb-1 flex items-center gap-2">
              <FileText className="h-4 w-4 text-gray-500" aria-hidden="true" />
              <p className="text-sm text-gray-600">Nomor Pendaftaran</p>
            </div>
            <p 
              className="font-mono text-lg font-bold text-emerald-600"
              aria-label={`Nomor pendaftaran: ${registrationNumber}`}
            >
              {registrationNumber}
            </p>
          </div>

          {notes && (
            <div 
              className="rounded-lg border bg-white p-4"
              aria-label="Catatan dari tim"
            >
              <p className="mb-1 text-sm text-gray-600">Catatan dari Tim:</p>
              <p className="text-gray-900" aria-live="polite">{notes}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

