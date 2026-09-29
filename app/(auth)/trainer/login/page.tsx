"use client";

import { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { IconSchool, IconArrowRight, IconArrowLeft } from "@tabler/icons-react";
import { Plus_Jakarta_Sans } from "next/font/google";

const plusJakartaSans = Plus_Jakarta_Sans({ subsets: ["latin"] });

function TrainerLoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loadingDemo, setLoadingDemo] = useState(false);
  const [loadingForm, setLoadingForm] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingForm(true);
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    
    if (result?.error) {
      setLoadingForm(false);
      router.push(`/trainer/login?error=${encodeURIComponent(result.error)}`);
    } else {
      router.push("/trainer/dashboard");
    }
  };

  const handleQuickDemoTeacher = async () => {
    setLoadingDemo(true);
    const result = await signIn("credentials", {
      email: "teacher@capacityconnect.in",
      password: "trainer123",
      redirect: false,
    });

    if (result?.error) {
      setLoadingDemo(false);
      router.push(`/trainer/login?error=${encodeURIComponent(result.error)}`);
    } else {
      router.push("/trainer/dashboard");
    }
  };

  return (
    <div className="max-w-md w-full bg-[#FAF9F6] border border-slate-200 rounded-2xl p-8 shadow-sm">
      <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 mb-6 transition-colors">
        <IconArrowLeft size={16} /> Back to Homepage
      </Link>

      <div className="text-center mb-8">
        <div className="w-12 h-12 rounded-xl bg-[#1c4a4a] text-white flex items-center justify-center mx-auto mb-4">
          <IconSchool size={26} />
        </div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Teacher & Trainer Portal</h1>
        <p className="text-slate-600 text-sm">Sign in to manage your courses, quizzes, and trainees.</p>
      </div>

      {/* Quick Demo Access Card */}
      <div className="mb-6 p-4 rounded-xl border border-teal-200 bg-teal-50/60">
        <p className="text-xs font-semibold text-teal-900 mb-1">Quick Teacher Access</p>
        <p className="text-xs text-teal-700 mb-3">Pre-configured with sample course & learning materials.</p>
        <button
          type="button"
          onClick={handleQuickDemoTeacher}
          disabled={loadingDemo}
          className="w-full bg-[#1c4a4a] hover:bg-[#153838] text-white py-2 px-3 rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          {loadingDemo ? "Authenticating Teacher..." : "1-Click Teacher Sign In"}
          <IconArrowRight size={14} />
        </button>
      </div>
      
      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-600 border border-red-200 rounded-xl text-sm">
          {error === "CredentialsSignin" ? "Invalid email or password." : error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="teacher@capacityconnect.in"
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#1c4a4a] text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">Password</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="trainer123"
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#1c4a4a] text-sm"
          />
        </div>
        <button
          type="submit"
          disabled={loadingForm}
          className="w-full bg-[#1c4a4a] hover:bg-[#153838] text-[#FAF9F6] py-3 rounded-xl font-medium transition-colors text-sm cursor-pointer disabled:opacity-50"
        >
          {loadingForm ? "Authenticating..." : "Sign In to Teacher Portal"}
        </button>
      </form>
      
      <div className="mt-6 text-center">
        <p className="text-slate-600 text-xs">
          New instructor?{" "}
          <Link href="/trainer/signup" className="text-[#1c4a4a] font-medium hover:underline">
            Apply to be a trainer
          </Link>
        </p>
      </div>

      {/* Switch Portals */}
      <div className="mt-8 pt-6 border-t border-slate-200 text-center space-y-2">
        <p className="text-xs text-slate-500">Need another portal?</p>
        <div className="flex justify-center gap-4 text-xs font-medium">
          <Link href="/admin/login" className="text-amber-800 hover:underline">
            Admin Portal
          </Link>
          <span className="text-slate-300">•</span>
          <Link href="/trainee/login" className="text-blue-700 hover:underline">
            Trainee Portal
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function TrainerLoginPage() {
  return (
    <div className={`min-h-screen bg-[#F9F7F2] flex items-center justify-center p-4 ${plusJakartaSans.className}`}>
      <Suspense fallback={<div className="text-sm text-slate-500">Loading form...</div>}>
        <TrainerLoginForm />
      </Suspense>
    </div>
  );
}
