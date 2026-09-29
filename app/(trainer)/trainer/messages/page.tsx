"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";

export default function TrainerMessagesPage() {
  const [courses, setCourses] = useState<any[]>([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [messages, setMessages] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/trainer/courses").then(r => r.json()).then(setCourses);
  }, []);

  useEffect(() => {
    if (selectedCourse) {
      fetch(`/api/messages?courseId=${selectedCourse}`).then(r => r.json()).then(setMessages);
    }
  }, [selectedCourse]);

  return (
    <div className="max-w-4xl mx-auto h-[80vh] flex gap-4">
      <Card className="w-1/3 bg-[#FAF9F6] h-full overflow-auto">
        <div className="p-4 border-b font-bold">Courses</div>
        <div className="p-2 space-y-1">
          {courses.map(c => (
            <div 
              key={c.id} 
              className={`p-3 rounded cursor-pointer ${selectedCourse === c.id ? 'bg-slate-200' : 'hover:bg-slate-100'}`}
              onClick={() => setSelectedCourse(c.id)}
            >
              {c.title}
            </div>
          ))}
        </div>
      </Card>
      
      <Card className="flex-1 bg-[#FAF9F6] h-full flex flex-col">
        {selectedCourse ? (
          <>
            <div className="p-4 border-b font-bold">Messages</div>
            <div className="flex-1 overflow-auto p-4 space-y-4">
              {messages.map(m => (
                <div key={m.id} className="p-3 bg-[\#FAF9F6] rounded shadow-sm">
                  <p className="font-bold text-sm mb-1">{m.sender.name}</p>
                  <p>{m.content}</p>
                </div>
              ))}
              {messages.length === 0 && <p className="text-slate-500 text-center mt-10">No messages</p>}
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-slate-500">
            Select a course to view messages
          </div>
        )}
      </Card>
    </div>
  );
}
