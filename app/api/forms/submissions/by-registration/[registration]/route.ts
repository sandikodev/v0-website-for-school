import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ registration: string }> },
) {
  try {
    const { registration } = await params;
    const decodedRegistration = decodeURIComponent(registration).toUpperCase();

    const submission = await prisma.formSubmission.findUnique({
      where: { registrationNumber: decodedRegistration },
      include: {
        school: {
          select: {
            name: true,
            phone: true,
            email: true,
          },
        },
      },
    });

    if (!submission) {
      return NextResponse.json(
        { success: false, message: "Submission not found" },
        { status: 404 },
      );
    }

    let uploadedFiles: unknown[] = [];
    if (submission.uploadedFiles) {
      try {
        uploadedFiles = JSON.parse(submission.uploadedFiles);
      } catch (error) {
        console.error("Error parsing uploaded files:", error);
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        ...submission,
        uploadedFiles,
      },
    });
  } catch (error) {
    console.error("Error fetching submission by registration:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}


