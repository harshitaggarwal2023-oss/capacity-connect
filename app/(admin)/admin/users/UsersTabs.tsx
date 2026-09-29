"use client";

import { useState } from "react";
import { MetalButton } from "@/components/ui/metal-button";
import { useRouter } from "next/navigation";

export default function UsersTabs({ initialUsers }: { initialUsers: any[] }) {
  const [tab, setTab] = useState<"PENDING" | "ALL">("PENDING");
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const router = useRouter();

  const pendingTrainers = initialUsers.filter(u => u.role === "TRAINER" && u.status === "PENDING");
  
  const allFiltered = initialUsers.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === "ALL" || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleAction = async (id: string, action: "approve" | "reject") => {
    await fetch(`/api/admin/users/${id}/${action}`, { method: "POST" });
    router.refresh();
  };

  return (
    <div className="bg-zinc-50 border shadow-sm rounded-lg overflow-hidden">
      <div className="flex border-b border-zinc-200">
        <button
          className={`px-6 py-3 text-sm font-medium ${tab === "PENDING" ? "border-b-2 border-zinc-900 text-zinc-900" : "text-zinc-500 hover:text-zinc-700"}`}
          onClick={() => setTab("PENDING")}
        >
          Pending Approvals ({pendingTrainers.length})
        </button>
        <button
          className={`px-6 py-3 text-sm font-medium ${tab === "ALL" ? "border-b-2 border-zinc-900 text-zinc-900" : "text-zinc-500 hover:text-zinc-700"}`}
          onClick={() => setTab("ALL")}
        >
          All Users
        </button>
      </div>

      <div className="p-6">
        {tab === "PENDING" && (
          <div>
            {pendingTrainers.length === 0 ? (
              <p className="text-zinc-500">No pending approvals.</p>
            ) : (
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b text-sm text-zinc-500">
                    <th className="pb-2">Name</th>
                    <th className="pb-2">Email</th>
                    <th className="pb-2 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {pendingTrainers.map(user => (
                    <tr key={user.id}>
                      <td className="py-3 font-medium text-zinc-900">{user.name}</td>
                      <td className="py-3 text-zinc-600">{user.email}</td>
                      <td className="py-3 text-right space-x-2">
                        <MetalButton variant="success" onClick={() => handleAction(user.id, "approve")}>Approve</MetalButton>
                        <MetalButton variant="error" onClick={() => handleAction(user.id, "reject")}>Reject</MetalButton>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {tab === "ALL" && (
          <div>
            <div className="flex gap-4 mb-4">
              <input
                type="text"
                placeholder="Search name or email..."
                className="border px-3 py-2 rounded-md focus:outline-none focus:ring-1 focus:ring-zinc-950 flex-1"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              <select
                className="border px-3 py-2 rounded-md focus:outline-none focus:ring-1 focus:ring-zinc-950"
                value={roleFilter}
                onChange={e => setRoleFilter(e.target.value)}
              >
                <option value="ALL">All Roles</option>
                <option value="TRAINEE">Trainee</option>
                <option value="TRAINER">Trainer</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>
            <table className="w-full text-left">
              <thead>
                <tr className="border-b text-sm text-zinc-500">
                  <th className="pb-2">Name</th>
                  <th className="pb-2">Email</th>
                  <th className="pb-2">Role</th>
                  <th className="pb-2">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {allFiltered.map(user => (
                  <tr key={user.id}>
                    <td className="py-3 font-medium text-zinc-900">{user.name}</td>
                    <td className="py-3 text-zinc-600">{user.email}</td>
                    <td className="py-3 text-zinc-600">{user.role}</td>
                    <td className="py-3 text-zinc-600">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        user.status === 'APPROVED' ? 'bg-green-100 text-green-700' :
                        user.status === 'PENDING' ? 'bg-orange-100 text-orange-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {user.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
