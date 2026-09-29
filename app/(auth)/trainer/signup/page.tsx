"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus_Jakarta_Sans } from "next/font/google";

const plusJakartaSans = Plus_Jakarta_Sans({ subsets: ["latin"] });

export default function TrainerSignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match");
      setStatus("error");
      return;
    }

    setStatus("submitting");
    try {
      const res = await fetch("/api/auth/trainer-signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || "Something went wrong");
        setStatus("error");
      } else {
        setStatus("success");
      }
    } catch (err) {
      setErrorMsg("An unexpected error occurred");
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className={`min-h-screen bg-[#F9F7F2] flex items-center justify-center p-4 ${plusJakartaSans.className}`}>
        <div className="max-w-md w-full bg-[\#FAF9F6]/50 backdrop-blur-sm border border-slate-200 rounded-2xl p-8 shadow-sm text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-4">Application Submitted</h1>
          <p className="text-slate-600 mb-6">
            Application submitted. Awaiting admin approval.
          </p>
          <Link href="/" className="text-[#1a1a1a] font-medium hover:underline">
            Return home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-[#F9F7F2] flex items-center justify-center p-4 ${plusJakartaSans.className}`}>
      <div className="max-w-md w-full bg-[\#FAF9F6]/50 backdrop-blur-sm border border-slate-200 rounded-2xl p-8 shadow-sm">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Apply as Trainer</h1>
          <p className="text-slate-600">Join our platform and share your knowledge.</p>
        </div>

        {status === "error" && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 border border-red-200 rounded-xl text-sm">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#1a1a1a]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#1a1a1a]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
            <input
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#1a1a1a]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Confirm Password</label>
            <input
              type="password"
              required
              minLength={8}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#1a1a1a]"
            />
          </div>
          <button
            type="submit"
            disabled={status === "submitting"}
            className="w-full bg-[#1a1a1a] hover:bg-[#333] text-[#FAF9F6] p-4 rounded-xl font-medium transition-colors disabled:opacity-70"
          >
            {status === "submitting" ? "Submitting..." : "Submit Application"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-slate-600 text-sm">
            Already a trainer?{" "}
            <Link href="/trainer/login" className="text-slate-900 font-medium hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
