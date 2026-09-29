import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import Link from "next/link";
import { IconClipboard, IconCheck, IconAlertCircle } from "@tabler/icons-react";

export default async function AssessmentsPage() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const enrolledCourses = await prisma.course.findMany({
    where: { enrollments: { some: { traineeId: session.user.id } } },
    include: {
      quizzes: {
        include: {
          attempts: {
            where: { traineeId: session.user.id, status: "COMPLETED" }
          }
        }
      }
    }
  });

  const allQuizzes = enrolledCourses.flatMap(course => 
    course.quizzes.map(quiz => ({
      ...quiz,
      courseTitle: course.title,
    }))
  ).sort((a, b) => a.deadline.getTime() - b.deadline.getTime());

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 bg-[#F7F4EF] min-h-[calc(100vh-4rem)]">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">My Assessments</h1>
      
      {allQuizzes.length === 0 ? (
        <p className="text-gray-500">No assessments available.</p>
      ) : (
        <div className="space-y-4">
          {allQuizzes.map(quiz => {
            const hasCompletedAttempt = quiz.attempts.length > 0;
            const isMissed = !hasCompletedAttempt && quiz.deadline < new Date();
            const isPending = !hasCompletedAttempt && quiz.deadline >= new Date();

            let statusIcon = <IconClipboard className="text-gray-400" />;
            let statusBadge = null;

            if (hasCompletedAttempt) {
              statusIcon = <IconCheck className="text-green-500" />;
              statusBadge = <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded">COMPLETED</span>;
            } else if (isMissed) {
              statusIcon = <IconAlertCircle className="text-red-500" />;
              statusBadge = <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-semibold rounded">MISSED</span>;
            } else if (isPending) {
              statusIcon = <IconClipboard className="text-yellow-500" />;
              statusBadge = <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded">PENDING</span>;
            }

            const content = (
              <div className="flex items-center justify-between p-6 bg-white rounded-xl border border-gray-200 shadow-sm transition hover:shadow-md">
                <div className="flex items-center gap-4">
                  {statusIcon}
                  <div>
                    <h3 className="font-bold text-gray-900">{quiz.title}</h3>
                    <p className="text-sm text-gray-500">{quiz.courseTitle}</p>
                    <p className="text-xs text-gray-400 mt-1">Deadline: {quiz.deadline.toLocaleString()}</p>
                  </div>
                </div>
                <div>
                  {statusBadge}
                </div>
              </div>
            );

            if (isPending) {
              return (
                <Link key={quiz.id} href={`/trainee/assessments/${quiz.id}`}>
                  {content}
                </Link>
              );
            }

            return <div key={quiz.id}>{content}</div>;
          })}
        </div>
      )}
    </div>
  );
}
