'use client';

import { FormGeneralFields } from "./FormGeneralFields";
import type { EditorForm, InterviewTypeSummary, EditorHandlers } from "./types";

interface FormInfoPaneProps {
  editor: EditorForm;
  types: InterviewTypeSummary[];
  onChange: EditorHandlers["onEditorChange"];
}

export function FormInfoPane({ editor, types, onChange }: FormInfoPaneProps) {
  return (
    <section className="space-y-3 md:space-y-4">
      <h3 className="text-sm font-semibold text-slate-800">
        Informasi Pembuatan / Editing Form
      </h3>
      <FormGeneralFields editor={editor} types={types} onChange={onChange} />
    </section>
  );
}

