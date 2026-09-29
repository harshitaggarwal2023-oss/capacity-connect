import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth-helpers";
import { auth } from "@/auth";
import { z } from "zod";

const schema = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
  type: z.enum(["ANNOUNCEMENT", "ACHIEVEMENT", "NEW_CONTENT"]),
  courseId: z.string().optional().nullable(),
});

export async function GET() {
  const announcements = await prisma.announcement.findMany({
    orderBy: { publishedAt: "desc" },
    include: { course: { select: { title: true } } },
  });
  return NextResponse.json(announcements);
}

export async function POST(req: Request) {
  try {
    const session = await requireRole("ADMIN");
    const adminId = session.user?.id as string;
    
    const body = await req.json();
    const parsed = schema.parse(body);

    const announcement = await prisma.announcement.create({
      data: {
        adminId,
        title: parsed.title,
        content: parsed.content,
        type: parsed.type,
        courseId: parsed.courseId || null,
      },
    });

    return NextResponse.json({ success: true, announcement });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
