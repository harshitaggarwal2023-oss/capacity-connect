"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { IconUpload, IconPdf, IconPresentation, IconVideo, IconTrash } from "@tabler/icons-react";

export default function LibraryPage() {
  const [courses, setCourses] = useState<any[]>([]);
  const [resources, setResources] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);

  const [form, setForm] = useState({
    courseId: "",
    title: "",
    file: null as File | null
  });

  const loadResources = () => fetch("/api/trainer/resources").then(r => r.json()).then(setResources);

  useEffect(() => {
    fetch("/api/trainer/courses").then(r => r.json()).then(setCourses);
    loadResources();
  }, []);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.file || !form.courseId) return;
    setUploading(true);
    try {
      const typeStr = form.file.type;
      let type = "PDF";
      if (typeStr.includes("powerpoint") || typeStr.includes("presentation")) type = "PPT";
      if (typeStr.includes("video")) type = "VIDEO";

      const sigRes = await fetch("/api/upload/signed-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ folder: "library" })
      });
      const sigData = await sigRes.json();

      const formData = new FormData();
      formData.append("file", form.file);
      formData.append("api_key", sigData.apiKey);
      formData.append("timestamp", sigData.timestamp.toString());
      formData.append("signature", sigData.signature);
      formData.append("folder", sigData.folder);

      const cloudinaryRes = await fetch(`https://api.cloudinary.com/v1_1/${sigData.cloudName}/auto/upload`, {
        method: "POST",
        body: formData
      });
      const uploadData = await cloudinaryRes.json();

      await fetch("/api/trainer/resources", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          courseId: form.courseId,
          title: form.title || form.file.name,
          url: uploadData.secure_url,
          type
        })
      });

      setForm({ courseId: form.courseId, title: "", file: null });
      loadResources();
    } catch (err) {
      console.error(err);
      alert("Upload failed");
    }
    setUploading(false);
  };

  const getIcon = (type: string) => {
    if (type === "PDF") return <IconPdf className="h-5 w-5 text-red-500" />;
    if (type === "PPT") return <IconPresentation className="h-5 w-5 text-orange-500" />;
    return <IconVideo className="h-5 w-5 text-blue-500" />;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <Card className="bg-[#FAF9F6]">
        <CardHeader><CardTitle>Upload Resource</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handleUpload} className="flex gap-4 items-end">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">Course</label>
              <select required className="w-full border rounded p-2 bg-transparent" value={form.courseId} onChange={e => setForm({...form, courseId: e.target.value})}>
                <option value="" disabled>Select course</option>
                {courses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">Title (Optional)</label>
              <Input value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="Document title" />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">File</label>
              <Input type="file" required accept=".pdf,.ppt,.pptx,.mp4" onChange={e => setForm({...form, file: e.target.files?.[0] || null})} />
            </div>
            <Button type="submit" disabled={uploading}>
              {uploading ? "Uploading..." : <><IconUpload className="h-4 w-4 mr-2" /> Upload</>}
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-6">
        {courses.map(course => {
          const courseRes = resources.filter(r => r.courseId === course.id);
          if (courseRes.length === 0) return null;
          return (
            <div key={course.id}>
              <h2 className="text-xl font-bold mb-4">{course.title}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {courseRes.map(r => (
                  <Card key={r.id} className="bg-[\#FAF9F6]">
                    <CardContent className="p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3 overflow-hidden">
                        {getIcon(r.type)}
                        <a href={r.url} target="_blank" rel="noreferrer" className="font-medium truncate hover:underline">{r.title}</a>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
