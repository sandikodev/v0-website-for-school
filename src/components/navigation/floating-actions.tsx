/**
 * Floating Action Buttons Component
 *
 * Displays floating action buttons for quick navigation (back, scroll to top, etc.)
 *
 * @example
 * ```tsx
 * <FloatingActions
 *   backButton={{ href: "/", label: "Kembali ke Beranda" }}
 *   scrollToTop={{ show: true, threshold: 400 }}
 * />
 * ```
 */

"use client";

import Link from "next/link";
import { ArrowUp, ChevronLeft, LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useScrollTop } from "@/hooks";
import { cn } from "@/lib/utils";

export interface FloatingActionButton {
  icon?: LucideIcon;
  label: string;
  onClick?: () => void;
  href?: string;
  className?: string;
  show?: boolean;
}

export interface FloatingActionsProps {
  backButton?: FloatingActionButton & { href: string };
  scrollToTop?: {
    show?: boolean;
    threshold?: number;
    label?: string;
  };
  customButtons?: FloatingActionButton[];
  position?: "bottom-right" | "bottom-left" | "top-right" | "top-left";
  className?: string;
}

const positionClasses = {
  "bottom-right": "bottom-6 right-6",
  "bottom-left": "bottom-6 left-6",
  "top-right": "top-6 right-6",
  "top-left": "top-6 left-6",
};

export function FloatingActions({
  backButton,
  scrollToTop: scrollToTopConfig,
  customButtons = [],
  position = "bottom-right",
  className,
}: FloatingActionsProps) {
  const { showButton: showScrollButton, scrollToTop } = useScrollTop(
    scrollToTopConfig?.threshold,
  );

  const shouldShowScrollTop =
    scrollToTopConfig?.show !== false && showScrollButton;

  // If nothing to show, return null
  if (!backButton && !shouldShowScrollTop && customButtons.length === 0) {
    return null;
  }

  return (
    <div
      className={cn(
        "fixed flex flex-col gap-3 z-50",
        positionClasses[position],
        className,
      )}
    >
      {/* Back Button */}
      {backButton && (
        <Link href={backButton.href}>
          <Button
            size="lg"
            className={cn(
              "h-14 w-14 rounded-full shadow-lg bg-white text-emerald-600 hover:bg-emerald-50 border-2 border-emerald-600",
              backButton.className,
            )}
            title={backButton.label}
          >
            {backButton.icon ? (
              <backButton.icon className="h-6 w-6" />
            ) : (
              <ChevronLeft className="h-6 w-6" />
            )}
          </Button>
        </Link>
      )}

      {/* Custom Buttons */}
      {customButtons.map((button, index) => {
        const Icon = button.icon;
        const ButtonComponent = button.href ? Link : "button";

        if (button.show === false) return null;

        return (
          <ButtonComponent
            key={index}
            {...(button.href ? { href: button.href } : {})}
          >
            <Button
              size="lg"
              onClick={button.onClick}
              className={cn(
                "h-14 w-14 rounded-full shadow-lg bg-primary hover:bg-primary-hover",
                button.className,
              )}
              title={button.label}
            >
              {Icon && <Icon className="h-6 w-6" />}
            </Button>
          </ButtonComponent>
        );
      })}

      {/* Scroll to Top Button */}
      {shouldShowScrollTop && (
        <Button
          size="lg"
          onClick={scrollToTop}
          className="h-14 w-14 rounded-full shadow-lg bg-primary hover:bg-primary-hover animate-in fade-in slide-in-from-bottom-5 duration-300"
          title={scrollToTopConfig?.label || "Kembali ke Atas"}
        >
          <ArrowUp className="h-6 w-6" />
        </Button>
      )}
    </div>
  );
}
