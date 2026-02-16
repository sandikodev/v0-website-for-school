import type {
  InterviewFormStatus,
  InterviewQuestionType,
} from "@prisma/client";

export interface InterviewOptionInput {
  id?: string;
  label: string;
  value?: string;
  description?: string | null;
  position?: number;
}

export interface InterviewQuestionInput {
  id?: string;
  title: string;
  description?: string | null;
  helperText?: string | null;
  type: InterviewQuestionType;
  required?: boolean;
  position?: number;
  settings?: Record<string, unknown> | null;
  options?: InterviewOptionInput[];
}

export interface InterviewSectionInput {
  id?: string;
  title: string;
  description?: string | null;
  position?: number;
  questions?: InterviewQuestionInput[];
}

export interface InterviewFormInput {
  id?: string;
  title: string;
  description?: string | null;
  slug?: string;
  status?: InterviewFormStatus;
  version?: number;
  interviewTypeId?: string | null;
  metadata?: Record<string, unknown> | null;
  sections?: InterviewSectionInput[];
  setAsDefault?: boolean;
}

export interface InterviewFormFilter {
  status?: InterviewFormStatus;
  interviewTypeId?: string;
  includeDrafts?: boolean;
}


