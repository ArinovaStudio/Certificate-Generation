import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authCheck } from "@/lib/auth";

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
        employeeId: true,
        name: true,
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