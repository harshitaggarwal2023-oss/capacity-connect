import { NextResponse } from "next/server";
import { requireRole } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const schema = z.object({
  trainerId: z.string(),
});

export async function PATCH(req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    await requireRole("ADMIN");
    const { id } = await context.params;
    const body = await req.json();
    const { trainerId } = schema.parse(body);

    const course = await prisma.course.update({
      where: { id },
      data: { trainerId },
    });

    return NextResponse.json({ success: true, course });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
