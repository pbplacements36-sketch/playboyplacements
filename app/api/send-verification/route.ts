import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();

    await prisma.verification.create({
      data: {
        identifier: email,
        value: code,
        expiresAt: new Date(Date.now() + 1000 * 60 * 15), // 15 min expiry
      },
    });

    // Configure your SMTP transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER, // your Gmail address
        pass: process.env.GMAIL_PASS, // your Gmail app password
      },
    });

    await transporter.sendMail({
      to: email,
      subject: "Your Verification Code",
      text: `Your verification code is: ${code}`,
      html: `<p>Your verification code is: <b>${code}</b></p>`,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: "Failed to send verification code" }, { status: 500 });
  }
}