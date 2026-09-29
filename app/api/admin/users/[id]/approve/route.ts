import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth-helpers";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    await requireRole("ADMIN");
    const user = await prisma.user.update({
      where: { id: params.id },
      data: { status: "APPROVED" },
    });
    return NextResponse.json({ success: true, user });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }
}
