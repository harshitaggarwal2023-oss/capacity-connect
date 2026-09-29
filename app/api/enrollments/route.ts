import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { z } from "zod";

const enrollmentSchema = z.object({
  courseId: z.string().min(1),
});

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { courseId } = enrollmentSchema.parse(body);

    const enrollment = await prisma.enrollment.create({
      data: {
        traineeId: session.user.id,
        courseId,
      }
    });

    return NextResponse.json(enrollment, { status: 201 });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    // Handle unique constraint error
    if (error.code === 'P2002') {
      return NextResponse.json({ error: "Already enrolled in this course" }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
