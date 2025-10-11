"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { 
  Calendar, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  FileText, 
  Filter, 
  Download,
  Upload,
  ExternalLink,
  Eye,
  Plus
} from "lucide-react"

interface InterviewSession {
  id: string
  submissionId: string
  applicantName: string
  applicantId: string
  interviewType: string
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'REVIEWED' | 'FAILED' | 'RESCHEDULED'
  scheduledDate?: string
  completedDate?: string
  googleFormId?: string
  score?: number
  grade?: string
  feedback?: string
}

export default function InterviewManagement() {
  const [sessions, setSessions] = useState<InterviewSession[]>([])
  const [filteredSessions, setFilteredSessions] = useState<InterviewSession[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [loading, setLoading] = useState(true)

  // Mock data - replace with API call
  useEffect(() => {
    const mockSessions: InterviewSession[] = [
      {
        id: "1",
        submissionId: "SPMB-2025-0935",
        applicantName: "Ahmad Fauzi",
        applicantId: "SPMB-2025-0935",
        interviewType: "Interview Diniyah",
        status: "COMPLETED",
        completedDate: "2024-12-20",
        googleFormId: "abc123",
        score: 85,
        grade: "A",
        feedback: "Sangat baik dalam pengetahuan agama"
      },
      {
        id: "2", 
        submissionId: "SPMB-2025-0936",
        applicantName: "Siti Nurhaliza",
        applicantId: "SPMB-2025-0936",
        interviewType: "Interview Diniyah",
        status: "PENDING",
        scheduledDate: "2024-12-25"
      }
    ]
    
    setSessions(mockSessions)
    setFilteredSessions(mockSessions)
    setLoading(false)
  }, [])

  // Filter logic
  useEffect(() => {
    let filtered = sessions

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(session => 
        session.applicantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        session.applicantId.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(session => session.status === statusFilter)
    }

    // Type filter
    if (typeFilter !== "all") {
      filtered = filtered.filter(session => session.interviewType === typeFilter)
    }

    setFilteredSessions(filtered)
  }, [sessions, searchTerm, statusFilter, typeFilter])

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      PENDING: { color: "bg-yellow-100 text-yellow-800", icon: Clock },
      IN_PROGRESS: { color: "bg-blue-100 text-blue-800", icon: Calendar },
      COMPLETED: { color: "bg-green-100 text-green-800", icon: CheckCircle },
      REVIEWED: { color: "bg-purple-100 text-purple-800", icon: Eye },
      FAILED: { color: "bg-red-100 text-red-800", icon: XCircle },
      RESCHEDULED: { color: "bg-orange-100 text-orange-800", icon: AlertCircle }
    }

    const config = statusConfig[status as keyof typeof statusConfig]
    const Icon = config.icon

    return (
      <Badge className={config.color}>
        <Icon className="h-3 w-3 mr-1" />
        {status.replace('_', ' ')}
      </Badge>
    )
  }

  const getStatusCounts = () => {
    const counts = {
      total: sessions.length,
      pending: sessions.filter(s => s.status === 'PENDING').length,
      completed: sessions.filter(s => s.status === 'COMPLETED').length,
      reviewed: sessions.filter(s => s.status === 'REVIEWED').length
    }
    return counts
  }

  const stats = getStatusCounts()

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Interview</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Reviewed</p>
                <p className="text-2xl font-bold text-purple-600">{stats.reviewed}</p>
              </div>
              <Eye className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Actions */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <CardTitle>Interview Management</CardTitle>
            <div className="flex gap-2">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Upload className="h-4 w-4 mr-2" />
                    Import Google Forms
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Import Interview Data</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Upload CSV file dari Google Forms atau masukkan data manual.
                    </p>
                    <Button className="w-full">
                      <Upload className="h-4 w-4 mr-2" />
                      Upload CSV File
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
              
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export Data
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <Input
                placeholder="Cari nama atau ID pendaftar..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Status</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                <SelectItem value="COMPLETED">Completed</SelectItem>
                <SelectItem value="REVIEWED">Reviewed</SelectItem>
                <SelectItem value="FAILED">Failed</SelectItem>
              </SelectContent>
            </Select>

            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter Tipe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Tipe</SelectItem>
                <SelectItem value="Interview Diniyah">Interview Diniyah</SelectItem>
                <SelectItem value="Interview Akademik">Interview Akademik</SelectItem>
                <SelectItem value="Interview Psikologis">Interview Psikologis</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Interview Sessions Table */}
          <div className="space-y-4">
            {filteredSessions.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                Tidak ada data interview yang ditemukan.
              </div>
            ) : (
              filteredSessions.map((session) => (
                <Card key={session.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold">{session.applicantName}</h3>
                          <Badge variant="outline">{session.applicantId}</Badge>
                          {getStatusBadge(session.status)}
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm text-muted-foreground">
                          <div>
                            <span className="font-medium">Tipe Interview:</span>
                            <p>{session.interviewType}</p>
                          </div>
                          <div>
                            <span className="font-medium">Tanggal:</span>
                            <p>{session.scheduledDate || session.completedDate || 'Belum dijadwalkan'}</p>
                          </div>
                          <div>
                            <span className="font-medium">Skor:</span>
                            <p>{session.score ? `${session.score} (${session.grade})` : 'Belum dinilai'}</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        {session.googleFormId && (
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => window.open(`https://forms.gle/${session.googleFormId}`, '_blank')}
                          >
                            <ExternalLink className="h-4 w-4 mr-2" />
                            Google Form
                          </Button>
                        )}
                        
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4 mr-2" />
                          Detail
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
