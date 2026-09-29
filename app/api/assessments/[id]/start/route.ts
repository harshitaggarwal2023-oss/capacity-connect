import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  
  const quiz = await prisma.quiz.findUnique({
    where: { id: params.id },
    include: { questions: { select: { id: true, text: true, options: true } } }, // NO correctIndex
  });
  if (!quiz) return NextResponse.json({ error: "Not found" }, { status: 404 });
  
  let attempt = await prisma.attempt.findFirst({
    where: { quizId: params.id, traineeId: (session.user as any).id, status: "ONGOING" },
  });
  
  if (!attempt) {
    attempt = await prisma.attempt.create({
      data: { quizId: params.id, traineeId: (session.user as any).id, answers: [], status: "ONGOING" },
    });
  }
  
  const endTime = new Date(attempt.startTime.getTime() + quiz.timeLimit * 60 * 1000);
  return NextResponse.json({ attemptId: attempt.id, endTime, questions: quiz.questions });
}
