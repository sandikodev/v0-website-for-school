"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, Settings, LogOut, Mail, Loader2, ExternalLink } from "lucide-react";
import { toast } from "sonner";

interface UserData {
  id: string;
  username: string;
  email?: string | null;
  role?: string;
}

interface ProfileDropdownProps {
  user: UserData;
}

export function ProfileDropdown({ user }: ProfileDropdownProps) {
  const [isLoggingOut, setIsLoggingOut] = React.useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
      });

      const result = await response.json();

      if (result.success) {
        toast.success("Berhasil keluar");
        // Redirect to signin
        window.location.href = "/signin";
      } else {
        toast.error("Gagal keluar");
      }
    } catch (error) {
      console.error("Error logging out:", error);
      toast.error("Terjadi kesalahan saat keluar");
    } finally {
      setIsLoggingOut(false);
    }
  };

  // Get initials from username or email
  const getInitials = (username: string, email?: string | null): string => {
    if (username) {
      return username.charAt(0).toUpperCase();
    }
    if (email) {
      return email.charAt(0).toUpperCase();
    }
    return "U";
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex items-center gap-2 h-8 px-2.5 rounded-full hover:bg-accent/50 text-muted-foreground hover:text-foreground transition-all duration-200"
        >
          <div className="h-7 w-7 bg-primary-muted rounded-full flex items-center justify-center border border-primary/20 shadow-sm transition-all duration-200 hover:bg-primary-muted hover:border-primary/40">
            {user.email ? (
              <span className="text-xs font-semibold text-primary">
                {getInitials(user.username, user.email)}
              </span>
            ) : (
              <User className="h-3.5 w-3.5 text-primary" />
            )}
          </div>
          <span className="hidden md:inline text-sm font-medium">
            {user.username}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="p-3">
          <div className="flex flex-col space-y-1">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-primary-muted rounded-full flex items-center justify-center border border-primary/20 shadow-sm">
                {user.email ? (
                  <span className="text-sm font-semibold text-primary">
                    {getInitials(user.username, user.email)}
                  </span>
                ) : (
                  <User className="h-5 w-5 text-primary" />
                )}
              </div>
              <div className="flex flex-col space-y-0.5 flex-1 min-w-0">
                <p className="text-sm font-medium leading-none truncate">
                  {user.username}
                </p>
                {user.email && (
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Mail className="h-3 w-3 shrink-0" />
                    <span className="truncate">{user.email}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/dashboard/settings" className="flex items-center cursor-pointer">
            <Settings className="h-4 w-4 mr-2" />
            <span>Pengaturan</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={handleLogout}
          disabled={isLoggingOut}
          variant="destructive"
          className="cursor-pointer"
        >
          {isLoggingOut ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              <span>Keluar...</span>
            </>
          ) : (
            <>
              <LogOut className="h-4 w-4 mr-2" />
              <span>Keluar</span>
            </>
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

