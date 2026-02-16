import { NextResponse } from "next/server";
import { withTenantContext } from "@/lib/api/with-tenant-context";
import { getSchoolIdForTenant } from "@/lib/tenant/tenant-isolation";

// Mock data untuk demo interview results
const mockInterviewResults = [
  {
    id: "r1",
    interviewSessionId: "s2",
    question: "Berapa juz Al-Quran yang sudah dihafal?",
    answer: "Juz 30 sudah dihafal dengan baik",
    score: 85,
    feedback: "Hafalan lancar dan tajwid baik",
    createdAt: new Date("2024-10-28"),
    updatedAt: new Date("2024-10-28"),
  },
  {
    id: "r2",
    interviewSessionId: "s2",
    question: "Bagaimana cara membaca Al-Fatihah?",
    answer: "Membaca dengan tartil dan memperhatikan makhraj",
    score: 90,
    feedback: "Pengucapan sangat baik",
    createdAt: new Date("2024-10-28"),
    updatedAt: new Date("2024-10-28"),
  },
  {
    id: "r3",
    interviewSessionId: "s4",
    question: "Apakah Anda siap untuk tinggal di asrama?",
    answer: "Ya, saya siap tinggal di asrama dan mengikuti peraturan",
    score: 88,
    feedback: "Motivasi tinggi dan siap beradaptasi",
    createdAt: new Date("2024-10-30"),
    updatedAt: new Date("2024-10-30"),
  },
  {
    id: "r4",
    interviewSessionId: "s4",
    question: "Bagaimana cara mengatasi homesick?",
    answer:
      "Saya akan fokus pada kegiatan positif dan berkomunikasi dengan keluarga",
    score: 82,
    feedback: "Strategi coping yang baik",
    createdAt: new Date("2024-10-30"),
    updatedAt: new Date("2024-10-30"),
  },
];

export const GET = withTenantContext(async (request, { tenant }) => {
  try {
    const schoolId = await getSchoolIdForTenant(tenant.id);
    if (!schoolId) {
      return NextResponse.json(
        { success: false, message: "School not found for tenant" },
        { status: 404 },
      );
    }

    const { searchParams } = new URL(request.url);
    const interviewSessionId = searchParams.get("interviewSessionId");

    // TODO: Replace with real database query filtered by schoolId
    // const results = await prisma.interviewResult.findMany({
    //   where: {
    //     session: {
    //       submission: {
    //         schoolId, // CRITICAL: Tenant isolation
    //       },
    //     },
    //     ...(interviewSessionId && { sessionId: interviewSessionId }),
    //   },
    // });

    let filteredResults = [...mockInterviewResults];

    // Filter by interview session ID
    if (interviewSessionId) {
      filteredResults = filteredResults.filter(
        (result) => result.interviewSessionId === interviewSessionId,
      );
    }

    console.log(
      `[Tenant: ${tenant.name}] Fetched ${filteredResults.length} interview results`,
    );

    return NextResponse.json({
      success: true,
      data: filteredResults,
      message: "Interview results retrieved successfully",
    });
  } catch (error) {
    console.error("Error fetching interview results:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch interview results" },
      { status: 500 },
    );
  }
});

export const POST = withTenantContext(async (request, { tenant }) => {
  try {
    const schoolId = await getSchoolIdForTenant(tenant.id);
    if (!schoolId) {
      return NextResponse.json(
        { success: false, message: "School not found for tenant" },
        { status: 404 },
      );
    }

    const body = await request.json();
    const { interviewSessionId, question, answer, score, feedback } = body;

    // Validasi input
    if (!interviewSessionId || !question || !answer) {
      return NextResponse.json(
        {
          success: false,
          message: "interviewSessionId, question, and answer are required",
        },
        { status: 400 },
      );
    }

    // TODO: Validate session belongs to tenant before creating result
    // const session = await prisma.interviewSession.findFirst({
    //   where: {
    //     id: interviewSessionId,
    //     submission: { schoolId },
    //   },
    // });
    // if (!session) return 404;

    // Simulasi penambahan interview result baru
    const newResult = {
      id: `r${mockInterviewResults.length + 1}`,
      interviewSessionId,
      question,
      answer,
      score: score || null,
      feedback: feedback || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockInterviewResults.push(newResult);

    console.log(
      `[Tenant: ${tenant.name}] Created interview result for session ${interviewSessionId}`,
    );

    return NextResponse.json({
      success: true,
      data: newResult,
      message: "Interview result created successfully",
    });
  } catch (error) {
    console.error("Error creating interview result:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create interview result" },
      { status: 500 },
    );
  }
});
