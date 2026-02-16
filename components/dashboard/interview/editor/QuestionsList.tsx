"use client";

import { InterviewQuestionType } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Wand2 } from "lucide-react";
import { Accordion } from "@/components/ui/accordion";
import type { EditorQuestion } from "./types";
import { QuestionEditor } from "./QuestionEditor";

interface QuestionsListProps {
  questions: EditorQuestion[];
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
  newlyAddedQuestionIds?: Set<string>;
}

export function QuestionsList({
  questions,
  onQuestionChange,
  onQuestionTypeChange,
  onRemoveQuestion,
  onAddQuestion,
  onAddOption,
  onRemoveOption,
  onOptionLabelChange,
  newlyAddedQuestionIds = new Set(),
}: QuestionsListProps) {
  // Only expand questions that are newly added (not from template)
  const expandedQuestionIds = questions
    .filter((question) => newlyAddedQuestionIds.has(question.tempId))
    .map((question) => question.tempId);

  return (
    <div className="space-y-3 md:space-y-4">
      <Accordion
        type="multiple"
        defaultValue={expandedQuestionIds}
        className="space-y-2 md:space-y-3"
      >
        {questions.map((question, questionIndex) => (
          <QuestionEditor
            key={question.tempId}
            question={question}
            questionIndex={questionIndex}
            onQuestionChange={(patch) =>
              onQuestionChange(question.tempId, patch)
            }
            onQuestionTypeChange={(type) =>
              onQuestionTypeChange(question.tempId, type)
            }
            onRemoveQuestion={() => onRemoveQuestion(question.tempId)}
            onAddOption={() => onAddOption(question.tempId)}
            onRemoveOption={(optionId) =>
              onRemoveOption(question.tempId, optionId)
            }
            onOptionLabelChange={(optionId, label) =>
              onOptionLabelChange(question.tempId, optionId, label)
            }
          />
        ))}
      </Accordion>

      <Button
        variant="outline"
        size="sm"
        onClick={onAddQuestion}
        className="min-h-0 border-dashed h-8 w-full md:w-auto"
      >
        <Wand2 className="h-4 w-4 md:mr-2" />
        <span className="hidden md:inline">Tambah Pertanyaan</span>
      </Button>
    </div>
  );
}

