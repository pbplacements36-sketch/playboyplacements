import { NextRequest, NextResponse } from "next/server";
import ImageKit from "imagekit";
const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY!,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT!,
});
export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file") as File;
  if (!file) return NextResponse.json({ error: "No file" }, { status: 400 });
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const uploadResponse = await imagekit.upload({
    file: buffer,
    fileName: `gallery-${Date.now()}`,
    folder: "/gallery-photos",
  });
  return NextResponse.json({ url: uploadResponse.url });
}