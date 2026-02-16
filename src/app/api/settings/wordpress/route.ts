import { NextRequest, NextResponse } from "next/server";

// Mock storage (dalam production gunakan database)
let wordpressConfig = {
  url: "",
  username: "",
  appPassword: "",
  status: {
    connected: false,
    lastSync: null,
    accountName: null,
  },
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url, username, appPassword } = body;

    // Validasi
    if (!url || !username || !appPassword) {
      return NextResponse.json(
        { success: false, message: "All fields are required" },
        { status: 400 },
      );
    }

    // Simpan konfigurasi
    wordpressConfig.url = url;
    wordpressConfig.username = username;
    wordpressConfig.appPassword = appPassword;

    // Test koneksi ke WordPress
    try {
      const testUrl = `${url}/wp-json/wp/v2/users/me`;
      void testUrl;
      const _auth = Buffer.from(`${username}:${appPassword}`).toString("base64");

      // Dalam production, lakukan request actual ke WordPress
      // const response = await fetch(testUrl, {
      //   headers: {
      //     'Authorization': `Basic ${auth}`
      //   }
      // })

      // Simulasi sukses untuk demo
      wordpressConfig.status = {
        connected: true,
        lastSync: new Date(),
        accountName: url.replace(/^https?:\/\//, ""),
      };

      return NextResponse.json({
        success: true,
        data: {
          accountName: wordpressConfig.status.accountName,
          message: "WordPress connected successfully",
        },
      });
    } catch {
      return NextResponse.json(
        {
          success: false,
          message:
            "Failed to connect to WordPress. Please check your credentials.",
        },
        { status: 401 },
      );
    }
  } catch (_error) {
    console.error("Error connecting WordPress:", _error);
    return NextResponse.json(
      { success: false, message: "Failed to connect WordPress" },
      { status: 500 },
    );
  }
}

export async function DELETE(_request: NextRequest) {
  try {
    // Reset konfigurasi
    wordpressConfig = {
      url: "",
      username: "",
      appPassword: "",
      status: {
        connected: false,
        lastSync: null,
        accountName: null,
      },
    };

    return NextResponse.json({
      success: true,
      message: "WordPress integration disconnected successfully",
    });
  } catch (_error) {
    console.error("Error disconnecting WordPress:", _error);
    return NextResponse.json(
      { success: false, message: "Failed to disconnect WordPress" },
      { status: 500 },
    );
  }
}

export async function GET(_request: NextRequest) {
  try {
    return NextResponse.json({
      success: true,
      data: {
        url: wordpressConfig.url,
        username: wordpressConfig.username,
        status: wordpressConfig.status,
      },
    });
  } catch (_error) {
    console.error("Error fetching WordPress config:", _error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch WordPress configuration" },
      { status: 500 },
    );
  }
}
