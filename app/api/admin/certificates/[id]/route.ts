import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { authCheck } from '@/lib/auth';
import { z } from 'zod';
import { writeFile, unlink, rename } from 'fs/promises';
import path from 'path';
import fs from 'fs';

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'certificates');

const updateSchema = z.object({
  employeeId: z.string().min(1, "Employee ID is required"),
  candidateName: z.string().min(1, "Candidate Name is required"),
  position: z.string().min(1, "Position is required"),
  department: z.string().min(1, "Department is required"),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  isDownloaded: z.string().transform((val) => val === 'true').optional(), 
});

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await authCheck();
    
  if (!user || user.role !== 'ADMIN') {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params; 
    const certId = id;
    const formData = await request.formData();

    const body = {
      employeeId: formData.get('employeeId'),
      candidateName: formData.get('candidateName'),
      position: formData.get('position'),
      department: formData.get('department'),
      startDate: formData.get('startDate'),
      endDate: formData.get('endDate'),
      isDownloaded: formData.get('isDownloaded') || undefined,
    };

    const result = updateSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ success: false, message: "Validation Error", details: result.error.flatten().fieldErrors }, { status: 400 });
    }
    const data = result.data;

    const existingCert = await prisma.certificate.findUnique({ where: { id: certId } });

    if (!existingCert) {
      return NextResponse.json({ success: false, message: "Certificate not found" }, { status: 404 });
    }

    const safeName = data.candidateName.replace(/[^a-zA-Z0-9]/g, '_'); 
    const expectedFileName = `${data.employeeId}_${safeName}.pdf`;
    
    let finalFileName = existingCert.fileName;
    let finalFileUrl = existingCert.fileUrl;

    const file = formData.get('file') as File | null;
    
    if (file && file.size > 0) {
      if (file.type !== 'application/pdf') {
        return NextResponse.json({ success: false, message: "Only PDF files are allowed" }, { status: 400 });
      }

      // Delete the old file
      const oldFilePath = path.join(UPLOAD_DIR, existingCert.fileName);
      if (fs.existsSync(oldFilePath)) {
        await unlink(oldFilePath);
      }

      const newFilePath = path.join(UPLOAD_DIR, expectedFileName);
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      await writeFile(newFilePath, buffer);
      
      finalFileName = expectedFileName;
      finalFileUrl = `/certificates/${expectedFileName}`;
    } 
    else if (expectedFileName !== existingCert.fileName) {
      const oldFilePath = path.join(UPLOAD_DIR, existingCert.fileName);
      const newFilePath = path.join(UPLOAD_DIR, expectedFileName);

      if (fs.existsSync(oldFilePath)) {
        await rename(oldFilePath, newFilePath);
      }
      
      finalFileName = expectedFileName;
      finalFileUrl = `/certificates/${expectedFileName}`;
    }

    const updatedCert = await prisma.certificate.update({
      where: { id: certId },
      data: {
        employeeId: data.employeeId,
        candidateName: data.candidateName,
        position: data.position,
        department: data.department,
        startDate: data.startDate,
        endDate: data.endDate,
        fileName: finalFileName,
        fileUrl: finalFileUrl,
        ...(data.isDownloaded !== undefined && { isDownloaded: data.isDownloaded }),
      }
    });

    return NextResponse.json({ success: true, data: updatedCert });

  } catch (error) {
    console.error("Update Error:", error);
    return NextResponse.json({ success: false, message: "Update Failed" }, { status: 500 });
  }
}


export async function DELETE(request: NextRequest,  { params }: { params: Promise<{ id: string }> }) {
  const user = await authCheck();
  
  if (!user || user.role !== 'ADMIN') {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params; 
    const certId = id;

    const cert = await prisma.certificate.findUnique({ where: { id: certId } });

    if (!cert) {
      return NextResponse.json({ success: false, message: "Certificate not found" }, { status: 404 });
    }

    const filePath = path.join(UPLOAD_DIR, cert.fileName);
    if (fs.existsSync(filePath)) {
      await unlink(filePath);
    }

    await prisma.certificate.delete({ where: { id: certId }});

    return NextResponse.json({ success: true, message: "Certificate deleted successfully" });

  } catch (error) {
    console.error("Delete Error:", error);
    return NextResponse.json({ success: false, message: "Delete Failed" }, { status: 500 });
  }
}