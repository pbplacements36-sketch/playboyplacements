import { NextRequest, NextResponse } from "next/server";
import ImageKit from "imagekit";
import { prisma } from "@/lib/prisma";

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY!,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT!,
});

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file") as File;
  const email = formData.get("email") as string;

  if (!file || !email) {
    return NextResponse.json({ error: "File and email are required" }, { status: 400 });
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  // Upload to ImageKit
  const uploadResponse = await imagekit.upload({
    file: buffer,
    fileName: `${email}-profile-${Date.now()}`,
    folder: "/profile-photos",
  });

  // Save URL to DB
  await prisma.user.update({
    where: { email },
    data: { image: uploadResponse.url },
  });

  return NextResponse.json({ url: uploadResponse.url });
}