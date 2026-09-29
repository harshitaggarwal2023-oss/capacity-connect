"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

function LiquidMetalButton({ onClick, children, className = "" }: any) {
  return (
    <button
      onClick={onClick}
      className={`px-6 py-3 rounded-lg bg-gradient-to-b from-slate-200 to-slate-400 text-slate-900 font-semibold shadow-inner border border-slate-500 hover:from-slate-300 hover:to-slate-500 transition-all ${className}`}
    >
      {children}
    </button>
  );
}

export default function AssessmentPage({ params }: { params: { id: string } }) {
  const [questions, setQuestions] = useState<any[]>([]);
  const [endTime, setEndTime] = useState<Date | null>(null);
  const [attemptId, setAttemptId] = useState<string | null>(null);
  const [answers, setAnswers] = useState<number[]>([]);
  const [timeLeft, setTimeLeft] = useState<string>("00:00");
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Hide navbar if there's a global one
    document.body.classList.add("assessment-focus");
    return () => document.body.classList.remove("assessment-focus");
  }, []);

  useEffect(() => {
    async function startQuiz() {
      const res = await fetch(`/api/assessments/${params.id}/start`, { method: "POST" });
      if (res.ok) {
        const data = await res.json();
        setAttemptId(data.attemptId);
        setEndTime(new Date(data.endTime));
        setQuestions(data.questions);
        setAnswers(new Array(data.questions.length).fill(-1));
      }
    }
    startQuiz();
  }, [params.id]);

  useEffect(() => {
    if (!endTime || submitted) return;
    
    const interval = setInterval(() => {
      const now = new Date();
      const diff = endTime.getTime() - now.getTime();
      
      if (diff <= 0) {
        clearInterval(interval);
        submitQuiz();
      } else {
        const m = Math.floor(diff / 60000);
        const s = Math.floor((diff % 60000) / 1000);
        setTimeLeft(`${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")} remaining`);
      }
    }, 1000);
    
    return () => clearInterval(interval);
  }, [endTime, submitted, answers]);

  async function submitQuiz() {
    setSubmitted(true);
    setShowConfirm(false);
    if (!attemptId) return;
    
    const res = await fetch(`/api/assessments/${params.id}/submit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ attemptId, answers }),
    });
    
    if (res.ok) {
      const data = await res.json();
      setResult(data);
    }
  }

  if (submitted && result) {
    return (
      <div className="min-h-screen bg-[#F7F4EF] flex items-center justify-center p-6 text-slate-800">
        <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-sm border border-slate-200 text-center">
          <h2 className="text-3xl font-bold mb-4">Assessment Complete</h2>
          <div className="text-6xl font-bold mb-2">{result.score}%</div>
          <p className="text-xl mb-6">
            {result.passed ? "You passed" : "You did not pass"}
          </p>
          <p className="text-slate-600 mb-8">
            Correct: {result.correct} / {result.totalQuestions}
          </p>
          <button 
            onClick={() => router.push("/trainee")}
            className="px-4 py-2 bg-slate-900 text-white rounded-md"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (!questions.length) {
    return <div className="min-h-screen bg-[#F7F4EF] p-8">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-[#F7F4EF] text-slate-900 pb-24">
      <div className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-slate-200 p-4 shadow-sm z-10 flex justify-between items-center">
        <h1 className="font-bold text-xl">Assessment</h1>
        <div className="font-mono text-lg font-semibold bg-slate-100 px-3 py-1 rounded">{timeLeft}</div>
      </div>
      
      <div className="max-w-3xl mx-auto p-6 space-y-8 mt-6">
        {questions.map((q, qIndex) => (
          <div key={q.id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="font-semibold text-lg mb-4">{qIndex + 1}. {q.text}</h3>
            <div className="space-y-3">
              {q.options.map((opt: string, optIndex: number) => (
                <label key={optIndex} className="flex items-center space-x-3 p-3 rounded-lg border border-slate-100 hover:bg-slate-50 cursor-pointer">
                  <input
                    type="radio"
                    name={`q-${q.id}`}
                    value={optIndex}
                    checked={answers[qIndex] === optIndex}
                    onChange={() => {
                      const newAnswers = [...answers];
                      newAnswers[qIndex] = optIndex;
                      setAnswers(newAnswers);
                    }}
                    className="w-4 h-4 text-slate-900"
                  />
                  <span>{opt}</span>
                </label>
              ))}
            </div>
          </div>
        ))}
        
        <div className="flex justify-end pt-6">
          <LiquidMetalButton onClick={() => setShowConfirm(true)}>
            Submit Assessment
          </LiquidMetalButton>
        </div>
      </div>

      {showConfirm && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl max-w-sm w-full">
            <h3 className="font-bold text-lg mb-2">Confirm Submission</h3>
            <p className="text-slate-600 mb-6">Are you sure you want to submit your assessment? You cannot change your answers after submission.</p>
            <div className="flex justify-end space-x-3">
              <button 
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 border border-slate-300 rounded-md hover:bg-slate-50"
              >
                Cancel
              </button>
              <button 
                onClick={submitQuiz}
                className="px-4 py-2 bg-slate-900 text-white rounded-md"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
