import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";

const submitSchema = z.object({
  attemptId: z.string(),
  answers: z.array(z.number()),
});

export async function POST(req: Request, context: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  
  const userId = (session.user as any).id;
  const { id } = await context.params;

  try {
    const body = await req.json();
    const { attemptId, answers } = submitSchema.parse(body);
    
    const attempt = await prisma.attempt.findFirst({
      where: { id: attemptId, quizId: id, traineeId: userId, status: "ONGOING" },
      include: { quiz: { include: { questions: true } } },
    });
    
    if (!attempt) {
      return NextResponse.json({ error: "Attempt not found or already submitted" }, { status: 404 });
    }
    
    const quiz = attempt.quiz;
    const now = new Date();
    const endTime = new Date(attempt.startTime.getTime() + quiz.timeLimit * 60 * 1000 + 5000); // 5s grace
    
    if (now > endTime) {
      // Time out, mark as TIMEOUT and zero score or handle differently
      await prisma.attempt.update({
        where: { id: attempt.id },
        data: { status: "TIMEOUT" },
      });
      return NextResponse.json({ error: "Time limit exceeded" }, { status: 400 });
    }
    
    let correct = 0;
    const totalQuestions = quiz.questions.length;
    
    quiz.questions.forEach((q, idx) => {
      if (answers[idx] === q.correctIndex) {
        correct++;
      }
    });
    
    const score = Math.round((correct / totalQuestions) * 100);
    const passed = score >= quiz.passMark;
    
    await prisma.attempt.update({
      where: { id: attempt.id },
      data: { 
        answers, 
        score, 
        status: "COMPLETED",
        endTime: now
      },
    });
    
    if (passed) {
      // TODO: emit certificate event (wire in Task 8)
    }
    
    return NextResponse.json({ score, passed, correct, totalQuestions });
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid request payload" }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
