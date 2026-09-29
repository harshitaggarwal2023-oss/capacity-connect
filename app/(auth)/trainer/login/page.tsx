"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Plus_Jakarta_Sans } from "next/font/google";

const plusJakartaSans = Plus_Jakarta_Sans({ subsets: ["latin"] });

export default function TrainerLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    
    if (result?.error) {
      router.push(`/trainer/login?error=${encodeURIComponent(result.error)}`);
    } else {
      router.push("/trainer/dashboard");
    }
  };

  return (
    <div className={`min-h-screen bg-[#F9F7F2] flex items-center justify-center p-4 ${plusJakartaSans.className}`}>
      <div className="max-w-md w-full bg-[\#FAF9F6]/50 backdrop-blur-sm border border-slate-200 rounded-2xl p-8 shadow-sm">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Trainer Portal</h1>
          <p className="text-slate-600">Sign in to manage your courses and trainees.</p>
        </div>
        
        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 border border-red-200 rounded-xl text-sm">
            {error === "CredentialsSignin" ? "Invalid email or password." : error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#1a1a1a]"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-[#1a1a1a] hover:bg-[#333] text-[#FAF9F6] p-4 rounded-xl font-medium transition-colors"
          >
            Sign In
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-slate-600 text-sm">
            Don't have an account?{" "}
            <Link href="/trainer/signup" className="text-slate-900 font-medium hover:underline">
              Apply to be a trainer
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
