"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { User, Info, Phone, FileText, Mail } from "lucide-react";

const items = [
  {
    key: "overview",
    icon: User,
    label: "Overview",
    href: "/dashboard/overview",
  },
  { key: "school", icon: Info, label: "Sekolah", href: "/dashboard/school" },
  { key: "contact", icon: Phone, label: "Kontak", href: "/dashboard/contact" },
  {
    key: "admissions",
    icon: FileText,
    label: "SPMB",
    href: "/dashboard/admissions",
  },
  { key: "messages", icon: Mail, label: "Pesan", href: "/dashboard/messages" },
] as const;

export function DashboardMobileNav() {
  const pathname = usePathname();
  if (!pathname?.startsWith("/dashboard")) return null;

  // Determine current page based on pathname
  const getCurrentPage = () => {
    if (pathname === "/dashboard/overview") return "overview";
    if (pathname === "/dashboard/school") return "school";
    if (pathname === "/dashboard/contact") return "contact";
    if (pathname === "/dashboard/admissions") return "admissions";
    if (pathname === "/dashboard/messages") return "messages";
    if (pathname === "/dashboard") return "overview"; // Redirect to overview
    return "overview";
  };

  const current = getCurrentPage();

  return (
    <nav
      aria-label="Dashboard Navigation"
      className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-t border-border md:hidden"
    >
      <ul className="grid grid-cols-5 h-14">
        {items.map(({ key, icon: Icon, label, href }) => {
          const isActive = current === key;
          return (
            <li key={key}>
              <Link
                href={href}
                className={cn(
                  "flex h-full items-center justify-center",
                  isActive ? "text-primary" : "text-muted-foreground",
                )}
                aria-label={label}
              >
                <Icon className="h-5 w-5" aria-hidden="true" />
                <span className="sr-only">{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
