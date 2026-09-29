"use client";

import { useState } from "react";
import { MetalButton } from "@/components/ui/metal-button";
import { IconBrain } from "@tabler/icons-react";

export default function CompetencyClient({ courses }: { courses: { id: string; title: string; status: string }[] }) {
  const [courseId, setCourseId] = useState(courses[0]?.id || "");
  const [subjectTags, setSubjectTags] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [assigning, setAssigning] = useState<string | null>(null);

  const handleFind = async () => {
    if (!courseId || !subjectTags) return;
    setLoading(true);
    try {
      const res = await fetch("/api/admin/competency", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          courseId,
          subjectTags: subjectTags.split(",").map(t => t.trim()).filter(Boolean)
        }),
      });
      const data = await res.json();
      setResults(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleAssign = async (trainerId: string) => {
    setAssigning(trainerId);
    try {
      await fetch(`/api/admin/courses/${courseId}/assign-trainer`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ trainerId }),
      });
      alert("Trainer assigned successfully!");
    } catch (e) {
      console.error(e);
      alert("Failed to assign trainer.");
    } finally {
      setAssigning(null);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="bg-zinc-50 border shadow-sm rounded-lg p-6">
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
          <IconBrain className="text-purple-600" /> Map Competency
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">Select Course</label>
            <select
              className="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-1 focus:ring-zinc-950"
              value={courseId}
              onChange={(e) => setCourseId(e.target.value)}
            >
              {courses.map(c => (
                <option key={c.id} value={c.id}>{c.title} ({c.status})</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">Subject Tags (comma-separated)</label>
            <input
              type="text"
              className="w-full border px-3 py-2 rounded-md focus:outline-none focus:ring-1 focus:ring-zinc-950"
              placeholder="e.g. React, Node.js, Frontend"
              value={subjectTags}
              onChange={(e) => setSubjectTags(e.target.value)}
            />
          </div>
          <MetalButton onClick={handleFind} disabled={loading} className="w-full">
            {loading ? "Analyzing..." : "Find Best Trainers"}
          </MetalButton>
        </div>
      </div>

      <div className="space-y-4">
        {results.map((r, i) => (
          <div key={r.user.id} className="bg-zinc-50 border shadow-sm rounded-lg p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-bold text-lg text-zinc-900">{r.user.name}</h3>
                <p className="text-sm text-zinc-500">Score: <span className="font-bold text-green-600">{r.score}</span>/100</p>
              </div>
              <MetalButton
                onClick={() => handleAssign(r.user.id)}
                disabled={assigning === r.user.id}
              >
                {assigning === r.user.id ? "Assigning..." : "Assign"}
              </MetalButton>
            </div>
            
            <div className="text-sm text-zinc-600 grid grid-cols-3 gap-2">
              <div className="bg-zinc-100 p-2 rounded">
                <span className="block text-xs font-bold text-zinc-500">Skills Match</span>
                {r.breakdown.skills} pts
              </div>
              <div className="bg-zinc-100 p-2 rounded">
                <span className="block text-xs font-bold text-zinc-500">Qualifications</span>
                {r.breakdown.qualifications} pts
              </div>
              <div className="bg-zinc-100 p-2 rounded">
                <span className="block text-xs font-bold text-zinc-500">Experience</span>
                {r.breakdown.experience} pts
              </div>
            </div>
          </div>
        ))}
        {results.length === 0 && !loading && (
          <div className="text-center text-zinc-500 p-8 border border-dashed rounded-lg bg-zinc-50">
            Submit tags to see top trainers.
          </div>
        )}
      </div>
    </div>
  );
}
