"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AdminLayout } from "@/components/admin/admin-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Search, Mail, MailOpen, Trash2, Eye } from "lucide-react"
import { toast } from "sonner"

interface Message {
  id: string
  student: {
    id: string
    name: string
    email: string
  }
  subject: string
  content: string
  type: string
  read: boolean
  createdAt: Date
}

export default function MessagesPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState<'all' | 'unread' | 'read'>('all')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/me')
        if (!response.ok) {
          router.replace("/signin")
        } else {
          const data = await response.json()
          setUser(data.user)
          fetchMessages()
        }
      } catch {
        router.replace("/signin")
      }
    }
    
    checkAuth()
  }, [router])

  const fetchMessages = async () => {
    try {
      const response = await fetch('/api/messages')
      if (response.ok) {
        const data = await response.json()
        setMessages(data.data || [])
      }
    } catch (error) {
      console.error('Error fetching messages:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const markAsRead = async (messageId: string) => {
    try {
      const response = await fetch(`/api/messages/${messageId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ read: true }),
      })

      if (response.ok) {
        toast.success('Pesan ditandai sebagai dibaca')
        fetchMessages()
      } else {
        toast.error('Gagal menandai pesan')
      }
    } catch (error) {
      console.error('Error marking message as read:', error)
      toast.error('Terjadi kesalahan')
    }
  }

  const deleteMessage = async (messageId: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus pesan ini?')) {
      return
    }

    try {
      const response = await fetch(`/api/messages/${messageId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        toast.success('Pesan berhasil dihapus')
        fetchMessages()
      } else {
        toast.error('Gagal menghapus pesan')
      }
    } catch (error) {
      console.error('Error deleting message:', error)
      toast.error('Terjadi kesalahan')
    }
  }

  const filteredMessages = messages.filter(message => {
    const matchesSearch = 
      message.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      message.student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      message.content.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesFilter = 
      filterType === 'all' ||
      (filterType === 'unread' && !message.read) ||
      (filterType === 'read' && message.read)

    return matchesSearch && matchesFilter
  })

  const unreadCount = messages.filter(m => !m.read).length

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'info':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Info</Badge>
      case 'warning':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Warning</Badge>
      case 'urgent':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Urgent</Badge>
      default:
        return <Badge variant="outline">{type}</Badge>
    }
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <AdminLayout user={user}>
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Pesan</h1>
            <p className="mt-2 text-gray-600">Kelola pesan dari siswa dan orang tua</p>
          </div>
          {unreadCount > 0 && (
            <Badge className="bg-red-500 text-white">
              {unreadCount} Pesan Baru
            </Badge>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              onClick={() => setFilterType('all')}
              className={`px-6 py-3 border-b-2 font-medium text-sm ${
                filterType === 'all'
                  ? 'border-emerald-500 text-emerald-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Semua ({messages.length})
            </button>
            <button
              onClick={() => setFilterType('unread')}
              className={`px-6 py-3 border-b-2 font-medium text-sm ${
                filterType === 'unread'
                  ? 'border-emerald-500 text-emerald-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Belum Dibaca ({unreadCount})
            </button>
            <button
              onClick={() => setFilterType('read')}
              className={`px-6 py-3 border-b-2 font-medium text-sm ${
                filterType === 'read'
                  ? 'border-emerald-500 text-emerald-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Sudah Dibaca ({messages.length - unreadCount})
            </button>
          </nav>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Cari pesan berdasarkan subjek, pengirim, atau isi..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Messages Table */}
      <div className="bg-white rounded-lg shadow">
        {isLoading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Memuat pesan...</p>
          </div>
        ) : filteredMessages.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-500">
              {searchQuery || filterType !== 'all' ? 'Tidak ada pesan yang cocok dengan filter' : 'Belum ada pesan'}
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12"></TableHead>
                <TableHead>Dari</TableHead>
                <TableHead>Subjek</TableHead>
                <TableHead>Tipe</TableHead>
                <TableHead>Tanggal</TableHead>
                <TableHead>Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMessages.map((message) => (
                <TableRow key={message.id} className={!message.read ? 'bg-emerald-50' : ''}>
                  <TableCell>
                    {message.read ? (
                      <MailOpen className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Mail className="h-5 w-5 text-emerald-600" />
                    )}
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className={`font-medium ${!message.read ? 'text-gray-900' : 'text-gray-600'}`}>
                        {message.student.name}
                      </p>
                      <p className="text-sm text-gray-500">{message.student.email}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className={!message.read ? 'font-semibold text-gray-900' : 'text-gray-600'}>
                      {message.subject}
                    </p>
                  </TableCell>
                  <TableCell>{getTypeBadge(message.type)}</TableCell>
                  <TableCell className="text-gray-500">
                    {new Date(message.createdAt).toLocaleDateString('id-ID')}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {!message.read && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => markAsRead(message.id)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Tandai Dibaca
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-600 hover:text-red-700"
                        onClick={() => deleteMessage(message.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </AdminLayout>
  )
}

