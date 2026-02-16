import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withOptionalTenantContext } from "@/lib/api/with-tenant-context";

// GET SPMB settings
// Uses optional tenant context for future multi-tenant support
// TODO: Add tenantId to SPMBSetting model for proper isolation
export const GET = withOptionalTenantContext(async (_request, { tenant }) => {
  try {
    // For now, use "default" ID
    // In future: use tenant-specific ID like `spmb-${tenant.id}`
    const settingsId = tenant ? `spmb-${tenant.id}` : "default";
    
    let settings = await prisma.sPMBSetting.findUnique({
      where: { id: settingsId },
    });
    
    // Fallback to default if tenant-specific not found
    if (!settings && tenant) {
      settings = await prisma.sPMBSetting.findUnique({
        where: { id: "default" },
      });
    }

    // If no settings exist, create default
    if (!settings) {
      settings = await prisma.sPMBSetting.create({
        data: {
          id: "default",
          academicYear: "2025/2026",
          registrationOpen: true,
          heroTitle: "SPMB SMP IT MASJID SYUHADA",
          heroSubtitle: "TAHUN PELAJARAN 2025/2026",
          gelombangData: "[]",
          jalurData: "[]",
          biayaData: "{}",
          syaratData: "[]",
          wawancaraData: "{}",
        },
      });
    }

    // Parse JSON fields
    const parsed = {
      ...settings,
      gelombangData: JSON.parse(settings.gelombangData),
      jalurData: JSON.parse(settings.jalurData),
      biayaData: JSON.parse(settings.biayaData),
      syaratData: JSON.parse(settings.syaratData),
      wawancaraData: JSON.parse(settings.wawancaraData),
    };

    console.log(
      `📋 SPMB settings fetched${tenant ? ` for tenant ${tenant.name}` : " (default)"}`
    );

    return NextResponse.json({ success: true, data: parsed });
  } catch (error) {
    console.error("Error fetching SPMB settings:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch SPMB settings" },
      { status: 500 }
    );
  }
});

// PUT - Update SPMB settings
// Uses optional tenant context for future multi-tenant support
export const PUT = withOptionalTenantContext(async (request, { tenant }) => {
  try {
    const body = await request.json();
    const {
      academicYear,
      registrationOpen,
      heroTitle,
      heroSubtitle,
      heroDescription,
      gelombangData,
      jalurData,
      biayaData,
      syaratData,
      wawancaraData,
      schoolAddress,
      schoolPhone,
      schoolEmail,
    } = body;

    // For now, use "default" ID
    // In future: use tenant-specific ID like `spmb-${tenant.id}`
    const settingsId = tenant ? `spmb-${tenant.id}` : "default";
    
    const settings = await prisma.sPMBSetting.upsert({
      where: { id: settingsId },
      update: {
        academicYear,
        registrationOpen,
        heroTitle,
        heroSubtitle,
        heroDescription,
        gelombangData: JSON.stringify(gelombangData),
        jalurData: JSON.stringify(jalurData),
        biayaData: JSON.stringify(biayaData),
        syaratData: JSON.stringify(syaratData),
        wawancaraData: JSON.stringify(wawancaraData),
        schoolAddress,
        schoolPhone,
        schoolEmail,
      },
      create: {
        id: settingsId,
        academicYear,
        registrationOpen,
        heroTitle,
        heroSubtitle,
        heroDescription,
        gelombangData: JSON.stringify(gelombangData),
        jalurData: JSON.stringify(jalurData),
        biayaData: JSON.stringify(biayaData),
        syaratData: JSON.stringify(syaratData),
        wawancaraData: JSON.stringify(wawancaraData),
        schoolAddress,
        schoolPhone,
        schoolEmail,
      },
    });

    console.log(
      `✅ SPMB settings updated${tenant ? ` for tenant ${tenant.name}` : " (default)"}`
    );

    return NextResponse.json({ success: true, data: settings });
  } catch (error) {
    console.error("Error updating SPMB settings:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update SPMB settings" },
      { status: 500 }
    );
  }
});
