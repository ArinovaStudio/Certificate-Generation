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
  title: z.string().min(1, "Employee ID is required"),
  description: z.string().min(1, "Candidate Name is required"),
  employeeId: z.string().min(1, "Position is required"),
  certificateId: z.string().min(1,"Certificate Id Is Required")
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
    const certificates = (await prisma.certificate.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      include: {user: true}
    })).map((certificate)=>{
      return {...certificate,department:certificate.user.department};
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
      title: formData.get('title'),
      description: formData.get('description'),
      employeeId: formData.get('employeeId'),
      certificateId: formData.get("certificateId")
    };

    const result = certificateSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json( { success: false, message: "Validation Error", details: result.error.flatten().fieldErrors }, { status: 400 });
    }
    const data = result.data;
    const certificate = await prisma.certificate.findFirst({where:{certificateId:data.certificateId}});
    if (certificate) {
      return NextResponse.json({ success: false, message: "Certificate Id Already Exists!" }, { status: 400 });
    }
    if (!file) {
      return NextResponse.json({ success: false, message: "Certificate PDF file is required" }, { status: 400 });
    }
    if (file.type !== 'application/pdf') {
      return NextResponse.json({ success: false, message: "Only PDF files are allowed" }, { status: 400 });
    }
    const user = await prisma.user.findFirst({where:{employeeId:data.employeeId}});
    if (!user) {
      return NextResponse.json({ success: false, message: "User Data is Invalid" }, { status: 400 });
    }    
    const finalFileName = `ARV-${user.employeeType}-${data.certificateId}.pdf`;
    const finalFilePath = path.join(UPLOAD_DIR, finalFileName);

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(finalFilePath, buffer);


    const newCert = await prisma.certificate.create({
      data: {
        certificateId: data.certificateId,
        title: data.title,
        description: data.description,
        employeeId: data.employeeId,
        fileName: finalFileName,
        fileUrl: `/certificates/${finalFileName}`
      }
    });

    return NextResponse.json(newCert, { status: 201 });

  } catch {
    return NextResponse.json({ error: "Server Error during upload" }, { status: 500 });
  }
}