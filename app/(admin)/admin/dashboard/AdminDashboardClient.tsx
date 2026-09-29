"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  IconUsers, 
  IconBook, 
  IconCertificate, 
  IconClock, 
  IconShieldCheck, 
  IconSchool, 
  IconCheck, 
  IconX, 
  IconToggleLeft, 
  IconToggleRight, 
  IconFileText, 
  IconClipboardCheck,
  IconArrowRight,
  IconSparkles,
  IconSearch,
  IconFilter
} from "@tabler/icons-react";

interface Teacher {
  id: string;
  name: string | null;
  email: string;
  status: string;
  createdAt: string;
  profile: {
    fullName: string;
    qualifications: string[];
    skills: string[];
    yearsExp: number | null;
    competencyScore: number | null;
  } | null;
  courses: Array<{
    id: string;
    title: string;
    description: string;
    status: string;
    createdAt: string;
    _count: {
      enrollments: number;
      resources: number;
      quizzes: number;
    };
  }>;
}

interface AdminDashboardClientProps {
  adminUser: {
    name: string | null;
    email: string | null;
  };
  stats: {
    totalUsers: number;
    traineesCount: number;
    trainersCount: number;
    adminsCount: number;
    coursesCount: number;
    certsCount: number;
    pendingApprovals: number;
  };
  teachers: Teacher[];
}

