import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { PortalNavbar } from "@/components/portal-navbar";
import { ReactNode } from "react";

export default async function TrainerLayout({ children }: { children: ReactNode }) {
  const session = await auth();
  if (!session || (session.user as any).role !== "TRAINER") {
    redirect("/");
  }

  const navItems = [
    { name: "Dashboard", link: "/trainer/dashboard" },
    { name: "Courses", link: "/trainer/courses" },
    { name: "Quizzes", link: "/trainer/quizzes" },
    { name: "Library", link: "/trainer/library" },
    { name: "Students", link: "/trainer/students" },
    { name: "Messages", link: "/trainer/messages" },
    { name: "Profile", link: "/trainer/profile" },
  ];

  return (
    <div className="min-h-screen bg-[#F9F7F2] flex flex-col">
      <PortalNavbar navItems={navItems} />
      <main className="container mx-auto px-4 py-8 mt-20 flex-1">
        {children}
      </main>
    </div>
  );
}
