/**
 * Breadcrumb Navigation Component
 *
 * Displays a breadcrumb navigation showing the current page hierarchy
 *
 * @example
 * ```tsx
 * <Breadcrumb
 *   items={[
 *     { label: "Beranda", href: "/", icon: Home },
 *     { label: "SPMB", href: "/admissions" }
 *   ]}
 * />
 * ```
 */

import Link from "next/link";
import { ChevronRight, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: LucideIcon;
  current?: boolean;
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumb({ items, className }: BreadcrumbProps) {
  return (
    <nav
      className={cn("bg-white border-b border-gray-200", className)}
      aria-label="Breadcrumb"
    >
      <div className="max-w-6xl mx-auto px-4 py-3">
        <ol className="flex items-center gap-2 text-sm">
          {items.map((item, index) => {
            const isLast = index === items.length - 1;
            const isCurrent = item.current ?? isLast;
            const Icon = item.icon;

            return (
              <li key={index} className="flex items-center gap-2">
                {item.href && !isCurrent ? (
                  <Link
                    href={item.href}
                    className="flex items-center gap-1 text-gray-600 hover:text-emerald-600 transition-colors"
                  >
                    {Icon && <Icon className="h-4 w-4" />}
                    <span>{item.label}</span>
                  </Link>
                ) : (
                  <span
                    className={cn(
                      "flex items-center gap-1",
                      isCurrent
                        ? "text-emerald-600 font-medium"
                        : "text-gray-600",
                    )}
                  >
                    {Icon && <Icon className="h-4 w-4" />}
                    <span>{item.label}</span>
                  </span>
                )}

                {!isLast && (
                  <ChevronRight
                    className="h-4 w-4 text-gray-400"
                    aria-hidden="true"
                  />
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
}