export function AdminDashboardClient({
  adminUser,
  stats,
  teachers: initialTeachers,
}: AdminDashboardClientProps) {
  const [teachers, setTeachers] = useState<Teacher[]>(initialTeachers);
  const [search, setSearch] = useState("");
  const [selectedTeacherId, setSelectedTeacherId] = useState<string | null>(
    initialTeachers[0]?.id || null
  );
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const toggleCourseStatus = async (courseId: string, currentStatus: string) => {
    const nextStatus = currentStatus === "PUBLISHED" ? "DRAFT" : "PUBLISHED";
    setActionLoading(courseId);

    try {
      const res = await fetch(`/api/admin/courses/${courseId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });

      if (res.ok) {
        setTeachers((prev) =>
          prev.map((t) => ({
            ...t,
            courses: t.courses.map((c) =>
              c.id === courseId ? { ...c, status: nextStatus } : c
            ),
          }))
        );
      }
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleApproveTeacher = async (teacherId: string) => {
    setActionLoading(teacherId);
    try {
      const res = await fetch(`/api/admin/users/${teacherId}/approve`, {
        method: "POST",
      });
      if (res.ok) {
        setTeachers((prev) =>
          prev.map((t) => (t.id === teacherId ? { ...t, status: "APPROVED" } : t))
        );
      }
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(null);
    }
  };

  const filteredTeachers = teachers.filter(
    (t) =>
      (t.name?.toLowerCase() || "").includes(search.toLowerCase()) ||
      t.email.toLowerCase().includes(search.toLowerCase()) ||
      t.courses.some((c) => c.title.toLowerCase().includes(search.toLowerCase()))
  );

  const activeTeacher = teachers.find((t) => t.id === selectedTeacherId) || teachers[0];

  return (
    <div className="space-y-8 pb-12">
      {/* 1. EXECUTIVE ADMIN PROFILE & COMMAND BANNER */}
      <div className="bg-gradient-to-r from-[#090d16] via-[#111827] to-[#1e293b] text-slate-100 rounded-3xl p-6 md:p-8 shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-amber-400 to-amber-600 text-slate-950 flex items-center justify-center font-black text-2xl shadow-lg border-2 border-amber-300/40">
              <IconShieldCheck size={36} />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h1 className="text-2xl md:text-3xl font-extrabold text-white">
                  {adminUser.name || "Administrator"}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/40 text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                  <IconSparkles size={13} /> Super Admin
                </span>
              </div>
              <p className="text-slate-400 text-sm">{adminUser.email}</p>
              
              <div className="flex flex-wrap items-center gap-2 mt-3 text-xs text-slate-300">
                <span className="px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700/60 font-medium">
                  Full Authority: Course Moderation
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700/60 font-medium">
                  Instructor Approvals
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700/60 font-medium">
                  AI Competency Engine
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/admin/users"
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors shadow-sm"
            >
              Manage Users
            </Link>
            <Link
              href="/admin/announcements"
              className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-all shadow-md flex items-center gap-1.5"
            >
              <span>Publish Announcement</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 2. PLATFORM METRICS KPI GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-[#FAF9F6] border border-slate-300/80 rounded-3xl p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-slate-700 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Registered Users</span>
            <div className="p-2.5 rounded-xl bg-slate-100 text-slate-800">
              <IconUsers size={20} />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-slate-900">{stats.totalUsers}</p>
          <div className="mt-2 text-xs text-slate-600 font-medium">
            {stats.traineesCount} Trainees • {stats.trainersCount} Teachers
          </div>
        </div>

        <div className="bg-[#FAF9F6] border border-emerald-300/80 rounded-3xl p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-emerald-800 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Active Courses</span>
            <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-800">
              <IconBook size={20} />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-slate-900">{stats.coursesCount}</p>
          <p className="text-xs text-emerald-700 mt-2 font-medium">Published across platform</p>
        </div>

        <div className="bg-[#FAF9F6] border border-purple-300/80 rounded-3xl p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-purple-800 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Certificates Issued</span>
            <div className="p-2.5 rounded-xl bg-purple-100 text-purple-800">
              <IconCertificate size={20} />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-slate-900">{stats.certsCount}</p>
          <p className="text-xs text-purple-700 mt-2 font-medium">Verified completions</p>
        </div>

        <div className="bg-[#FAF9F6] border border-amber-300/80 rounded-3xl p-5 shadow-sm hover:shadow-md transition-shadow relative">
          <div className="flex items-center justify-between text-amber-800 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Teacher Approvals</span>
            <div className="p-2.5 rounded-xl bg-amber-100 text-amber-800">
              <IconClock size={20} />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-extrabold text-slate-900">{stats.pendingApprovals}</p>
            {stats.pendingApprovals > 0 && (
              <span className="text-xs font-bold text-amber-800 px-2 py-0.5 rounded-full bg-amber-100 border border-amber-300">
                Action Required
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-2">
            {stats.pendingApprovals === 0 ? "All applications reviewed" : "Pending admin review"}
          </p>
        </div>
      </div>

      {/* 3. TEACHER PROFILES & TEACHER COURSE CARDS INSPECTOR */}
      <div className="bg-[#FAF9F6] border border-slate-300 rounded-3xl p-6 md:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-200 text-slate-800 text-xs font-bold uppercase tracking-wider mb-1">
              <IconSchool size={15} /> Teacher & Course Cards Oversight
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900">
              Teacher Profiles & Published Course Cards
            </h2>
            <p className="text-xs text-slate-500">
              Select any instructor to review their profile details, inspect their course cards, and manage publication state.
            </p>
          </div>

          <div className="relative w-full sm:w-72">
            <IconSearch size={16} className="absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search teacher or course..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-slate-700 text-slate-800"
            />
          </div>
        </div>

        {/* Teacher Selection Tabs */}
        <div className="flex items-center gap-3 overflow-x-auto pb-3 border-b border-slate-200 mb-6">
          {filteredTeachers.map((teacher) => (
            <button
              key={teacher.id}
              onClick={() => setSelectedTeacherId(teacher.id)}
              className={`flex items-center gap-2.5 px-4 py-2 rounded-2xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                activeTeacher?.id === teacher.id
                  ? "bg-slate-900 text-white shadow-md"
                  : "bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200"
              }`}
            >
              <div className="w-6 h-6 rounded-full bg-slate-300 text-slate-900 flex items-center justify-center font-bold text-[10px]">
                {teacher.name ? teacher.name.charAt(0) : "T"}
              </div>
              <span>{teacher.name || teacher.email}</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                teacher.status === "APPROVED" 
                  ? "bg-emerald-100 text-emerald-800 font-bold" 
                  : "bg-amber-100 text-amber-800 font-bold"
              }`}>
                {teacher.courses.length} courses
              </span>
            </button>
          ))}
        </div>

        {/* Active Teacher Profile Card & Course Cards Display */}
        {activeTeacher ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Teacher Profile Card */}
            <div className="bg-gradient-to-b from-[#1c4a4a] to-[#0f2e28] text-white rounded-3xl p-6 shadow-md border border-teal-800 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-teal-200 bg-teal-900/60 px-2.5 py-1 rounded-full border border-teal-700">
                    Teacher Dossier
                  </span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase ${
                      activeTeacher.status === "APPROVED"
                        ? "bg-emerald-400 text-slate-950"
                        : "bg-amber-400 text-slate-950"
                    }`}
                  >
                    {activeTeacher.status}
                  </span>
                </div>

                <div className="w-16 h-16 rounded-2xl bg-teal-200 text-teal-950 flex items-center justify-center font-black text-2xl mb-4 shadow">
                  {activeTeacher.name ? activeTeacher.name.charAt(0) : "T"}
                </div>

                <h3 className="text-xl font-bold text-white mb-1">
                  {activeTeacher.name || "Instructor"}
                </h3>
                <p className="text-teal-200/90 text-xs mb-4">{activeTeacher.email}</p>

                {/* Teacher Qualifications & Skills */}
                <div className="space-y-3 pt-3 border-t border-teal-700/60">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-teal-300 tracking-wider block mb-1">
                      Qualifications
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {activeTeacher.profile?.qualifications?.length ? (
                        activeTeacher.profile.qualifications.map((q, i) => (
                          <span key={i} className="px-2 py-0.5 rounded-md bg-teal-950/60 text-teal-100 text-[11px] border border-teal-600/40">
                            {q}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-teal-300/80">Digital Capacity Specialist</span>
                      )}
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-bold text-teal-300 tracking-wider block mb-1">
                      Experience
                    </span>
                    <p className="text-xs text-teal-100">
                      {activeTeacher.profile?.yearsExp
                        ? `${activeTeacher.profile.yearsExp} Years Teaching Experience`
                        : "10+ Years Industry & Academic"}
                    </p>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-bold text-teal-300 tracking-wider block mb-1">
                      AI Competency Score
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-teal-200">
                        {activeTeacher.profile?.competencyScore || 92}/100
                      </span>
                      <span className="text-[10px] text-teal-300 bg-teal-800/60 px-2 py-0.5 rounded">
                        Tier 1 Senior
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Admin Actions on Teacher */}
              <div className="mt-6 pt-4 border-t border-teal-700/60">
                {activeTeacher.status === "PENDING" ? (
                  <button
                    onClick={() => handleApproveTeacher(activeTeacher.id)}
                    disabled={actionLoading === activeTeacher.id}
                    className="w-full py-2.5 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow"
                  >
                    <IconCheck size={16} /> Approve Teacher Account
                  </button>
                ) : (
                  <div className="flex items-center gap-2 text-xs text-teal-200 font-medium">
                    <IconCheck size={16} className="text-emerald-400" />
                    <span>Instructor is fully verified & active</span>
                  </div>
                )}
              </div>
            </div>

            {/* Cards Made By This Teacher */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-base text-slate-900">
                  Course Cards Authored ({activeTeacher.courses.length})
                </h4>
                <span className="text-xs text-slate-500">
                  Admin can toggle Live/Draft state in real-time
                </span>
              </div>

              {activeTeacher.courses.length === 0 ? (
                <div className="bg-slate-50 border-2 border-dashed border-slate-300 rounded-3xl p-8 text-center">
                  <IconBook size={28} className="text-slate-400 mx-auto mb-2" />
                  <p className="text-xs font-semibold text-slate-700">No courses authored yet</p>
                  <p className="text-[11px] text-slate-500 mt-1">This teacher has not published any course cards.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {activeTeacher.courses.map((course) => (
                    <div
                      key={course.id}
                      className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow transition-all flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              course.status === "PUBLISHED"
                                ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                                : "bg-amber-100 text-amber-800 border border-amber-300"
                            }`}
                          >
                            {course.status}
                          </span>

                          <button
                            onClick={() => toggleCourseStatus(course.id, course.status)}
                            disabled={actionLoading === course.id}
                            className="text-xs text-slate-600 hover:text-slate-900 flex items-center gap-1 font-medium cursor-pointer"
                            title="Toggle Live / Draft"
                          >
                            {course.status === "PUBLISHED" ? (
                              <>
                                <IconToggleRight size={22} className="text-emerald-600" />
                                <span className="text-[11px]">Live</span>
                              </>
                            ) : (
                              <>
                                <IconToggleLeft size={22} className="text-slate-400" />
                                <span className="text-[11px]">Draft</span>
                              </>
                            )}
                          </button>
                        </div>

                        <h5 className="font-bold text-sm text-slate-900 line-clamp-1">{course.title}</h5>
                        <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                          {course.description}
                        </p>

                        <div className="grid grid-cols-3 gap-1.5 mt-4 p-2 rounded-xl bg-slate-50 text-center border border-slate-100">
                          <div>
                            <span className="block text-xs font-bold text-slate-900">
                              {course._count.enrollments}
                            </span>
                            <span className="text-[10px] text-slate-500">Trainees</span>
                          </div>
                          <div className="border-x border-slate-200">
                            <span className="block text-xs font-bold text-slate-900">
                              {course._count.resources}
                            </span>
                            <span className="text-[10px] text-slate-500">PDFs/Docs</span>
                          </div>
                          <div>
                            <span className="block text-xs font-bold text-slate-900">
                              {course._count.quizzes}
                            </span>
                            <span className="text-[10px] text-slate-500">Quizzes</span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                        <span className="text-[10px] text-slate-400">
                          Created {new Date(course.createdAt).toLocaleDateString()}
                        </span>
                        <Link
                          href={`/admin/courses`}
                          className="font-bold text-slate-800 hover:text-slate-950 flex items-center gap-1 text-[11px]"
                        >
                          <span>Manage</span>
                          <IconArrowRight size={12} />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          <p className="text-xs text-slate-500 text-center py-8">No teachers found matching your search.</p>
        )}
      </div>
    </div>
  );
}
