import { InterviewQuestionType } from "@prisma/client";

export function isOptionType(type: InterviewQuestionType): boolean {
  switch (type) {
    case InterviewQuestionType.RADIO:
    case InterviewQuestionType.CHECKBOX:
    case InterviewQuestionType.SELECT:
      return true;
    default:
      return false;
  }
}

export function questionTypeLabel(type: InterviewQuestionType): string {
  switch (type) {
    case InterviewQuestionType.SHORT_TEXT:
      return "Jawaban singkat";
    case InterviewQuestionType.LONG_TEXT:
      return "Paragraf";
    case InterviewQuestionType.RADIO:
      return "Pilihan tunggal";
    case InterviewQuestionType.CHECKBOX:
      return "Pilihan ganda";
    case InterviewQuestionType.SELECT:
      return "Dropdown";
    case InterviewQuestionType.SCALE:
      return "Skala";
    case InterviewQuestionType.DATE:
      return "Tanggal";
    case InterviewQuestionType.TIME:
      return "Waktu";
    case InterviewQuestionType.FILE:
      return "Upload file";
    default:
      return type;
  }
}

export const QUESTION_TYPE_OPTIONS = [
  { value: InterviewQuestionType.SHORT_TEXT, label: "Jawaban singkat" },
  { value: InterviewQuestionType.LONG_TEXT, label: "Paragraf" },
  { value: InterviewQuestionType.RADIO, label: "Pilihan tunggal" },
  { value: InterviewQuestionType.CHECKBOX, label: "Pilihan ganda" },
  { value: InterviewQuestionType.SELECT, label: "Dropdown" },
  { value: InterviewQuestionType.SCALE, label: "Skala penilaian" },
  { value: InterviewQuestionType.DATE, label: "Tanggal" },
  { value: InterviewQuestionType.TIME, label: "Waktu" },
  { value: InterviewQuestionType.FILE, label: "Upload file" },
] as const;

