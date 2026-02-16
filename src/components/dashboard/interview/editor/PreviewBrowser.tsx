"use client";

import { useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserCircle2, ChevronLeft, ChevronRight } from "lucide-react";

import { QuestionPreviewCard } from "./QuestionPreviewCard";
import type { EditorForm, PreviewSlide, EditorPaneKey } from "./types";

interface PreviewBrowserProps {
  previewUrl: string;
  interviewTypeName: string | null;
  editor: EditorForm;
  onExit: (target: EditorPaneKey) => void;
  exitTarget: EditorPaneKey;
}

export function PreviewBrowser({
  previewUrl,
  interviewTypeName,
  editor,
  onExit,
  exitTarget,
}: PreviewBrowserProps) {
  const previewSlides = useMemo<PreviewSlide[]>(() => {
    const slides: PreviewSlide[] = [{ key: "welcome", type: "welcome" }];

    editor.sections.forEach((section, index) => {
      slides.push({
        key: section.tempId || `section-${index}`,
        type: "section",
        section,
        sectionIndex: index,
      });
    });

    return slides;
  }, [editor.sections]);

  const [previewIndex, setPreviewIndex] = useState(0);

  useEffect(() => {
    setPreviewIndex(0);
  }, [editor.id, editor.title, editor.sections.length]);

  const currentSlide = previewSlides[previewIndex] ?? previewSlides[0];

  const currentSectionPosition = useMemo(() => {
    if (!currentSlide?.section) return null;
    if (typeof currentSlide.sectionIndex === "number") {
      return currentSlide.sectionIndex + 1;
    }
    const detectedIndex = editor.sections.findIndex(
      (section) => section.tempId === currentSlide.section?.tempId,
    );
    return (detectedIndex >= 0 ? detectedIndex : 0) + 1;
  }, [currentSlide, editor.sections]);

  const isFirstSlide = previewIndex === 0;
  const isLastSlide = previewIndex === previewSlides.length - 1;

  const handleBack = () => {
    if (isFirstSlide) {
      onExit(exitTarget);
      return;
    }
    setPreviewIndex((prev) => Math.max(prev - 1, 0));
  };

  const handleForward = () => {
    if (isLastSlide) {
      onExit(exitTarget);
      return;
    }
    setPreviewIndex((prev) => Math.min(prev + 1, previewSlides.length - 1));
  };

  return (
    <section className="space-y-3 md:space-y-4">
      <div className="rounded-xl border border-slate-200 bg-slate-100 shadow-sm">
        <div className="flex rounded-t-xl items-center gap-2 md:gap-3 border-b border-slate-200 bg-slate-50 px-3 py-2 md:px-6 md:py-3">
          <div className="flex items-center gap-1 md:gap-1.5 shrink-0">
            <span className="h-2.5 w-2.5 md:h-3 md:w-3 rounded-full bg-rose-400" aria-hidden />
            <span className="h-2.5 w-2.5 md:h-3 md:w-3 rounded-full bg-amber-400" aria-hidden />
            <span className="h-2.5 w-2.5 md:h-3 md:w-3 rounded-full bg-emerald-400" aria-hidden />
          </div>
          <div className="flex w-full items-center justify-between gap-2 min-w-0">
            <div className="flex-1 min-w-0 max-w-full md:max-w-xl rounded-full border border-slate-200 bg-white px-2 py-1 md:px-4 md:py-1.5 text-xs text-slate-600">
              <span className="truncate block">{previewUrl}</span>
            </div>
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-1 md:gap-2 rounded-full border border-slate-200 bg-white px-2 md:px-3 text-xs font-medium text-slate-600 hover:bg-white hover:text-slate-900 shrink-0"
                >
                  <span className="flex h-5 w-5 md:h-6 md:w-6 items-center justify-center overflow-hidden rounded-full bg-emerald-50 text-emerald-500">
                    <UserCircle2 className="h-3.5 w-3.5 md:h-4 md:w-4" />
                  </span>
                  <span className="hidden md:inline">Chrome • Profil Sandikodev</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-72">
                <DropdownMenuLabel className="text-xs uppercase text-slate-500">
                  Status sesi browser
                </DropdownMenuLabel>
                <div className="px-2 py-1.5">
                  <div className="flex items-start gap-3 py-2">
                    <UserCircle2 className="mt-0.5 h-8 w-8 text-emerald-500" />
                    <div className="space-y-1 text-xs">
                      <p className="text-sm font-semibold text-slate-900">Sandikodev</p>
                      <p className="text-muted-foreground">
                        Founder • PT Koneksi Jaringan Indonesia
                      </p>
                    </div>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <div className="px-2 py-1.5">
                  <div className="space-y-2 py-1 text-[11px] leading-relaxed text-slate-600">
                    <p>Profil sandbox ini menjaga jejak autentik karya digital.</p>
                    <p>
                      Dibangun dan ditandatangani oleh Sandikodev sebagai bagian dari katalog
                      inovasi PT Koneksi Jaringan Indonesia.
                    </p>
                  </div>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="rounded-b-xl bg-white px-3 py-6 md:px-6 md:py-10 lg:px-12">
          {currentSlide?.type === "welcome" && (
            <div className="mx-auto max-w-2xl space-y-4 md:space-y-6 text-center">
              <div className="flex items-center justify-center">
                <Badge variant="secondary" className="bg-emerald-50 text-emerald-600">
                  {interviewTypeName ?? "Interview"}
                </Badge>
              </div>
              <div className="space-y-2 md:space-y-3">
                <h2 className="text-xl font-semibold text-slate-900 md:text-2xl lg:text-3xl">
                  Selamat Datang {editor.title ? `di ${editor.title}` : "di Form Interview"}
                </h2>
                <p className="text-xs md:text-sm text-muted-foreground">
                  {editor.description ||
                    "Pastikan informasi yang Anda isi sesuai kenyataan untuk memperlancar proses seleksi."}
                </p>
              </div>
              <div className="space-y-3 md:space-y-4 rounded-xl border border-slate-100 bg-slate-50 p-4 md:p-6 text-left text-xs md:text-sm text-slate-600">
                <p className="font-medium text-slate-800">Apa yang akan Anda temui?</p>
                <ul className="space-y-2 text-xs md:text-sm">
                  {editor.sections.length === 0 ? (
                    <li className="text-muted-foreground">
                      Belum ada bagian yang disusun. Tambahkan bagian untuk membuat form.
                    </li>
                  ) : (
                    editor.sections.map((section, index) => (
                      <li key={section.tempId} className="flex items-start gap-2">
                        <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-400 shrink-0" />
                        <span>
                          <span className="font-medium text-slate-800">
                            Bagian {index + 1}:
                          </span>{" "}
                          {section.title?.trim() || "Tanpa judul"}
                        </span>
                      </li>
                    ))
                  )}
                </ul>
              </div>
            </div>
          )}

          {currentSlide?.type === "section" && currentSlide.section && (
            <div className="mx-auto max-w-3xl space-y-4 md:space-y-6">
              <div className="space-y-2 text-left">
                <div className="flex items-center gap-1.5 md:gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  <span>
                    Bagian {currentSectionPosition ?? (currentSlide.sectionIndex ?? 0) + 1}
                  </span>
                  <span className="h-1 w-1 rounded-full bg-slate-300" />
                  <span className="hidden md:inline">{editor.sections.length} total bagian</span>
                  <span className="md:hidden">{editor.sections.length} bagian</span>
                </div>
                <h3 className="text-lg md:text-xl font-semibold text-slate-900">
                  {currentSlide.section.title?.trim() ||
                    `Bagian ${currentSectionPosition ?? (currentSlide.sectionIndex ?? 0) + 1}`}
                </h3>
                {currentSlide.section.description && (
                  <p className="text-xs md:text-sm text-muted-foreground">
                    {currentSlide.section.description}
                  </p>
                )}
              </div>

              <div className="space-y-3 md:space-y-4">
                {currentSlide.section.questions.length === 0 ? (
                  <div className="rounded-lg border border-dashed border-slate-200 p-4 md:p-6 text-center text-xs text-muted-foreground">
                    Belum ada pertanyaan di bagian ini.
                  </div>
                ) : (
                  currentSlide.section.questions.map((question, questionIdx) => (
                    <QuestionPreviewCard
                      key={question.tempId}
                      question={question}
                      sectionIndex={currentSlide.sectionIndex ?? 0}
                      questionIndex={questionIdx}
                    />
                  ))
                )}
              </div>
            </div>
          )}

          <div className="mt-6 md:mt-10 flex flex-col gap-2 md:gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 md:px-6 md:py-4 text-xs md:text-sm text-slate-600 shadow-sm sm:flex-row sm:items-center sm:justify-between">
            <div>
              Slide {previewIndex + 1} dari {previewSlides.length}
              <span className="hidden md:inline">
                {" "}• {currentSlide?.type === "welcome"
                  ? "Pengantar"
                  : `Bagian ${currentSectionPosition ?? (currentSlide?.sectionIndex ?? 0) + 1}`}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleBack} disabled={isFirstSlide} className="min-h-0 h-8 flex-1 sm:flex-initial">
                <ChevronLeft className="h-4 w-4 md:mr-2" />
                <span className="hidden md:inline">Kembali</span>
              </Button>
              <Button
                size="sm"
                onClick={handleForward}
                variant={isLastSlide ? "secondary" : "default"}
                className="min-h-0 h-8 flex-1 sm:flex-initial"
              >
                {isLastSlide ? (
                  <span>Selesai</span>
                ) : (
                  <>
                    <span className="hidden md:inline">Lanjut</span>
                    <ChevronRight className="h-4 w-4 md:ml-2" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
