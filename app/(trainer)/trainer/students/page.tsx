import { Suspense } from "react";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

async function StudentsTable({ trainerId, courseId }: { trainerId: string, courseId?: string }) {
  const enrollments = await prisma.enrollment.findMany({
    where: { 
      course: { trainerId },
      ...(courseId ? { courseId } : {})
    },
    include: {
      user: { select: { id: true, name: true, email: true } },
      course: { select: { title: true } }
    },
    orderBy: { createdAt: 'desc' }
  });

  const studentMap = new Map();
  for (const e of enrollments) {
    if (!studentMap.has(e.user.id)) {
      studentMap.set(e.user.id, {
        ...e.user,
        courses: [],
        lastActivity: e.createdAt
      });
    }
    const st = studentMap.get(e.user.id);
    st.courses.push(e.course.title);
    if (e.createdAt > st.lastActivity) st.lastActivity = e.createdAt;
  }

  const students = Array.from(studentMap.values());

  return (
    <Card className="bg-[#FAF9F6]">
      <CardContent className="p-0">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b">
            <tr>
              <th className="p-4 font-medium">Name</th>
              <th className="p-4 font-medium">Email</th>
              <th className="p-4 font-medium">Enrolled Courses</th>
              <th className="p-4 font-medium">Last Activity</th>
            </tr>
          </thead>
          <tbody>
            {students.map(s => (
              <tr key={s.id} className="border-b last:border-0">
                <td className="p-4 font-medium">{s.name}</td>
                <td className="p-4 text-slate-500">{s.email}</td>
                <td className="p-4">{s.courses.length}</td>
                <td className="p-4 text-slate-500">{s.lastActivity.toLocaleDateString()}</td>
              </tr>
            ))}
            {students.length === 0 && (
              <tr><td colSpan={4} className="p-8 text-center text-slate-500">No students found.</td></tr>
            )}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}

function TableSkeleton() {
  return <Skeleton className="h-96 w-full rounded-xl" />;
}

export default async function TrainerStudentsPage({ searchParams }: { searchParams: { courseId?: string } }) {
  const session = await auth();
  const trainerId = (session?.user as any).id;
  const courses = await prisma.course.findMany({ where: { trainerId }, select: { id: true, title: true } });

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Students</h1>
        <form className="flex items-center gap-2">
          <select name="courseId" className="border rounded p-2 bg-transparent" defaultValue={searchParams.courseId || ""}>
            <option value="">All Courses</option>
            {courses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
          </select>
          <button type="submit" className="px-4 py-2 bg-slate-900 text-white rounded">Filter</button>
        </form>
      </div>

      <Suspense fallback={<TableSkeleton />}>
        <StudentsTable trainerId={trainerId} courseId={searchParams.courseId} />
      </Suspense>
    </div>
  );
}
