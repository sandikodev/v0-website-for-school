"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  FileText,
  MessageSquare,
  Settings,
  Building2,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"

interface AdminSidebarProps {
  isOpen?: boolean
  onClose?: () => void
}

const menuItems = [
  {
    title: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Siswa",
    href: "/admin/students",
    icon: Users,
  },
  {
    title: "Guru & Staff",
    href: "/admin/staff",
    icon: GraduationCap,
  },
  {
    title: "SPMB",
    href: "/admin/admissions",
    icon: FileText,
  },
  {
    title: "Pendaftar",
    href: "/admin/submissions",
    icon: FileText,
  },
  {
    title: "Pesan",
    href: "/admin/messages",
    icon: MessageSquare,
  },
  {
    title: "Sekolah",
    href: "/admin/school",
    icon: Building2,
  },
  {
    title: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
]

export function AdminSidebar({ isOpen = false, onClose }: AdminSidebarProps) {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <aside
      className={cn(
        "fixed left-0 top-16 h-[calc(100vh-4rem)] bg-white border-r transition-all duration-300 z-40",
        "lg:translate-x-0", // Always visible on desktop
        isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0", // Slide in/out on mobile
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      {/* Close button for mobile */}
      <div className="lg:hidden absolute right-4 top-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
        >
          <X className="h-5 w-5" />
        </Button>
      </div>
      {/* Collapse Toggle */}
      <div className="absolute -right-3 top-6 z-50">
        <Button
          variant="outline"
          size="icon"
          className="h-6 w-6 rounded-full bg-white shadow-md"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Menu Items */}
      <nav className="p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors",
                isActive
                  ? "bg-emerald-50 text-emerald-600 font-medium"
                  : "text-gray-700 hover:bg-gray-100"
              )}
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              {!isCollapsed && <span>{item.title}</span>}
            </Link>
          )
        })}
      </nav>

      {/* Footer Info */}
      {!isCollapsed && (
        <div className="absolute bottom-4 left-4 right-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-500">Version 1.0.0</p>
          <p className="text-xs text-gray-400">School Management System</p>
        </div>
      )}
    </aside>
  )
}

