import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
export async function POST(req: NextRequest) {
  const { email, galleryImages } = await req.json();
  await prisma.user.update({
    where: { email },
    data: { galleryImages },
  });
  return NextResponse.json({ success: true });
}