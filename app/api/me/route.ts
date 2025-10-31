import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function GET(req: Request) {
  try {
    // Get session using the same auth system as profile page
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    const session_email = session?.user?.email;

    if (!session_email) {
      return NextResponse.json({
        user: {
          id: 'temp',
          membershipType: 'inactive',
          name: 'Guest User',
          email: null,
          image: null,
        }
      });
    }

    // Fetch user from DB using email
    const user = await prisma.user.findUnique({ 
      where: { email: session_email },
      select: {
        id: true,
        membershipType: true,
        name: true,
        email: true,
        image: true,
      }
    });

    if (!user) {
      return NextResponse.json({
        user: {
          id: 'temp',
          membershipType: 'inactive',
          name: session?.user?.name || 'Guest User',
          email: session_email,
          image: session?.user?.image || null,
        }
      });
    }

    return NextResponse.json({ user });

  } catch (error) {
    console.error("GET /api/me error:", error);
    return NextResponse.json({
      user: {
        id: 'temp',
        membershipType: 'inactive',
        name: 'Guest User',
        email: null,
        image: null,
      }
    });
  }
}