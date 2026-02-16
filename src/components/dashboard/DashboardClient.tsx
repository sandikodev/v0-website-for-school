"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ProfileDropdown } from "@/components/dashboard/profile-dropdown";

interface UserData {
  id: string;
  username: string;
  email?: string | null;
  role?: string | null;
}

interface DashboardClientProps {
  user: UserData;
}

export function DashboardClient({ user }: DashboardClientProps) {
  const pathname = usePathname();

  // Determine current page for active state
  const getCurrentPage = () => {
    if (pathname === "/dashboard/overview") return "overview";
    if (pathname === "/dashboard/school") return "school";
    if (pathname === "/dashboard/contact") return "contact";
    if (pathname === "/dashboard/admissions") return "admissions";
    if (pathname === "/dashboard/messages") return "messages";
    return "overview";
  };

  const currentPage = getCurrentPage();

  return (
    <header className="mb-4 hidden items-center justify-between md:flex">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-balance">
          Dashboard Pengelolaan Website Sekolah
        </h1>
        <p className="text-sm text-muted-foreground">
          Kelola profil sekolah, fasilitas, kontak, jam operasional, dan SPMB.
        </p>
      </div>
      <div className="flex items-center gap-1.5">
        <Link href="/dashboard/overview">
          <Button
            variant={currentPage === "overview" ? "default" : "ghost"}
            size="sm"
          >
            Overview
          </Button>
        </Link>
        <Link href="/dashboard/school">
          <Button
            variant={currentPage === "school" ? "default" : "ghost"}
            size="sm"
          >
            Sekolah
          </Button>
        </Link>
        <Link href="/dashboard/contact">
          <Button
            variant={currentPage === "contact" ? "default" : "ghost"}
            size="sm"
          >
            Kontak
          </Button>
        </Link>
        <Link href="/dashboard/admissions">
          <Button
            variant={currentPage === "admissions" ? "default" : "ghost"}
            size="sm"
          >
            SPMB
          </Button>
        </Link>
        <Link href="/dashboard/messages">
          <Button
            variant={currentPage === "messages" ? "default" : "ghost"}
            size="sm"
          >
            Pesan
          </Button>
        </Link>
        <ProfileDropdown user={user} />
      </div>
    </header>
  );
}
