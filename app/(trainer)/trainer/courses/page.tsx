"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  IconBook, 
  IconPlus, 
  IconFileText, 
  IconClipboardCheck, 
  IconUsers, 
  IconTrash, 
  IconToggleLeft, 
  IconToggleRight, 
  IconArrowRight,
  IconSparkles,
  IconSearch
} from "@tabler/icons-react";

interface Course {
  id: string;
  title: string;
  description: string;
  status: string;
  createdAt: string;
  _count?: {
    enrollments: number;
    resources: number;
    quizzes: number;
  };
  resources?: any[];
  quizzes?: any[];
}

export default function TrainerCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "PUBLISHED" | "DRAFT">("ALL");
  
  // Create Modal State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [creating, setCreating] = useState(false);

  const fetchCourses = async () => {
    try {
      const res = await fetch("/api/trainer/courses");
      if (res.ok) {
        const data = await res.json();
        setCourses(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    setCreating(true);

    try {
      const res = await fetch("/api/trainer/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newTitle,
          description: newDescription,
          status: "PUBLISHED",
        }),
      });

      if (res.ok) {
        setNewTitle("");
        setNewDescription("");
        setShowCreateModal(false);
        fetchCourses();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setCreating(false);
    }
  };

  const toggleStatus = async (course: Course) => {
    const nextStatus = course.status === "PUBLISHED" ? "DRAFT" : "PUBLISHED";
    try {
      const res = await fetch("/api/trainer/courses", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: course.id, status: nextStatus }),
      });
      if (res.ok) {
        setCourses(courses.map(c => c.id === course.id ? { ...c, status: nextStatus } : c));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteCourse = async (id: string) => {
    if (!confirm("Are you sure you want to delete this course?")) return;
    try {
      const res = await fetch(`/api/trainer/courses?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setCourses(courses.filter(c => c.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filteredCourses = courses.filter(c => {
    const matchesSearch = c.title.toLowerCase().includes(search.toLowerCase()) || 
                          c.description.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#064e3b] via-[#043d2e] to-[#0f2e28] text-emerald-50 rounded-3xl p-8 shadow-md border border-emerald-800/40 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-800/60 text-emerald-200 text-xs font-semibold uppercase tracking-wider mb-3">
            <IconSparkles size={14} /> Teacher Studio
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white">Course Management</h1>
          <p className="text-emerald-200/90 text-sm mt-1 max-w-xl">
            Design learning pathways, upload reference PDFs, publish assessments, and track trainee progress across your classes.
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold px-5 py-3 rounded-2xl shadow-lg transition-transform active:scale-95 cursor-pointer text-sm"
        >
          <IconPlus size={18} />
          <span>New Course</span>
        </button>
      </div>

      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-emerald-950/20 backdrop-blur-md p-4 rounded-2xl border border-emerald-900/30">
        <div className="relative w-full sm:w-80">
          <IconSearch size={18} className="absolute left-3.5 top-3 text-emerald-700" />
          <input
            type="text"
            placeholder="Search your courses..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[#FAF9F6] border border-emerald-200/70 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 text-slate-800 placeholder:text-slate-400"
          />
        </div>

        <div className="flex items-center gap-2 self-stretch sm:self-auto">
          {(["ALL", "PUBLISHED", "DRAFT"] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setStatusFilter(filter)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                statusFilter === filter
                  ? "bg-[#064e3b] text-emerald-100 shadow-sm"
                  : "bg-[#FAF9F6] text-slate-600 hover:bg-emerald-100/50 border border-emerald-200/50"
              }`}
            >
              {filter === "ALL" ? `All (${courses.length})` : filter}
            </button>
          ))}
        </div>
      </div>

      {/* Courses Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-64 rounded-3xl bg-emerald-900/10 animate-pulse border border-emerald-900/20" />
          ))}
        </div>
      ) : filteredCourses.length === 0 ? (
        <div className="bg-[#FAF9F6] border-2 border-dashed border-emerald-200 rounded-3xl p-12 text-center">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <IconBook size={32} />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-1">No courses found</h3>
          <p className="text-slate-500 text-sm max-w-md mx-auto mb-6">
            Get started by creating your first course card. You can attach PDFs, quizzes, and multimedia modules.
          </p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center gap-2 bg-[#064e3b] hover:bg-[#043d2e] text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors cursor-pointer"
          >
            <IconPlus size={16} /> Create Course
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <div
              key={course.id}
              className="bg-[#FAF9F6] border border-emerald-200/80 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group relative overflow-hidden"
            >
              {/* Top Accent Strip */}
              <div 
                className={`absolute top-0 left-0 right-0 h-1.5 ${
                  course.status === "PUBLISHED" ? "bg-emerald-500" : "bg-amber-400"
                }`}
              />

              <div>
                <div className="flex items-center justify-between gap-2 mb-3 mt-1">
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                      course.status === "PUBLISHED"
                        ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                        : "bg-amber-100 text-amber-800 border border-amber-300"
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${course.status === "PUBLISHED" ? "bg-emerald-600" : "bg-amber-600"}`} />
                    {course.status}
                  </span>
                  
                  <button
                    onClick={() => toggleStatus(course)}
                    title={course.status === "PUBLISHED" ? "Switch to Draft" : "Publish Course"}
                    className="text-xs text-slate-500 hover:text-emerald-700 flex items-center gap-1 font-medium transition-colors"
                  >
                    {course.status === "PUBLISHED" ? (
                      <>
                        <IconToggleRight size={20} className="text-emerald-600" />
                        <span>Live</span>
                      </>
                    ) : (
                      <>
                        <IconToggleLeft size={20} className="text-slate-400" />
                        <span>Draft</span>
                      </>
                    )}
                  </button>
                </div>

                <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-900 transition-colors line-clamp-1">
                  {course.title}
                </h3>
                <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">
                  {course.description}
                </p>

                {/* Metrics Pill Grid */}
                <div className="grid grid-cols-3 gap-2 mt-5 p-3 rounded-2xl bg-emerald-50/70 border border-emerald-100 text-center">
                  <div>
                    <div className="flex items-center justify-center gap-1 text-emerald-800">
                      <IconUsers size={14} />
                      <span className="text-xs font-bold">{course._count?.enrollments || 0}</span>
                    </div>
                    <span className="text-[10px] text-emerald-700 uppercase font-medium">Trainees</span>
                  </div>
                  <div className="border-x border-emerald-200">
                    <div className="flex items-center justify-center gap-1 text-emerald-800">
                      <IconFileText size={14} />
                      <span className="text-xs font-bold">{course._count?.resources || 0}</span>
                    </div>
                    <span className="text-[10px] text-emerald-700 uppercase font-medium">Materials</span>
                  </div>
                  <div>
                    <div className="flex items-center justify-center gap-1 text-emerald-800">
                      <IconClipboardCheck size={14} />
                      <span className="text-xs font-bold">{course._count?.quizzes || 0}</span>
                    </div>
                    <span className="text-[10px] text-emerald-700 uppercase font-medium">Quizzes</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 pt-4 border-t border-emerald-100 flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  <Link
                    href={`/trainer/library?courseId=${course.id}`}
                    className="p-2 text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-xl text-xs font-medium transition-colors"
                    title="Upload / Manage PDFs & Materials"
                  >
                    <IconFileText size={16} />
                  </Link>
                  <Link
                    href="/trainer/quizzes"
                    className="p-2 text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-xl text-xs font-medium transition-colors"
                    title="Manage Quizzes"
                  >
                    <IconClipboardCheck size={16} />
                  </Link>
                  <button
                    onClick={() => handleDeleteCourse(course.id)}
                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                    title="Delete Course"
                  >
                    <IconTrash size={16} />
                  </button>
                </div>

                <Link
                  href={`/trainer/students?courseId=${course.id}`}
                  className="inline-flex items-center gap-1 text-xs font-bold text-emerald-800 hover:text-emerald-950 hover:underline"
                >
                  <span>Classroom</span>
                  <IconArrowRight size={14} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Course Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#FAF9F6] border border-slate-200 rounded-3xl p-8 max-w-lg w-full shadow-2xl space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#064e3b] text-white flex items-center justify-center">
                  <IconBook size={20} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Create New Course</h3>
                  <p className="text-xs text-slate-500">Publish a course module for trainees</p>
                </div>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-slate-600 text-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateCourse} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Course Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Advanced Digital Governance & Policy"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#064e3b] text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Description & Learning Objectives *
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Summarize key competencies, syllabus outline, and target audience..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#064e3b] text-sm resize-none"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 text-sm font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="px-5 py-2.5 rounded-xl bg-[#064e3b] hover:bg-[#043d2e] text-white text-sm font-semibold shadow transition-colors cursor-pointer disabled:opacity-50"
                >
                  {creating ? "Creating..." : "Save & Publish"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
