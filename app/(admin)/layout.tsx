import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { IconDashboard, IconUsers, IconBook, IconCertificate, IconBell, IconSpeakerphone, IconBrain } from "@tabler/icons-react";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  const isAdmin = session?.user && (session.user as any).role === "ADMIN";

  if (!isAdmin) {
    // If not admin, just render children (allows login page to work without sidebar, but might redirect in page if needed)
    return <div className="min-h-screen bg-[#F4F4F5]">{children}</div>;
  }

  const navItems = [
    { name: "Dashboard", href: "/admin/dashboard", icon: IconDashboard },
    { name: "Users", href: "/admin/users", icon: IconUsers },
    { name: "Courses", href: "/admin/courses", icon: IconBook },
    { name: "Competency", href: "/admin/competency", icon: IconBrain },
    { name: "Announcements", href: "/admin/announcements", icon: IconSpeakerphone },
    { name: "Notifications", href: "/admin/notifications", icon: IconBell },
  ];

  return (
    <div className="flex h-screen bg-[#F4F4F5]">
      <aside className="w-64 bg-zinc-900 text-zinc-100 flex flex-col">
        <div className="h-16 flex items-center px-6 font-bold text-lg border-b border-zinc-800">
          Admin Portal
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-zinc-800 transition-colors"
            >
              <item.icon className="w-5 h-5 text-zinc-400" />
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>
      </aside>
      <main className="flex-1 overflow-auto p-8">{children}</main>
    </div>
  );
}
