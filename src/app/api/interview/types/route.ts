import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import {
  ensureDefaultInterviewTypes,
  syncDefaultInterviewForms,
} from "@/lib/interview/typeDefaults";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const isRequired = searchParams.get("required");

    await ensureDefaultInterviewTypes();
    await syncDefaultInterviewForms();

    const where: Record<string, unknown> = {};
    if (isRequired === "true") {
      where.isRequired = true;
    } else if (isRequired === "false") {
      where.isRequired = false;
    }

    const types = await prisma.interviewType.findMany({
      where,
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json({
      success: true,
      data: types,
      message: "Interview types retrieved successfully",
    });
  } catch (error) {
    console.error("Error fetching interview types:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch interview types" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, googleFormUrl, isRequired } = body ?? {};

    if (!name || !googleFormUrl) {
      return NextResponse.json(
        { success: false, message: "Name and googleFormUrl are required" },
        { status: 400 },
      );
    }

    const type = await prisma.interviewType.create({
      data: {
        name,
        description: description ?? null,
        googleFormUrl,
        isRequired: typeof isRequired === "boolean" ? isRequired : true,
      },
    });

    return NextResponse.json({
      success: true,
      data: type,
      message: "Interview type created successfully",
    });
  } catch (error) {
    console.error("Error creating interview type:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create interview type" },
      { status: 500 },
    );
  }
}
