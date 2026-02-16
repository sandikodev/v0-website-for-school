"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";

import type {
  EditorForm,
  EditorPaneItem,
  EditorPaneKey,
  InterviewTypeSummary,
  EditorHandlers,
} from "./editor/types";
import { FormEditorContent } from "./editor/FormEditorContent";

interface FormEditorDialogProps {
  editor: EditorForm | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tocItems: EditorPaneItem[];
  activePane: EditorPaneKey;
  onSelectPane: (pane: EditorPaneKey) => void;
  previewReturnPane: EditorPaneKey;
  types: InterviewTypeSummary[];
  handlers: EditorHandlers;
  newlyAddedSectionIndex?: number | null;
  newlyAddedQuestionIds?: Set<string>;
}

export function FormEditorDialog({
  editor,
  open,
  onOpenChange,
  tocItems,
  activePane,
  onSelectPane,
  previewReturnPane,
  types,
  handlers,
  newlyAddedSectionIndex,
  newlyAddedQuestionIds,
}: FormEditorDialogProps) {
  return (
    <Dialog open={open && Boolean(editor)} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="sm:max-w-5xl w-[min(960px,95vw)] max-h-[90vh] overflow-hidden p-0"
        onPointerDownOutside={(event) => {
          event.preventDefault();
        }}
      >
        <div className="flex h-full max-h-[90vh] flex-col overflow-hidden">
          {editor && (
            <FormEditorContent
              editor={editor}
              types={types}
              tocItems={tocItems}
              activePane={activePane}
              onSelectPane={onSelectPane}
              previewReturnPane={previewReturnPane}
              handlers={handlers}
              newlyAddedSectionIndex={newlyAddedSectionIndex}
              newlyAddedQuestionIds={newlyAddedQuestionIds}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

