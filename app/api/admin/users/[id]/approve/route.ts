import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth-helpers";

export async function POST(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    await requireRole("ADMIN");
    const { id } = await context.params;
    const user = await prisma.user.update({
      where: { id },
      data: { status: "APPROVED" },
    });
    return NextResponse.json({ success: true, user });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }
}
