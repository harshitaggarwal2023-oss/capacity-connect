import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { notFound } from "next/navigation";
import { IconFileTypePdf, IconPresentation, IconVideo } from "@tabler/icons-react";
import EnrollButton from "./EnrollButton";

function getResourceIcon(type: string) {
  switch (type) {
    case "PDF": return <IconFileTypePdf className="text-red-500" />;
    case "PPT": return <IconPresentation className="text-orange-500" />;
    case "VIDEO": return <IconVideo className="text-blue-500" />;
    default: return <IconFileTypePdf className="text-gray-500" />;
  }
}

export default async function CourseDetailPage({ params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user?.id) return null;

  const course = await prisma.course.findUnique({
    where: { id: params.id },
    include: {
      resources: true,
      quizzes: {
        include: {
          questions: { select: { id: true, text: true, options: true } }
        }
      },
      trainer: { select: { name: true } },
      enrollments: {
        where: { traineeId: session.user.id }
      }
    }
  });

  if (!course) {
    notFound();
  }

  const isEnrolled = course.enrollments.length > 0;

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 bg-[#F7F4EF] min-h-[calc(100vh-4rem)]">
      <div className="bg-[#FAF9F6] p-8 rounded-xl border border-gray-200 mb-8 shadow-sm">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{course.title}</h1>
        <p className="text-sm text-gray-500 mb-6">Trainer: {course.trainer?.name || "Unknown"}</p>
        <p className="text-gray-800 whitespace-pre-wrap mb-8">{course.description}</p>
        
        {!isEnrolled ? (
          <EnrollButton courseId={course.id} />
        ) : (
          <div className="inline-flex items-center px-4 py-2 bg-green-50 text-green-700 rounded-md border border-green-200 font-medium">
            Enrolled
          </div>
        )}
      </div>

      {isEnrolled && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-[#FAF9F6] p-6 rounded-xl border border-gray-200 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Resources</h2>
            {course.resources.length === 0 ? (
              <p className="text-sm text-gray-500">No resources available.</p>
            ) : (
              <ul className="space-y-3">
                {course.resources.map(res => (
                  <li key={res.id} className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-100">
                    {getResourceIcon(res.type)}
                    <a href={res.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm font-medium">
                      {res.title}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="bg-[#FAF9F6] p-6 rounded-xl border border-gray-200 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Quizzes</h2>
            {course.quizzes.length === 0 ? (
              <p className="text-sm text-gray-500">No quizzes available.</p>
            ) : (
              <ul className="space-y-3">
                {course.quizzes.map(quiz => (
                  <li key={quiz.id} className="p-3 bg-white rounded-lg border border-gray-100">
                    <p className="font-medium text-gray-900">{quiz.title}</p>
                    <p className="text-xs text-red-600 mt-1">Deadline: {quiz.deadline.toLocaleDateString()}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
