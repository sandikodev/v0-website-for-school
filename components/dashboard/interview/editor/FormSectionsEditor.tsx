"use client";

import { useState, useEffect } from "react";
import { InterviewQuestionType } from "@prisma/client";
import { Accordion } from "@/components/ui/accordion";
import type { EditorSection, EditorQuestion } from "./types";
import { SectionHeader } from "./SectionHeader";
import { SectionItem } from "./SectionItem";

interface FormSectionsEditorProps {
  sections: EditorSection[];
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
  onRemoveOption: (
    sectionId: string,
    questionId: string,
    optionId: string,
  ) => void;
  onOptionLabelChange: (
    sectionId: string,
    questionId: string,
    optionId: string,
    label: string,
  ) => void;
  sectionAnchorPrefix?: string;
  renderSingleSectionIndex?: number;
  isNewlyAdded?: boolean;
  newlyAddedQuestionIds?: Set<string>;
}

export function FormSectionsEditor({
  sections,
  onAddSection,
  onRemoveSection,
  onSectionTitleChange,
  onSectionDescriptionChange,
  onAddQuestion,
  onRemoveQuestion,
  onQuestionChange,
  onQuestionTypeChange,
  onAddOption,
  onRemoveOption,
  onOptionLabelChange,
  sectionAnchorPrefix,
  renderSingleSectionIndex,
  isNewlyAdded = false,
  newlyAddedQuestionIds = new Set(),
}: FormSectionsEditorProps) {
  // Track expanded sections - all sections are expanded by default
  const [expandedSections, setExpandedSections] = useState<string[]>(() =>
    sections.map((section) => section.tempId)
  );

  // Update expanded sections when sections change (e.g., new section added)
  useEffect(() => {
    const currentSectionIds = sections.map((section) => section.tempId);
    // Add any new sections to expanded list (keep existing expanded sections)
    setExpandedSections((prev) => {
      const newExpanded = [...prev];
      currentSectionIds.forEach((sectionId) => {
        if (!prev.includes(sectionId)) {
          newExpanded.push(sectionId);
        }
      });
      // Remove sections that no longer exist
      return newExpanded.filter((id) => currentSectionIds.includes(id));
    });
  }, [sections]);

  return (
    <div className="space-y-3 md:space-y-4">
      <SectionHeader
        showDeleteButton={
          typeof renderSingleSectionIndex === "number" && sections.length > 1
        }
        onAddSection={onAddSection}
        onRemoveSection={
          typeof renderSingleSectionIndex === "number"
            ? () => onRemoveSection(sections[renderSingleSectionIndex].tempId)
            : undefined
        }
      />

      <Accordion
        type="multiple"
        value={expandedSections}
        onValueChange={setExpandedSections}
        className="space-y-2 md:space-y-3"
      >
        {sections.map((section, sectionIndex) => {
          const anchorId = sectionAnchorPrefix
            ? `${sectionAnchorPrefix}-${sectionIndex + 1}`
            : undefined;

          const shouldRender =
            typeof renderSingleSectionIndex !== "number" ||
            sectionIndex === renderSingleSectionIndex;

          if (!shouldRender) return null;

          return (
            <SectionItem
              key={section.tempId}
              section={section}
              sectionIndex={sectionIndex}
              anchorId={anchorId}
              onTitleChange={(title) =>
                onSectionTitleChange(section.tempId, title)
              }
              onDescriptionChange={(description) =>
                onSectionDescriptionChange(section.tempId, description)
              }
              onQuestionChange={(questionId, patch) =>
                onQuestionChange(section.tempId, questionId, patch)
              }
              onQuestionTypeChange={(questionId, type) =>
                onQuestionTypeChange(section.tempId, questionId, type)
              }
              onRemoveQuestion={(questionId) =>
                onRemoveQuestion(section.tempId, questionId)
              }
              onAddQuestion={() => onAddQuestion(section.tempId)}
              onAddOption={(questionId) =>
                onAddOption(section.tempId, questionId)
              }
              onRemoveOption={(questionId, optionId) =>
                onRemoveOption(section.tempId, questionId, optionId)
              }
              onOptionLabelChange={(questionId, optionId, label) =>
                onOptionLabelChange(section.tempId, questionId, optionId, label)
              }
              isNewlyAdded={isNewlyAdded && sectionIndex === renderSingleSectionIndex}
              newlyAddedQuestionIds={newlyAddedQuestionIds}
            />
          );
        })}
      </Accordion>
    </div>
  );
}
