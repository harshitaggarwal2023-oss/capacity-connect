import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { IconPlus, IconClock, IconUsers } from "@tabler/icons-react";

export default async function TrainerQuizzes() {
  const session = await auth();
  const trainerId = (session?.user as any).id;

  const quizzes = await prisma.quiz.findMany({
    where: { course: { trainerId } },
    include: {
      course: { select: { title: true } },
      _count: { select: { questions: true, attempts: true } }
    },
    orderBy: { deadline: "asc" }
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Quizzes</h1>
        <Link href="/trainer/quizzes/new">
          <Button><IconPlus className="h-4 w-4 mr-2" /> Create Quiz</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {quizzes.map(q => (
          <Card key={q.id} className="bg-[#FAF9F6]">
            <CardHeader>
              <CardTitle className="text-lg">{q.title}</CardTitle>
              <p className="text-sm text-slate-500">{q.course.title}</p>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 text-sm text-slate-600 mb-4">
                <div className="flex items-center gap-1"><IconClock className="h-4 w-4" /> {q.timeLimit}m</div>
                <div className="flex items-center gap-1"><IconUsers className="h-4 w-4" /> {q._count.attempts} attempts</div>
                <div>{q._count.questions} Qs</div>
              </div>
              <Link href={`/trainer/quizzes/${q.id}`}>
                <Button variant="outline" className="w-full">Edit / View</Button>
              </Link>
            </CardContent>
          </Card>
        ))}
        {quizzes.length === 0 && <p className="col-span-3 text-slate-500 text-center py-12">No quizzes created yet.</p>}
      </div>
    </div>
  );
}
