"use client";

import { Tabs } from "@/components/ui/tabs";
import type { ReactNode } from "react";

interface TabItem {
  key: string;
  label: string;
}

interface FlatTabNavigationProps {
  tabs: TabItem[];
  current: string;
  onTabChange: (tab: string) => void;
  ariaLabel: string;
  children: ReactNode;
  className?: string;
}

/**
 * Reusable flat tab navigation component
 * Uses the same style as /dashboard/admissions
 * 
 * @example
 * ```tsx
 * const { current, setTab } = useTabParam("overview");
 * 
 * <FlatTabNavigation
 *   tabs={[
 *     { key: "overview", label: "Overview" },
 *     { key: "applicants", label: "Pendaftar" },
 *   ]}
 *   current={current}
 *   onTabChange={setTab}
 *   ariaLabel="SPMB sections"
 * >
 *   <TabsContent value="overview">...</TabsContent>
 *   <TabsContent value="applicants">...</TabsContent>
 * </FlatTabNavigation>
 * ```
 */
export function FlatTabNavigation({
  tabs,
  current,
  onTabChange,
  ariaLabel,
  children,
  className = "",
}: FlatTabNavigationProps) {
  return (
    <div className={`space-y-6 ${className}`}>
      {/* Flat Tab Navigation */}
      <nav aria-label={ariaLabel} className="mb-6 overflow-x-auto">
        <ul className="flex items-center gap-1">
          {tabs.map((item) => {
            const isActive = current === item.key;
            return (
              <li key={item.key}>
                <button
                  onClick={() => onTabChange(item.key)}
                  className={`inline-flex min-h-0 items-center rounded-md px-3 py-2 text-sm transition-colors ${
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-accent hover:text-primary-foreground text-muted-foreground"
                  }`}
                  type="button"
                >
                  {item.label}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Tabs Content Wrapper */}
      <Tabs value={current} onValueChange={onTabChange} className="w-full">
        {children}
      </Tabs>
    </div>
  );
}

