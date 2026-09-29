"use client";

import { useState } from "react";
import { MetalButton } from "@/components/ui/metal-button";
import { IconBell } from "@tabler/icons-react";

export default function AdminNotificationsPage() {
  const [message, setMessage] = useState("");
  const [target, setTarget] = useState("ALL");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/admin/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, target }),
      });
      const data = await res.json();
      if (res.ok) {
        setResult(`Success: Sent to ${data.count} users.`);
        setMessage("");
      } else {
        setResult(`Error: ${data.error}`);
      }
    } catch (err: any) {
      setResult(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 text-zinc-900 flex items-center gap-2">
        <IconBell className="text-zinc-500" /> Notifications Push
      </h1>

      <div className="bg-zinc-50 border shadow-sm rounded-lg p-6 max-w-xl">
        <p className="text-sm text-zinc-500 mb-6">
          Send a direct system notification to users. This will appear in their notification center.
        </p>

        {result && (
          <div className={`mb-4 p-3 rounded-md text-sm ${result.startsWith("Success") ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
            {result}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">Target Audience</label>
            <select
              className="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-1 focus:ring-zinc-950"
              value={target}
              onChange={e => setTarget(e.target.value)}
            >
              <option value="ALL">All Users</option>
              <option value="TRAINEE">Trainees Only</option>
              <option value="TRAINER">Trainers Only</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">Message Content</label>
            <textarea
              required
              rows={4}
              className="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-1 focus:ring-zinc-950"
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder="Enter the notification text here..."
            />
          </div>

          <MetalButton type="submit" disabled={loading || !message} className="w-full">
            {loading ? "Sending..." : "Push Notification"}
          </MetalButton>
        </form>
      </div>
    </div>
  );
}
