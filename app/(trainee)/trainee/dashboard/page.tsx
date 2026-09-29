import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { IconBook, IconClock, IconBell } from "@tabler/icons-react";

async function DashboardStats({ userId }: { userId: string }) {
  const [enrolledCount, completedQuizzesCount, pendingQuizzesCount] = await Promise.all([
    prisma.enrollment.count({ where: { traineeId: userId } }),
    prisma.attempt.count({ where: { traineeId: userId, status: "COMPLETED" } }),
    prisma.quiz.count({
      where: {
        course: { enrollments: { some: { traineeId: userId } } },
        deadline: { gt: new Date() },
        attempts: { none: { traineeId: userId, status: "COMPLETED" } }
      }
    }),
  ]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div className="bg-[#FAF9F6] p-6 rounded-xl shadow-sm border border-gray-200 flex items-center gap-4">
        <div className="p-3 bg-blue-50 text-blue-600 rounded-lg"><IconBook /></div>
        <div>
          <p className="text-sm text-gray-500 font-medium">Enrolled Courses</p>
          <p className="text-2xl font-bold text-gray-900">{enrolledCount}</p>
        </div>
      </div>
      <div className="bg-[#FAF9F6] p-6 rounded-xl shadow-sm border border-gray-200 flex items-center gap-4">
        <div className="p-3 bg-green-50 text-green-600 rounded-lg"><IconClock /></div>
        <div>
          <p className="text-sm text-gray-500 font-medium">Completed Quizzes</p>
          <p className="text-2xl font-bold text-gray-900">{completedQuizzesCount}</p>
        </div>
      </div>
      <div className="bg-[#FAF9F6] p-6 rounded-xl shadow-sm border border-gray-200 flex items-center gap-4">
        <div className="p-3 bg-yellow-50 text-yellow-600 rounded-lg"><IconBell /></div>
        <div>
          <p className="text-sm text-gray-500 font-medium">Pending Quizzes</p>
          <p className="text-2xl font-bold text-gray-900">{pendingQuizzesCount}</p>
        </div>
      </div>
    </div>
  );
}

function StatsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {[1, 2, 3].map((i) => (
        <Skeleton key={i} className="h-24 w-full rounded-xl bg-gray-200" />
      ))}
    </div>
  );
}

async function NextUp({ userId }: { userId: string }) {
  const upcomingQuizzes = await prisma.quiz.findMany({
    where: {
      course: { enrollments: { some: { traineeId: userId } } },
      deadline: { gt: new Date() },
      attempts: { none: { traineeId: userId, status: "COMPLETED" } }
    },
    orderBy: { deadline: 'asc' },
    take: 3,
    include: { course: true }
  });

  return (
    <div className="bg-[#FAF9F6] rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
      <h2 className="text-lg font-bold text-gray-900 mb-4">Next Up</h2>
      {upcomingQuizzes.length === 0 ? (
        <p className="text-gray-500 text-sm">No upcoming deadlines.</p>
      ) : (
        <ul className="space-y-4">
          {upcomingQuizzes.map((quiz) => (
            <li key={quiz.id} className="flex justify-between items-center pb-4 border-b border-gray-200 last:border-0 last:pb-0">
              <div>
                <p className="font-medium text-gray-900">{quiz.title}</p>
                <p className="text-sm text-gray-500">{quiz.course.title}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-red-600">{quiz.deadline?.toLocaleDateString()}</p>
                <p className="text-xs text-gray-500">Deadline</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function NextUpSkeleton() {
  return <Skeleton className="h-48 w-full rounded-xl mb-8 bg-gray-200" />;
}

async function Notifications({ userId }: { userId: string }) {
  const notifications = await prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: 5
  });

  return (
    <div className="bg-[#FAF9F6] rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-lg font-bold text-gray-900 mb-4">Latest Notifications</h2>
      {notifications.length === 0 ? (
        <p className="text-gray-500 text-sm">No new notifications.</p>
      ) : (
        <ul className="space-y-4">
          {notifications.map((notif) => (
            <li key={notif.id} className="flex gap-3">
              <div className="mt-1"><IconBell size={16} className="text-gray-400" /></div>
              <div>
                <p className="text-sm text-gray-800">{notif.content}</p>
                <p className="text-xs text-gray-400 mt-1">{notif.createdAt.toLocaleDateString()}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function NotificationsSkeleton() {
  return <Skeleton className="h-64 w-full rounded-xl bg-gray-200" />;
}

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) return null;

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>
      
      <Suspense fallback={<StatsSkeleton />}>
        <DashboardStats userId={session.user.id} />
      </Suspense>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Suspense fallback={<NextUpSkeleton />}>
          <NextUp userId={session.user.id} />
        </Suspense>
        
        <Suspense fallback={<NotificationsSkeleton />}>
          <Notifications userId={session.user.id} />
        </Suspense>
      </div>
    </div>
  );
}
