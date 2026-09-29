import { auth } from "@/auth";
import { requireRole } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { AdminDashboardClient } from "./AdminDashboardClient";

export default async function AdminDashboardPage() {
  await requireRole("ADMIN");
  const session = await auth();

  const [
    usersCount,
    traineesCount,
    trainersCount,
    adminsCount,
    coursesCount,
    certsCount,
    pendingApprovalsCount,
    teachers,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { role: "TRAINEE" } }),
    prisma.user.count({ where: { role: "TRAINER" } }),
    prisma.user.count({ where: { role: "ADMIN" } }),
    prisma.course.count({ where: { status: "PUBLISHED" } }),
    prisma.certificate.count(),
    prisma.user.count({ where: { role: "TRAINER", status: "PENDING" } }),
    prisma.user.findMany({
      where: { role: "TRAINER" },
      include: {
        profile: true,
        courses: {
          include: {
            _count: {
              select: {
                enrollments: true,
                resources: true,
                quizzes: true,
              },
            },
          },
          orderBy: { createdAt: "desc" },
        },
      },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return (
    <AdminDashboardClient
      adminUser={{
        name: session?.user?.name || "Administrator",
        email: session?.user?.email || "admin@capacityconnect.in",
      }}
      stats={{
        totalUsers: usersCount,
        traineesCount,
        trainersCount,
        adminsCount,
        coursesCount,
        certsCount,
        pendingApprovals: pendingApprovalsCount,
      }}
      teachers={teachers as any}
    />
  );
}
