import { requireRole } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { IconUsers, IconBook, IconCertificate, IconClock } from "@tabler/icons-react";

export default async function AdminDashboardPage() {
  await requireRole("ADMIN");

  const usersCount = await prisma.user.count();
  const traineesCount = await prisma.user.count({ where: { role: "TRAINEE" } });
  const trainersCount = await prisma.user.count({ where: { role: "TRAINER" } });
  const adminsCount = await prisma.user.count({ where: { role: "ADMIN" } });
  
  const coursesCount = await prisma.course.count({ where: { status: "PUBLISHED" } });
  const certsCount = await prisma.certificate.count();
  const pendingApprovalsCount = await prisma.user.count({
    where: { role: "TRAINER", status: "PENDING" },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 text-zinc-900">Dashboard</h1>
      
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-zinc-50 p-6 rounded-lg border shadow-sm flex items-start space-x-4">
          <div className="p-3 bg-blue-100 rounded-md text-blue-600">
            <IconUsers size={24} />
          </div>
          <div>
            <p className="text-sm text-zinc-500 font-medium">Total Users</p>
            <p className="text-2xl font-bold text-zinc-900">{usersCount}</p>
            <p className="text-xs text-zinc-400 mt-1">
              {traineesCount} Trainees, {trainersCount} Trainers, {adminsCount} Admins
            </p>
          </div>
        </div>

        <div className="bg-zinc-50 p-6 rounded-lg border shadow-sm flex items-start space-x-4">
          <div className="p-3 bg-green-100 rounded-md text-green-600">
            <IconBook size={24} />
          </div>
          <div>
            <p className="text-sm text-zinc-500 font-medium">Active Courses</p>
            <p className="text-2xl font-bold text-zinc-900">{coursesCount}</p>
          </div>
        </div>

        <div className="bg-zinc-50 p-6 rounded-lg border shadow-sm flex items-start space-x-4">
          <div className="p-3 bg-purple-100 rounded-md text-purple-600">
            <IconCertificate size={24} />
          </div>
          <div>
            <p className="text-sm text-zinc-500 font-medium">Certificates Issued</p>
            <p className="text-2xl font-bold text-zinc-900">{certsCount}</p>
          </div>
        </div>

        <div className="bg-zinc-50 p-6 rounded-lg border shadow-sm flex items-start space-x-4 relative">
          <div className="p-3 bg-orange-100 rounded-md text-orange-600">
            <IconClock size={24} />
          </div>
          <div>
            <p className="text-sm text-zinc-500 font-medium">Pending Approvals</p>
            <p className="text-2xl font-bold text-zinc-900">{pendingApprovalsCount}</p>
            {pendingApprovalsCount > 0 && (
              <span className="absolute top-6 right-6 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                {pendingApprovalsCount} New
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
