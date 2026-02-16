"use client";

import { useEffect, useRef } from "react";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { EditorSection, EditorQuestion } from "./types";
import { InterviewQuestionType } from "@prisma/client";
import { SectionFields } from "./SectionFields";
import { QuestionsList } from "./QuestionsList";

interface SectionItemProps {
  section: EditorSection;
  sectionIndex: number;
  anchorId?: string;
  onTitleChange: (title: string) => void;
  onDescriptionChange: (description: string) => void;
  onQuestionChange: (
    questionId: string,
    patch: Partial<EditorQuestion>,
  ) => void;
  onQuestionTypeChange: (
    questionId: string,
    type: InterviewQuestionType,
  ) => void;
  onRemoveQuestion: (questionId: string) => void;
  onAddQuestion: () => void;
  onAddOption: (questionId: string) => void;
  onRemoveOption: (questionId: string, optionId: string) => void;
  onOptionLabelChange: (questionId: string, optionId: string, label: string) => void;
  isNewlyAdded?: boolean;
  newlyAddedQuestionIds?: Set<string>;
}

export function SectionItem({
  section,
  sectionIndex,
  anchorId,
  onTitleChange,
  onDescriptionChange,
  onQuestionChange,
  onQuestionTypeChange,
  onRemoveQuestion,
  onAddQuestion,
  onAddOption,
  onRemoveOption,
  onOptionLabelChange,
  isNewlyAdded = false,
  newlyAddedQuestionIds = new Set(),
}: SectionItemProps) {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isNewlyAdded && sectionRef.current) {
      // Scroll to the newly added section after accordion is expanded and content is rendered
      const timeoutId = setTimeout(() => {
        sectionRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }, 300);
      return () => clearTimeout(timeoutId);
    }
  }, [isNewlyAdded]);

  return (
    <div ref={sectionRef}>
      <AccordionItem
        value={section.tempId}
        className="border-b-2 rounded-xl border border-slate-200 bg-white px-2"
        id={anchorId}
      >
      <AccordionTrigger className="px-2 md:px-3">
        <div className="flex items-center text-left gap-2 md:gap-3 min-w-0">
          <span className="text-sm font-semibold text-slate-800 truncate">
            {section.title?.trim() || `Bagian ${sectionIndex + 1}`}
          </span>
          <span className="hidden md:inline text-slate-300">•</span>
          <span className="hidden md:inline text-xs text-muted-foreground whitespace-nowrap">
            {section.questions.length} pertanyaan
          </span>
        </div>
      </AccordionTrigger>
      <AccordionContent className="px-2 pb-4 md:px-3">
        <div className="space-y-3 md:space-y-4">
          <SectionFields
            title={section.title}
            description={section.description}
            sectionIndex={sectionIndex}
            onTitleChange={onTitleChange}
            onDescriptionChange={onDescriptionChange}
            autoFocus={isNewlyAdded}
          />

          <QuestionsList
            questions={section.questions}
            onQuestionChange={onQuestionChange}
            onQuestionTypeChange={onQuestionTypeChange}
            onRemoveQuestion={onRemoveQuestion}
            onAddQuestion={onAddQuestion}
            onAddOption={onAddOption}
            onRemoveOption={onRemoveOption}
            onOptionLabelChange={onOptionLabelChange}
            newlyAddedQuestionIds={newlyAddedQuestionIds}
          />
        </div>
      </AccordionContent>
    </AccordionItem>
    </div>
  );
}

