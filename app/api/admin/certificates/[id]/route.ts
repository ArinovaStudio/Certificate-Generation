import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { authCheck } from '@/lib/auth';
import { z } from 'zod';
import { writeFile, unlink, rename } from 'fs/promises';
import path from 'path';
import fs from 'fs';

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'certificates');

const updateSchema = z.object({
  title: z.string().min(1, "Employee ID is required"),
  description: z.string().min(1, "Candidate Name is required"),
  employeeId: z.string().min(1, "Position is required"),
  resetDownload: z.boolean().default(false)
});
export async function GET(request: NextRequest,{params}:{params: Promise<{id: string}>}) {

  const id = (await params).id;


  try {
    const certificate = await prisma.certificate.findUnique({
      where:{
        certificateId: id
      }
    });
    if(certificate){
      return NextResponse.json({ success: true, certificate });
    }
    return NextResponse.json({ success: false, message: "Certificate Not Found!" });
  } catch {
    return NextResponse.json({ success: false, message: "Failed to fetch data" }, { status: 500 });
  }
}
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
      title: formData.get("title"),
      description: formData.get("description"),
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
    const employee = await prisma.user.findUnique({where: {employeeId:data.employeeId,role:"EMPLOYEE"}});
    if (!employee) {
      return NextResponse.json({ success: false, message: "Employee Does not exist!" }, { status: 404 });
    }
    const safeName = employee.name.replace(/[^a-zA-Z0-9]/g, '_'); 
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
        title: data.title,
        description: data.description,
        fileName: finalFileName,
        fileUrl: finalFileUrl,
        ...(data.resetDownload !== undefined && { isDownloaded: data.resetDownload ? false:data.resetDownload }),
      }
    });

    return NextResponse.json({ success: true, data: updatedCert });

  } catch {
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

  } catch {
    return NextResponse.json({ success: false, message: "Delete Failed" }, { status: 500 });
  }
}