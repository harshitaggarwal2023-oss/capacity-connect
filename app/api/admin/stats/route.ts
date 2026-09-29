import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth-helpers";

export async function GET() {
  try {
    await requireRole("ADMIN");

    const userCount = await prisma.user.count();
    const courseCount = await prisma.course.count({ where: { status: "PUBLISHED" } });
    const certCount = await prisma.certificate.count();
    const pendingApprovals = await prisma.user.count({
      where: { role: "TRAINER", status: "PENDING" },
    });

    return NextResponse.json({
      userCount,
      courseCount,
      certCount,
      pendingApprovals,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }
}
