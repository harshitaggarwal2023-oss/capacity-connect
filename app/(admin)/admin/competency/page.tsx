import { requireRole } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import CompetencyClient from "./CompetencyClient";

export default async function AdminCompetencyPage() {
  await requireRole("ADMIN");

  const courses = await prisma.course.findMany({
    orderBy: { createdAt: "desc" },
    select: { id: true, title: true, status: true },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 text-zinc-900">Competency Mapping</h1>
      <CompetencyClient courses={courses} />
    </div>
  );
}
