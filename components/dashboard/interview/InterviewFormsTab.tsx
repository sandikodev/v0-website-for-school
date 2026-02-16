"use client";

import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { InterviewQuestionType } from "@prisma/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  AlertCircle,
  Check,
  Loader2,
  Save,
  Trash2,
  XIcon,
  Eye,
  Sparkles,
} from "lucide-react";
import {
  getTemplateOptions,
  resolveTemplateByKey,
} from "@/lib/interview/templateCatalog";
import { getInterviewTemplateProducts } from "@/lib/interview/marketplaceTemplates";
import {
  buildEditorFromTemplate,
  createEmptyForm,
  createEmptyOption,
  createEmptyQuestion,
  createEmptySection,
  isOptionBased,
  mapFormToEditor,
} from "@/lib/interview/editorFormHelpers";
import type {
  FormSummary,
  InterviewTypeSummary,
  EditorForm,
  EditorQuestion,
  EditorPaneKey,
} from "./editor/types";
import { FormTemplatesBar } from "./editor/FormTemplatesBar";
import { FormList } from "./editor/FormList";
import { FormEditorContent } from "./editor/FormEditorContent";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogClose,
  DialogDescription,
} from "@/components/ui/dialog";
import { useTemplateRouting } from "@/hooks/interview/useTemplateRouting";
import { usePaneNavigation } from "@/hooks/interview/usePaneNavigation";

