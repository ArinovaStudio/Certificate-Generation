import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { authCheck } from "@/lib/auth";
import { genSalt, hash } from "bcrypt";
import { EMPLOYEE_TYPE } from "@/lib/constants";
import { EmployeeTypes } from "@prisma/client";
export const createUserSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email").optional(),
  employeeId: z.string().min(1).optional(),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["EMPLOYEE"]).optional().default("EMPLOYEE"),
  designation: z.string().min(1),
  department: z.string().min(1),
  startDate: z.string().min(1),
  endDate: z.string().min(1),
  employeeType: z.enum(EMPLOYEE_TYPE.map((item) => item[0])),
});

export const updateUserSchema = z.object({
  id: z.string().uuid("Invalid user ID"),
  name: z.string().min(1).optional(),
  email: z.string().email("Invalid email").optional(),
  designation: z.string().min(1),
  department: z.string().min(1),
  startDate: z.string().min(1),
  endDate: z.string().min(1),
  employeeType: z.enum(EMPLOYEE_TYPE.map((item) => item[0])),
});

export async function GET() {
  try {
    const user = await authCheck();

    if (!user || user.role !== "ADMIN") {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const users = await prisma.user.findMany({
      where: {
        role: "EMPLOYEE",
      },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        employeeId: true,
        email: true,
        name: true,
        role: true,
        designation: true,
        department: true,
        employeeType:true,
        startDate: true,
        endDate: true,
      },
    });
    return NextResponse.json({ success: true, users });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to fetch users" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const parsed = createUserSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          message: "Validation failed",
          errors: parsed.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const {
      name,
      email,
      employeeId,
      startDate,
      password,
      designation,
      department,
      endDate,
      employeeType
    } = parsed.data;
    const existingUserWithId = await prisma.user.findFirst({
      where: { employeeId: employeeId },
    });
    if (existingUserWithId) {
      return NextResponse.json(
        {
          message: "User With Employee id Already exists",
        },
        { status: 400 }
      );
    }
    const existingUserWithEmail = await prisma.user.findFirst({
      where: { employeeId: email },
    });
    if (existingUserWithEmail) {
      return NextResponse.json(
        {
          message: "User With Email Already exists",
        },
        { status: 400 }
      );
    }
    const salt = await genSalt(10);
    const hashedPass = await hash(password, salt);
    const user = await prisma.user.create({
      data: {
        name,
        email,
        employeeId,
        password: hashedPass,
        role: "EMPLOYEE",
        employeeType: employeeType as EmployeeTypes,
        department,
        designation,
        startDate: new Date(startDate).toISOString(),
        endDate: new Date(endDate).toISOString(),
      },
    });

    return NextResponse.json(user, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { message: "Failed to create user" },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();

    const parsed = updateUserSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          message: "Validation failed",
          errors: parsed.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { id, name, email, designation, department, startDate, endDate,employeeType } =
      parsed.data;

    await prisma.user.update({
      where: { id },
      data: {
        name,
        email,
        department,
        designation,
        employeeType: employeeType as EmployeeTypes,
        startDate: new Date(startDate).toISOString(),
        endDate: new Date(endDate).toISOString(),
      },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: "Failed to update user" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { message: "User ID is required" },
        { status: 400 }
      );
    }

    await prisma.user.delete({
      where: { id },
    });

    return NextResponse.json({ message: "User deleted successfully" });
  } catch (error: any) {
    return NextResponse.json(
      { message: "Failed to delete user" },
      { status: 500 }
    );
  }
}
