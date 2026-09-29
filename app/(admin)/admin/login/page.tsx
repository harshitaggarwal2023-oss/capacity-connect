"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { MetalButton } from "@/components/ui/metal-button";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const res = await signIn("credentials", {
      email,
      password,
      redirect: true,
      redirectTo: "/admin/dashboard",
    });
    if (res?.error) {
      setError("Invalid credentials or access denied");
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-[#F4F4F5]">
      <div className="w-full max-w-md p-8 bg-zinc-50 border shadow-sm rounded-lg">
        <h1 className="text-2xl font-bold mb-6 text-center text-zinc-900">Admin Portal</h1>
        {error && <div className="mb-4 text-red-600 text-sm text-center">{error}</div>}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">Email</label>
            <input
              type="email"
              required
              className="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-1 focus:ring-zinc-950"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">Password</label>
            <input
              type="password"
              required
              className="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-1 focus:ring-zinc-950"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <MetalButton type="submit" className="w-full">Sign In</MetalButton>
        </form>
      </div>
    </div>
  );
}
