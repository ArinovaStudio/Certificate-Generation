import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { authCheck } from '@/lib/auth';
import { z } from 'zod';
import { customAlphabet } from 'nanoid';
import { writeFile } from 'fs/promises';
import path from 'path';
import fs from 'fs';

const nanoid = customAlphabet('23456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz', 12);

const certificateSchema = z.object({
  employeeId: z.string().min(1, "Employee ID is required"),
  candidateName: z.string().min(1, "Candidate Name is required"),
  position: z.string().min(1, "Position is required"),
  department: z.string().min(1, "Department is required"),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
});

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'certificates');

if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

export async function GET(request: NextRequest) {
 const user = await authCheck();
  
  if (!user || user.role !== 'ADMIN') {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const search = searchParams.get('search') || "";     
  const department = searchParams.get('department'); 

  const whereClause: any = { AND: [] };

  if (department && department !== 'All') {
    whereClause.AND.push({ department: department });
  }

  if (search) {
    whereClause.AND.push({
      OR: [
        { candidateName: { contains: search, mode: 'insensitive' } },
        { employeeId: { contains: search, mode: 'insensitive' } }
      ]
    });
  }

  try {
    const certificates = await prisma.certificate.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ success: true, certificates });
  } catch {
    return NextResponse.json({ success: false, message: "Failed to fetch data" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const user = await authCheck();
  
  if (!user || user.role !== 'ADMIN') {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    
    const file = formData.get('file') as File | null;
    const body = {
      employeeId: formData.get('employeeId'),
      candidateName: formData.get('candidateName'),
      position: formData.get('position'),
      department: formData.get('department'),
      startDate: formData.get('startDate'),
      endDate: formData.get('endDate'),
    };

    const result = certificateSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json( { success: false, message: "Validation Error", details: result.error.flatten().fieldErrors }, { status: 400 });
    }
    const data = result.data;

    if (!file) {
      return NextResponse.json({ success: false, message: "Certificate PDF file is required" }, { status: 400 });
    }
    if (file.type !== 'application/pdf') {
      return NextResponse.json({ success: false, message: "Only PDF files are allowed" }, { status: 400 });
    }

    const safeName = data.candidateName.replace(/[^a-zA-Z0-9]/g, '_'); 
    const finalFileName = `${data.employeeId}_${safeName}.pdf`;
    const finalFilePath = path.join(UPLOAD_DIR, finalFileName);

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(finalFilePath, buffer);

    const certId = nanoid();

    const newCert = await prisma.certificate.create({
      data: {
        certificateId: certId,
        employeeId: data.employeeId,
        candidateName: data.candidateName,
        position: data.position,
        department: data.department,
        fileName: finalFileName,
        fileUrl: `/certificates/${finalFileName}`,
        startDate: data.startDate,
        endDate: data.endDate,
      }
    });

    return NextResponse.json(newCert, { status: 201 });

  } catch {
    return NextResponse.json({ error: "Server Error during upload" }, { status: 500 });
  }
}