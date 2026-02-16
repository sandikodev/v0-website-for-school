"use client";

import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { TableOfContents, MobileToc } from "./TableOfContents";
import { FormInfoPane } from "./FormInfoPane";
import { SectionEditorPane } from "./SectionEditorPane";
import { PreviewBrowser } from "./PreviewBrowser";
import { TemplateShowcase } from "./TemplateShowcase";
import type { InterviewTemplateProduct } from "@/lib/interview/marketplaceTemplates";
import type {
  EditorForm,
  EditorPaneItem,
  EditorPaneKey,
  InterviewTypeSummary,
  EditorHandlers,
} from "./types";

interface FormEditorContentProps {
  editor: EditorForm;
  types: InterviewTypeSummary[];
  tocItems: EditorPaneItem[];
  activePane: EditorPaneKey;
  onSelectPane: (pane: EditorPaneKey) => void;
  previewReturnPane: EditorPaneKey;
  handlers: EditorHandlers;
  newlyAddedSectionIndex?: number | null;
  newlyAddedQuestionIds?: Set<string>;
  templates: InterviewTemplateProduct[];
  onSelectTemplate: (templateId: string) => void;
}

function getSectionIndexFromPane(pane: EditorPaneKey): number | null {
  if (!pane.startsWith("section-")) return null;
  const index = Number(pane.split("-")[1]);
  return Number.isNaN(index) ? null : index - 1;
}

export function FormEditorContent({
  editor,
  types,
  tocItems,
  activePane,
  onSelectPane,
  previewReturnPane,
  handlers,
  newlyAddedSectionIndex,
  newlyAddedQuestionIds = new Set(),
  templates,
  onSelectTemplate,
}: FormEditorContentProps) {
  const isPreview = activePane === "preview";
  const isTemplates = activePane === "templates";
  const currentIndex = tocItems.findIndex((item) => item.id === activePane);

  const interviewTypeName = useMemo(() => {
    if (!editor.interviewTypeId) return null;
    return types.find((type) => type.id === editor.interviewTypeId)?.name ?? null;
  }, [editor.interviewTypeId, types]);

  const resolvePreviewExitTarget = useMemo(
    () =>
      tocItems.find((item) => item.id === previewReturnPane)?.id ??
      tocItems[tocItems.length - 1]?.id ??
      "form-info",
    [tocItems, previewReturnPane]
  );

  const handlePrev = () => {
    if (isPreview) {
      onSelectPane(resolvePreviewExitTarget);
      return;
    }

    if (currentIndex <= 0) return;
    onSelectPane(tocItems[currentIndex - 1]?.id ?? "form-info");
  };

  const handleNext = () => {
    if (isPreview) return;

    if (currentIndex === -1) {
      onSelectPane(tocItems[0]?.id ?? "form-info");
      return;
    }

    if (currentIndex >= tocItems.length - 1) {
      onSelectPane("preview");
      return;
    }

    onSelectPane(tocItems[currentIndex + 1]?.id ?? "form-info");
  };

  const sectionIndex = getSectionIndexFromPane(activePane);

  const slug = editor.slug?.trim() || "form-preview";
  const previewUrl = `https://spmb.masjidsyuhada.sch.id/interview/${slug}`;

  return (
    <div className="flex flex-1 min-h-0">
      {/* TableOfContents - di luar area scroll, tidak ikut scroll */}
      {!isPreview && !isTemplates && (
        <TableOfContents
          tocItems={tocItems}
          activePane={activePane}
          onSelectPane={onSelectPane}
          hidden={false}
        />
      )}

      {/* Konten editor - area yang scroll */}
      <div className="flex-1 min-h-0 overflow-y-auto">
        <div className="p-4 space-y-4">
          {!isPreview && !isTemplates && (
            <MobileToc
              tocItems={tocItems}
              activePane={activePane}
              onSelectPane={onSelectPane}
            />
          )}

          {isTemplates && (
            <TemplateShowcase
              templates={templates}
              onSelectTemplate={onSelectTemplate}
            />
          )}

          {activePane === "form-info" && (
            <FormInfoPane
              editor={editor}
              types={types}
              onChange={handlers.onEditorChange}
            />
          )}

          {!isPreview && !isTemplates && sectionIndex !== null && (
            <SectionEditorPane
              editor={editor}
              sectionIndex={sectionIndex}
              handlers={handlers}
              isNewlyAdded={sectionIndex === newlyAddedSectionIndex}
              newlyAddedQuestionIds={newlyAddedQuestionIds}
            />
          )}

          {isPreview && (
            <PreviewBrowser
              previewUrl={previewUrl}
              interviewTypeName={interviewTypeName}
              editor={editor}
              onExit={onSelectPane}
              exitTarget={resolvePreviewExitTarget}
            />
          )}

          <div className="flex items-center justify-between gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrev}
              disabled={
                isPreview
                  ? tocItems.length === 0
                  : currentIndex <= 0 || isTemplates
              }
              className="min-h-0 h-8 flex-1 md:flex-initial"
            >
              <ChevronLeft className="h-4 w-4 md:mr-2" />
              <span className="hidden md:inline">Sebelumnya</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleNext}
              disabled={
                isPreview ||
                isTemplates ||
                tocItems.length === 0 ||
                currentIndex === -1
              }
              className="min-h-0 h-8 flex-1 md:flex-initial"
            >
              <span className="hidden md:inline">Selanjutnya</span>
              <ChevronRight className="h-4 w-4 md:ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
