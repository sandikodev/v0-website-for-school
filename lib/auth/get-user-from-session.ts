import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

export async function getUserFromSession() {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("user-session");

    if (!sessionCookie) {
      return null;
    }

    const session = JSON.parse(sessionCookie.value);

    const user = await prisma.user.findUnique({
      where: { id: session.id },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        isActive: true,
        tenantId: true,
        tenant: {
          select: {
            id: true,
            name: true,
            slug: true,
            domain: true,
            isActive: true,
          },
        },
      },
    });

    if (!user || !user.isActive) {
      return null;
    }

    return user;
  } catch (error) {
    // Suppress error logging during build time (static generation)
    // The error is expected when Next.js tries to statically generate auth pages
    if (error instanceof Error && error.message.includes('Dynamic server usage')) {
      return null;
    }
    
    // Only log unexpected errors in production/development runtime
    if (process.env.NODE_ENV !== 'production' || typeof window !== 'undefined') {
      console.error("Error getting user from session:", error);
    }
    return null;
  }
}

