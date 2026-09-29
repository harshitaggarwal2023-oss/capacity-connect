"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { IconBrandGoogle, IconArrowRight, IconArrowLeft, IconCheck } from "@tabler/icons-react";
import { Plus_Jakarta_Sans } from "next/font/google";

const plusJakartaSans = Plus_Jakarta_Sans({ subsets: ["latin"] });

export default function TraineeSignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (password.length < 6) {
      setErrorMsg("Password must be at least 6 characters");
      setStatus("error");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match");
      setStatus("error");
      return;
    }

    setStatus("submitting");

    try {
      const res = await fetch("/api/auth/trainee-signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error || "Signup failed. Please try again.");
        setStatus("error");
        return;
      }

      setStatus("success");

      // Auto sign-in with the new credentials
      const loginResult = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (!loginResult?.error) {
        router.push("/trainee/dashboard");
      } else {
        router.push("/trainee/login");
      }
    } catch (err) {
      setErrorMsg("An unexpected error occurred. Please try again.");
      setStatus("error");
    }
  };

  return (
    <div
      className={`min-h-screen bg-[#FAF9F6] flex items-center justify-center p-4 ${plusJakartaSans.className}`}
    >
      <div className="max-w-md w-full bg-[#FAF9F6]/95 backdrop-blur-md border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 mb-6 transition-colors"
        >
          <IconArrowLeft size={16} /> Back to Homepage
        </Link>

        <div className="text-center mb-6">
          <span className="inline-block px-3 py-1 rounded-full text-[11px] font-bold bg-blue-100 text-blue-800 border border-blue-200 mb-3">
            Trainee Portal
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Create Your Account
          </h1>
          <p className="text-slate-600 text-xs sm:text-sm mt-1">
            Get instant access to civil service courses and certifications.
          </p>
        </div>

        {/* Google One-Click Sign Up */}
        <button
          type="button"
          onClick={() => signIn("google", { callbackUrl: "/trainee/dashboard" })}
          className="w-full flex items-center justify-center gap-3 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 py-2.5 rounded-xl font-medium text-sm transition-all shadow-xs cursor-pointer"
        >
          <IconBrandGoogle className="w-5 h-5" />
          <span>Sign up with Google</span>
        </button>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-[#FAF9F6] px-3 text-slate-400 font-medium">
              Or register with email
            </span>
          </div>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 font-medium text-center">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Full Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Priya Sharma"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-sm text-slate-900"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Official or Personal Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="priya@example.com"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-sm text-slate-900"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Password (min 6 characters)
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-sm text-slate-900"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Confirm Password
            </label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-sm text-slate-900"
            />
          </div>

          <button
            type="submit"
            disabled={status === "submitting" || status === "success"}
            className="w-full mt-2 py-3 px-4 rounded-xl text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 transition-colors shadow-sm flex items-center justify-center gap-2 cursor-pointer"
          >
            {status === "submitting" ? (
              "Creating account..."
            ) : status === "success" ? (
              <span className="flex items-center gap-1.5">
                <IconCheck size={16} /> Account created! Redirecting...
              </span>
            ) : (
              <span className="flex items-center gap-1.5">
                Complete Registration <IconArrowRight size={16} />
              </span>
            )}
          </button>
        </form>

        <div className="mt-6 pt-5 border-t border-slate-200 text-center">
          <p className="text-xs text-slate-500">
            Already have an account?{" "}
            <Link
              href="/trainee/login"
              className="text-blue-700 font-semibold hover:underline"
            >
              Sign In here
            </Link>
          </p>
        </div>

        {/* Portal links */}
        <div className="mt-4 text-center">
          <div className="flex justify-center gap-3 text-xs text-slate-400">
            <Link href="/trainer/signup" className="hover:text-slate-700 hover:underline">
              Trainer Signup
            </Link>
            <span>•</span>
            <Link href="/admin/login" className="hover:text-slate-700 hover:underline">
              Admin Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
