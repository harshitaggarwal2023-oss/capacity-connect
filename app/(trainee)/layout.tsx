import { requireRole } from "@/lib/auth-helpers";
import { PortalNavbar } from "@/components/portal-navbar";
import { ReactNode } from "react";

export default async function TraineeLayout({ children }: { children: ReactNode }) {
  await requireRole("TRAINEE");

  const navItems = [
    { name: "Dashboard", link: "/trainee/dashboard" },
    { name: "Courses", link: "/trainee/courses" },
    { name: "Assessments", link: "/trainee/assessments" },
    { name: "Results", link: "/trainee/results" },
    { name: "Messages", link: "/trainee/messages" },
  ];

  return (
    <div className="min-h-screen bg-[#F7F4EF] flex flex-col">
      <PortalNavbar navItems={navItems} />
      <main className="flex-1 p-4 md:p-8 overflow-y-auto mt-20">
        {children}
      </main>
    </div>
  );
}
