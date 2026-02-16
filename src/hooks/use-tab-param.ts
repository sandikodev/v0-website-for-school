"use client";
/**
 * Custom hook for managing URL query parameters for tab navigation
 *
 * @example
 * ```tsx
 * const { current, setTab } = useTabParam("default")
 *
 * <Tabs value={current} onValueChange={setTab}>
 *   <TabsTrigger value="tab1">Tab 1</TabsTrigger>
 * </Tabs>
 * ```
 */

import { useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export function useTabParam(defaultTab: string = "default") {
  const router = useRouter();
  const searchParams = useSearchParams();
  const current = searchParams?.get("tab") || defaultTab;

  const setTab = useCallback(
    (tab: string) => {
      const params = new URLSearchParams(searchParams?.toString());
      params.set("tab", tab);
      router.replace(`?${params.toString()}`, { scroll: false });
    },
    [router, searchParams],
  );

  return { current, setTab };
}
