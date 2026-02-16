"use client";

import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { EditorPaneItem, EditorPaneKey } from "./types";
import { TOC_CONSTANTS } from "./constants";

interface TableOfContentsProps {
  tocItems: EditorPaneItem[];
  activePane: EditorPaneKey;
  onSelectPane: (pane: EditorPaneKey) => void;
  hidden?: boolean;
}

export function TableOfContents({
  tocItems,
  activePane,
  onSelectPane,
  hidden,
}: TableOfContentsProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const activeItemRef = useRef<HTMLButtonElement>(null);

  // Scroll to active item when activePane changes
  useEffect(() => {
    if (activeItemRef.current) {
      // Small delay to ensure DOM is updated
      const timeoutId = setTimeout(() => {
        activeItemRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
        });
      }, 100);
      return () => clearTimeout(timeoutId);
    }
  }, [activePane, isCollapsed]);

  if (hidden) {
    return null;
  }

  return (
    <nav
      className={cn(
        "hidden shrink-0 rounded-lg border border-slate-200 bg-slate-50 transition-all duration-200 lg:flex lg:flex-col",
        "self-start my-4 ml-4", // Align to top, margin m-4
        isCollapsed ? "w-12" : "w-48"
      )}
      style={{
        maxHeight: TOC_CONSTANTS.getMaxHeight(),
      }}
    >
      {/* Header - always visible */}
      <div
        className={cn(
          "flex items-center gap-2 shrink-0 border-b border-slate-200 bg-slate-50 rounded-t-lg",
          isCollapsed ? "justify-center p-2" : "justify-between p-3 md:p-4"
        )}
      >
        {!isCollapsed && (
          <p className="text-xs font-semibold uppercase text-slate-500">
            Daftar Isi
          </p>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="min-h-0 h-6 w-6 shrink-0 p-0 text-slate-600 hover:bg-slate-200 hover:text-slate-900"
          aria-label={isCollapsed ? "Expand daftar isi" : "Collapse daftar isi"}
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>
      
      {/* Content area - scroll independent jika konten panjang */}
      <div className="flex-1 min-h-0 overflow-y-auto rounded-b-lg">
        {!isCollapsed ? (
          <div className="px-2 py-2">
            <ul className={cn("space-y-1 text-sm")}>
              {tocItems.map((item) => {
                const isActive = activePane === item.id;
                
                return (
                  <li key={item.id}>
                    <button
                      ref={isActive ? activeItemRef : null}
                      onClick={() => onSelectPane(item.id)}
                      className={cn(
                        "w-full rounded-md transition-colors px-2 py-1.5 text-left truncate",
                        isActive
                          ? "bg-emerald-50 font-semibold text-emerald-600"
                          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                      )}
                      title={item.label}
                    >
                      {item.label}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ) : (
          <div className="px-1 py-2">
            <ul className={cn("space-y-2 text-sm")}>
              {tocItems.map((item, index) => {
                const isActive = activePane === item.id;
                
                return (
                  <li key={item.id}>
                    <button
                      ref={isActive ? activeItemRef : null}
                      onClick={() => onSelectPane(item.id)}
                      className={cn(
                        "w-full rounded-md transition-colors flex items-center justify-center py-2 text-xs font-medium min-h-0",
                        isActive
                          ? "bg-emerald-50 font-semibold text-emerald-600"
                          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                      )}
                      title={item.label}
                    >
                      {index}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
}

interface MobileTocProps {
  tocItems: EditorPaneItem[];
  activePane: EditorPaneKey;
  onSelectPane: (pane: EditorPaneKey) => void;
}

export function MobileToc({ tocItems, activePane, onSelectPane }: MobileTocProps) {
  return (
    <div className="lg:hidden">
      <div className="scrollbar-hidden flex gap-2 overflow-x-auto pb-2">
        {tocItems.map((item, index) => {
          const isActive = activePane === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onSelectPane(item.id)}
              className={cn(
                "flex items-center justify-center rounded-full border text-xs font-medium transition-all",
                "hover:scale-105 active:scale-95",
                // Mobile (< sm): circle (w-7 h-7), Tablet (sm - lg): pill shape dengan fixed width untuk simetris
                // min-h-0 untuk disable min-height default dari browser/CSS reset agar button tetap compact
                "min-h-0 w-7 h-7 sm:shrink-0 sm:w-[100px] sm:px-2.5 sm:h-7",
                isActive
                  ? "border-emerald-500 bg-emerald-50 text-emerald-700 shadow-sm"
                  : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
              )}
              title={item.label}
              aria-label={item.label}
            >
              {/* Index: Visible di mobile (< sm), hidden di sm+ */}
              <span className="sm:hidden">{index}</span>
              
              {/* Label: Hidden di mobile, visible di sm sampai sebelum lg, truncate jika panjang */}
              <span className="hidden sm:inline lg:hidden truncate text-center">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

