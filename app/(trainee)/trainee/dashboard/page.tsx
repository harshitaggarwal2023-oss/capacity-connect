import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { 
  IconBook, 
  IconClock, 
  IconBell, 
  IconCertificate, 
  IconAward, 
  IconArrowRight, 
  IconFileText, 
  IconFlame,
  IconCheck,
  IconSparkles
} from "@tabler/icons-react";

export default async function TraineeDashboardPage() {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return null;

  const [
    user,
    enrollments,
    completedAttempts,
    upcomingQuizzes,
    certificates,
    notifications,
  ] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true },
    }),
    prisma.enrollment.findMany({
      where: { traineeId: userId },
      include: {
        course: {
          include: {
            trainer: { select: { name: true } },
            resources: true,
            quizzes: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.attempt.findMany({
      where: { traineeId: userId, status: "COMPLETED" },
      include: { quiz: true },
    }),
    prisma.quiz.findMany({
      where: {
        course: { enrollments: { some: { traineeId: userId } } },
        deadline: { gt: new Date() },
        attempts: { none: { traineeId: userId, status: "COMPLETED" } },
      },
      orderBy: { deadline: "asc" },
      take: 4,
      include: { course: true },
    }),
    prisma.certificate.findMany({
      where: { userId },
      include: { enrollment: { include: { course: true } } },
    }),
    prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
  ]);

  const avgScore = completedAttempts.length
    ? Math.round(
        completedAttempts.reduce((acc, c) => acc + (c.score || 0), 0) /
          completedAttempts.length
      )
    : 85;

  return (
    <div className="space-y-8 pb-12 max-w-6xl mx-auto">
      {/* 1. SAPPHIRE STUDENT LEARNING BANNER */}
      <div className="bg-gradient-to-r from-[#172554] via-[#1e3a8a] to-[#1e1b4b] text-blue-50 rounded-3xl p-6 md:p-8 shadow-xl border border-blue-900/60 relative overflow-hidden">
        <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />
        <div className="absolute right-40 -bottom-20 w-60 h-60 rounded-full bg-indigo-400/10 blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-blue-400 to-indigo-300 text-slate-950 flex items-center justify-center font-black text-2xl shadow-lg border-2 border-blue-200/40">
              {user?.name ? user.name.charAt(0).toUpperCase() : "T"}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h1 className="text-2xl md:text-3xl font-extrabold text-white">
                  Welcome back, {user?.name?.split(" ")[0] || "Trainee"}!
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-blue-400/20 text-blue-300 border border-blue-400/30 text-xs font-semibold uppercase tracking-wider flex items-center gap-1">
                  <IconAward size={13} /> Active Learner
                </span>
              </div>
              <p className="text-blue-200/80 text-sm">{user?.email}</p>
              
              <div className="flex flex-wrap gap-2 mt-3">
                <span className="px-2.5 py-1 rounded-lg bg-blue-950/60 text-blue-200 text-xs font-medium border border-blue-800/50 flex items-center gap-1.5">
                  <IconFlame size={14} className="text-amber-400" /> 4-Day Learning Streak
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-indigo-950/60 text-indigo-200 text-xs font-medium border border-indigo-800/50">
                  Avg Assessment: {avgScore}%
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/trainee/courses"
              className="px-4 py-2.5 rounded-xl bg-blue-900/80 hover:bg-blue-800 text-blue-100 text-xs font-semibold border border-blue-700/60 transition-colors shadow-sm"
            >
              Browse Catalog
            </Link>
            <Link
              href="/trainee/assessments"
              className="px-5 py-2.5 rounded-xl bg-blue-400 hover:bg-blue-300 text-slate-950 text-xs font-bold transition-all shadow-md flex items-center gap-1.5"
            >
              <IconSparkles size={16} /> Take Next Quiz
            </Link>
          </div>
        </div>
      </div>

      {/* 2. STATS & ANALYTICS KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-[#FAF9F6] border border-blue-200/80 rounded-3xl p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-blue-800 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Enrolled Courses</span>
            <div className="p-2.5 rounded-xl bg-blue-50 text-blue-700">
              <IconBook size={20} />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-slate-900">{enrollments.length}</p>
          <p className="text-xs text-blue-700 mt-2 font-medium">In active training track</p>
        </div>

        <div className="bg-[#FAF9F6] border border-indigo-200/80 rounded-3xl p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-indigo-800 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Quizzes Passed</span>
            <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-700">
              <IconCheck size={20} />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-slate-900">{completedAttempts.length}</p>
          <p className="text-xs text-indigo-700 mt-2 font-medium">Evaluated assessments</p>
        </div>

        <div className="bg-[#FAF9F6] border border-amber-200/80 rounded-3xl p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-amber-800 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Pending Quizzes</span>
            <div className="p-2.5 rounded-xl bg-amber-50 text-amber-700">
              <IconClock size={20} />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-slate-900">{upcomingQuizzes.length}</p>
          <p className="text-xs text-amber-700 mt-2 font-medium">Due this week</p>
        </div>

        <div className="bg-[#FAF9F6] border border-purple-200/80 rounded-3xl p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-purple-800 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Certificates</span>
            <div className="p-2.5 rounded-xl bg-purple-50 text-purple-700">
              <IconCertificate size={20} />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-slate-900">{certificates.length}</p>
          <p className="text-xs text-purple-700 mt-2 font-medium">Verified credentials</p>
        </div>
      </div>

      {/* 3. MY ENROLLED COURSES CARDS */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Your Enrolled Courses</h2>
            <p className="text-xs text-slate-500">Resume learning modules and download reference materials</p>
          </div>
          <Link
            href="/trainee/courses"
            className="text-xs font-bold text-blue-800 hover:text-blue-950 flex items-center gap-1"
          >
            <span>Explore All</span>
            <IconArrowRight size={14} />
          </Link>
        </div>

        {enrollments.length === 0 ? (
          <div className="bg-[#FAF9F6] border-2 border-dashed border-blue-200 rounded-3xl p-8 text-center">
            <IconBook size={32} className="text-blue-700 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-800">You haven't enrolled in any courses yet</p>
            <p className="text-xs text-slate-500 mt-1 mb-4">Discover specialized capacity building modules.</p>
            <Link
              href="/trainee/courses"
              className="inline-flex items-center gap-1.5 bg-[#172554] text-white px-4 py-2 rounded-xl text-xs font-semibold"
            >
              Browse Catalog
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {enrollments.map((enr) => (
              <div
                key={enr.id}
                className="bg-[#FAF9F6] border border-blue-200/80 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-blue-100 text-blue-800 border border-blue-300">
                      Enrolled
                    </span>
                    <span className="text-xs font-bold text-slate-700">{enr.progress}% Done</span>
                  </div>

                  <h3 className="font-bold text-base text-slate-900 line-clamp-1">
                    {enr.course.title}
                  </h3>
                  <p className="text-xs text-slate-600 mt-1.5 line-clamp-2 leading-relaxed">
                    {enr.course.description}
                  </p>

                  <div className="w-full bg-slate-200 rounded-full h-2 mt-4 overflow-hidden">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all"
                      style={{ width: `${Math.max(enr.progress, 15)}%` }}
                    />
                  </div>

                  <p className="text-[11px] text-slate-500 mt-3">
                    Instructor: <span className="font-semibold text-slate-700">{enr.course.trainer?.name || "Senior Faculty"}</span>
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-blue-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500 flex items-center gap-1">
                    <IconFileText size={14} />
                    {enr.course.resources.length} materials
                  </span>
                  <Link
                    href={`/trainee/courses/${enr.course.id}`}
                    className="inline-flex items-center gap-1 text-xs font-bold text-blue-800 hover:text-blue-950"
                  >
                    <span>Resume</span>
                    <IconArrowRight size={13} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 4. UPCOMING QUIZZES & NOTIFICATIONS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Next Up Quizzes */}
        <div className="bg-[#FAF9F6] border border-blue-200/80 rounded-3xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-base font-bold text-slate-900">Upcoming Assessments</h2>
              <p className="text-xs text-slate-500">Timed assessments required for certification</p>
            </div>
            <Link
              href="/trainee/assessments"
              className="text-xs font-semibold text-blue-800 hover:underline"
            >
              All Quizzes
            </Link>
          </div>

          {upcomingQuizzes.length === 0 ? (
            <p className="text-xs text-slate-500 py-6 text-center">No pending assessment deadlines.</p>
          ) : (
            <div className="space-y-3">
              {upcomingQuizzes.map((quiz) => (
                <div
                  key={quiz.id}
                  className="p-4 rounded-2xl bg-blue-50/60 border border-blue-100 flex items-center justify-between gap-4"
                >
                  <div>
                    <h3 className="text-xs font-bold text-slate-900">{quiz.title}</h3>
                    <p className="text-[11px] text-slate-500">{quiz.course.title}</p>
                    <p className="text-[10px] text-red-600 font-semibold mt-1">
                      Due: {quiz.deadline ? new Date(quiz.deadline).toLocaleDateString() : "This week"}
                    </p>
                  </div>
                  <Link
                    href={`/trainee/assessments/${quiz.id}`}
                    className="px-3.5 py-1.5 rounded-xl bg-[#172554] hover:bg-[#1e3a8a] text-white text-xs font-semibold shadow-sm transition-colors whitespace-nowrap"
                  >
                    Start Test
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Notifications & Announcements */}
        <div className="bg-[#FAF9F6] border border-blue-200/80 rounded-3xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-base font-bold text-slate-900">Broadcasts & Updates</h2>
              <p className="text-xs text-slate-500">Live platform alerts from faculty and admins</p>
            </div>
            <span className="text-xs text-blue-800 font-medium">Real-Time</span>
          </div>

          {notifications.length === 0 ? (
            <p className="text-xs text-slate-500 py-6 text-center">No new notifications.</p>
          ) : (
            <div className="divide-y divide-blue-100">
              {notifications.map((notif) => (
                <div key={notif.id} className="py-3 flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-blue-100 text-blue-800 shrink-0 mt-0.5">
                    <IconBell size={15} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-800 font-medium">{notif.content}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      {new Date(notif.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
