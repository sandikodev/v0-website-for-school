import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSPMBSettings } from "@/lib/spmb/getSPMBSettings";
import { withTenantContext } from "@/lib/api/with-tenant-context";
import { validateSubmissionBelongsToTenant } from "@/lib/tenant/tenant-isolation";

// GET - Get submission detail
export const GET = withTenantContext<{ id: string }>(
  async (request, { tenant, params }) => {
    try {
      const id = params?.id;
      if (!id) {
        return NextResponse.json(
          { success: false, message: "Submission ID required" },
          { status: 400 }
        );
      }

      // Validate submission belongs to tenant
      const belongsToTenant = await validateSubmissionBelongsToTenant(
        id,
        tenant.id
      );

      if (!belongsToTenant) {
        return NextResponse.json(
          { success: false, message: "Submission not found or access denied" },
          { status: 404 }
        );
      }

      const submission = await prisma.formSubmission.findUnique({
        where: { id },
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
          { status: 404 }
        );
      }

      // Parse uploaded files if exists
      let uploadedFiles = [];
      if (submission.uploadedFiles) {
        try {
          uploadedFiles = JSON.parse(submission.uploadedFiles);
        } catch (e) {
          console.error("Error parsing uploaded files:", e);
        }
      }

      // Resolve jalur and gelombang names from settings
      const settings = await getSPMBSettings();
      const jalurName = submission.jalurPendaftaran
        ? settings.jalurData.find((j) => j.id === submission.jalurPendaftaran)
            ?.name || submission.jalurPendaftaran
        : null;
      const gelombangName = submission.gelombangPendaftaran
        ? settings.gelombangData.find(
            (g) => g.id === submission.gelombangPendaftaran
          )?.name || submission.gelombangPendaftaran
        : null;

      return NextResponse.json({
        success: true,
        data: {
          ...submission,
          uploadedFiles,
          jalurPendaftaranName: jalurName,
          gelombangPendaftaranName: gelombangName,
        },
      });
    } catch (_error) {
      console.error("[API] Error fetching submission:", _error);
      return NextResponse.json(
        { success: false, message: "Internal server error" },
        { status: 500 }
      );
    }
  }
);

// PUT - Update submission (status, notes, review)
export const PUT = withTenantContext<{ id: string }>(
  async (request, { tenant, params }) => {
    try {
      const id = params?.id;
      if (!id) {
        return NextResponse.json(
          { success: false, message: "Submission ID required" },
          { status: 400 }
        );
      }

      // Validate submission belongs to tenant
      const belongsToTenant = await validateSubmissionBelongsToTenant(
        id,
        tenant.id
      );

      if (!belongsToTenant) {
        return NextResponse.json(
          { success: false, message: "Submission not found or access denied" },
          { status: 404 }
        );
      }
      const body = await request.json();

      const updateData: Record<string, unknown> = {
        updatedAt: new Date(),
      };

      if (body.status) {
        updateData.status = body.status;

        // If approving or rejecting, mark as reviewed
        if (body.status === "approved" || body.status === "rejected") {
          updateData.reviewedAt = new Date();
          updateData.reviewedBy = body.reviewedBy || "admin";
        }
      }

      if (body.notes !== undefined) {
        updateData.notes = body.notes;
      }

      const submission = await prisma.formSubmission.update({
        where: { id },
        data: updateData,
      });

      return NextResponse.json({
        success: true,
        message: "Submission updated successfully",
        data: submission,
      });
    } catch (_error) {
      console.error("[API] Error updating submission:", _error);
      return NextResponse.json(
        { success: false, message: "Failed to update submission" },
        { status: 500 }
      );
    }
  }
);

// DELETE - Delete submission
export const DELETE = withTenantContext<{ id: string }>(
  async (request, { tenant, params }) => {
    try {
      const id = params?.id;
      if (!id) {
        return NextResponse.json(
          { success: false, message: "Submission ID required" },
          { status: 400 }
        );
      }

      // Validate submission belongs to tenant
      const belongsToTenant = await validateSubmissionBelongsToTenant(
        id,
        tenant.id
      );

      if (!belongsToTenant) {
        return NextResponse.json(
          { success: false, message: "Submission not found or access denied" },
          { status: 404 }
        );
      }
      await prisma.formSubmission.delete({
        where: { id },
      });

      return NextResponse.json({
        success: true,
        message: "Submission deleted successfully",
      });
    } catch (_error) {
      console.error("[API] Error deleting submission:", _error);
      return NextResponse.json(
        { success: false, message: "Failed to delete submission" },
        { status: 500 }
      );
    }
  }
);
