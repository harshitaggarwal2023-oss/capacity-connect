"use client";

import { useEffect, useState } from "react";
import { Carousel, Card } from "@/components/ui/apple-cards-carousel";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";

type Course = {
  id: string;
  title: string;
  description: string;
  trainer?: { name: string };
};

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/courses")
      .then((res) => res.json())
      .then((data) => {
        setCourses(Array.isArray(data) ? data : []);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const cards = courses.map((course) => {
    return (
      <Card
        key={course.id}
        card={{
          category: course.description.substring(0, 30) + (course.description.length > 30 ? "..." : ""),
          title: course.title,
          src: "", // Placeholder or default image can be handled by the Card component or backend
          content: (
            <div className="p-4 bg-[#FAF9F6] rounded-xl border border-gray-200">
              <p className="text-gray-800 mb-4">{course.description}</p>
              <p className="text-sm text-gray-500 mb-6">Trainer: {course.trainer?.name || "Unknown"}</p>
              <button
                onClick={() => router.push(`/trainee/courses/${course.id}`)}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
              >
                View Course
              </button>
            </div>
          )
        }}
        
      />
    );
  });

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 bg-[#F7F4EF] min-h-[calc(100vh-4rem)]">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Available Courses</h1>
      
      {loading ? (
        <div className="flex gap-4 overflow-hidden">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-[300px] w-[300px] rounded-xl flex-shrink-0 bg-gray-200" />
          ))}
        </div>
      ) : courses.length === 0 ? (
        <p className="text-gray-500">No courses available at the moment.</p>
      ) : (
        <div className="w-full">
          <Carousel items={cards} />
        </div>
      )}
    </div>
  );
}
