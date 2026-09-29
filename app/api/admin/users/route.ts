import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth-helpers";
import type { Role } from "@prisma/client";

export async function GET(req: Request) {
  try {
    await requireRole("ADMIN");
    const { searchParams } = new URL(req.url);
    const role = searchParams.get("role") as Role | null;
    
    const where = role ? { role } : {};
    
    const users = await prisma.user.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });
    
    return NextResponse.json(users);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }
}
