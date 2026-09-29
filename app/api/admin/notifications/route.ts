import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth-helpers";
import { z } from "zod";

const schema = z.object({
  message: z.string().min(1),
  target: z.enum(["TRAINEE", "TRAINER", "ALL"]),
});

export async function POST(req: Request) {
  try {
    await requireRole("ADMIN");
    const body = await req.json();
    const { message, target } = schema.parse(body);

    const where = target === "ALL" ? {} : { role: target };
    const users = await prisma.user.findMany({ where, select: { id: true } });

    const notifications = users.map(u => ({
      userId: u.id,
      type: "ADMIN_ANNOUNCEMENT",
      content: message,
    }));

    if (notifications.length > 0) {
      await prisma.notification.createMany({
        data: notifications,
      });
    }

    return NextResponse.json({ success: true, count: notifications.length });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
