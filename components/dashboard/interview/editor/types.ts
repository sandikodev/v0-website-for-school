import { InterviewFormStatus, InterviewQuestionType } from "@prisma/client";

export const interviewFormStatuses = Object.values(InterviewFormStatus);

export type InterviewQuestionWithOptions = {
  id: string;
  title: string;
  description: string | null;
  helperText: string | null;
  type: InterviewQuestionType;
  required: boolean;
  position: number;
  options: Array<{
    id: string;
    label: string;
    value: string;
    description: string | null;
    position: number;
  }>;
};

export interface FormSummary {
  id: string;
  title: string;
  description: string | null;
  slug: string;
  status: InterviewFormStatus;
  interviewTypeId: string | null;
  interviewType?: {
    id: string;
    name: string;
  } | null;
  defaultForType?: {
    id: string;
    name: string;
  } | null;
  sections: Array<{
    id: string;
    title: string;
    description: string | null;
    position: number;
    questions: Array<{
      id: string;
      title: string;
      description: string | null;
      helperText: string | null;
      type: InterviewQuestionType;
      required: boolean;
      position: number;
      options: Array<{
        id: string;
        label: string;
        value: string;
        description: string | null;
        position: number;
      }>;
    }>;
  }>;
}

export interface InterviewTypeSummary {
  id: string;
  name: string;
}

export interface EditorOption {
  tempId: string;
  id?: string;
  label: string;
  value?: string;
  description?: string | null;
  position?: number;
}

export interface EditorQuestion {
  tempId: string;
  id?: string;
  title: string;
  description?: string | null;
  helperText?: string | null;
  type: InterviewQuestionType;
  required: boolean;
  position: number;
  settings?: Record<string, unknown> | null;
  options: EditorOption[];
}

export interface EditorSection {
  tempId: string;
  id?: string;
  title: string;
  description?: string | null;
  position: number;
  questions: EditorQuestion[];
}

export interface EditorForm {
  id?: string;
  title: string;
  description?: string | null;
  slug?: string;
  status: InterviewFormStatus;
  version?: number;
  interviewTypeId?: string;
  metadata?: Record<string, unknown> | null;
  setAsDefault?: boolean;
  sections: EditorSection[];
}

export interface EditorHandlers {
  onEditorChange: (updater: (prev: EditorForm) => EditorForm) => void;
  onAddSection: () => void;
  onRemoveSection: (sectionId: string) => void;
  onSectionTitleChange: (sectionId: string, title: string) => void;
  onSectionDescriptionChange: (sectionId: string, description: string) => void;
  onAddQuestion: (sectionId: string) => void;
  onRemoveQuestion: (sectionId: string, questionId: string) => void;
  onQuestionChange: (
    sectionId: string,
    questionId: string,
    patch: Partial<EditorQuestion>,
  ) => void;
  onQuestionTypeChange: (
    sectionId: string,
    questionId: string,
    type: InterviewQuestionType,
  ) => void;
  onAddOption: (sectionId: string, questionId: string) => void;
  onRemoveOption: (sectionId: string, questionId: string, optionId: string) => void;
  onOptionLabelChange: (
    sectionId: string,
    questionId: string,
    optionId: string,
    label: string,
  ) => void;
}

export type EditorPaneKey =
  | "templates"
  | "form-info"
  | "preview"
  | `section-${number}`;

export interface EditorPaneItem {
  id: EditorPaneKey;
  label: string;
}

export interface PreviewSlide {
  key: string;
  type: "welcome" | "section";
  section?: EditorSection;
  sectionIndex?: number;
}

