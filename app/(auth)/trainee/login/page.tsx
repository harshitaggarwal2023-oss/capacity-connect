"use client";

import { signIn } from "next-auth/react";
import { IconBrandGoogle } from "@tabler/icons-react";
import { Plus_Jakarta_Sans } from "next/font/google";

const plusJakartaSans = Plus_Jakarta_Sans({ subsets: ["latin"] });

export default function TraineeLoginPage() {
  return (
    <div className={`min-h-screen bg-[#FAF9F6] flex items-center justify-center p-4 ${plusJakartaSans.className}`}>
      <div className="max-w-md w-full bg-[\#FAF9F6]/50 backdrop-blur-sm border border-slate-200 rounded-2xl p-8 shadow-sm">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Continue Learning</h1>
          <p className="text-slate-600">
            Sign in with your Google account to access your courses.
          </p>
        </div>
        
        <button
          onClick={() => signIn("google", { callbackUrl: "/trainee/dashboard" })}
          className="w-full flex items-center justify-center gap-3 bg-[#1a1a1a] hover:bg-[#333] text-[#FAF9F6] p-4 rounded-xl font-medium transition-colors"
        >
          <IconBrandGoogle className="w-6 h-6" />
          <span>Sign in with Google</span>
        </button>
      </div>
    </div>
  );
}
