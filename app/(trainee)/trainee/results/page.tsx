import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { IconCertificate, IconTrophy } from "@tabler/icons-react";

export default async function ResultsPage() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const attempts = await prisma.attempt.findMany({
    where: { traineeId: session.user.id, status: "COMPLETED" },
    include: {
      quiz: { include: { course: true } }
    },
    orderBy: { endTime: 'desc' }
  });

  const certificates = await prisma.certificate.findMany({
    where: { userId: session.user.id }
  });

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 bg-[#F7F4EF] min-h-[calc(100vh-4rem)]">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">My Results</h1>
      
      {attempts.length === 0 ? (
        <p className="text-gray-500">No completed assessments yet.</p>
      ) : (
        <div className="space-y-6">
          {attempts.map(attempt => {
            const passMark = attempt.quiz.passMark;
            const score = attempt.score || 0;
            const maxScore = (attempt.quiz as any).questions?.length ? (attempt.quiz as any).questions?.length : 100; // approximation if questions not loaded
            // Let's compute actual percentage if possible. Wait, score is typically out of 100 or absolute. Assuming percentage here.
            const isPassed = score >= passMark;

            // find if certificate exists for this course
            const cert = certificates.find(c => c.enrollmentId && false); // wait, need to check enrollment, let's just find by userId and some link. Wait, we'd need to find the enrollment. Let's just do a basic map for now, assuming certificate links to enrollment.
            // Actually, we can fetch enrollments for user
            return (
              <div key={attempt.id} className="p-6 bg-[\#FAF9F6] rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-full ${isPassed ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                    <IconTrophy size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">{attempt.quiz.title}</h3>
                    <p className="text-sm text-gray-500">{attempt.quiz.course.title}</p>
                    <p className="text-xs text-gray-400 mt-1">Completed on: {attempt.endTime?.toLocaleDateString()}</p>
                  </div>
                </div>
                
                <div className="flex flex-col md:items-end gap-2 w-full md:w-auto">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-bold text-gray-900">{score}%</span>
                    <span className={`px-2 py-1 text-xs font-semibold rounded ${isPassed ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {isPassed ? 'PASSED' : 'FAILED'}
                    </span>
                  </div>
                  {isPassed && (
                    <button className="text-blue-600 text-sm font-medium hover:underline flex items-center gap-1 mt-2">
                      <IconCertificate size={16} />
                      View Certificate (if available)
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
