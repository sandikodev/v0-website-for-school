"use client";

import { useState, useEffect, useRef } from "react";
import { InterviewQuestionType } from "@prisma/client";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Trash2, ChevronDownIcon } from "lucide-react";
import {
  AccordionContent,
  AccordionItem,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import type { EditorQuestion } from "./types";
import { isOptionType, questionTypeLabel } from "./utils";
import { QuestionTypeSelect } from "./QuestionTypeSelect";
import { QuestionTextFields } from "./QuestionTextFields";
import { QuestionOptionsEditor } from "./QuestionOptionsEditor";

interface QuestionEditorProps {
  question: EditorQuestion;
  questionIndex: number;
  onQuestionChange: (patch: Partial<EditorQuestion>) => void;
  onQuestionTypeChange: (type: InterviewQuestionType) => void;
  onRemoveQuestion: () => void;
  onAddOption: () => void;
  onRemoveOption: (optionId: string) => void;
  onOptionLabelChange: (optionId: string, label: string) => void;
}

// Helper to stop event propagation
const stopPropagation = (event: React.MouseEvent | React.PointerEvent) => {
  event.stopPropagation();
};

export function QuestionEditor({
  question,
  questionIndex,
  onQuestionChange,
  onQuestionTypeChange,
  onRemoveQuestion,
  onAddOption,
  onRemoveOption,
  onOptionLabelChange,
}: QuestionEditorProps) {
  const showOptions = isOptionType(question.type);
  const [isOpen, setIsOpen] = useState(true);
  const headerRef = useRef<HTMLDivElement>(null);

  // Monitor accordion state by observing data-state changes
  useEffect(() => {
    const item = headerRef.current?.closest('[data-slot="accordion-item"]') as HTMLElement;
    if (!item) return;

    const checkState = () => {
      setIsOpen(item.getAttribute("data-state") === "open");
    };

    checkState();

    const observer = new MutationObserver(checkState);
    observer.observe(item, {
      attributes: true,
      attributeFilter: ["data-state"],
    });

    return () => observer.disconnect();
  }, []);

  return (
    <AccordionItem
      value={question.tempId}
      className="w-full rounded-lg border border-slate-200 bg-slate-50"
    >
      <AccordionPrimitive.Header
        ref={headerRef}
        className="flex items-center gap-2 px-3 py-2 md:px-4 md:py-3 min-w-0"
      >
        <AccordionPrimitive.Trigger
          className={cn(
            "focus-visible:border-ring focus-visible:ring-ring/50 flex flex-1 items-center gap-2 rounded-md text-left text-sm font-medium transition-all outline-none hover:underline focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50 min-w-0",
          )}
        >
          <div className="flex flex-1 flex-col text-left min-w-0 overflow-hidden">
            <span className="text-sm font-medium text-slate-800 truncate">
              {question.title?.trim() || `Pertanyaan ${questionIndex + 1}`}
            </span>
            <span className="hidden md:block text-xs text-muted-foreground truncate">
              {questionTypeLabel(question.type)}
              {question.required && " • Pertanyaan Wajib"}
            </span>
          </div>
          <ChevronDownIcon
            className={cn(
              "text-muted-foreground pointer-events-none size-4 shrink-0 transition-transform duration-200",
              isOpen && "rotate-180"
            )}
          />
        </AccordionPrimitive.Trigger>
          <Switch
            checked={question.required}
            onCheckedChange={(checked) =>
              onQuestionChange({ required: checked })
            }
            onClick={stopPropagation}
            onPointerDown={stopPropagation}
            className="shrink-0"
          />
        <div
          className="flex items-center shrink-0"
          onClick={stopPropagation}
          onPointerDown={stopPropagation}
          onMouseDown={stopPropagation}
        >
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="min-h-0 min-w-0 h-8 w-8 shrink-0 p-0 bg-rose-50 text-rose-600 hover:bg-rose-100 hover:text-rose-700"
            onClick={(event) => {
              stopPropagation(event);
              onRemoveQuestion();
            }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </AccordionPrimitive.Header>
      <AccordionContent className="px-3 pb-4 md:px-4">
        <div className="space-y-3">
          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            <Input
              value={question.title}
              onChange={(event) =>
                onQuestionChange({ title: event.target.value })
              }
              placeholder="Teks pertanyaan"
              className="flex-1"
            />
            <div className="w-full shrink-0 md:min-w-[200px] md:w-auto">
              <QuestionTypeSelect
                value={question.type}
                onValueChange={onQuestionTypeChange}
              />
            </div>
          </div>

          <QuestionTextFields
            description={question.description}
            helperText={question.helperText}
            onDescriptionChange={(description) =>
              onQuestionChange({ description })
            }
            onHelperTextChange={(helperText) =>
              onQuestionChange({ helperText })
            }
          />

          {showOptions && (
            <QuestionOptionsEditor
              options={question.options}
              onAddOption={onAddOption}
              onRemoveOption={onRemoveOption}
              onOptionLabelChange={onOptionLabelChange}
            />
          )}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}

