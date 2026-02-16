"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import type {
  EditorPaneItem,
  EditorPaneKey,
  EditorSection,
} from "@/components/dashboard/interview/editor/types";

type UsePaneNavigationParams = {
  sections?: EditorSection[];
  includeTemplatesPane?: boolean;
};

const SPECIAL_PANES: EditorPaneKey[] = ["preview", "templates"];

export function usePaneNavigation({
  sections = [],
  includeTemplatesPane = true,
}: UsePaneNavigationParams) {
  const initialPane: EditorPaneKey = "form-info";
  const [activePane, setActivePane] = useState<EditorPaneKey>(initialPane);
  const lastContentPaneRef = useRef<EditorPaneKey>(initialPane);
  const lastValidPaneIndexRef = useRef<number>(0);

  const tocItems: EditorPaneItem[] = useMemo(() => {
    const items: EditorPaneItem[] = [];

    if (includeTemplatesPane) {
      items.push({ id: "templates", label: "Templates" });
    }

    items.push({ id: "form-info", label: "Informasi Form" });

    sections.forEach((section, index) => {
      items.push({
        id: `section-${index + 1}` as EditorPaneKey,
        label: section.title?.trim() || `Bagian Form ${index + 1}`,
      });
    });

    return items;
  }, [includeTemplatesPane, sections]);

  const handleSelectPane = useCallback((nextPane: EditorPaneKey) => {
    if (!SPECIAL_PANES.includes(nextPane)) {
      lastContentPaneRef.current = nextPane;
    }
    setActivePane(nextPane);
  }, []);

  const toggleSpecialPane = useCallback((pane: EditorPaneKey) => {
    if (!SPECIAL_PANES.includes(pane)) {
      handleSelectPane(pane);
      return;
    }

    setActivePane((current) => {
      if (current === pane) {
        return lastContentPaneRef.current;
      }
      if (!SPECIAL_PANES.includes(current)) {
        lastContentPaneRef.current = current;
      }
      return pane;
    });
  }, [handleSelectPane]);

  useEffect(() => {
    if (SPECIAL_PANES.includes(activePane)) return;

    const activeIndex = tocItems.findIndex((item) => item.id === activePane);
    if (activeIndex !== -1) {
      lastValidPaneIndexRef.current = activeIndex;
      return;
    }

    if (tocItems.length === 0) {
      setActivePane(initialPane);
      lastValidPaneIndexRef.current = 0;
      return;
    }

    const previousIndex = lastValidPaneIndexRef.current;
    let fallbackIndex = Math.max(previousIndex - 1, 0);
    fallbackIndex = Math.min(fallbackIndex, tocItems.length - 1);
    const fallbackPane = tocItems[fallbackIndex]?.id ?? "form-info";
    setActivePane(fallbackPane);
    lastValidPaneIndexRef.current = fallbackIndex;
  }, [activePane, includeTemplatesPane, tocItems]);

  const resetPane = useCallback(() => {
    lastContentPaneRef.current = initialPane;
    lastValidPaneIndexRef.current = 0;
    setActivePane(initialPane);
  }, [initialPane]);

  const focusDefaultPane = useCallback(() => {
    resetPane();
  }, [resetPane]);

  return {
    tocItems,
    activePane,
    handleSelectPane,
    togglePreviewPane: () => toggleSpecialPane("preview"),
    toggleTemplatesPane: () => toggleSpecialPane("templates"),
    previewReturnPane: lastContentPaneRef.current,
    resetPane,
    focusDefaultPane,
  };
}

