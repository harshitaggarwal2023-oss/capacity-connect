import { requireRole } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import AnnouncementsClient from "./AnnouncementsClient";

export default async function AdminAnnouncementsPage() {
  await requireRole("ADMIN");

  const announcements = await prisma.announcement.findMany({
    orderBy: { publishedAt: "desc" },
    include: { course: { select: { title: true } } }
  });

  const courses = await prisma.course.findMany({
    select: { id: true, title: true }
  });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 text-zinc-900">Announcements</h1>
      <AnnouncementsClient initialAnnouncements={announcements} courses={courses} />
    </div>
  );
}
