import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const schema = z.object({
  courseId: z.string(),
  title: z.string().min(1),
  deadline: z.string().datetime(),
  timeLimit: z.number().int().positive(),
  passMark: z.number().int().min(0).max(100),
  questions: z.array(z.object({
    text: z.string().min(1),
    options: z.array(z.string()).length(4),
    correctIndex: z.number().int().min(0).max(3),
  })).min(1),
});

export async function GET() {
  const session = await auth();
  if (!session || (session.user as any).role !== "TRAINER") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  
  const quizzes = await prisma.quiz.findMany({
    where: { course: { trainerId: (session.user as any).id } },
    include: { course: true, _count: { select: { questions: true, attempts: true } } }
  });
  return NextResponse.json(quizzes);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session || (session.user as any).role !== "TRAINER") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  
  try {
    const body = await req.json();
    const data = schema.parse(body);

    const course = await prisma.course.findFirst({
      where: { id: data.courseId, trainerId: (session.user as any).id }
    });
    if (!course) return NextResponse.json({ error: "Course not found or unowned" }, { status: 403 });

    const quiz = await prisma.quiz.create({
      data: {
        title: data.title,
        deadline: new Date(data.deadline),
        timeLimit: data.timeLimit,
        passMark: data.passMark,
        courseId: data.courseId,
        questions: {
          create: data.questions
        }
      }
    });

    return NextResponse.json(quiz);
  } catch (err) {
    return NextResponse.json({ error: "Invalid data", details: err }, { status: 400 });
  }
}
