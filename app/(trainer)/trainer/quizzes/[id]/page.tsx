"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { IconPlus, IconTrash } from "@tabler/icons-react";

export default function QuizEditorPage() {
  const params = useParams();
  const router = useRouter();
  const isNew = params.id === "new";

  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(!isNew);
  const [formData, setFormData] = useState({
    courseId: "",
    title: "",
    deadline: "",
    timeLimit: 30,
    passMark: 60,
    questions: [
      { text: "", options: ["", "", "", ""], correctIndex: 0 }
    ]
  });

  const [attempts, setAttempts] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/trainer/courses").then(r => r.json()).then(setCourses);
    if (!isNew) {
      fetch(`/api/trainer/quizzes/${params.id}`).then(r => r.json()).then(data => {
        if(data.deadline) data.deadline = new Date(data.deadline).toISOString().slice(0, 16);
        setFormData(data);
        if (data.attempts) setAttempts(data.attempts);
        setLoading(false);
      });
    }
  }, [isNew, params.id]);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = isNew ? "/api/trainer/quizzes" : `/api/trainer/quizzes/${params.id}`;
    const method = isNew ? "POST" : "PATCH";
    
    const payload = {
      ...formData,
      timeLimit: Number(formData.timeLimit),
      passMark: Number(formData.passMark),
      deadline: new Date(formData.deadline).toISOString(),
    };

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    if (res.ok) {
      router.push("/trainer/quizzes");
    } else {
      alert("Error saving quiz");
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <Card className="bg-[#FAF9F6]">
        <CardHeader><CardTitle>{isNew ? "Create Quiz" : "Edit Quiz"}</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={save} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <Input required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Course</label>
                <select required className="w-full border rounded p-2 bg-transparent" value={formData.courseId} onChange={e => setFormData({...formData, courseId: e.target.value})}>
                  <option value="" disabled>Select course</option>
                  {courses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Deadline</label>
                <Input type="datetime-local" required value={formData.deadline} onChange={e => setFormData({...formData, deadline: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Time Limit (mins)</label>
                <Input type="number" required min={1} value={formData.timeLimit} onChange={e => setFormData({...formData, timeLimit: Number(e.target.value)})} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Pass Mark (%)</label>
                <Input type="number" required min={0} max={100} value={formData.passMark} onChange={e => setFormData({...formData, passMark: Number(e.target.value)})} />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-bold text-lg">Questions</h3>
              {formData.questions.map((q, qIndex) => (
                <div key={qIndex} className="p-4 border rounded relative bg-[\#FAF9F6]">
                  <Button type="button" variant="ghost" className="absolute top-2 right-2 text-red-500" onClick={() => setFormData({...formData, questions: formData.questions.filter((_, i) => i !== qIndex)})}>
                    <IconTrash className="h-4 w-4" />
                  </Button>
                  <Input required placeholder="Question text" className="mb-4" value={q.text} onChange={e => {
                    const newQs = [...formData.questions];
                    newQs[qIndex].text = e.target.value;
                    setFormData({...formData, questions: newQs});
                  }} />
                  <div className="grid grid-cols-2 gap-2">
                    {q.options.map((opt, oIndex) => (
                      <div key={oIndex} className="flex items-center gap-2">
                        <input type="radio" name={`correct-${qIndex}`} checked={q.correctIndex === oIndex} onChange={() => {
                          const newQs = [...formData.questions];
                          newQs[qIndex].correctIndex = oIndex;
                          setFormData({...formData, questions: newQs});
                        }} />
                        <Input required placeholder={`Option ${oIndex + 1}`} value={opt} onChange={e => {
                          const newQs = [...formData.questions];
                          newQs[qIndex].options[oIndex] = e.target.value;
                          setFormData({...formData, questions: newQs});
                        }} />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              <Button type="button" variant="outline" onClick={() => setFormData({...formData, questions: [...formData.questions, { text: "", options: ["", "", "", ""], correctIndex: 0 }]})}>
                <IconPlus className="h-4 w-4 mr-2" /> Add Question
              </Button>
            </div>

            <Button type="submit">Save Quiz</Button>
          </form>
        </CardContent>
      </Card>

      {!isNew && attempts.length > 0 && (
        <Card className="bg-[#FAF9F6]">
          <CardHeader><CardTitle>Attempts</CardTitle></CardHeader>
          <CardContent>
            <table className="w-full text-left">
              <thead>
                <tr className="border-b">
                  <th className="pb-2">Trainee</th>
                  <th className="pb-2">Score</th>
                  <th className="pb-2">Submitted</th>
                </tr>
              </thead>
              <tbody>
                {attempts.map(a => (
                  <tr key={a.id} className="border-b last:border-0">
                    <td className="py-2">{a.user?.name}</td>
                    <td className="py-2">{a.score}%</td>
                    <td className="py-2">{new Date(a.endTime).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
