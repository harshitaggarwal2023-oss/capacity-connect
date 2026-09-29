import { Suspense } from "react";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { IconBook, IconUsers, IconClipboardList, IconStar } from "@tabler/icons-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

async function DashboardStats({ trainerId }: { trainerId: string }) {
  const courses = await prisma.course.count({ where: { trainerId } });
  const quizzes = await prisma.quiz.count({ where: { course: { trainerId } } });
  const enrollments = await prisma.enrollment.count({ where: { course: { trainerId } } });
  
  const attempts = await prisma.attempt.findMany({
    where: { quiz: { course: { trainerId } }, score: { not: null } },
    select: { score: true }
  });
  
  const avgScore = attempts.length 
    ? Math.round(attempts.reduce((acc, curr) => acc + (curr.score || 0), 0) / attempts.length)
    : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      <Card className="bg-[#FAF9F6]">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Courses Owned</CardTitle>
          <IconBook className="h-4 w-4 text-slate-500" />
        </CardHeader>
        <CardContent><div className="text-2xl font-bold">{courses}</div></CardContent>
      </Card>
      <Card className="bg-[#FAF9F6]">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Enrolled Trainees</CardTitle>
          <IconUsers className="h-4 w-4 text-slate-500" />
        </CardHeader>
        <CardContent><div className="text-2xl font-bold">{enrollments}</div></CardContent>
      </Card>
      <Card className="bg-[#FAF9F6]">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Quizzes Created</CardTitle>
          <IconClipboardList className="h-4 w-4 text-slate-500" />
        </CardHeader>
        <CardContent><div className="text-2xl font-bold">{quizzes}</div></CardContent>
      </Card>
      <Card className="bg-[#FAF9F6]">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Avg Score</CardTitle>
          <IconStar className="h-4 w-4 text-slate-500" />
        </CardHeader>
        <CardContent><div className="text-2xl font-bold">{avgScore}%</div></CardContent>
      </Card>
    </div>
  );
}

function StatsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-28 rounded-xl" />)}
    </div>
  );
}

async function RecentSubmissions({ trainerId }: { trainerId: string }) {
  const attempts = await prisma.attempt.findMany({
    where: { quiz: { course: { trainerId } }, status: "COMPLETED" },
    orderBy: { endTime: 'desc' },
    take: 5,
    include: {
      user: { select: { name: true } },
      quiz: { select: { title: true } }
    }
  });

  return (
    <Card className="bg-[#FAF9F6]">
      <CardHeader><CardTitle>Recent Submissions</CardTitle></CardHeader>
      <CardContent>
        {attempts.length === 0 ? <p className="text-slate-500">No submissions yet.</p> : (
          <div className="space-y-4">
            {attempts.map(a => (
              <div key={a.id} className="flex justify-between items-center border-b pb-2 last:border-0">
                <div>
                  <p className="font-medium text-slate-900">{a.user.name}</p>
                  <p className="text-sm text-slate-500">{a.quiz.title}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold">{a.score}%</p>
                  <p className="text-xs text-slate-400">{a.endTime?.toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default async function TrainerDashboard() {
  const session = await auth();
  const trainerId = (session?.user as any).id;

  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-900 mb-8">Dashboard</h1>
      <Suspense fallback={<StatsSkeleton />}>
        <DashboardStats trainerId={trainerId} />
      </Suspense>
      <Suspense fallback={<Skeleton className="h-64 rounded-xl" />}>
        <RecentSubmissions trainerId={trainerId} />
      </Suspense>
    </div>
  );
}
