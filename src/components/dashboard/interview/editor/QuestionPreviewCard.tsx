'use client';

import type { ReactNode } from "react";
import { InterviewQuestionType } from "@prisma/client";

import type { EditorQuestion } from "./types";

interface QuestionPreviewCardProps {
  question: EditorQuestion;
  sectionIndex: number;
  questionIndex: number;
}

export function QuestionPreviewCard({
  question,
  sectionIndex,
  questionIndex,
}: QuestionPreviewCardProps) {
  const baseLabel = `${sectionIndex + 1}.${questionIndex + 1}`;

  const descriptionBlock = (
    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2 md:gap-4">
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
          Pertanyaan {baseLabel}
          {question.required ? " • Wajib" : ""}
        </p>
        <h5 className="text-xs md:text-sm font-semibold text-slate-900 mt-0.5">
          {question.title || "Pertanyaan tanpa judul"}
        </h5>
        {question.description && (
          <p className="mt-1 text-xs text-muted-foreground">{question.description}</p>
        )}
        {question.helperText && (
          <p className="mt-2 text-[11px] text-slate-500">{question.helperText}</p>
        )}
      </div>
      <span className="text-xs font-medium text-slate-500 shrink-0 md:mt-0 mt-1">
        {question.type.replace(/_/g, " ")}
      </span>
    </div>
  );

  const container = (children: ReactNode) => (
    <div className="rounded-md border border-slate-100 bg-white p-3 md:p-4 shadow-sm">
      {descriptionBlock}
      {children}
    </div>
  );

  switch (question.type) {
    case InterviewQuestionType.SHORT_TEXT:
      return container(
        <input
          readOnly
          placeholder="Jawaban singkat"
          className="mt-3 w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-500"
        />,
      );
    case InterviewQuestionType.LONG_TEXT:
      return container(
        <textarea
          readOnly
          placeholder="Jawaban panjang"
          className="mt-3 w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-500"
          rows={4}
        />,
      );
    case InterviewQuestionType.RADIO:
    case InterviewQuestionType.CHECKBOX: {
      const isMultiple = question.type === InterviewQuestionType.CHECKBOX;
      return container(
        <div className="mt-3 space-y-2 text-xs text-slate-600">
          {question.options.length === 0 ? (
            <p className="text-xs text-muted-foreground">
              Belum ada opsi. Tambahkan opsi di editor.
            </p>
          ) : (
            question.options.map((option) => (
              <label
                key={option.tempId}
                className="flex items-center gap-2 rounded-md border border-transparent px-2 py-1.5 hover:border-slate-200"
              >
                <span
                  className={`flex h-3.5 w-3.5 items-center justify-center rounded-full border ${
                    question.type === InterviewQuestionType.RADIO
                      ? "border-primary"
                      : "border-border"
                  }`}
                >
                  {isMultiple ? (
                    <span className="h-2 w-2 rounded-sm bg-primary" />
                  ) : (
                    <span className="h-2 w-2 rounded-full bg-primary" />
                  )}
                </span>
                <span>{option.label || "Opsi tanpa label"}</span>
              </label>
            ))
          )}
        </div>,
      );
    }
    case InterviewQuestionType.SELECT:
      return container(
        <div className="mt-3">
          <div className="flex items-center gap-2">
            <span className="rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-[11px] uppercase tracking-wide text-slate-500">
              Pilihan
            </span>
            <span className="text-[11px] text-muted-foreground">(simulasi dropdown)</span>
          </div>
          <div className="mt-2 rounded-md border border-slate-200 bg-white px-3 py-2 text-xs text-slate-600">
            <ul className="space-y-1">
              {question.options.length === 0 ? (
                <li className="text-muted-foreground">
                  Belum ada opsi. Tambahkan opsi di editor.
                </li>
              ) : (
                question.options.map((option) => (
                  <li key={option.tempId}>{option.label || "Opsi tanpa label"}</li>
                ))
              )}
            </ul>
          </div>
        </div>,
      );
    case InterviewQuestionType.SCALE:
      return container(
        <div className="mt-4">
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground">0</span>
            <div className="h-1 flex-1 rounded-full bg-primary-muted">
              <div className="h-1 w-1/2 rounded-full bg-primary" />
            </div>
            <span className="text-xs text-muted-foreground">10</span>
          </div>
          <p className="mt-2 text-[11px] text-muted-foreground">
            Skala penilaian (simulasi slider)
          </p>
        </div>,
      );
    case InterviewQuestionType.DATE:
    case InterviewQuestionType.TIME:
    case InterviewQuestionType.FILE:
      return container(
        <div className="mt-3">
          <div className="w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-500">
            {question.type === InterviewQuestionType.DATE && "Pilih tanggal"}
            {question.type === InterviewQuestionType.TIME && "Pilih waktu"}
            {question.type === InterviewQuestionType.FILE && "Upload file"}
          </div>
        </div>,
      );
    default:
      return container(null);
  }
}

