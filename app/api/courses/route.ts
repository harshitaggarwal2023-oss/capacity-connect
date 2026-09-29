import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const courses = await prisma.course.findMany({
    where: { status: "PUBLISHED" },
    include: {
      trainer: {
        select: { id: true, name: true, email: true, image: true },
      },
      quizzes: {
        select: { id: true, title: true },
      },
      resources: {
        select: { id: true, title: true, type: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(courses);
}
