import { NextResponse } from "next/server";
import { removeAuthCookie } from "@/lib/jwt";

export async function POST() {
  try {
    await removeAuthCookie();

    return NextResponse.json({
      message: "Logout berhasil",
    });
  } catch (error) {
    console.error("Signout error:", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan saat logout" },
      { status: 500 }
    );
  }
}

export async function GET() {
  // Support GET method for simple logout links
  return POST();
}
