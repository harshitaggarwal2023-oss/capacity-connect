import { requireRole } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { IconBook } from "@tabler/icons-react";

export default async function AdminCoursesPage() {
  await requireRole("ADMIN");

  const courses = await prisma.course.findMany({
    include: {
      trainer: true,
      _count: {
        select: { enrollments: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-zinc-200 rounded-md">
          <IconBook className="text-zinc-700" size={24} />
        </div>
        <h1 className="text-2xl font-bold text-zinc-900">Courses Oversight</h1>
      </div>

      <div className="bg-zinc-50 border shadow-sm rounded-lg overflow-hidden p-6">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b text-sm text-zinc-500">
              <th className="pb-2">Title</th>
              <th className="pb-2">Trainer</th>
              <th className="pb-2">Enrollments</th>
              <th className="pb-2">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {courses.map((course) => (
              <tr key={course.id}>
                <td className="py-3 font-medium text-zinc-900">{course.title}</td>
                <td className="py-3 text-zinc-600">{course.trainer?.name || "Unassigned"}</td>
                <td className="py-3 text-zinc-600">{course._count.enrollments}</td>
                <td className="py-3 text-zinc-600">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    course.status === 'PUBLISHED' ? 'bg-green-100 text-green-700' : 'bg-zinc-200 text-zinc-700'
                  }`}>
                    {course.status}
                  </span>
                </td>
              </tr>
            ))}
            {courses.length === 0 && (
              <tr>
                <td colSpan={4} className="py-4 text-center text-zinc-500">No courses found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
