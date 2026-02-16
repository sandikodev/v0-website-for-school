"use client";

import { InterviewQuestionType } from "@prisma/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { QUESTION_TYPE_OPTIONS } from "./utils";

interface QuestionTypeSelectProps {
  value: InterviewQuestionType;
  onValueChange: (value: InterviewQuestionType) => void;
}

export function QuestionTypeSelect({
  value,
  onValueChange,
}: QuestionTypeSelectProps) {
  return (
    <Select
      value={value}
      onValueChange={(val) => onValueChange(val as InterviewQuestionType)}
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Tipe pertanyaan" />
      </SelectTrigger>
      <SelectContent>
        {QUESTION_TYPE_OPTIONS.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

