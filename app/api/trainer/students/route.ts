import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const session = await auth();
  if (!session || (session.user as any).role !== "TRAINER") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  
  const { searchParams } = new URL(req.url);
  const courseId = searchParams.get("courseId");

  const enrollments = await prisma.enrollment.findMany({
    where: {
      course: { trainerId: (session.user as any).id },
      ...(courseId ? { courseId } : {})
    },
    include: { user: true, course: true }
  });

  return NextResponse.json(enrollments);
}
