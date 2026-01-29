import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { authCheck } from '@/lib/auth';

export async function GET( request: NextRequest, { params }: { params: Promise<{ certificateId: string }> }) {
  try {
    const user = await authCheck();
    if (!user) {
      return NextResponse.json({ success: false, message: "Unauthorized. Please login." }, { status: 401 });
    }

    const { certificateId } = await params;

    const certificate = await prisma.certificate.findUnique({
      where: { certificateId: certificateId },
      select: {
        certificateId: true,
        candidateName: true,
        employeeId: true,
        position: true,
        department: true,
        startDate: true,
        endDate: true,
        createdAt: true, 
        isDownloaded: true
      }
    });

    if (!certificate) {
      return NextResponse.json({ success: false, message: "Certificate not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: certificate });

  } catch {
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}