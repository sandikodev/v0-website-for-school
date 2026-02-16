"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Home, FileText, Phone } from "lucide-react";

export function MobileBottomNav() {
  const pathname = usePathname();
  const isActive = (href: string) => pathname === href;

  // Hide global nav on dashboard pages
  if (pathname?.startsWith("/dashboard")) {
    return null;
  }

  return (
    <nav
      aria-label="Mobile Navigation"
      className="fixed bottom-0 left-0 right-0 md:hidden bg-background border-t border-border z-40"
    >
      <ul className="grid grid-cols-3 h-14">
        <li>
          <Link
            href="/school"
            className={cn(
              "flex h-full items-center justify-center gap-2 text-sm",
              isActive("/school") ? "text-primary" : "text-muted-foreground",
            )}
          >
            <Home className="h-5 w-5" aria-hidden="true" />
            <span className="font-medium">School</span>
          </Link>
        </li>
        <li>
          <Link
            href="/registrar"
            className={cn(
              "flex h-full items-center justify-center gap-2 text-sm",
              isActive("/registrar") ? "text-primary" : "text-muted-foreground",
            )}
          >
            <FileText className="h-5 w-5" aria-hidden="true" />
            <span className="font-medium">Registrar</span>
          </Link>
        </li>
        <li>
          <Link
            href="/contact"
            className={cn(
              "flex h-full items-center justify-center gap-2 text-sm",
              isActive("/contact") ? "text-primary" : "text-muted-foreground",
            )}
          >
            <Phone className="h-5 w-5" aria-hidden="true" />
            <span className="font-medium">Kontak</span>
          </Link>
        </li>
      </ul>
    </nav>
  );
}
