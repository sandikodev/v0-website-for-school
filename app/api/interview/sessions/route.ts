import { NextRequest, NextResponse } from 'next/server'

// Mock data untuk demo interview sessions
const mockInterviewSessions = [
  {
    id: "s1",
    submissionId: "cmgkjjjpt000b112dwcpgc3ay",
    interviewTypeId: "1",
    status: "PENDING",
    scheduledDate: "2025-11-01T10:00:00Z",
    completedDate: null,
    notes: null,
    reviewerId: null,
    createdAt: new Date("2024-10-25"),
    updatedAt: new Date("2024-10-25"),
    interviewType: {
      id: "1",
      name: "Interview Diniyah",
      googleFormUrl: "https://forms.gle/diniyah-demo"
    },
    submission: {
      id: "cmgkjjjpt000b112dwcpgc3ay",
      registrationNumber: "SPMB-2025-2007",
      namaLengkap: "Ahmad Fauzi"
    }
  },
  {
    id: "s2",
    submissionId: "cmgkj9ypc0009112dd9om1bw9", 
    interviewTypeId: "1",
    status: "COMPLETED",
    scheduledDate: "2024-10-28T14:00:00Z",
    completedDate: "2024-10-28T14:30:00Z",
    notes: "Lulus dengan baik, hafalan juz 30 lancar",
    reviewerId: "admin1",
    createdAt: new Date("2024-10-20"),
    updatedAt: new Date("2024-10-28"),
    interviewType: {
      id: "1",
      name: "Interview Diniyah", 
      googleFormUrl: "https://forms.gle/diniyah-demo"
    },
    submission: {
      id: "cmgkj9ypc0009112dd9om1bw9",
      registrationNumber: "SPMB-2025-5790",
      namaLengkap: "Siti Rahma"
    }
  },
  {
    id: "s3",
    submissionId: "cmgkj9ypc0009112dd9om1bw9",
    interviewTypeId: "2", 
    status: "PENDING",
    scheduledDate: "2025-11-05T09:00:00Z",
    completedDate: null,
    notes: null,
    reviewerId: null,
    createdAt: new Date("2024-10-25"),
    updatedAt: new Date("2024-10-25"),
    interviewType: {
      id: "2",
      name: "Interview Akademik",
      googleFormUrl: "https://forms.gle/akademik-demo"
    },
    submission: {
      id: "cmgkj9ypc0009112dd9om1bw9",
      registrationNumber: "SPMB-2025-5790", 
      namaLengkap: "Siti Rahma"
    }
  },
  {
    id: "s4",
    submissionId: "cmgkjjjpt000b112dwcpgc3ay",
    interviewTypeId: "3",
    status: "REVIEWED",
    scheduledDate: "2024-10-30T11:00:00Z",
    completedDate: "2024-10-30T11:45:00Z", 
    notes: "Kondisi psikologis baik, siap untuk pembelajaran",
    reviewerId: "admin2",
    createdAt: new Date("2024-10-22"),
    updatedAt: new Date("2024-10-30"),
    interviewType: {
      id: "3",
      name: "Interview Psikologis",
      googleFormUrl: "https://forms.gle/psikologis-demo"
    },
    submission: {
      id: "cmgkjjjpt000b112dwcpgc3ay",
      registrationNumber: "SPMB-2025-2007",
      namaLengkap: "Ahmad Fauzi"
    }
  }
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const submissionId = searchParams.get('submissionId')
    const status = searchParams.get('status')
    const interviewTypeId = searchParams.get('interviewTypeId')
    const search = searchParams.get('search')

    let filteredSessions = [...mockInterviewSessions]

    // Filter by submission ID
    if (submissionId) {
      filteredSessions = filteredSessions.filter(session => 
        session.submissionId === submissionId
      )
    }

    // Filter by status
    if (status && status !== 'all') {
      filteredSessions = filteredSessions.filter(session => 
        session.status === status.toUpperCase()
      )
    }

    // Filter by interview type
    if (interviewTypeId && interviewTypeId !== 'all') {
      filteredSessions = filteredSessions.filter(session => 
        session.interviewTypeId === interviewTypeId
      )
    }

    // Search by name or registration number
    if (search) {
      const searchLower = search.toLowerCase()
      filteredSessions = filteredSessions.filter(session =>
        session.submission.namaLengkap.toLowerCase().includes(searchLower) ||
        session.submission.registrationNumber.toLowerCase().includes(searchLower)
      )
    }

    // Calculate stats
    const stats = {
      total: filteredSessions.length,
      pending: filteredSessions.filter(s => s.status === 'PENDING').length,
      completed: filteredSessions.filter(s => s.status === 'COMPLETED').length,
      reviewed: filteredSessions.filter(s => s.status === 'REVIEWED').length,
      failed: filteredSessions.filter(s => s.status === 'FAILED').length
    }

    return NextResponse.json({
      success: true,
      data: {
        sessions: filteredSessions,
        stats
      },
      message: "Interview sessions retrieved successfully"
    })
  } catch (error) {
    console.error('Error fetching interview sessions:', error)
    return NextResponse.json(
      { success: false, message: "Failed to fetch interview sessions" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { submissionId, interviewTypeId, scheduledDate, notes } = body

    // Validasi input
    if (!submissionId || !interviewTypeId) {
      return NextResponse.json(
        { success: false, message: "submissionId and interviewTypeId are required" },
        { status: 400 }
      )
    }

    // Simulasi penambahan interview session baru
    const newSession = {
      id: `s${mockInterviewSessions.length + 1}`,
      submissionId,
      interviewTypeId,
      status: "PENDING",
      scheduledDate: scheduledDate || null,
      completedDate: null,
      notes: notes || null,
      reviewerId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      interviewType: {
        id: interviewTypeId,
        name: "Interview Type",
        googleFormUrl: "https://forms.gle/demo"
      },
      submission: {
        id: submissionId,
        registrationNumber: "SPMB-2025-XXXX",
        namaLengkap: "Applicant Name"
      }
    }

    mockInterviewSessions.push(newSession)

    return NextResponse.json({
      success: true,
      data: newSession,
      message: "Interview session created successfully"
    })
  } catch (error) {
    console.error('Error creating interview session:', error)
    return NextResponse.json(
      { success: false, message: "Failed to create interview session" },
      { status: 500 }
    )
  }
}
