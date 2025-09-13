// /app/api/verify-email/route.ts
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { email, code } = await req.json();
  const verification = await prisma.verification.findFirst({
    where: {
      identifier: email,
      value: code,
      expiresAt: { gt: new Date() },
    },
  });

  if (!verification) {
    return NextResponse.json({ error: "Invalid or expired code" }, { status: 400 });
  }

  await prisma.user.update({
    where: { email },
    data: { emailVerified: true },
  });

  // Optionally, delete the verification record
  await prisma.verification.delete({ where: { id: verification.id } });

  return NextResponse.json({ success: true });
}