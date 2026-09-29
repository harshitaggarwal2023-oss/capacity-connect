"use client";

import { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { IconBrandGoogle, IconUserCheck, IconArrowRight, IconArrowLeft } from "@tabler/icons-react";
import { Plus_Jakarta_Sans } from "next/font/google";

const plusJakartaSans = Plus_Jakarta_Sans({ subsets: ["latin"] });

function TraineeLoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loadingDemo, setLoadingDemo] = useState(false);
  const [loadingForm, setLoadingForm] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingForm(true);
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    setLoadingForm(false);

    if (result?.error) {
      router.push(`/trainee/login?error=${encodeURIComponent(result.error)}`);
    } else {
      router.push("/trainee/dashboard");
    }
  };

  const handle1ClickDemo = async () => {
    setLoadingDemo(true);
    const result = await signIn("credentials", {
      email: "trainee@capacityconnect.in",
      password: "trainee123",
      redirect: false,
    });
    setLoadingDemo(false);

    if (!result?.error) {
      router.push("/trainee/dashboard");
    }
  };

  return (
    <div className="max-w-md w-full bg-[#FAF9F6]/90 backdrop-blur-sm border border-slate-200 rounded-2xl p-8 shadow-sm">
      <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 mb-6 transition-colors">
        <IconArrowLeft size={16} /> Back to Homepage
      </Link>

      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Continue Learning</h1>
        <p className="text-slate-600 text-sm">
          Access your courses, assessments, and learning certificates.
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-600 border border-red-200 rounded-xl text-sm">
          {error === "CredentialsSignin" ? "Invalid email or password." : error}
        </div>
      )}

      {/* 1-Click Instant Demo Login */}
      <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200">
        <div className="flex items-center gap-2 mb-2 text-emerald-900 font-semibold text-sm">
          <IconUserCheck className="w-5 h-5 text-emerald-700" />
          <span>Quick Demo Access</span>
        </div>
        <p className="text-xs text-emerald-800 mb-3 leading-relaxed">
          Skip registration and log in with pre-seeded sample trainee profile & enrolled courses.
        </p>
        <button
          onClick={handle1ClickDemo}
          disabled={loadingDemo}
          className="w-full flex items-center justify-center gap-2 bg-emerald-800 hover:bg-emerald-900 text-white py-2.5 px-4 rounded-lg font-medium text-sm transition-colors shadow-sm disabled:opacity-50"
        >
          <span>{loadingDemo ? "Signing in..." : "1-Click Demo Trainee Sign In"}</span>
          <IconArrowRight className="w-4 h-4" />
        </button>
      </div>

      <div className="relative my-6 text-center">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-200" />
        </div>
        <span className="relative px-3 bg-[#FAF9F6] text-xs uppercase tracking-wider text-slate-400">
          Or with email
        </span>
      </div>

      {/* Credentials form */}
      <form onSubmit={handleCredentialsSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="trainee@capacityconnect.in"
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2c3e6b] text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="trainee123"
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2c3e6b] text-sm"
          />
        </div>
        <button
          type="submit"
          disabled={loadingForm}
          className="w-full bg-[#2c3e6b] hover:bg-[#233257] text-white py-3 rounded-xl font-medium transition-colors text-sm shadow-sm disabled:opacity-50"
        >
          {loadingForm ? "Authenticating..." : "Sign In with Credentials"}
        </button>
      </form>

      <div className="mt-4 text-center">
        <p className="text-xs text-slate-500">
          Don&apos;t have an account?{" "}
          <Link href="/trainee/signup" className="text-blue-600 font-semibold hover:underline">
            Register here
          </Link>
        </p>
      </div>

      {/* Google OAuth Option */}
      <div className="mt-6 pt-6 border-t border-slate-200 text-center">
        <button
          onClick={() => signIn("google", { callbackUrl: "/trainee/dashboard" })}
          className="w-full flex items-center justify-center gap-3 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 py-2.5 rounded-xl font-medium text-sm transition-colors cursor-pointer"
        >
          <IconBrandGoogle className="w-5 h-5" />
          <span>Sign in with Google</span>
        </button>
      </div>

      {/* Switch Portals */}
      <div className="mt-8 pt-6 border-t border-slate-200 text-center space-y-2">
        <p className="text-xs text-slate-500">Need another portal?</p>
        <div className="flex justify-center gap-4 text-xs font-medium">
          <Link href="/trainer/login" className="text-teal-800 hover:underline">
            Teacher / Trainer Portal
          </Link>
          <span className="text-slate-300">•</span>
          <Link href="/admin/login" className="text-amber-800 hover:underline">
            Admin Portal
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function TraineeLoginPage() {
  return (
    <div className={`min-h-screen bg-[#FAF9F6] flex items-center justify-center p-4 ${plusJakartaSans.className}`}>
      <Suspense fallback={<div className="text-sm text-slate-500">Loading portal...</div>}>
        <TraineeLoginForm />
      </Suspense>
    </div>
  );
}
