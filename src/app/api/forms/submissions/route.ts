import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSPMBSettings } from "@/lib/spmb/getSPMBSettings";
import { withTenantContext } from "@/lib/api/with-tenant-context";
import { getSchoolIdForTenant } from "@/lib/tenant/tenant-isolation";

export const GET = withTenantContext(async (request, { tenant }) => {
  try {
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get("status");
    const search = searchParams.get("search");
    const jalur = searchParams.get("jalur");
    const gelombang = searchParams.get("gelombang");

    // Get school for this tenant (tenant isolation)
    const schoolId = await getSchoolIdForTenant(tenant.id);

    if (!schoolId) {
      return NextResponse.json(
        {
          success: false,
          message: "School not found for this tenant",
        },
        { status: 404 }
      );
    }

    // Build where clause with tenant isolation
    const where: Record<string, unknown> = {
      schoolId, // CRITICAL: Filter by tenant's school
    };

    if (status && status !== "all") {
      where.status = status;
    }

    if (search) {
      // SQLite doesn't support case-insensitive mode, so we search as-is
      // The frontend should uppercase registration numbers
      where.OR = [
        { namaLengkap: { contains: search } },
        { email: { contains: search } },
        { registrationNumber: { contains: search } },
        { noHPOrangtua: { contains: search } },
      ];
    }

    if (jalur && jalur !== "all") {
      where.jalurPendaftaran = jalur;
    }

    if (gelombang && gelombang !== "all") {
      where.gelombangPendaftaran = gelombang;
    }

    // Get submissions (filtered by tenant's school)
    const submissions = await prisma.formSubmission.findMany({
      where,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        school: {
          select: {
            name: true,
          },
        },
      },
    });

    // Resolve jalur and gelombang names from settings
    const settings = await getSPMBSettings();
    const submissionsWithNames = submissions.map((submission) => {
      const jalurName = submission.jalurPendaftaran
        ? settings.jalurData.find((j) => j.id === submission.jalurPendaftaran)
            ?.name || submission.jalurPendaftaran
        : null;
      const gelombangName = submission.gelombangPendaftaran
        ? settings.gelombangData.find(
            (g) => g.id === submission.gelombangPendaftaran,
          )?.name || submission.gelombangPendaftaran
        : null;

      return {
        ...submission,
        jalurPendaftaranName: jalurName,
        gelombangPendaftaranName: gelombangName,
      };
    });

    // Get counts for stats (filtered by tenant's school)
    const stats = await prisma.formSubmission.groupBy({
      by: ["status"],
      where: { schoolId }, // CRITICAL: Filter by tenant's school
      _count: {
        _all: true,
      },
    });

    const statusCounts = {
      total: submissions.length,
      pending: stats.find((s) => s.status === "pending")?._count._all || 0,
      reviewed: stats.find((s) => s.status === "reviewed")?._count._all || 0,
      approved: stats.find((s) => s.status === "approved")?._count._all || 0,
      rejected: stats.find((s) => s.status === "rejected")?._count._all || 0,
    };

    return NextResponse.json({
      success: true,
      data: {
        submissions: submissionsWithNames,
        stats: statusCounts,
      },
    });
  } catch (_error) {
    console.error("[API] Error fetching submissions:", _error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
});
