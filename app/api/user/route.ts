import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { authCheck } from "@/lib/auth";
import path from "path";
import fs from "fs";

const UPLOAD_DIR = path.join(process.cwd(), "public", "certificates");

if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

export async function GET(request: NextRequest) {
  const user = await authCheck();
  if (!user) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }
  const id = user.id;
  console.log(id);
  try {
    const certificates = await prisma.certificate.findMany({
      where: {
        user: { id: id },
      },
      orderBy: { createdAt: "desc" },
      include: { user: true },
    });

    return NextResponse.json({ success: true, certificates });
  } catch {
    return NextResponse.json(
      { success: false, message: "Failed to fetch data" },
      { status: 500 }
    );
  }
}

// To Update The Certificate Download Status
export async function PUT(request: NextRequest) {
  const user = await authCheck();
  if (!user) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }
  try {
    const userId = user.id;
    const { certificateId } = await request.json();
    const certificate = await prisma.certificate.findUnique({where:{certificateId:certificateId}});
    if(certificate?.isDownloaded){
      throw Error("Already Downloaded!");
    }
    await prisma.certificate.update({
      where: {
        certificateId: certificateId,
        user: {
          id: userId,
        },
      },
      data: {
        isDownloaded: true,
      },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false });
  }
}
