import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // Make sure this exports a PrismaClient instance

export async function PATCH(req: NextRequest) {
  try {
    const { email, phone, age, city, country } = await req.json();
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }
    const user = await prisma.user.update({
      where: { email },
      data: {
        phone,
        age: age ? Number(age) : null,
        city,
        country,
      },
    });
    return NextResponse.json({ user }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}