import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import path from 'path';
import fs from 'fs';

const STORAGE_DIR = path.join(process.cwd(), 'public', 'certificates');

export async function GET( request: NextRequest, { params }: { params: Promise<{ certificateId: string }> }) {
  try {
    const { certificateId } = await params;

    const cert = await prisma.certificate.findUnique({ where: { certificateId: certificateId }});

    if (!cert) {
      return NextResponse.json({ success: false, message: "Invalid Certificate ID" }, { status: 404 });
    }

    if (cert.isDownloaded) {
      return NextResponse.json(
        { success: false, message: "This certificate has already been downloaded. Access denied." }, 
        { status: 403 }
      );
    }

    const filePath = path.join(STORAGE_DIR, cert.fileName);

    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ success: false, message: "File not found on server." }, { status: 500 });
    }

    await prisma.certificate.update({
      where: { id: cert.id }, 
      data: { isDownloaded: true }
    });

    const fileBuffer = fs.readFileSync(filePath);

    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${cert.fileName}"`,
      },
    });

  } catch {
    return NextResponse.json({ success: false, message: "Download Failed" }, { status: 500 });
  }
}