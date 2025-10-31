import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { earnings, images, serviceType, category, location } = await req.json();

    if (!earnings || !images || !serviceType || !category) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Build payload dynamically to avoid TS error when Prisma model doesn't include `location`
    const payload: any = {
      earnings: Number(earnings),
      images,
      serviceType,
      category,
    };

    if (location) {
      payload.location = location;
    }

    const client = await prisma.client.create({
      data: payload as any, // cast to any to satisfy TS when schema differs
    });

    return NextResponse.json(client, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Create failed" }, { status: 500 });
  }
}