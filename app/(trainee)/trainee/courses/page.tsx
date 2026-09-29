"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import {
  IconBook,
  IconClock,
  IconUser,
  IconCheck,
  IconArrowRight,
  IconSearch,
  IconMessageCircle,
  IconFileText,
  IconAward,
  IconSparkles,
} from "@tabler/icons-react";
import Link from "next/link";

type Course = {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  trainer?: {
    id: string;
    name: string;
    email: string;
    image?: string | null;
  };
  quizzes?: { id: string; title: string }[];
  resources?: { id: string; title: string; type: string }[];
};

type Enrollment = {
  id: string;
  courseId: string;
  progress: number;
};

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [enrollments, setEnrollments] = useState<Record<string, Enrollment>>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [enrollingId, setEnrollingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function loadData() {
      try {
        const [coursesRes, enrollmentsRes] = await Promise.all([
          fetch("/api/courses"),
          fetch("/api/enrollments"),
        ]);

        if (coursesRes.ok) {
          const coursesData = await coursesRes.json();
          setCourses(Array.isArray(coursesData) ? coursesData : []);
        }

        if (enrollmentsRes.ok) {
          const enrollmentsData = await enrollmentsRes.json();
          if (Array.isArray(enrollmentsData)) {
            const map: Record<string, Enrollment> = {};
            enrollmentsData.forEach((e: Enrollment) => {
              map[e.courseId] = e;
            });
            setEnrollments(map);
          }
        }
      } catch (err) {
        console.error("Failed to load courses", err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const handleEnroll = async (courseId: string) => {
    setEnrollingId(courseId);
    try {
      const res = await fetch("/api/enrollments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId }),
      });

      if (res.ok) {
        const newEnrollment = await res.json();
        setEnrollments((prev) => ({
          ...prev,
          [courseId]: newEnrollment,
        }));
      }
    } catch (err) {
      console.error("Enrollment failed", err);
    } finally {
      setEnrollingId(null);
    }
  };

  const filteredCourses = courses.filter((c) => {
    const matchesSearch =
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.trainer?.name?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white rounded-3xl p-6 sm:p-10 shadow-md relative overflow-hidden border border-slate-800">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 rounded-full bg-blue-500/10 blur-3xl pointer-events-none"></div>
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-400/30 mb-4">
            <IconSparkles size={14} />
            Institutional Training Repository
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight mb-3">
            Civil Service & Capacity Programs
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Access certified professional curricula, structured assessment modules, and verified
            departmental frameworks with direct instructor mentorship.
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-[#FAF9F6] p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="relative w-full sm:w-80">
          <IconSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search programs, topics, mentors..."
            className="w-full pl-10 pr-4 py-2 text-sm bg-white rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
          />
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto text-xs text-slate-600 font-medium">
          <span className="bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
            {filteredCourses.length} {filteredCourses.length === 1 ? "Program" : "Programs"} Available
          </span>
          <span className="bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg border border-blue-200 font-semibold">
            {Object.keys(enrollments).length} Enrolled
          </span>
        </div>
      </div>

      {/* Courses Catalog Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-2xl p-6 border border-slate-200 space-y-4">
              <Skeleton className="h-32 w-full rounded-xl bg-slate-200" />
              <Skeleton className="h-6 w-3/4 bg-slate-200" />
              <Skeleton className="h-16 w-full bg-slate-200" />
              <Skeleton className="h-10 w-full rounded-lg bg-slate-200" />
            </div>
          ))}
        </div>
      ) : filteredCourses.length === 0 ? (
        <div className="bg-[#FAF9F6] border border-slate-200 rounded-2xl p-12 text-center max-w-md mx-auto">
          <IconBook className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-900 mb-1">No courses found</h3>
          <p className="text-sm text-slate-500 mb-4">
            Try adjusting your search query or check back later for new programs.
          </p>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="text-xs font-semibold text-blue-600 hover:underline"
            >
              Clear search filter
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course, idx) => {
            const isEnrolled = !!enrollments[course.id];
            const enrollment = enrollments[course.id];
            const quizCount = course.quizzes?.length || 0;
            const resourceCount = course.resources?.length || 0;

            // Varied subtle header gradients
            const gradients = [
              "from-blue-900 to-indigo-950",
              "from-emerald-900 to-teal-950",
              "from-slate-800 to-slate-950",
            ];
            const gradient = gradients[idx % gradients.length];

            return (
              <div
                key={course.id}
                className="bg-[#FAF9F6] border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  {/* Card Banner */}
                  <div
                    className={`bg-gradient-to-br ${gradient} text-white p-6 relative overflow-hidden`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[11px] font-bold uppercase tracking-wider bg-white/15 px-2.5 py-0.5 rounded-full border border-white/20 backdrop-blur-sm">
                        Curriculum
                      </span>
                      {isEnrolled && (
                        <span className="text-[11px] font-bold bg-emerald-500 text-white px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                          <IconCheck size={12} /> Enrolled
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg font-bold line-clamp-2 leading-snug group-hover:text-blue-200 transition-colors">
                      {course.title}
                    </h3>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 space-y-4">
                    <p className="text-xs sm:text-sm text-slate-600 line-clamp-3 leading-relaxed">
                      {course.description}
                    </p>

                    {/* Metadata Chips */}
                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 pt-2 border-t border-slate-100">
                      <span className="flex items-center gap-1">
                        <IconFileText size={15} className="text-slate-400" />
                        {quizCount} {quizCount === 1 ? "Quiz" : "Quizzes"}
                      </span>
                      <span className="flex items-center gap-1">
                        <IconBook size={15} className="text-slate-400" />
                        {resourceCount} Resources
                      </span>
                      <span className="flex items-center gap-1 text-emerald-700 font-medium">
                        <IconAward size={15} />
                        Accredited
                      </span>
                    </div>

                    {/* Trainer Info */}
                    <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-700 font-bold text-xs uppercase">
                          {course.trainer?.name?.charAt(0) || "T"}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xs font-semibold text-slate-900 truncate max-w-[140px]">
                            {course.trainer?.name || "Faculty Member"}
                          </span>
                          <span className="text-[10px] text-slate-500">Certified Mentor</span>
                        </div>
                      </div>

                      {course.trainer && (
                        <Link
                          href={`/trainee/messages?courseId=${course.id}`}
                          title="Message Trainer"
                          className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                        >
                          <IconMessageCircle size={18} />
                        </Link>
                      )}
                    </div>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="p-5 pt-0">
                  {isEnrolled ? (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                        <span>Progress</span>
                        <span className="font-bold text-slate-700">
                          {enrollment?.progress || 0}%
                        </span>
                      </div>
                      <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-emerald-600 h-full rounded-full transition-all duration-500"
                          style={{ width: `${Math.max(enrollment?.progress || 0, 5)}%` }}
                        />
                      </div>
                      <button
                        onClick={() => router.push(`/trainee/courses/${course.id}`)}
                        className="w-full mt-2 py-2 px-4 rounded-xl text-xs sm:text-sm font-semibold bg-slate-900 text-white hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 shadow-sm"
                      >
                        Continue Course
                        <IconArrowRight size={16} />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleEnroll(course.id)}
                      disabled={enrollingId === course.id}
                      className="w-full py-2 px-4 rounded-xl text-xs sm:text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2 shadow-sm"
                    >
                      {enrollingId === course.id ? "Enrolling..." : "Enroll in Program"}
                      <IconArrowRight size={16} />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