export function InterviewFormsTab() {
  const [forms, setForms] = useState<FormSummary[]>([]);
  const [types, setTypes] = useState<InterviewTypeSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedFormId, setSelectedFormId] = useState<string | null>(null);
  const [editor, setEditor] = useState<EditorForm | null>(null);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [editorOpen, setEditorOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const closingAfterActionRef = useRef(false);
  const newlyAddedSectionIndexRef = useRef<number | null>(null);
  const newlyAddedQuestionIdsRef = useRef<Set<string>>(new Set());

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const templateList = useMemo(() => getTemplateOptions(), []);
  const templateProducts = useMemo(
    () => getInterviewTemplateProducts(),
    [],
  );

  const {
    tocItems,
    activePane,
    handleSelectPane,
    previewReturnPane,
    togglePreviewPane,
    toggleTemplatesPane,
    resetPane,
  } = usePaneNavigation({
    sections: editor?.sections ?? [],
    includeTemplatesPane: false,
  });

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [formsResponse, typesResponse] = await Promise.all([
          fetch("/api/interview/forms?includeDrafts=true"),
          fetch("/api/interview/types"),
        ]);

        if (!formsResponse.ok) {
          throw new Error("Gagal memuat daftar form interview");
        }

        const formsPayload = await formsResponse.json();
        if (!formsPayload.success) {
          throw new Error(formsPayload.message ?? "Gagal memuat form interview");
        }

        if (!typesResponse.ok) {
          throw new Error("Gagal memuat daftar tipe interview");
        }

        const typesPayload = await typesResponse.json();

        setForms(formsPayload.data ?? []);
        setTypes(typesPayload.data ?? []);
        setError(null);
      } catch (fetchError) {
        setError(
          fetchError instanceof Error
            ? fetchError.message
            : "Terjadi kesalahan saat memuat data",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  const applyExistingFormToEditor = useCallback(
    (form: FormSummary) => {
      setSelectedFormId(form.id);
      setEditor(mapFormToEditor(form));
      newlyAddedQuestionIdsRef.current.clear();
      setSuccessMessage(null);
      setEditorOpen(true);
      resetPane();
    },
    [resetPane],
  );

  const applyTemplateToEditor = useCallback(
    (newEditor: EditorForm) => {
      setSelectedFormId(null);
      setEditor(newEditor);
      newlyAddedQuestionIdsRef.current.clear();
      setSuccessMessage(null);
      setEditorOpen(true);
      resetPane();
    },
    [resetPane],
  );

  const handleLoadTemplate = useCallback(
    async (templateKey: string) => {
      const template = resolveTemplateByKey(templateKey);
      if (template) {
        const newEditor = buildEditorFromTemplate(template.form);
        applyTemplateToEditor(newEditor);
        return;
      }

      const localForm = forms.find((form) => form.id === templateKey);
      if (localForm) {
        applyExistingFormToEditor(localForm);
        return;
      }

      try {
        const response = await fetch(`/api/interview/forms/${templateKey}`);
        const payload = await response.json().catch(() => null);

        if (!response.ok || !payload?.success || !payload?.data) {
          const message =
            payload?.message ?? "Form interview tidak ditemukan atau tidak valid.";
          setError(message);
          throw new Error(message);
        }

        const fetchedForm = payload.data as FormSummary;
        setForms((prev) => {
          const exists = prev.some((form) => form.id === fetchedForm.id);
          if (exists) {
            return prev.map((form) =>
              form.id === fetchedForm.id ? fetchedForm : form,
            );
          }
          return [fetchedForm, ...prev];
        });

        applyExistingFormToEditor(fetchedForm);
      } catch (loadError) {
        const message =
          loadError instanceof Error
            ? loadError.message
            : "Gagal memuat form interview dari URL.";
        setError(message);
        throw loadError instanceof Error ? loadError : new Error(message);
      }
    },
    [applyExistingFormToEditor, applyTemplateToEditor, forms],
  );

  const { handleTemplateButtonClick, clearTemplateQuery } = useTemplateRouting({
    onLoadTemplate: handleLoadTemplate,
    onTemplateLoaded: () => handleSelectPane("form-info"),
  });

  const handleSelectForm = useCallback(
    (form: FormSummary) => {
      applyExistingFormToEditor(form);
      if (!searchParams) return;
      const params = new URLSearchParams(searchParams.toString());
      params.set("template", form.id);
      router.replace(
        params.toString() ? `${pathname}?${params.toString()}` : pathname,
        { scroll: false },
      );
    },
    [applyExistingFormToEditor, pathname, router, searchParams],
  );

  const handleCreateNew = useCallback(() => {
    applyTemplateToEditor(createEmptyForm());
    clearTemplateQuery();
  }, [applyTemplateToEditor, clearTemplateQuery]);

  const handleUpdateEditor = (updater: (prev: EditorForm) => EditorForm) => {
    setEditor((prev) => {
      if (!prev) return prev;
      return updater(prev);
    });
  };

  const handleAddSection = () => {
    if (!editor) return;
    const newSectionIndex = editor.sections.length;
    newlyAddedSectionIndexRef.current = newSectionIndex;
    handleUpdateEditor((prev) => {
      const nextSections = [
        ...prev.sections,
        createEmptySection(newSectionIndex),
      ];
      return { ...prev, sections: nextSections };
    });
    // Switch to the newly created section
    const newPane: EditorPaneKey = `section-${newSectionIndex + 1}`;
    handleSelectPane(newPane);
    // Reset the ref after a short delay to allow the component to mount
    setTimeout(() => {
      newlyAddedSectionIndexRef.current = null;
    }, 1000);
  };

  const handleRemoveSection = (tempId: string) => {
    if (!editor) return;
    handleUpdateEditor((prev) => {
      const nextSections = prev.sections
        .filter((section) => section.tempId !== tempId)
        .map((section, index) => ({ ...section, position: index }));
      return { ...prev, sections: nextSections };
    });
  };

  const handleAddQuestion = (sectionId: string) => {
    if (!editor) return;
    handleUpdateEditor((prev) => {
      const nextSections = prev.sections.map((section) => {
        if (section.tempId !== sectionId) return section;
        const newQuestion = createEmptyQuestion(`Pertanyaan ${section.questions.length + 1}`);
        // Track newly added question ID
        newlyAddedQuestionIdsRef.current.add(newQuestion.tempId);
        const nextQuestions = [
          ...section.questions,
          newQuestion,
        ].map((question, index) => ({ ...question, position: index }));
        return { ...section, questions: nextQuestions };
      });
      return { ...prev, sections: nextSections };
    });
  };

  const handleRemoveQuestion = (sectionId: string, questionId: string) => {
    if (!editor) return;
    // Remove from newly added tracking if present
    newlyAddedQuestionIdsRef.current.delete(questionId);
    handleUpdateEditor((prev) => {
      const nextSections = prev.sections.map((section) => {
        if (section.tempId !== sectionId) return section;
        const nextQuestions = section.questions
          .filter((question) => question.tempId !== questionId)
          .map((question, index) => ({ ...question, position: index }));
        return { ...section, questions: nextQuestions };
      });
      return { ...prev, sections: nextSections };
    });
  };

  const handleQuestionTypeChange = (
    sectionId: string,
    questionId: string,
    type: InterviewQuestionType,
  ) => {
    if (!editor) return;
    handleUpdateEditor((prev) => {
      const nextSections = prev.sections.map((section) => {
        if (section.tempId !== sectionId) return section;
        const nextQuestions = section.questions.map((question) => {
          if (question.tempId !== questionId) return question;
          const needsOptions = isOptionBased(type);
          return {
            ...question,
            type,
            options: needsOptions
              ? question.options.length
                ? question.options
                : [createEmptyOption("Opsi 1"), createEmptyOption("Opsi 2")]
              : [],
          };
        });
        return { ...section, questions: nextQuestions };
      });
      return { ...prev, sections: nextSections };
    });
  };

  const handleAddOption = (sectionId: string, questionId: string) => {
    if (!editor) return;
    handleUpdateEditor((prev) => {
      const nextSections = prev.sections.map((section) => {
        if (section.tempId !== sectionId) return section;
        const nextQuestions = section.questions.map((question) => {
          if (question.tempId !== questionId) return question;
          const optionNumber = question.options.length + 1;
          return {
            ...question,
            options: [
              ...question.options,
              createEmptyOption(`Opsi ${optionNumber}`),
            ].map((option, index) => ({ ...option, position: index })),
          };
        });
        return { ...section, questions: nextQuestions };
      });
      return { ...prev, sections: nextSections };
    });
  };

  const handleRemoveOption = (
    sectionId: string,
    questionId: string,
    optionId: string,
  ) => {
    if (!editor) return;
    handleUpdateEditor((prev) => {
      const nextSections = prev.sections.map((section) => {
        if (section.tempId !== sectionId) return section;
        const nextQuestions = section.questions.map((question) => {
          if (question.tempId !== questionId) return question;
          const nextOptions = question.options
            .filter((option) => option.tempId !== optionId)
            .map((option, index) => ({ ...option, position: index }));
          return { ...question, options: nextOptions };
        });
        return { ...section, questions: nextQuestions };
      });
      return { ...prev, sections: nextSections };
    });
  };

  const handleSectionTitleChange = (sectionId: string, title: string) => {
    handleUpdateEditor((prev) => ({
      ...prev,
      sections: prev.sections.map((section) =>
        section.tempId === sectionId ? { ...section, title } : section,
      ),
    }));
  };

  const handleSectionDescriptionChange = (
    sectionId: string,
    description: string,
  ) => {
    handleUpdateEditor((prev) => ({
      ...prev,
      sections: prev.sections.map((section) =>
        section.tempId === sectionId
          ? { ...section, description }
          : section,
      ),
    }));
  };

  const handleQuestionChange = (
    sectionId: string,
    questionId: string,
    patch: Partial<EditorQuestion>,
  ) => {
    handleUpdateEditor((prev) => ({
      ...prev,
      sections: prev.sections.map((section) =>
        section.tempId === sectionId
          ? {
              ...section,
              questions: section.questions.map((question) =>
                question.tempId === questionId
                  ? { ...question, ...patch }
                  : question,
              ),
            }
          : section,
      ),
    }));
  };

  const handleOptionLabelChange = (
    sectionId: string,
    questionId: string,
    optionId: string,
    label: string,
  ) => {
    handleUpdateEditor((prev) => ({
      ...prev,
      sections: prev.sections.map((section) =>
        section.tempId === sectionId
          ? {
              ...section,
              questions: section.questions.map((question) =>
                question.tempId === questionId
                  ? {
                      ...question,
                      options: question.options.map((option) =>
                        option.tempId === optionId
                          ? {
                              ...option,
                              label,
                              value:
                                option.value && option.value !== ""
                                  ? option.value
                                  : label.toLowerCase().replace(/\s+/g, "-"),
                            }
                          : option,
                      ),
                    }
                  : question,
              ),
            }
          : section,
      ),
    }));
  };

  const handleEditorOpenChange = (open: boolean) => {
    setEditorOpen(open);
    if (!open) {
      clearTemplateQuery();
      if (closingAfterActionRef.current) {
        closingAfterActionRef.current = false;
      } else if (editor) {
        // ESC close: keep form selected but hide modal
        closingAfterActionRef.current = false;
      } else {
        setSuccessMessage(null);
      }
      resetPane();
    }
  };

  const handleDeleteForm = async () => {
    if (!editor?.id) return;
    const confirmed = window.confirm(
      "Hapus form interview ini? Tindakan ini tidak dapat dibatalkan.",
    );
    if (!confirmed) return;

    setDeleting(true);
    setError(null);

    try {
      const response = await fetch(`/api/interview/forms/${editor.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        throw new Error(
          payload?.message ?? "Gagal menghapus form interview",
        );
      }

      setForms((prev) => prev.filter((form) => form.id !== editor.id));
      setEditor(null);
      setSelectedFormId(null);
      setSuccessMessage("Form interview berhasil dihapus.");
      closingAfterActionRef.current = true;
      setEditorOpen(false);
    } catch (deleteError) {
      setError(
        deleteError instanceof Error
          ? deleteError.message
          : "Terjadi kesalahan saat menghapus form interview",
      );
    } finally {
      setDeleting(false);
    }
  };

  const formPayload = useMemo(() => {
    if (!editor) return null;
    return {
      title: editor.title,
      description: editor.description ?? null,
      slug: editor.slug,
      status: editor.status,
      version: editor.version ?? 1,
      interviewTypeId: editor.interviewTypeId ?? null,
      metadata: editor.metadata ?? null,
      setAsDefault: editor.setAsDefault ?? false,
      sections: editor.sections.map((section, sectionIndex) => ({
        title: section.title,
        description: section.description ?? null,
        position: sectionIndex,
        questions: section.questions.map(
          (question, questionIndex) => ({
            title: question.title,
            description: question.description ?? null,
            helperText: question.helperText ?? null,
            type: question.type,
            required: question.required ?? false,
            position: questionIndex,
            settings: question.settings ?? null,
            options: isOptionBased(question.type)
              ? question.options.map((option, optionIndex) => ({
                  label: option.label,
                  value: option.value ?? undefined,
                  description: option.description ?? null,
                  position: optionIndex,
                }))
              : [],
          }),
        ),
      })),
    };
  }, [editor]);

  const handleSave = async () => {
    if (!editor || !formPayload) return;
    setSaving(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const isUpdating = Boolean(editor.id);
      const endpoint = isUpdating
        ? `/api/interview/forms/${editor.id}`
        : "/api/interview/forms";
      const method = isUpdating ? "PUT" : "POST";

      const response = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formPayload),
      });

      const payload = await response.json();

      if (!response.ok || !payload.success) {
        throw new Error(
          payload.message ?? "Gagal menyimpan form interview",
        );
      }

      const savedForm = payload.data as FormSummary;

      setForms((prev) => {
        if (isUpdating) {
          return prev.map((form) =>
            form.id === savedForm.id ? savedForm : form,
          );
        }
        return [savedForm, ...prev];
      });

      setEditor(mapFormToEditor(savedForm));
      setSelectedFormId(savedForm.id);
      setSuccessMessage("Form interview berhasil disimpan");
      closingAfterActionRef.current = true;
      setEditorOpen(false);
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : "Terjadi kesalahan saat menyimpan form",
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" />
        Memuat form interview...
      </div>
    );
  }

  return (
    <>
      <Card className="h-full">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base font-semibold">
            Daftar Form Interview
          </CardTitle>
          <FormTemplatesBar
            templates={templateList}
            onLoadTemplate={handleTemplateButtonClick}
            onCreateNew={handleCreateNew}
          />
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Terjadi Kesalahan</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {successMessage && !editorOpen && (
            <Alert className="mb-4 border-emerald-200 bg-emerald-50 text-emerald-700">
              <Check className="h-4 w-4" />
              <AlertTitle>Berhasil</AlertTitle>
              <AlertDescription>{successMessage}</AlertDescription>
            </Alert>
          )}

          <FormList
            forms={forms}
            selectedFormId={selectedFormId}
            onSelect={handleSelectForm}
          />
        </CardContent>
      </Card>

      <Dialog
        open={editorOpen && Boolean(editor)}
        onOpenChange={handleEditorOpenChange}
      >
        <DialogContent
          showCloseButton={false}
          className="sm:max-w-5xl w-[min(960px,95vw)] max-h-[90vh] overflow-hidden p-0"
          onPointerDownOutside={(event) => {
            // Prevent closing dialog when clicking outside (overlay)
            // This allows interaction with SelectContent and other elements
            event.preventDefault();
          }}
        >
          <div className="flex h-full max-h-[90vh] flex-col overflow-hidden">
            <div className="flex items-start justify-between gap-2 md:gap-4 border-b px-3 py-3 md:px-6 md:py-4 shrink-0">
              <div className="min-w-0 flex-1 space-y-0.5 md:space-y-1">
                <DialogTitle className="truncate text-sm md:text-base font-semibold text-slate-900">
                  {editor?.id ? "Edit Form Interview" : "Form Interview Baru"}
                </DialogTitle>
                <DialogDescription className="hidden md:block text-xs text-muted-foreground">
                  Susun pertanyaan interview secara modular. Klik simpan untuk menerapkan perubahan.
                </DialogDescription>
              </div>
              <div className="flex items-center gap-1.5 md:gap-2 shrink-0">
                {editor && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={togglePreviewPane}
                    className="h-8 w-8 md:w-auto md:px-3 p-0"
                  >
                    <Eye className="h-4 w-4 md:mr-2" />
                    <span className="hidden md:inline">
                      {activePane === "preview" ? "Tutup Preview" : "Preview"}
                    </span>
                  </Button>
                )}
                <Button
                  variant={activePane === "templates" ? "default" : "outline"}
                  size="sm"
                  onClick={toggleTemplatesPane}
                  className="h-8 w-8 md:w-auto md:px-3 p-0"
                >
                  <Sparkles className="h-4 w-4 md:mr-2" />
                  <span className="hidden md:inline">
                    {activePane === "templates" ? "Tutup Templates" : "Templates"}
                  </span>
                </Button>
                {editor?.id && (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleDeleteForm}
                    disabled={saving || deleting}
                    className="h-8 w-8 md:w-auto md:px-3 p-0"
                  >
                    {deleting ? (
                      <Loader2 className="h-4 w-4 md:mr-2 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4 md:mr-2" />
                    )}
                    <span className="hidden md:inline">Hapus</span>
                  </Button>
                )}
                <Button
                  size="sm"
                  onClick={handleSave}
                  disabled={!editor || saving || deleting}
                  className="h-8 w-8 md:w-auto md:px-3 p-0"
                >
                  {saving ? (
                    <Loader2 className="h-4 w-4 md:mr-2 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4 md:mr-2" />
                  )}
                  <span className="hidden md:inline">Simpan</span>
                </Button>
                <DialogClose asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Tutup editor"
                    className="h-8 w-8 text-muted-foreground hover:text-foreground bg-slate-100"
                  >
                    <XIcon className="h-4 w-4" />
                  </Button>
                </DialogClose>
              </div>
            </div>

            {!editor ? (
              <div className="flex flex-1 items-center justify-center px-6 py-12 text-sm text-muted-foreground min-h-0">
                Pilih form interview atau buat form baru untuk mulai mengedit.
              </div>
            ) : (
              <>
                {successMessage && (
                  <div className="px-3 md:px-6 pt-3 md:pt-4 shrink-0">
                    <Alert className="border-emerald-200 bg-emerald-50 text-emerald-700">
                      <Check className="h-4 w-4" />
                      <AlertTitle>Berhasil disimpan</AlertTitle>
                      <AlertDescription>{successMessage}</AlertDescription>
                    </Alert>
                  </div>
                )}
                <FormEditorContent
                  editor={editor}
                  types={types}
                  tocItems={tocItems}
                  activePane={activePane}
                  onSelectPane={handleSelectPane}
                  previewReturnPane={previewReturnPane}
                  handlers={{
                    onEditorChange: handleUpdateEditor,
                    onAddSection: handleAddSection,
                    onRemoveSection: handleRemoveSection,
                    onSectionTitleChange: handleSectionTitleChange,
                    onSectionDescriptionChange: handleSectionDescriptionChange,
                    onAddQuestion: handleAddQuestion,
                    onRemoveQuestion: handleRemoveQuestion,
                    onQuestionChange: handleQuestionChange,
                    onQuestionTypeChange: handleQuestionTypeChange,
                    onAddOption: handleAddOption,
                    onRemoveOption: handleRemoveOption,
                    onOptionLabelChange: handleOptionLabelChange,
                  }}
                  newlyAddedSectionIndex={newlyAddedSectionIndexRef.current}
                  newlyAddedQuestionIds={newlyAddedQuestionIdsRef.current}
                  templates={templateProducts}
                  onSelectTemplate={handleTemplateButtonClick}
                />
              </>
            )}
          </div>
      </DialogContent>
    </Dialog>
  </>
  );
}
