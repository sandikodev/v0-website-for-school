"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  Calendar, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  ExternalLink,
  BookOpen,
  Brain,
  Users,
  FileText
} from "lucide-react"

interface InterviewNotificationProps {
  submissionId: string
  applicantName: string
}

interface InterviewSession {
  id: string
  type: string
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'REVIEWED' | 'FAILED' | 'RESCHEDULED'
  scheduledDate?: string
  completedDate?: string
  googleFormUrl: string
  deadline?: string
  score?: number
  feedback?: string
}

export default function InterviewNotification({ submissionId, applicantName }: InterviewNotificationProps) {
  // Mock data - replace with API call
  const [interviews, setInterviews] = React.useState<InterviewSession[]>([
    {
      id: "1",
      type: "Interview Diniyah",
      status: "PENDING",
      googleFormUrl: "https://forms.gle/abc123",
      deadline: "2024-12-30"
    },
    {
      id: "2", 
      type: "Interview Akademik",
      status: "COMPLETED",
      googleFormUrl: "https://forms.gle/def456",
      completedDate: "2024-12-20",
      score: 85,
      feedback: "Sangat baik dalam pengetahuan agama dan karakter"
    }
  ])

  const getInterviewIcon = (type: string) => {
    switch (type) {
      case "Interview Diniyah":
        return <BookOpen className="h-5 w-5" />
      case "Interview Akademik":
        return <Brain className="h-5 w-5" />
      case "Interview Psikologis":
        return <Users className="h-5 w-5" />
      default:
        return <FileText className="h-5 w-5" />
    }
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      PENDING: { 
        color: "bg-yellow-100 text-yellow-800 border-yellow-200", 
        icon: Clock,
        text: "Menunggu Interview"
      },
      IN_PROGRESS: { 
        color: "bg-blue-100 text-blue-800 border-blue-200", 
        icon: Calendar,
        text: "Sedang Berlangsung"
      },
      COMPLETED: { 
        color: "bg-green-100 text-green-800 border-green-200", 
        icon: CheckCircle,
        text: "Selesai"
      },
      REVIEWED: { 
        color: "bg-purple-100 text-purple-800 border-purple-200", 
        icon: FileText,
        text: "Sudah Direview"
      },
      FAILED: { 
        color: "bg-red-100 text-red-800 border-red-200", 
        icon: XCircle,
        text: "Tidak Lulus"
      },
      RESCHEDULED: { 
        color: "bg-orange-100 text-orange-800 border-orange-200", 
        icon: AlertCircle,
        text: "Diundur"
      }
    }

    const config = statusConfig[status as keyof typeof statusConfig]
    const Icon = config.icon

    return (
      <Badge className={`${config.color} border`}>
        <Icon className="h-3 w-3 mr-1" />
        {config.text}
      </Badge>
    )
  }

  const pendingInterviews = interviews.filter(i => i.status === 'PENDING')
  const completedInterviews = interviews.filter(i => i.status === 'COMPLETED' || i.status === 'REVIEWED')
  const failedInterviews = interviews.filter(i => i.status === 'FAILED')

  return (
    <div className="space-y-4">
      {/* Pending Interviews Alert */}
      {pendingInterviews.length > 0 && (
        <Alert className="border-orange-200 bg-orange-50">
          <AlertCircle className="h-4 w-4 text-orange-600" />
          <AlertDescription className="text-orange-800">
            <strong>Interview Diperlukan!</strong> Anda memiliki {pendingInterviews.length} interview yang harus diselesaikan untuk melengkapi proses pendaftaran.
          </AlertDescription>
        </Alert>
      )}

      {/* Interview Progress Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Status Interview
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Progress Summary */}
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="space-y-1">
              <div className="text-2xl font-bold text-orange-600">{pendingInterviews.length}</div>
              <div className="text-xs text-muted-foreground">Pending</div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-bold text-green-600">{completedInterviews.length}</div>
              <div className="text-xs text-muted-foreground">Selesai</div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-bold text-red-600">{failedInterviews.length}</div>
              <div className="text-xs text-muted-foreground">Gagal</div>
            </div>
          </div>

          {/* Individual Interview Cards */}
          <div className="space-y-3">
            {interviews.map((interview) => (
              <Card key={interview.id} className={`${
                interview.status === 'PENDING' ? 'border-orange-200 bg-orange-50' :
                interview.status === 'COMPLETED' ? 'border-green-200 bg-green-50' :
                interview.status === 'FAILED' ? 'border-red-200 bg-red-50' :
                'border-gray-200'
              }`}>
                <CardContent className="p-4">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                          {getInterviewIcon(interview.type)}
                        </div>
                        <div>
                          <h3 className="font-semibold">{interview.type}</h3>
                          {getStatusBadge(interview.status)}
                        </div>
                      </div>

                      {interview.status === 'PENDING' && (
                        <div className="space-y-2">
                          <p className="text-sm text-orange-700">
                            ⏰ <strong>Deadline:</strong> {interview.deadline}
                          </p>
                          <p className="text-xs text-orange-600">
                            Silakan ikuti interview ini untuk melengkapi proses pendaftaran.
                          </p>
                        </div>
                      )}

                      {interview.status === 'COMPLETED' && (
                        <div className="space-y-2">
                          <p className="text-sm text-green-700">
                            ✅ <strong>Selesai:</strong> {interview.completedDate}
                          </p>
                          {interview.score && (
                            <p className="text-sm text-green-600">
                              📊 <strong>Skor:</strong> {interview.score}
                            </p>
                          )}
                          {interview.feedback && (
                            <p className="text-xs text-green-600">
                              💬 <strong>Feedback:</strong> {interview.feedback}
                            </p>
                          )}
                        </div>
                      )}

                      {interview.status === 'FAILED' && (
                        <div className="space-y-2">
                          <p className="text-sm text-red-700">
                            ❌ Interview tidak lulus. Silakan hubungi panitia untuk informasi lebih lanjut.
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2">
                      {interview.status === 'PENDING' && (
                        <Button 
                          size="sm" 
                          className="bg-orange-600 hover:bg-orange-700"
                          onClick={() => window.open(interview.googleFormUrl, '_blank')}
                        >
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Ikuti Interview
                        </Button>
                      )}
                      
                      {interview.status === 'COMPLETED' && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => window.open(interview.googleFormUrl, '_blank')}
                        >
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Lihat Hasil
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
