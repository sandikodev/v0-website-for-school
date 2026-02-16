'use client';

import { FormSectionsEditor } from "./FormSectionsEditor";
import type { EditorForm, EditorHandlers } from "./types";

interface SectionEditorPaneProps {
  editor: EditorForm;
  sectionIndex: number;
  handlers: EditorHandlers;
  isNewlyAdded?: boolean;
  newlyAddedQuestionIds?: Set<string>;
}

export function SectionEditorPane({
  editor,
  sectionIndex,
  handlers,
  isNewlyAdded = false,
  newlyAddedQuestionIds = new Set(),
}: SectionEditorPaneProps) {
  const section = editor.sections[sectionIndex];

  if (!section) {
    return (
      <section className="space-y-4">
        <p className="text-xs text-muted-foreground">
          Section tidak ditemukan. Silakan pilih bagian lain atau tambah baru.
        </p>
      </section>
    );
  }

  return (
    <section className="space-y-4">
      <FormSectionsEditor
        sections={editor.sections}
        onAddSection={handlers.onAddSection}
        onRemoveSection={handlers.onRemoveSection}
        onSectionTitleChange={handlers.onSectionTitleChange}
        onSectionDescriptionChange={handlers.onSectionDescriptionChange}
        onAddQuestion={handlers.onAddQuestion}
        onRemoveQuestion={handlers.onRemoveQuestion}
        onQuestionChange={handlers.onQuestionChange}
        onQuestionTypeChange={handlers.onQuestionTypeChange}
        onAddOption={handlers.onAddOption}
        onRemoveOption={handlers.onRemoveOption}
        onOptionLabelChange={handlers.onOptionLabelChange}
        renderSingleSectionIndex={sectionIndex}
        isNewlyAdded={isNewlyAdded}
        newlyAddedQuestionIds={newlyAddedQuestionIds}
      />
    </section>
  );
}

