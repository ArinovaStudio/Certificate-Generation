import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import prisma from "./prisma";

export async function authCheck() {
  const cookieStore = await cookies();
  
  const token = cookieStore.get('token')?.value;
  const JWT_SECRET = process.env.JWT_SECRET || "My_Jwt_Secret";

  if (!token) return null;

  try {
    const decoded: any = jwt.verify(token, JWT_SECRET);

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, name: true, role: true, employeeId: true, email: true },
    });

    if (user) {
      return user;
    }

    return null;

  } catch {
    return null;
  }
}