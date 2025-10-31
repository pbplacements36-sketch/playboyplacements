import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const clients = await prisma.client.findMany({
      select: {
        id: true,
        images: true,
        earnings: true,
        category: true,
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 20 // Limit to 20 latest clients
    });

    return NextResponse.json(clients);
  } catch (error) {
    console.error("Failed to fetch clients:", error);
    return NextResponse.json(
      { error: "Failed to fetch clients" },
      { status: 500 }
    );
  }
}