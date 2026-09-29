import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function TrainerLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session || (session.user as any).role !== "TRAINER") {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-[#F9F7F2]">
      <header className="bg-[#FAF9F6] shadow-sm">
        <nav className="container mx-auto px-4 h-16 flex items-center gap-6">
          <Link href="/trainer/dashboard" className="font-bold text-lg text-slate-800">Trainer Portal</Link>
          <div className="flex gap-4">
            <Link href="/trainer/dashboard" className="text-slate-600 hover:text-slate-900">Dashboard</Link>
            <Link href="/trainer/courses" className="text-slate-600 hover:text-slate-900">Courses</Link>
            <Link href="/trainer/quizzes" className="text-slate-600 hover:text-slate-900">Quizzes</Link>
            <Link href="/trainer/library" className="text-slate-600 hover:text-slate-900">Library</Link>
            <Link href="/trainer/students" className="text-slate-600 hover:text-slate-900">Students</Link>
            <Link href="/trainer/messages" className="text-slate-600 hover:text-slate-900">Messages</Link>
            <Link href="/trainer/profile" className="text-slate-600 hover:text-slate-900">Profile</Link>
          </div>
        </nav>
      </header>
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
}
