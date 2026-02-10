import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET( request: NextRequest, { params }: { params: Promise<{ certificateId: string }> }) {
  try {
    const { certificateId } = await params;

    const certificate = await prisma.certificate.findUnique({
      where: { certificateId: certificateId },
      select: {
        title: true,
        description: true,
        certificateId: true,
        employeeId: true,
        createdAt: true, 
        isDownloaded: true,
        user:{
          select:{
            name: true,
            email: true,
            employeeId: true,
            designation: true,
            department: true,
            startDate: true,
            endDate: true,
            employeeType: true
          }
        }
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