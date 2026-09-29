import { requireRole } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import UsersTabs from "./UsersTabs";

export default async function AdminUsersPage() {
  await requireRole("ADMIN");

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 text-zinc-900">User Management</h1>
      <UsersTabs initialUsers={users} />
    </div>
  );
}
