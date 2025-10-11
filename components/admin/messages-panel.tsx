"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu"
import { Maximize2, Minimize2 } from "lucide-react"

type ContactMessage = {
  id: string
  name: string
  email: string
  phone?: string
  subject?: string
  message: string
  createdAt: string
  status: "new" | "read"
}

type ColKey = "time" | "name" | "email" | "phone" | "subject" | "message" | "status" | "actions"
const allColumns: { key: ColKey; label: string }[] = [
  { key: "time", label: "Waktu" },
  { key: "name", label: "Nama" },
  { key: "email", label: "Email" },
  { key: "phone", label: "Telepon" },
  { key: "subject", label: "Subjek" },
  { key: "message", label: "Pesan" },
  { key: "status", label: "Status" },
  { key: "actions", label: "Aksi" },
]

export default function MessagesPanel() {
  const [messages, setMessages] = React.useState<ContactMessage[]>([])
  const [query, setQuery] = React.useState("")
  const [status, setStatus] = React.useState<"all" | "new" | "read">("all")
  const [selectedId, setSelectedId] = React.useState<string | null>(null)
  const [maxRows, setMaxRows] = React.useState<number>(() => {
    // Initialize from localStorage if available
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem("inbox_max_rows")
        if (stored) {
          const parsed = parseInt(stored, 10)
          if ((parsed > 0 && parsed <= 1000) || parsed === -1) {
            return parsed
          }
        }
      } catch (e) {
        console.warn("Failed to parse maxRows from localStorage:", e)
      }
    }
    return 50 // Default value
  })
  const [visibleCols, setVisibleCols] = React.useState<Record<ColKey, boolean>>(() => {
    // Initialize from localStorage if available
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem("inbox_visible_cols")
        if (stored) {
          const parsed = JSON.parse(stored) as Record<ColKey, boolean>
          // Validate that all required columns exist
          const defaultCols: Record<ColKey, boolean> = {
    time: true,
    name: true,
    email: true,
    phone: true,
    subject: true,
    message: true,
    status: true,
    actions: true,
          }
          return { ...defaultCols, ...parsed }
        }
      } catch (error) {
        console.warn("Failed to load initial column visibility:", error)
      }
    }
    // Default values
    return {
    time: true,
    name: true,
    email: true,
    phone: true,
    subject: true,
    message: true,
    status: true,
    actions: true,
    }
  })
  const [isMaximized, setIsMaximized] = React.useState(false)
  const [columnWidths, setColumnWidths] = React.useState<Record<ColKey, number>>(() => {
    // Initialize from localStorage if available
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem("inbox_column_widths")
        if (stored) {
          const parsed = JSON.parse(stored) as Record<ColKey, number>
          // Validate that all required columns exist
          const defaultWidths: Record<ColKey, number> = {
            time: 100,
            name: 120,
            email: 150,
            phone: 100,
            subject: 150,
            message: 200,
            status: 80,
            actions: 120,
          }
          return { ...defaultWidths, ...parsed }
        }
      } catch (error) {
        console.warn("Failed to load initial column widths:", error)
      }
    }
    // Default values
    return {
      time: 100,
      name: 120,
      email: 150,
      phone: 100,
      subject: 150,
      message: 200,
      status: 80,
      actions: 120,
    }
  })

  function toggleColumn(col: ColKey) {
    setVisibleCols((prev) => {
      const next = { ...prev, [col]: !prev[col] }
      const count = Object.values(next).filter(Boolean).length
      if (count === 0) return prev
      
      // Save to localStorage immediately
      try {
        localStorage.setItem("inbox_visible_cols", JSON.stringify(next))
      } catch (error) {
        console.warn("Failed to save column visibility:", error)
      }
      
      return next
    })
  }

  function resetColumns() {
    const defaultCols: Record<ColKey, boolean> = {
      time: true,
      name: true,
      email: true,
      phone: true,
      subject: true,
      message: true,
      status: true,
      actions: true,
    }
    setVisibleCols(defaultCols)
    try {
      localStorage.setItem("inbox_visible_cols", JSON.stringify(defaultCols))
    } catch (error) {
      console.warn("Failed to save reset column visibility:", error)
    }
  }

  function showAllColumns() {
    const allCols: Record<ColKey, boolean> = {
      time: true,
      name: true,
      email: true,
      phone: true,
      subject: true,
      message: true,
      status: true,
      actions: true,
    }
    setVisibleCols(allCols)
    try {
      localStorage.setItem("inbox_visible_cols", JSON.stringify(allCols))
    } catch (error) {
      console.warn("Failed to save show all columns:", error)
    }
  }

  function updateColumnWidth(col: ColKey, width: number) {
    setColumnWidths(prev => {
      const next = { ...prev, [col]: Math.max(60, width) } // minimum 60px
      try {
        localStorage.setItem("inbox_column_widths", JSON.stringify(next))
      } catch (error) {
        console.warn("Failed to save column width:", error)
      }
      return next
    })
  }

  // Fetch messages from API
  const fetchMessages = React.useCallback(async () => {
    try {
      const params = new URLSearchParams()
      if (status !== 'all') params.set('status', status)
      if (query) params.set('search', query)
      params.set('limit', maxRows.toString())
      
      const response = await fetch(`/api/contact/messages?${params}`)
      const data = await response.json()
      
      if (data.success) {
        setMessages(data.data || [])
      } else {
        console.error('Failed to fetch messages:', data.error)
        setMessages([])
      }
    } catch (error) {
      console.error('Error fetching messages:', error)
      setMessages([])
    }
  }, [status, query, maxRows])

  React.useEffect(() => {
    fetchMessages()
  }, [fetchMessages])

  React.useEffect(() => {
    try {
      localStorage.setItem("inbox_visible_cols", JSON.stringify(visibleCols))
    } catch (error) {
      console.warn("Failed to save column visibility settings:", error)
    }
  }, [visibleCols])

  React.useEffect(() => {
    try {
      localStorage.setItem("inbox_column_widths", JSON.stringify(columnWidths))
    } catch (error) {
      console.warn("Failed to save column width settings:", error)
    }
  }, [columnWidths])

  async function toggleRead(id: string) {
    const message = messages.find((m) => m.id === id)
    if (!message) return
    
    const newStatus = message.status === "new" ? "read" : "new"
    
    try {
      const response = await fetch(`/api/contact/messages/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      })
      
      if (response.ok) {
        // Update local state optimistically
        setMessages(messages.map((m) => 
          m.id === id ? { ...m, status: newStatus } : m
        ))
      } else {
        console.error('Failed to update message status')
      }
    } catch (error) {
      console.error('Error updating message:', error)
    }
  }

  async function remove(id: string) {
    if (!confirm('Apakah Anda yakin ingin menghapus pesan ini?')) {
      return
    }
    
    try {
      const response = await fetch(`/api/contact/messages/${id}`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        // Remove from local state
        setMessages(messages.filter((m) => m.id !== id))
        if (selectedId === id) {
          setSelectedId(null)
        }
      } else {
        console.error('Failed to delete message')
        alert('Gagal menghapus pesan')
      }
    } catch (error) {
      console.error('Error deleting message:', error)
      alert('Terjadi kesalahan saat menghapus pesan')
    }
  }

  const filtered = messages.filter((m) => {
    const q = query.toLowerCase()
    const matchQ =
      !q ||
      m.name.toLowerCase().includes(q) ||
      m.email.toLowerCase().includes(q) ||
      (m.subject || "").toLowerCase().includes(q) ||
      m.message.toLowerCase().includes(q)
    const matchS = status === "all" ? true : m.status === status
    return matchQ && matchS
  }).slice(0, maxRows === -1 ? undefined : maxRows) // Apply row limit, -1 means show all

  const selected = selectedId
    ? (filtered.find((m) => m.id === selectedId) ?? messages.find((m) => m.id === selectedId))
    : null

  const visibleCount = Object.values(visibleCols).filter(Boolean).length

  return (
    <div className="space-y-4 h-full flex flex-col">
      {/* Filters */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2 flex-1">
          {/* Search Input */}
          <Input
            placeholder="Cari (nama, email, subjek, isi)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1"
            aria-label="Cari pesan"
          />
          
          {/* Filter Controls */}
          <select
            aria-label="Filter status"
            value={status}
            onChange={(e) => setStatus(e.target.value as any)}
            className="h-9 rounded-md border bg-background px-2 text-sm"
          >
            <option value="all">Semua</option>
            <option value="new">Baru</option>
            <option value="read">Dibaca</option>
          </select>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="h-9 bg-transparent">
                Pilih Kolom ({Object.values(visibleCols).filter(Boolean).length}/{allColumns.length})
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48">
              <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground border-b">
                Tampilkan Kolom
              </div>
              {allColumns.map((c) => (
                <DropdownMenuCheckboxItem
                  key={c.key}
                  checked={visibleCols[c.key]}
                  onCheckedChange={() => toggleColumn(c.key)}
                >
                  {c.label}
                </DropdownMenuCheckboxItem>
              ))}
              <div className="border-t mt-1 pt-1">
                <DropdownMenuCheckboxItem
                  checked={Object.values(visibleCols).every(Boolean)}
                  onCheckedChange={() => showAllColumns()}
                >
                  Tampilkan Semua
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={false}
                  onCheckedChange={() => resetColumns()}
                >
                  Reset ke Default
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={false}
                  onCheckedChange={() => {
                    const defaultWidths: Record<ColKey, number> = {
                      time: 100,
                      name: 120,
                      email: 150,
                      phone: 100,
                      subject: 150,
                      message: 200,
                      status: 80,
                      actions: 120,
                    }
                    setColumnWidths(defaultWidths)
                    try {
                      localStorage.setItem("inbox_column_widths", JSON.stringify(defaultWidths))
                    } catch {
                      // ignore localStorage errors
                    }
                  }}
                >
                  Reset Lebar Kolom
                </DropdownMenuCheckboxItem>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Mobile: stacked list and preview */}
      <div className="md:hidden space-y-4 flex-1 overflow-hidden">
        <div className="overflow-auto max-h-[calc(100vh-200px)]">
          <table className="w-full text-sm table-fixed" style={{ minWidth: '100%' }}>
            <thead className="text-muted-foreground">
              <tr className="border-b">
                {visibleCols.time && <th className="text-left py-2 px-2">Waktu</th>}
                {visibleCols.name && <th className="text-left py-2 px-2">Nama</th>}
                {visibleCols.email && <th className="text-left py-2 px-2">Email</th>}
                {visibleCols.phone && <th className="text-left py-2 px-2">Telepon</th>}
                {visibleCols.subject && <th className="text-left py-2 px-2">Subjek</th>}
                {visibleCols.message && <th className="text-left py-2 px-2">Pesan</th>}
                {visibleCols.status && <th className="text-left py-2 px-2">Status</th>}
                {visibleCols.actions && <th className="text-left py-2 px-2">Aksi</th>}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={visibleCount} className="py-6 text-center text-muted-foreground">
                    Belum ada pesan.
                  </td>
                </tr>
              ) : (
                filtered.map((m) => (
                  <tr
                    key={m.id}
                    className={`border-b align-top cursor-pointer ${selectedId === m.id ? "bg-muted/50" : ""}`}
                    onClick={() => setSelectedId(selectedId === m.id ? null : m.id)}
                  >
                    {visibleCols.time && (
                      <td className="py-2 px-2 whitespace-nowrap">
                        <div className="text-xs">
                          <div>{new Date(m.createdAt).toLocaleDateString('id-ID', { 
                            day: '2-digit', 
                            month: '2-digit', 
                            year: 'numeric' 
                          })}</div>
                          <div className="text-muted-foreground">{new Date(m.createdAt).toLocaleTimeString('id-ID', { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}</div>
                        </div>
                      </td>
                    )}
                    {visibleCols.name && <td className="py-2 px-2">{m.name}</td>}
                    {visibleCols.email && <td className="py-2 px-2">{m.email}</td>}
                    {visibleCols.phone && <td className="py-2 px-2">{m.phone || "-"}</td>}
                    {visibleCols.subject && <td className="py-2 px-2">{m.subject || "-"}</td>}
                    {visibleCols.message && (
                      <td className="py-2 px-2 max-w-[360px]">
                        <div className="line-clamp-3 text-pretty">{m.message}</div>
                      </td>
                    )}
                    {visibleCols.status && (
                      <td className="py-2 px-2">
                        <span
                          className={
                            m.status === "new"
                              ? "inline-flex items-center rounded bg-primary/10 px-2 py-0.5 text-primary"
                              : "inline-flex items-center rounded bg-muted px-2 py-0.5 text-muted-foreground"
                          }
                        >
                          {m.status === "new" ? "Baru" : "Dibaca"}
                        </span>
                      </td>
                    )}
                    {visibleCols.actions && (
                      <td className="py-2 px-2">
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="w-32"
                            onClick={(e) => {
                              e.stopPropagation()
                              toggleRead(m.id)
                            }}
                          >
                            {m.status === "new" ? "Tandai Dibaca" : "Tandai Baru"}
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            className="w-20"
                            onClick={(e) => {
                              e.stopPropagation()
                              remove(m.id)
                            }}
                          >
                            Hapus
                          </Button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Max Rows Filter - Mobile */}
        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-muted-foreground">
            Menampilkan {filtered.length} dari {messages.length} pesan
          </div>
          <select
            aria-label="Maksimal baris tabel"
            value={maxRows}
            onChange={(e) => {
              const newMaxRows = parseInt(e.target.value, 10)
              setMaxRows(newMaxRows)
              // Save to localStorage
              try {
                localStorage.setItem("inbox_max_rows", newMaxRows.toString())
              } catch (e) {
                console.warn("Failed to save maxRows to localStorage:", e)
              }
            }}
            className="h-9 rounded-md border bg-background px-2 text-sm"
          >
            <option value={10}>10 baris</option>
            <option value={25}>25 baris</option>
            <option value={50}>50 baris</option>
            <option value={100}>100 baris</option>
            <option value={200}>200 baris</option>
            <option value={500}>500 baris</option>
            <option value={-1}>Tampilkan Semua</option>
          </select>
        </div>

        {/* Preview below list */}
        {selected ? (
          <div className="p-4 max-h-[calc(100vh-300px)] overflow-y-auto">
            <PreviewMessage
              m={selected}
              onToggle={() => toggleRead(selected.id)}
              onDelete={() => remove(selected.id)}
              onToggleMaximize={() => setIsMaximized((v) => !v)}
              isMaximized={isMaximized}
            />
          </div>
        ) : null}
      </div>

      {/* Desktop: resizable split */}
      <div className="hidden md:block flex-1 overflow-hidden">
        <div className="rounded-md border h-full overflow-hidden">
          {isMaximized && selected ? (
            // Maximized reading view: only preview, full width
            <div className="h-full p-4 overflow-y-auto">
                <PreviewMessage
                  m={selected}
                  onToggle={() => toggleRead(selected.id)}
                  onDelete={() => remove(selected.id)}
                  onToggleMaximize={() => setIsMaximized(false)}
                  isMaximized={true}
                />
            </div>
          ) : selected ? (
            // Split view with list and preview
            <ResizablePanelGroup direction="horizontal" className="h-full w-full">
              <ResizablePanel defaultSize={50} minSize={30}>
                <div className="h-full overflow-auto p-3">
                  <table className="w-full text-sm table-fixed">
                    <thead className="text-muted-foreground">
                      <tr className="border-b">
                        {visibleCols.time && (
                          <th 
                            className="text-left py-2 px-2 relative group cursor-col-resize select-none"
                            style={{ width: columnWidths.time }}
                            onMouseDown={(e) => {
                              const startX = e.clientX
                              const startWidth = columnWidths.time
                              const handleMouseMove = (e: MouseEvent) => {
                                const newWidth = startWidth + (e.clientX - startX)
                                updateColumnWidth('time', newWidth)
                              }
                              const handleMouseUp = () => {
                                document.removeEventListener('mousemove', handleMouseMove)
                                document.removeEventListener('mouseup', handleMouseUp)
                                document.body.style.cursor = ''
                                document.body.style.userSelect = ''
                              }
                              document.addEventListener('mousemove', handleMouseMove)
                              document.addEventListener('mouseup', handleMouseUp)
                              document.body.style.cursor = 'col-resize'
                              document.body.style.userSelect = 'none'
                            }}
                          >
                            Waktu
                            <div className="absolute right-0 top-0 bottom-0 w-1 bg-transparent group-hover:bg-blue-300 cursor-col-resize" />
                          </th>
                        )}
                        {visibleCols.name && (
                          <th 
                            className="text-left py-2 px-2 relative group cursor-col-resize select-none"
                            style={{ width: columnWidths.name }}
                            onMouseDown={(e) => {
                              const startX = e.clientX
                              const startWidth = columnWidths.name
                              const handleMouseMove = (e: MouseEvent) => {
                                const newWidth = startWidth + (e.clientX - startX)
                                updateColumnWidth('name', newWidth)
                              }
                              const handleMouseUp = () => {
                                document.removeEventListener('mousemove', handleMouseMove)
                                document.removeEventListener('mouseup', handleMouseUp)
                                document.body.style.cursor = ''
                                document.body.style.userSelect = ''
                              }
                              document.addEventListener('mousemove', handleMouseMove)
                              document.addEventListener('mouseup', handleMouseUp)
                              document.body.style.cursor = 'col-resize'
                              document.body.style.userSelect = 'none'
                            }}
                          >
                            Nama
                            <div className="absolute right-0 top-0 bottom-0 w-1 bg-transparent group-hover:bg-blue-300 cursor-col-resize" />
                          </th>
                        )}
                        {visibleCols.email && (
                          <th 
                            className="text-left py-2 px-2 relative group cursor-col-resize select-none"
                            style={{ width: columnWidths.email }}
                            onMouseDown={(e) => {
                              const startX = e.clientX
                              const startWidth = columnWidths.email
                              const handleMouseMove = (e: MouseEvent) => {
                                const newWidth = startWidth + (e.clientX - startX)
                                updateColumnWidth('email', newWidth)
                              }
                              const handleMouseUp = () => {
                                document.removeEventListener('mousemove', handleMouseMove)
                                document.removeEventListener('mouseup', handleMouseUp)
                                document.body.style.cursor = ''
                                document.body.style.userSelect = ''
                              }
                              document.addEventListener('mousemove', handleMouseMove)
                              document.addEventListener('mouseup', handleMouseUp)
                              document.body.style.cursor = 'col-resize'
                              document.body.style.userSelect = 'none'
                            }}
                          >
                            Email
                            <div className="absolute right-0 top-0 bottom-0 w-1 bg-transparent group-hover:bg-blue-300 cursor-col-resize" />
                          </th>
                        )}
                        {visibleCols.phone && (
                          <th 
                            className="text-left py-2 px-2 relative group cursor-col-resize select-none"
                            style={{ width: columnWidths.phone }}
                            onMouseDown={(e) => {
                              const startX = e.clientX
                              const startWidth = columnWidths.phone
                              const handleMouseMove = (e: MouseEvent) => {
                                const newWidth = startWidth + (e.clientX - startX)
                                updateColumnWidth('phone', newWidth)
                              }
                              const handleMouseUp = () => {
                                document.removeEventListener('mousemove', handleMouseMove)
                                document.removeEventListener('mouseup', handleMouseUp)
                                document.body.style.cursor = ''
                                document.body.style.userSelect = ''
                              }
                              document.addEventListener('mousemove', handleMouseMove)
                              document.addEventListener('mouseup', handleMouseUp)
                              document.body.style.cursor = 'col-resize'
                              document.body.style.userSelect = 'none'
                            }}
                          >
                            Telepon
                            <div className="absolute right-0 top-0 bottom-0 w-1 bg-transparent group-hover:bg-blue-300 cursor-col-resize" />
                          </th>
                        )}
                        {visibleCols.subject && (
                          <th 
                            className="text-left py-2 px-2 relative group cursor-col-resize select-none"
                            style={{ width: columnWidths.subject }}
                            onMouseDown={(e) => {
                              const startX = e.clientX
                              const startWidth = columnWidths.subject
                              const handleMouseMove = (e: MouseEvent) => {
                                const newWidth = startWidth + (e.clientX - startX)
                                updateColumnWidth('subject', newWidth)
                              }
                              const handleMouseUp = () => {
                                document.removeEventListener('mousemove', handleMouseMove)
                                document.removeEventListener('mouseup', handleMouseUp)
                                document.body.style.cursor = ''
                                document.body.style.userSelect = ''
                              }
                              document.addEventListener('mousemove', handleMouseMove)
                              document.addEventListener('mouseup', handleMouseUp)
                              document.body.style.cursor = 'col-resize'
                              document.body.style.userSelect = 'none'
                            }}
                          >
                            Subjek
                            <div className="absolute right-0 top-0 bottom-0 w-1 bg-transparent group-hover:bg-blue-300 cursor-col-resize" />
                          </th>
                        )}
                        {visibleCols.message && (
                          <th 
                            className="text-left py-2 px-2 relative group cursor-col-resize select-none"
                            style={{ width: columnWidths.message }}
                            onMouseDown={(e) => {
                              const startX = e.clientX
                              const startWidth = columnWidths.message
                              const handleMouseMove = (e: MouseEvent) => {
                                const newWidth = startWidth + (e.clientX - startX)
                                updateColumnWidth('message', newWidth)
                              }
                              const handleMouseUp = () => {
                                document.removeEventListener('mousemove', handleMouseMove)
                                document.removeEventListener('mouseup', handleMouseUp)
                                document.body.style.cursor = ''
                                document.body.style.userSelect = ''
                              }
                              document.addEventListener('mousemove', handleMouseMove)
                              document.addEventListener('mouseup', handleMouseUp)
                              document.body.style.cursor = 'col-resize'
                              document.body.style.userSelect = 'none'
                            }}
                          >
                            Pesan
                            <div className="absolute right-0 top-0 bottom-0 w-1 bg-transparent group-hover:bg-blue-300 cursor-col-resize" />
                          </th>
                        )}
                        {visibleCols.status && (
                          <th 
                            className="text-left py-2 px-2 relative group cursor-col-resize select-none"
                            style={{ width: columnWidths.status }}
                            onMouseDown={(e) => {
                              const startX = e.clientX
                              const startWidth = columnWidths.status
                              const handleMouseMove = (e: MouseEvent) => {
                                const newWidth = startWidth + (e.clientX - startX)
                                updateColumnWidth('status', newWidth)
                              }
                              const handleMouseUp = () => {
                                document.removeEventListener('mousemove', handleMouseMove)
                                document.removeEventListener('mouseup', handleMouseUp)
                                document.body.style.cursor = ''
                                document.body.style.userSelect = ''
                              }
                              document.addEventListener('mousemove', handleMouseMove)
                              document.addEventListener('mouseup', handleMouseUp)
                              document.body.style.cursor = 'col-resize'
                              document.body.style.userSelect = 'none'
                            }}
                          >
                            Status
                            <div className="absolute right-0 top-0 bottom-0 w-1 bg-transparent group-hover:bg-blue-300 cursor-col-resize" />
                          </th>
                        )}
                        {visibleCols.actions && (
                          <th 
                            className="text-left py-2 px-2 relative group cursor-col-resize select-none"
                            style={{ width: columnWidths.actions }}
                            onMouseDown={(e) => {
                              const startX = e.clientX
                              const startWidth = columnWidths.actions
                              const handleMouseMove = (e: MouseEvent) => {
                                const newWidth = startWidth + (e.clientX - startX)
                                updateColumnWidth('actions', newWidth)
                              }
                              const handleMouseUp = () => {
                                document.removeEventListener('mousemove', handleMouseMove)
                                document.removeEventListener('mouseup', handleMouseUp)
                                document.body.style.cursor = ''
                                document.body.style.userSelect = ''
                              }
                              document.addEventListener('mousemove', handleMouseMove)
                              document.addEventListener('mouseup', handleMouseUp)
                              document.body.style.cursor = 'col-resize'
                              document.body.style.userSelect = 'none'
                            }}
                          >
                            Aksi
                            <div className="absolute right-0 top-0 bottom-0 w-1 bg-transparent group-hover:bg-blue-300 cursor-col-resize" />
                          </th>
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.length === 0 ? (
                        <tr>
                          <td colSpan={visibleCount} className="py-6 text-center text-muted-foreground">
                            Belum ada pesan.
                          </td>
                        </tr>
                      ) : (
                        filtered.map((m) => (
                          <tr
                            key={m.id}
                            className={`border-b align-top cursor-pointer ${selectedId === m.id ? "bg-muted/50" : ""}`}
                            onClick={() => setSelectedId(selectedId === m.id ? null : m.id)}
                          >
                            {visibleCols.time && (
                              <td className="py-2 px-2 whitespace-nowrap">
                        <div className="text-xs">
                          <div>{new Date(m.createdAt).toLocaleDateString('id-ID', { 
                            day: '2-digit', 
                            month: '2-digit', 
                            year: 'numeric' 
                          })}</div>
                          <div className="text-muted-foreground">{new Date(m.createdAt).toLocaleTimeString('id-ID', { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}</div>
                        </div>
                      </td>
                            )}
                            {visibleCols.name && <td className="py-2 px-2">{m.name}</td>}
                            {visibleCols.email && <td className="py-2 px-2">{m.email}</td>}
                            {visibleCols.phone && <td className="py-2 px-2">{m.phone || "-"}</td>}
                            {visibleCols.subject && <td className="py-2 px-2">{m.subject || "-"}</td>}
                            {visibleCols.message && (
                              <td className="py-2 px-2 max-w-[360px]">
                                <div className="line-clamp-3 text-pretty">{m.message}</div>
                              </td>
                            )}
                            {visibleCols.status && (
                              <td className="py-2 px-2">
                                <span
                                  className={
                                    m.status === "new"
                                      ? "inline-flex items-center rounded bg-primary/10 px-2 py-0.5 text-xs text-primary"
                                      : "inline-flex items-center rounded bg-muted px-2 py-0.5 text-xs text-muted-foreground"
                                  }
                                >
                                  {m.status === "new" ? "Baru" : "Dibaca"}
                                </span>
                              </td>
                            )}
                            {visibleCols.actions && (
                              <td className="py-2 px-2">
                                <div className="flex gap-2">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="w-32"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      toggleRead(m.id)
                                    }}
                                  >
                                    {m.status === "new" ? "Tandai Dibaca" : "Tandai Baru"}
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="destructive"
                                    className="w-20"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      remove(m.id)
                                    }}
                                  >
                                    Hapus
                                  </Button>
                                </div>
                              </td>
                            )}
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
                
                {/* Max Rows Filter - Desktop Split View */}
                <div className="flex items-center justify-between mt-4 px-3">
                  <div className="text-sm text-muted-foreground">
                    Menampilkan {filtered.length} dari {messages.length} pesan
                  </div>
                  <select
                    aria-label="Maksimal baris tabel"
                    value={maxRows}
                    onChange={(e) => {
                      const newMaxRows = parseInt(e.target.value, 10)
                      setMaxRows(newMaxRows)
                      // Save to localStorage
                      try {
                        localStorage.setItem("inbox_max_rows", newMaxRows.toString())
                      } catch (e) {
                        console.warn("Failed to save maxRows to localStorage:", e)
                      }
                    }}
                    className="h-9 rounded-md border bg-background px-2 text-sm"
                  >
                    <option value={10}>10 baris</option>
                    <option value={25}>25 baris</option>
                    <option value={50}>50 baris</option>
                    <option value={100}>100 baris</option>
                    <option value={200}>200 baris</option>
                    <option value={500}>500 baris</option>
                    <option value={-1}>Tampilkan Semua</option>
                  </select>
                </div>
              </ResizablePanel>

              <ResizableHandle withHandle className="bg-border" />

              <ResizablePanel defaultSize={42} minSize={24}>
                <div className="h-full p-4 overflow-y-auto">
                    <PreviewMessage
                      m={selected}
                      onToggle={() => toggleRead(selected.id)}
                      onDelete={() => remove(selected.id)}
                      onToggleMaximize={() => setIsMaximized(true)}
                      isMaximized={false}
                    />
                </div>
              </ResizablePanel>
            </ResizablePanelGroup>
          ) : (
            // No selection: show list only
            <div className="h-full">
              <div className="h-full overflow-auto p-3">
                <table className="min-w-[900px] w-full text-sm">
                  <thead className="text-muted-foreground">
                    <tr className="border-b">
                      {visibleCols.time && <th className="text-left py-2 px-2">Waktu</th>}
                      {visibleCols.name && <th className="text-left py-2 px-2">Nama</th>}
                      {visibleCols.email && <th className="text-left py-2 px-2">Email</th>}
                      {visibleCols.phone && <th className="text-left py-2 px-2">Telepon</th>}
                      {visibleCols.subject && <th className="text-left py-2 px-2">Subjek</th>}
                      {visibleCols.message && <th className="text-left py-2 px-2">Pesan</th>}
                      {visibleCols.status && <th className="text-left py-2 px-2">Status</th>}
                      {visibleCols.actions && <th className="text-left py-2 px-2">Aksi</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.length === 0 ? (
                      <tr>
                        <td colSpan={visibleCount} className="py-6 text-center text-muted-foreground">
                          Belum ada pesan.
                        </td>
                      </tr>
                    ) : (
                      filtered.map((m) => (
                        <tr
                          key={m.id}
                          className={`border-b align-top cursor-pointer ${selectedId === m.id ? "bg-muted/50" : ""}`}
                          onClick={() => setSelectedId(selectedId === m.id ? null : m.id)}
                        >
                          {visibleCols.time && (
                            <td className="py-2 px-2 whitespace-nowrap">
                        <div className="text-xs">
                          <div>{new Date(m.createdAt).toLocaleDateString('id-ID', { 
                            day: '2-digit', 
                            month: '2-digit', 
                            year: 'numeric' 
                          })}</div>
                          <div className="text-muted-foreground">{new Date(m.createdAt).toLocaleTimeString('id-ID', { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}</div>
                        </div>
                      </td>
                          )}
                          {visibleCols.name && <td className="py-2 px-2">{m.name}</td>}
                          {visibleCols.email && <td className="py-2 px-2">{m.email}</td>}
                          {visibleCols.phone && <td className="py-2 px-2">{m.phone || "-"}</td>}
                          {visibleCols.subject && <td className="py-2 px-2">{m.subject || "-"}</td>}
                          {visibleCols.message && (
                            <td className="py-2 px-2 max-w-[360px]">
                              <div className="line-clamp-3 text-pretty">{m.message}</div>
                            </td>
                          )}
                          {visibleCols.status && (
                            <td className="py-2 px-2">
                              <span
                                className={
                                  m.status === "new"
                                    ? "inline-flex items-center rounded bg-primary/10 px-2 py-0.5 text-xs text-primary"
                                    : "inline-flex items-center rounded bg-muted px-2 py-0.5 text-xs text-muted-foreground"
                                }
                              >
                                {m.status === "new" ? "Baru" : "Dibaca"}
                              </span>
                            </td>
                          )}
                          {visibleCols.actions && (
                            <td className="py-2 px-2">
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="w-32"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    toggleRead(m.id)
                                  }}
                                >
                                  {m.status === "new" ? "Tandai Dibaca" : "Tandai Baru"}
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  className="w-20"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    remove(m.id)
                                  }}
                                >
                                  Hapus
                                </Button>
                              </div>
                            </td>
                          )}
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
              
              {/* Max Rows Filter - Desktop Maximized View */}
              <div className="flex items-center justify-between mt-4 px-3">
                <div className="text-sm text-muted-foreground">
                  Menampilkan {filtered.length} dari {messages.length} pesan
                </div>
                <select
                  aria-label="Maksimal baris tabel"
                  value={maxRows}
                  onChange={(e) => {
                    const newMaxRows = parseInt(e.target.value, 10)
                    setMaxRows(newMaxRows)
                    // Save to localStorage
                    try {
                      localStorage.setItem("inbox_max_rows", newMaxRows.toString())
                    } catch (e) {
                      console.warn("Failed to save maxRows to localStorage:", e)
                    }
                  }}
                  className="h-9 rounded-md border bg-background px-2 text-sm"
                >
                  <option value={10}>10 baris</option>
                  <option value={25}>25 baris</option>
                  <option value={50}>50 baris</option>
                  <option value={100}>100 baris</option>
                  <option value={200}>200 baris</option>
                  <option value={500}>500 baris</option>
                  <option value={-1}>Tampilkan Semua</option>
                </select>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function PreviewMessage({
  m,
  onToggle,
  onDelete,
  onToggleMaximize,
  isMaximized,
}: {
  m: {
    id: string
    name: string
    email: string
    phone?: string
    subject?: string
    message: string
    createdAt: string
    status: "new" | "read"
  }
  onToggle: () => void
  onDelete: () => void
  onToggleMaximize: () => void
  isMaximized: boolean
}) {
  return (
    <div className="flex h-full flex-col min-h-[400px] max-h-[calc(100vh-200px)]">
      <div className="pb-3 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-semibold">{m.subject || "Tanpa Subjek"}</h3>
            <span
              className={
                m.status === "new"
                  ? "inline-flex items-center rounded bg-primary/10 px-2 py-0.5 text-xs text-primary"
                  : "inline-flex items-center rounded bg-muted px-2 py-0.5 text-xs text-muted-foreground"
              }
            >
              {m.status === "new" ? "Baru" : "Dibaca"}
            </span>
          </div>
          <div className="flex items-center gap-1">
            {/* Action Buttons - Compact size */}
            <Button variant="outline" size="sm" className="w-24 text-xs" onClick={onToggle}>
          {m.status === "new" ? "Tandai Dibaca" : "Tandai Baru"}
        </Button>
            <Button variant="destructive" size="sm" className="w-16 text-xs" onClick={onDelete}>
          Hapus
        </Button>
            <Button
              variant="outline"
              size="sm"
              className="hidden md:inline-flex bg-transparent w-8 h-8 p-0"
              onClick={onToggleMaximize}
              aria-label={isMaximized ? "Kembalikan tampilan" : "Perbesar tampilan baca"}
              title={isMaximized ? "Kembalikan" : "Perbesar"}
            >
              {isMaximized ? <Minimize2 className="size-3" /> : <Maximize2 className="size-3" />}
            </Button>
          </div>
        </div>
        <div className="mt-1 text-xs text-muted-foreground">
          <div className="inline-block">
            <div className="inline">{new Date(m.createdAt).toLocaleDateString('id-ID', { 
              day: '2-digit', 
              month: '2-digit', 
              year: 'numeric' 
            })}</div>
            <div className="inline text-muted-foreground ml-1">{new Date(m.createdAt).toLocaleTimeString('id-ID', { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}</div>
          </div> • {m.name} • {m.email} {m.phone ? `• ${m.phone}` : ""}
        </div>
      </div>
      <div className="mt-4 flex-1 overflow-y-auto">
        <p className="whitespace-pre-wrap text-sm leading-relaxed break-words">{m.message}</p>
      </div>
    </div>
  )
}

