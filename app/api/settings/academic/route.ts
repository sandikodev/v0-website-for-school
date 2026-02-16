import { NextRequest, NextResponse } from "next/server";

// Mock storage (dalam production gunakan database)
let academicConfig = {
  apiUrl: "",
  apiKey: "",
  schoolCode: "",
  status: {
    connected: false,
    lastSync: null,
    accountName: null,
  },
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { apiUrl, apiKey, schoolCode } = body;

    // Validasi
    if (!apiUrl || !apiKey || !schoolCode) {
      return NextResponse.json(
        { success: false, message: "All fields are required" },
        { status: 400 },
      );
    }

    // Simpan konfigurasi
    academicConfig.apiUrl = apiUrl;
    academicConfig.apiKey = apiKey;
    academicConfig.schoolCode = schoolCode;

    // Test koneksi ke Academic System API
    try {
      const testUrl = `${apiUrl}/api/v1/school/verify`;
      void testUrl;

      // Dalam production, lakukan request actual ke Academic System
      // const response = await fetch(testUrl, {
      //   headers: {
      //     'Authorization': `Bearer ${apiKey}`,
      //     'X-School-Code': schoolCode
      //   }
      // })

      // Simulasi sukses untuk demo
      academicConfig.status = {
        connected: true,
        lastSync: new Date(),
        accountName: `Sekolah ${schoolCode}`,
      };

      return NextResponse.json({
        success: true,
        data: {
          schoolName: academicConfig.status.accountName,
          message: "Academic system connected successfully",
        },
      });
    } catch {
      return NextResponse.json(
        {
          success: false,
          message:
            "Failed to connect to Academic System. Please check your credentials.",
        },
        { status: 401 },
      );
    }
  } catch (_error) {
    console.error("Error connecting Academic System:", _error);
    return NextResponse.json(
      { success: false, message: "Failed to connect Academic System" },
      { status: 500 },
    );
  }
}

export async function DELETE(_request: NextRequest) {
  try {
    // Reset konfigurasi
    academicConfig = {
      apiUrl: "",
      apiKey: "",
      schoolCode: "",
      status: {
        connected: false,
        lastSync: null,
        accountName: null,
      },
    };

    return NextResponse.json({
      success: true,
      message: "Academic System integration disconnected successfully",
    });
  } catch (_error) {
    console.error("Error disconnecting Academic System:", _error);
    return NextResponse.json(
      { success: false, message: "Failed to disconnect Academic System" },
      { status: 500 },
    );
  }
}

export async function GET(_request: NextRequest) {
  try {
    return NextResponse.json({
      success: true,
      data: {
        apiUrl: academicConfig.apiUrl,
        schoolCode: academicConfig.schoolCode,
        status: academicConfig.status,
      },
    });
  } catch (_error) {
    console.error("Error fetching Academic System config:", _error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch Academic System configuration",
      },
      { status: 500 },
    );
  }
}
