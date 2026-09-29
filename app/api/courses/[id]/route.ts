import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;

  const course = await prisma.course.findUnique({
    where: { id },
    include: {
      resources: true,
      quizzes: {
        include: {
          questions: { select: { id: true, text: true, options: true } }
        }
      },
      trainer: { select: { name: true } }
    }
  });

  if (!course) {
    return NextResponse.json({ error: "Course not found" }, { status: 404 });
  }

  return NextResponse.json(course);
}
