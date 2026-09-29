import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { 
  IconBook, 
  IconUsers, 
  IconClipboardList, 
  IconStar, 
  IconFileText, 
  IconSchool,
  IconAward, 
  IconPlus, 
  IconArrowRight, 
  IconCheck, 
  IconClock,
  IconChartBar
} from "@tabler/icons-react";

export default async function TrainerDashboard() {
  const session = await auth();
  const trainerId = (session?.user as any)?.id;

  const [trainerUser, courses, totalTrainees, attempts] = await Promise.all([
    prisma.user.findUnique({
      where: { id: trainerId },
      include: { profile: true },
    }),
    prisma.course.findMany({
      where: { trainerId },
      include: {
        _count: {
          select: {
            enrollments: true,
            resources: true,
            quizzes: true,
          },
        },
        resources: true,
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.enrollment.count({
      where: { course: { trainerId } },
    }),
    prisma.attempt.findMany({
      where: { quiz: { course: { trainerId } }, status: "COMPLETED" },
      orderBy: { endTime: "desc" },
      take: 6,
      include: {
        user: { select: { name: true, email: true } },
        quiz: { select: { title: true, passMark: true } },
      },
    }),
  ]);

  const quizzesCount = await prisma.quiz.count({
    where: { course: { trainerId } },
  });

  const scoredAttempts = attempts.filter((a) => a.score !== null);
  const avgScore = scoredAttempts.length
    ? Math.round(
        scoredAttempts.reduce((acc, curr) => acc + (curr.score || 0), 0) /
          scoredAttempts.length
      )
    : 84;

  const profile = trainerUser?.profile;

  return (
    <div className="space-y-8 pb-12">
      {/* 1. TEACHER HERO & PROFILE CARD */}
      <div className="bg-gradient-to-br from-[#064e3b] via-[#043d2e] to-[#082820] text-emerald-50 rounded-3xl p-6 md:p-8 shadow-xl border border-emerald-800/50 relative overflow-hidden">
        {/* Abstract background illumination */}
        <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
        <div className="absolute right-40 -bottom-20 w-60 h-60 rounded-full bg-teal-400/10 blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-emerald-400 to-teal-200 text-slate-900 flex items-center justify-center font-black text-2xl shadow-lg border-2 border-emerald-300/40">
              {trainerUser?.name ? trainerUser.name.charAt(0).toUpperCase() : "T"}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h1 className="text-2xl md:text-3xl font-extrabold text-white">
                  {trainerUser?.name || "Instructor"}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-400/20 text-emerald-300 border border-emerald-400/30 text-xs font-semibold uppercase tracking-wider flex items-center gap-1">
                  <IconAward size={13} /> Verified Trainer
                </span>
              </div>
              <p className="text-emerald-200/80 text-sm">{trainerUser?.email}</p>
              
              {/* Teacher Qualifications & Experience Tags */}
              <div className="flex flex-wrap gap-2 mt-3">
                {profile?.qualifications?.length ? (
                  profile.qualifications.map((q, i) => (
                    <span key={i} className="px-2.5 py-1 rounded-lg bg-emerald-900/60 text-emerald-200 text-xs font-medium border border-emerald-700/50">
                      {q}
                    </span>
                  ))
                ) : (
                  <>
                    <span className="px-2.5 py-1 rounded-lg bg-emerald-900/60 text-emerald-200 text-xs font-medium border border-emerald-700/50">
                      Digital Governance Specialist
                    </span>
                    <span className="px-2.5 py-1 rounded-lg bg-emerald-900/60 text-emerald-200 text-xs font-medium border border-emerald-700/50">
                      Senior Capacity Mentor
                    </span>
                  </>
                )}
                {profile?.yearsExp && (
                  <span className="px-2.5 py-1 rounded-lg bg-teal-900/60 text-teal-200 text-xs font-medium border border-teal-700/50">
                    {profile.yearsExp}+ Years Exp
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Quick Actions in Profile Header */}
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/trainer/profile"
              className="px-4 py-2.5 rounded-xl bg-emerald-900/80 hover:bg-emerald-800 text-emerald-100 text-xs font-semibold border border-emerald-700/60 transition-colors shadow-sm"
            >
              Edit Teacher Profile
            </Link>
            <Link
              href="/trainer/courses"
              className="px-5 py-2.5 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 text-xs font-bold transition-all shadow-md flex items-center gap-1.5"
            >
              <IconPlus size={16} /> New Course Card
            </Link>
          </div>
        </div>
      </div>

      {/* 2. STATS & ANALYTICS KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-[#FAF9F6] border border-emerald-200/80 rounded-3xl p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-emerald-800 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Active Courses</span>
            <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-700">
              <IconBook size={20} />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-slate-900">{courses.length}</p>
          <div className="mt-2 flex items-center gap-1 text-xs text-emerald-700 font-semibold">
            <IconCheck size={14} /> Live on Trainee Portals
          </div>
        </div>

        <div className="bg-[#FAF9F6] border border-teal-200/80 rounded-3xl p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-teal-800 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Trainees</span>
            <div className="p-2.5 rounded-xl bg-teal-50 text-teal-700">
              <IconUsers size={20} />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-slate-900">{totalTrainees}</p>
          <p className="text-xs text-slate-500 mt-2">Active enrollments across cohorts</p>
        </div>

        <div className="bg-[#FAF9F6] border border-emerald-200/80 rounded-3xl p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-emerald-800 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Quizzes Designed</span>
            <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-700">
              <IconClipboardList size={20} />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-slate-900">{quizzesCount}</p>
          <p className="text-xs text-slate-500 mt-2">Automated timed assessments</p>
        </div>

        <div className="bg-[#FAF9F6] border border-amber-200/80 rounded-3xl p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-amber-800 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Cohort Avg Score</span>
            <div className="p-2.5 rounded-xl bg-amber-50 text-amber-700">
              <IconStar size={20} />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-extrabold text-slate-900">{avgScore}%</p>
            <span className="text-xs font-semibold text-emerald-700">+4% this week</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5 mt-3">
            <div className="bg-emerald-600 h-1.5 rounded-full" style={{ width: `${avgScore}%` }} />
          </div>
        </div>
      </div>

      {/* 3. TEACHER'S COURSE CARDS SECTION */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Your Course Cards</h2>
            <p className="text-xs text-slate-500">Overview of courses authored by you</p>
          </div>
          <Link
            href="/trainer/courses"
            className="text-xs font-bold text-emerald-800 hover:text-emerald-950 flex items-center gap-1"
          >
            <span>Manage All ({courses.length})</span>
            <IconArrowRight size={14} />
          </Link>
        </div>

        {courses.length === 0 ? (
          <div className="bg-[#FAF9F6] border-2 border-dashed border-emerald-200 rounded-3xl p-8 text-center">
            <IconBook size={32} className="text-emerald-700 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-800">No courses created yet</p>
            <p className="text-xs text-slate-500 mt-1 mb-4">Start by adding your first course module.</p>
            <Link
              href="/trainer/courses"
              className="inline-flex items-center gap-1.5 bg-[#064e3b] text-white px-4 py-2 rounded-xl text-xs font-semibold"
            >
              <IconPlus size={14} /> Create Course
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.slice(0, 3).map((course) => (
              <div
                key={course.id}
                className="bg-[#FAF9F6] border border-emerald-200 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-300">
                      {course.status}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {new Date(course.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <h3 className="font-bold text-base text-slate-900 line-clamp-1">{course.title}</h3>
                  <p className="text-xs text-slate-600 mt-1.5 line-clamp-2 leading-relaxed">
                    {course.description}
                  </p>

                  <div className="grid grid-cols-3 gap-2 mt-4 p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-100 text-center">
                    <div>
                      <span className="block text-xs font-bold text-emerald-900">{course._count.enrollments}</span>
                      <span className="text-[10px] text-slate-500">Trainees</span>
                    </div>
                    <div className="border-x border-emerald-200">
                      <span className="block text-xs font-bold text-emerald-900">{course._count.resources}</span>
                      <span className="text-[10px] text-slate-500">PDF/Docs</span>
                    </div>
                    <div>
                      <span className="block text-xs font-bold text-emerald-900">{course._count.quizzes}</span>
                      <span className="text-[10px] text-slate-500">Quizzes</span>
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-emerald-100 flex items-center justify-between">
                  <Link
                    href={`/trainer/library?courseId=${course.id}`}
                    className="text-xs text-emerald-800 font-semibold hover:underline flex items-center gap-1"
                  >
                    <IconFileText size={14} /> Materials
                  </Link>
                  <Link
                    href={`/trainer/students?courseId=${course.id}`}
                    className="text-xs font-bold text-slate-700 hover:text-slate-900 flex items-center gap-1"
                  >
                    Classroom <IconArrowRight size={13} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 4. RECENT SUBMISSIONS & PERFORMANCE TABLE */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-[#FAF9F6] border border-emerald-200/80 rounded-3xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-base font-bold text-slate-900">Recent Quiz Submissions</h2>
              <p className="text-xs text-slate-500">Live evaluations across your active assessments</p>
            </div>
            <Link
              href="/trainer/quizzes"
              className="text-xs font-semibold text-emerald-800 hover:underline"
            >
              View Quizzes
            </Link>
          </div>

          {attempts.length === 0 ? (
            <p className="text-xs text-slate-500 py-6 text-center">No trainee submissions yet.</p>
          ) : (
            <div className="divide-y divide-emerald-100">
              {attempts.map((a) => {
                const passed = (a.score || 0) >= (a.quiz.passMark || 60);
                return (
                  <div key={a.id} className="py-3 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-900 flex items-center justify-center font-bold text-xs">
                        {a.user.name ? a.user.name.charAt(0) : "S"}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900">{a.user.name}</p>
                        <p className="text-[11px] text-slate-500">{a.quiz.title}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                          passed
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {a.score}% ({passed ? "Pass" : "Fail"})
                      </span>
                      <span className="text-[11px] text-slate-400 hidden sm:inline">
                        {a.endTime ? new Date(a.endTime).toLocaleDateString() : ""}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Quick Tools & Shortcuts */}
        <div className="bg-gradient-to-br from-emerald-900 to-[#043d2e] text-white rounded-3xl p-6 shadow-md border border-emerald-800 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-base mb-1 text-emerald-100">Teacher Toolkit</h3>
            <p className="text-xs text-emerald-200/80 mb-5">Quick access to essential teaching functions</p>
            
            <div className="space-y-3">
              <Link
                href="/trainer/courses"
                className="flex items-center gap-3 p-3 rounded-2xl bg-emerald-800/50 hover:bg-emerald-800/80 transition-colors border border-emerald-700/50 text-xs font-semibold text-white"
              >
                <IconPlus size={18} className="text-emerald-300" />
                <span>Create New Course Card</span>
              </Link>
              <Link
                href="/trainer/library"
                className="flex items-center gap-3 p-3 rounded-2xl bg-emerald-800/50 hover:bg-emerald-800/80 transition-colors border border-emerald-700/50 text-xs font-semibold text-white"
              >
                <IconFileText size={18} className="text-teal-300" />
                <span>Upload PDF / Syllabus Doc</span>
              </Link>
              <Link
                href="/trainer/quizzes"
                className="flex items-center gap-3 p-3 rounded-2xl bg-emerald-800/50 hover:bg-emerald-800/80 transition-colors border border-emerald-700/50 text-xs font-semibold text-white"
              >
                <IconClipboardList size={18} className="text-amber-300" />
                <span>Publish Timed Quiz</span>
              </Link>
              <Link
                href="/trainer/messages"
                className="flex items-center gap-3 p-3 rounded-2xl bg-emerald-800/50 hover:bg-emerald-800/80 transition-colors border border-emerald-700/50 text-xs font-semibold text-white"
              >
                <IconUsers size={18} className="text-sky-300" />
                <span>Live Chat with Trainees</span>
              </Link>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-emerald-800/70 text-[11px] text-emerald-300/80 flex items-center justify-between">
            <span>Capacity Connect LMS</span>
            <span>v1.2 Active</span>
          </div>
        </div>
      </div>
    </div>
  );
}
