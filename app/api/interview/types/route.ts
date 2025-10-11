import { NextRequest, NextResponse } from 'next/server'

// Mock data untuk demo
const mockInterviewTypes = [
  {
    id: "1",
    name: "Interview Diniyah",
    description: "Interview untuk menilai kemampuan diniyah dan hafalan Al-Quran",
    googleFormUrl: "https://forms.gle/diniyah-demo",
    isRequired: true,
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15")
  },
  {
    id: "2", 
    name: "Interview Akademik",
    description: "Interview untuk menilai kemampuan akademik dan motivasi belajar",
    googleFormUrl: "https://forms.gle/akademik-demo",
    isRequired: true,
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15")
  },
  {
    id: "3",
    name: "Interview Psikologis", 
    description: "Interview untuk menilai kondisi psikologis dan kesiapan belajar",
    googleFormUrl: "https://forms.gle/psikologis-demo",
    isRequired: false,
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15")
  },
  {
    id: "4",
    name: "Interview Wawancara Orang Tua",
    description: "Interview dengan orang tua untuk memahami dukungan keluarga",
    googleFormUrl: "https://forms.gle/ortu-demo", 
    isRequired: false,
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15")
  }
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const isRequired = searchParams.get('required')
    
    let filteredTypes = mockInterviewTypes
    
    if (isRequired === 'true') {
      filteredTypes = mockInterviewTypes.filter(type => type.isRequired)
    } else if (isRequired === 'false') {
      filteredTypes = mockInterviewTypes.filter(type => !type.isRequired)
    }

    return NextResponse.json({
      success: true,
      data: filteredTypes,
      message: "Interview types retrieved successfully"
    })
  } catch (error) {
    console.error('Error fetching interview types:', error)
    return NextResponse.json(
      { success: false, message: "Failed to fetch interview types" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, description, googleFormUrl, isRequired } = body

    // Validasi input
    if (!name) {
      return NextResponse.json(
        { success: false, message: "Name is required" },
        { status: 400 }
      )
    }

    // Simulasi penambahan interview type baru
    const newType = {
      id: (mockInterviewTypes.length + 1).toString(),
      name,
      description: description || null,
      googleFormUrl: googleFormUrl || null,
      isRequired: isRequired || false,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    mockInterviewTypes.push(newType)

    return NextResponse.json({
      success: true,
      data: newType,
      message: "Interview type created successfully"
    })
  } catch (error) {
    console.error('Error creating interview type:', error)
    return NextResponse.json(
      { success: false, message: "Failed to create interview type" },
      { status: 500 }
    )
  }
}
