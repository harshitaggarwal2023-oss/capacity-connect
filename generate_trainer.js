const fs = require('fs');
const path = require('path');

const write = (p, content) => {
  const full = path.join('/Users/harshit/Desktop/sih', p);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, content.trim() + '\n');
};

write('app/(trainer)/layout.tsx', `
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
`);

write('app/(trainer)/trainer/dashboard/page.tsx', `
import { Suspense } from "react";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { IconBook, IconUsers, IconClipboardList, IconStar } from "@tabler/icons-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

async function DashboardStats({ trainerId }: { trainerId: string }) {
  const courses = await prisma.course.count({ where: { trainerId } });
  const quizzes = await prisma.quiz.count({ where: { course: { trainerId } } });
  const enrollments = await prisma.enrollment.count({ where: { course: { trainerId } } });
  
  const attempts = await prisma.attempt.findMany({
    where: { quiz: { course: { trainerId } }, score: { not: null } },
    select: { score: true }
  });
  
  const avgScore = attempts.length 
    ? Math.round(attempts.reduce((acc, curr) => acc + (curr.score || 0), 0) / attempts.length)
    : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      <Card className="bg-[#FAF9F6]">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Courses Owned</CardTitle>
          <IconBook className="h-4 w-4 text-slate-500" />
        </CardHeader>
        <CardContent><div className="text-2xl font-bold">{courses}</div></CardContent>
      </Card>
      <Card className="bg-[#FAF9F6]">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Enrolled Trainees</CardTitle>
          <IconUsers className="h-4 w-4 text-slate-500" />
        </CardHeader>
        <CardContent><div className="text-2xl font-bold">{enrollments}</div></CardContent>
      </Card>
      <Card className="bg-[#FAF9F6]">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Quizzes Created</CardTitle>
          <IconClipboardList className="h-4 w-4 text-slate-500" />
        </CardHeader>
        <CardContent><div className="text-2xl font-bold">{quizzes}</div></CardContent>
      </Card>
      <Card className="bg-[#FAF9F6]">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Avg Score</CardTitle>
          <IconStar className="h-4 w-4 text-slate-500" />
        </CardHeader>
        <CardContent><div className="text-2xl font-bold">{avgScore}%</div></CardContent>
      </Card>
    </div>
  );
}

function StatsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-28 rounded-xl" />)}
    </div>
  );
}

async function RecentSubmissions({ trainerId }: { trainerId: string }) {
  const attempts = await prisma.attempt.findMany({
    where: { quiz: { course: { trainerId } }, status: "COMPLETED" },
    orderBy: { endTime: 'desc' },
    take: 5,
    include: {
      user: { select: { name: true } },
      quiz: { select: { title: true } }
    }
  });

  return (
    <Card className="bg-[#FAF9F6]">
      <CardHeader><CardTitle>Recent Submissions</CardTitle></CardHeader>
      <CardContent>
        {attempts.length === 0 ? <p className="text-slate-500">No submissions yet.</p> : (
          <div className="space-y-4">
            {attempts.map(a => (
              <div key={a.id} className="flex justify-between items-center border-b pb-2 last:border-0">
                <div>
                  <p className="font-medium text-slate-900">{a.user.name}</p>
                  <p className="text-sm text-slate-500">{a.quiz.title}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold">{a.score}%</p>
                  <p className="text-xs text-slate-400">{a.endTime?.toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default async function TrainerDashboard() {
  const session = await auth();
  const trainerId = (session?.user as any).id;

  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-900 mb-8">Dashboard</h1>
      <Suspense fallback={<StatsSkeleton />}>
        <DashboardStats trainerId={trainerId} />
      </Suspense>
      <Suspense fallback={<Skeleton className="h-64 rounded-xl" />}>
        <RecentSubmissions trainerId={trainerId} />
      </Suspense>
    </div>
  );
}
`);

write('app/(trainer)/trainer/profile/page.tsx', `
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function TrainerProfilePage() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/profile").then(r => r.json()).then(data => {
      setProfile(data);
      setLoading(false);
    });
  }, []);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(profile)
    });
    alert("Profile saved");
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="bg-[#FAF9F6]">
        <CardHeader><CardTitle>Trainer Profile</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={save} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Full Name</label>
              <Input 
                value={profile?.fullName || ""} 
                onChange={e => setProfile({...profile, fullName: e.target.value})} 
                required 
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Bio / Experience</label>
              <Textarea 
                value={profile?.experience || ""} 
                onChange={e => setProfile({...profile, experience: e.target.value})} 
                rows={4}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Subject Tags (comma separated)</label>
              <Input 
                value={(profile?.skills || []).join(", ")} 
                onChange={e => setProfile({...profile, skills: e.target.value.split(",").map((s:string) => s.trim())})} 
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Years of Experience</label>
              <Input 
                type="number"
                value={profile?.yearsExp || 0} 
                onChange={e => setProfile({...profile, yearsExp: parseInt(e.target.value)})} 
              />
            </div>
            <Button type="submit">Save Profile</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
`);

write('app/(trainer)/trainer/quizzes/page.tsx', `
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { IconPlus, IconClock, IconUsers } from "@tabler/icons-react";

export default async function TrainerQuizzes() {
  const session = await auth();
  const trainerId = (session?.user as any).id;

  const quizzes = await prisma.quiz.findMany({
    where: { course: { trainerId } },
    include: {
      course: { select: { title: true } },
      _count: { select: { questions: true, attempts: true } }
    },
    orderBy: { deadline: "asc" }
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Quizzes</h1>
        <Link href="/trainer/quizzes/new">
          <Button><IconPlus className="h-4 w-4 mr-2" /> Create Quiz</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {quizzes.map(q => (
          <Card key={q.id} className="bg-[#FAF9F6]">
            <CardHeader>
              <CardTitle className="text-lg">{q.title}</CardTitle>
              <p className="text-sm text-slate-500">{q.course.title}</p>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 text-sm text-slate-600 mb-4">
                <div className="flex items-center gap-1"><IconClock className="h-4 w-4" /> {q.timeLimit}m</div>
                <div className="flex items-center gap-1"><IconUsers className="h-4 w-4" /> {q._count.attempts} attempts</div>
                <div>{q._count.questions} Qs</div>
              </div>
              <Link href={\`/trainer/quizzes/\${q.id}\`}>
                <Button variant="outline" className="w-full">Edit / View</Button>
              </Link>
            </CardContent>
          </Card>
        ))}
        {quizzes.length === 0 && <p className="col-span-3 text-slate-500 text-center py-12">No quizzes created yet.</p>}
      </div>
    </div>
  );
}
`);

