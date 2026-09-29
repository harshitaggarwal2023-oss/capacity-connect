import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { PortalNavbar } from "@/components/portal-navbar";
import { ReactNode } from "react";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const session = await auth();
  const isAdmin = session?.user && (session.user as any).role === "ADMIN";

  if (!isAdmin) {
    return <div className="min-h-screen bg-[#F4F4F5]">{children}</div>;
  }

  const navItems = [
    { name: "Dashboard", link: "/admin/dashboard" },
    { name: "Users", link: "/admin/users" },
    { name: "Courses", link: "/admin/courses" },
    { name: "Competency", link: "/admin/competency" },
    { name: "Announcements", link: "/admin/announcements" },
    { name: "Notifications", link: "/admin/notifications" },
  ];

  return (
    <div className="min-h-screen bg-[#F4F4F5] flex flex-col">
      <PortalNavbar navItems={navItems} />
      <main className="flex-1 overflow-auto p-4 md:p-8 mt-20">
        {children}
      </main>
    </div>
  );
}
