"use client";

import { useState } from "react";
import { MetalButton } from "@/components/ui/metal-button";
import { useRouter } from "next/navigation";

type Announcement = {
  id: string;
  title: string;
  content: string;
  type: string;
  publishedAt: Date;
  course?: { title: string } | null;
};

export default function AnnouncementsClient({ initialAnnouncements, courses }: { initialAnnouncements: Announcement[], courses: { id: string, title: string }[] }) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [type, setType] = useState("ANNOUNCEMENT");
  const [courseId, setCourseId] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await fetch("/api/admin/announcements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content, type, courseId: courseId || null }),
      });
      setTitle("");
      setContent("");
      setType("ANNOUNCEMENT");
      setCourseId("");
      router.refresh();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="bg-zinc-50 border shadow-sm rounded-lg p-6 h-fit">
        <h2 className="text-lg font-bold mb-4 text-zinc-900">New Announcement</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">Title</label>
            <input
              required
              className="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-1 focus:ring-zinc-950"
              value={title}
              onChange={e => setTitle(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">Type</label>
            <select
              className="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-1 focus:ring-zinc-950"
              value={type}
              onChange={e => setType(e.target.value)}
            >
              <option value="ANNOUNCEMENT">General Announcement</option>
              <option value="ACHIEVEMENT">Achievement</option>
              <option value="NEW_CONTENT">New Content</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">Linked Course (Optional)</label>
            <select
              className="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-1 focus:ring-zinc-950"
              value={courseId}
              onChange={e => setCourseId(e.target.value)}
            >
              <option value="">-- None --</option>
              {courses.map(c => (
                <option key={c.id} value={c.id}>{c.title}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">Content</label>
            <textarea
              required
              rows={4}
              className="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-1 focus:ring-zinc-950"
              value={content}
              onChange={e => setContent(e.target.value)}
            />
          </div>
          <MetalButton type="submit" disabled={loading} className="w-full">
            {loading ? "Publishing..." : "Publish Announcement"}
          </MetalButton>
        </form>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-bold mb-4 text-zinc-900">Recent Announcements</h2>
        {initialAnnouncements.map(ann => (
          <div key={ann.id} className="bg-zinc-50 border shadow-sm rounded-lg p-5">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-bold text-zinc-900">{ann.title}</h3>
              <span className="text-xs bg-zinc-200 text-zinc-700 px-2 py-1 rounded-full">
                {ann.type}
              </span>
            </div>
            <p className="text-sm text-zinc-600 mb-3 whitespace-pre-wrap">{ann.content}</p>
            <div className="flex justify-between items-center text-xs text-zinc-500">
              <span>{new Date(ann.publishedAt).toLocaleDateString()}</span>
              {ann.course && <span>Linked: {ann.course.title}</span>}
            </div>
          </div>
        ))}
        {initialAnnouncements.length === 0 && (
          <p className="text-zinc-500 text-sm">No announcements published yet.</p>
        )}
      </div>
    </div>
  );
}
