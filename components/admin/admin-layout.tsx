"use client"

import { AdminNavbar } from "./admin-navbar"
import { AdminSidebar } from "./admin-sidebar"

interface AdminLayoutProps {
  children: React.ReactNode
  user?: {
    username: string
    email?: string
    role?: string
  }
}

export function AdminLayout({ children, user }: AdminLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <AdminNavbar user={user} />
      
      {/* Sidebar */}
      <AdminSidebar />
      
      {/* Main Content */}
      <main className="ml-64 pt-16 transition-all duration-300">
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  )
}

