"use client";

import { useCallback, useEffect, useRef } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type UseTemplateRoutingParams = {
  onLoadTemplate: (templateKey: string) => void | Promise<void>;
  onTemplateLoaded?: (templateKey: string) => void;
  validateTemplateKey?: (templateKey: string) => boolean;
};

export function useTemplateRouting({
  onLoadTemplate,
  onTemplateLoaded,
  validateTemplateKey,
}: UseTemplateRoutingParams) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const appliedTemplateRef = useRef<string | null>(null);

  const handleTemplateButtonClick = useCallback(
    async (templateKey: string) => {
      if (validateTemplateKey && !validateTemplateKey(templateKey)) return;
      appliedTemplateRef.current = null;
      const params = new URLSearchParams(searchParams?.toString() ?? "");
      params.set("template", templateKey);
      const queryString = params.toString();
      await router.replace(
        queryString ? `${pathname}?${queryString}` : pathname,
        { scroll: false },
      );
    },
    [pathname, router, searchParams, validateTemplateKey],
  );

  const clearTemplateQuery = useCallback(() => {
    if (!searchParams) return;
    if (!searchParams.get("template")) return;
    const params = new URLSearchParams(searchParams.toString());
    params.delete("template");
    const nextQuery = params.toString();
    router.replace(
      nextQuery ? `${pathname}?${nextQuery}` : pathname,
      { scroll: false },
    );
  }, [pathname, router, searchParams]);

  useEffect(() => {
    if (!searchParams) return;
    const templateKey = searchParams.get("template");
    if (!templateKey) {
      appliedTemplateRef.current = null;
      return;
    }
    if (validateTemplateKey && !validateTemplateKey(templateKey)) {
      clearTemplateQuery();
      return;
    }
    if (appliedTemplateRef.current === templateKey) {
      return;
    }
    appliedTemplateRef.current = templateKey;
    const loadTemplate = async () => {
      try {
        await onLoadTemplate(templateKey);
        onTemplateLoaded?.(templateKey);
      } catch (error) {
        console.error("Failed to load template via routing:", error);
        appliedTemplateRef.current = null;
        clearTemplateQuery();
      }
    };
    void loadTemplate();
  }, [
    clearTemplateQuery,
    onLoadTemplate,
    onTemplateLoaded,
    searchParams,
    validateTemplateKey,
  ]);

  return {
    handleTemplateButtonClick,
    clearTemplateQuery,
  };
}

