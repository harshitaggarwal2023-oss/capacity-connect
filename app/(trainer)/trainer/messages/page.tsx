"use client";

import { useState, useEffect, useRef } from "react";
import {
  IconSend,
  IconMessageCircle,
  IconUser,
  IconCheck,
  IconSparkles,
} from "@tabler/icons-react";
import { io, Socket } from "socket.io-client";

type Sender = {
  id: string;
  name: string;
  email?: string;
  image?: string | null;
  role?: string;
};

type Message = {
  id: string;
  content: string;
  senderId: string;
  receiverId?: string;
  sentAt: string;
  roomId?: string;
  sender?: Sender;
};

export default function TrainerMessagesPage() {
  const [courses, setCourses] = useState<any[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [currentUserId, setCurrentUserId] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [socketConnected, setSocketConnected] = useState(false);

  const socketRef = useRef<Socket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    fetch("/api/profile")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.userId) setCurrentUserId(data.userId);
      })
      .catch(console.error);

    fetch("/api/trainer/courses")
      .then((r) => r.json())
      .then((data) => {
        const list = Array.isArray(data) ? data : [];
        setCourses(list);
        if (list.length > 0) setSelectedCourse(list[0]);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3001";
    let socket: Socket;

    try {
      socket = io(socketUrl, {
        transports: ["websocket", "polling"],
        reconnectionAttempts: 3,
        timeout: 5000,
      });

      socket.on("connect", () => {
        setSocketConnected(true);
        if (selectedCourse?.id) {
          socket.emit("join_course", selectedCourse.id);
        }
      });

      socket.on("disconnect", () => setSocketConnected(false));

      socket.on("new_message", (incomingMsg: Message) => {
        if (
          incomingMsg.roomId === `course:${selectedCourse?.id}` ||
          incomingMsg.roomId === selectedCourse?.id
        ) {
          setMessages((prev) => {
            if (prev.some((m) => m.id === incomingMsg.id)) return prev;
            return [...prev, incomingMsg];
          });
          scrollToBottom();
        }
      });

      socketRef.current = socket;
    } catch (e) {
      console.warn("Socket unreachable, using polling");
    }

    return () => {
      if (socket) socket.disconnect();
    };
  }, [selectedCourse?.id]);

  const loadMessages = async (courseId: string) => {
    try {
      const res = await fetch(`/api/messages?courseId=${courseId}`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          setMessages(data);
          scrollToBottom();
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (!selectedCourse?.id) return;
    loadMessages(selectedCourse.id);

    const interval = setInterval(() => {
      if (!socketConnected && selectedCourse?.id) {
        loadMessages(selectedCourse.id);
      }
    }, 6000);

    return () => clearInterval(interval);
  }, [selectedCourse?.id, socketConnected]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !selectedCourse?.id || sending) return;

    const content = inputText.trim();
    const courseId = selectedCourse.id;
    setInputText("");
    setSending(true);

    const tempId = `temp-${Date.now()}`;
    const optimisticMsg: Message = {
      id: tempId,
      content,
      senderId: currentUserId,
      sentAt: new Date().toISOString(),
      roomId: `course:${courseId}`,
      sender: {
        id: currentUserId,
        name: "You (Trainer)",
      },
    };

    setMessages((prev) => [...prev, optimisticMsg]);
    scrollToBottom();

    try {
      const payload = {
        content,
        courseId,
        roomId: `course:${courseId}`,
      };

      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const saved = await res.json();
        setMessages((prev) => prev.map((m) => (m.id === tempId ? saved : m)));
        if (socketRef.current?.connected) {
          socketRef.current.emit("send_message", payload);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSending(false);
      scrollToBottom();
    }
  };

  return (
    <div className="max-w-6xl mx-auto h-[calc(100vh-8.5rem)] flex flex-col">
      <div className="bg-[#FAF9F6] rounded-2xl shadow-sm border border-slate-200 h-full flex overflow-hidden">
        {/* Course Channel Sidebar */}
        <div className="w-80 lg:w-96 border-r border-slate-200 bg-[#FAF9F6] flex flex-col">
          <div className="p-4 border-b border-slate-200">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <IconMessageCircle size={20} className="text-emerald-600" />
              Course Inquiries
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">Trainee questions & discussions</p>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {loading ? (
              <div className="p-4 text-center text-xs text-slate-400">Loading courses...</div>
            ) : courses.length === 0 ? (
              <div className="p-6 text-center text-slate-500 text-xs">
                No active courses created yet.
              </div>
            ) : (
              courses.map((c) => {
                const isSelected = selectedCourse?.id === c.id;
                return (
                  <button
                    key={c.id}
                    onClick={() => setSelectedCourse(c)}
                    className={`w-full text-left p-3.5 rounded-xl transition-all ${
                      isSelected
                        ? "bg-emerald-50/80 border border-emerald-200 shadow-xs"
                        : "hover:bg-slate-100/70 border border-transparent"
                    }`}
                  >
                    <p
                      className={`text-sm font-semibold line-clamp-1 ${
                        isSelected ? "text-emerald-950" : "text-slate-900"
                      }`}
                    >
                      {c.title}
                    </p>
                    <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                      <span>Status:</span>
                      <span className="font-semibold text-emerald-700">{c.status}</span>
                    </p>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col bg-[#FAF9F6]">
          {selectedCourse ? (
            <>
              {/* Header */}
              <div className="p-4 border-b border-slate-200 bg-white/50 backdrop-blur-xs flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 line-clamp-1">
                    {selectedCourse.title}
                  </h3>
                  <p className="text-xs text-slate-500 flex items-center gap-2">
                    <span>Course Q&A Channel</span>
                    {socketConnected && (
                      <span className="inline-flex items-center gap-1 text-[11px] text-emerald-600 font-semibold">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Live
                      </span>
                    )}
                  </p>
                </div>
              </div>

              {/* Messages Body */}
              <div className="flex-1 p-4 md:p-6 overflow-y-auto space-y-4">
                {messages.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-6">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
                      <IconSparkles size={24} />
                    </div>
                    <h4 className="text-sm font-bold text-slate-800 mb-1">No inquiries yet</h4>
                    <p className="text-xs text-slate-500 max-w-sm">
                      Questions submitted by enrolled trainees will appear here for you to mentor
                      and respond.
                    </p>
                  </div>
                ) : (
                  messages.map((msg) => {
                    const isMine =
                      msg.senderId === currentUserId ||
                      msg.sender?.id === currentUserId ||
                      msg.sender?.role === "TRAINER";

                    return (
                      <div
                        key={msg.id}
                        className={`flex flex-col ${isMine ? "items-end" : "items-start"}`}
                      >
                        <span className="text-[11px] font-semibold text-slate-500 mb-1 ml-1">
                          {isMine
                            ? "You (Trainer)"
                            : msg.sender?.name || "Enrolled Trainee"}
                        </span>
                        <div
                          className={`max-w-[78%] sm:max-w-[65%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-2xs ${
                            isMine
                              ? "bg-emerald-700 text-white rounded-br-xs"
                              : "bg-white text-slate-900 border border-slate-200/80 rounded-bl-xs"
                          }`}
                        >
                          <p className="whitespace-pre-wrap break-words">{msg.content}</p>
                          <div
                            className={`text-[10px] mt-1 text-right flex items-center justify-end gap-1 ${
                              isMine ? "text-emerald-200" : "text-slate-400"
                            }`}
                          >
                            <span>
                              {msg.sentAt
                                ? new Date(msg.sentAt).toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })
                                : "Just now"}
                            </span>
                            {isMine && <IconCheck size={12} />}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Chat Input */}
              <div className="p-3 sm:p-4 bg-white/80 border-t border-slate-200 backdrop-blur-xs">
                <form onSubmit={handleSend} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Reply to trainees in this course..."
                    className="flex-1 bg-slate-100/80 hover:bg-slate-100 border border-slate-200 focus:border-emerald-500 rounded-full px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-slate-900 placeholder:text-slate-400 transition"
                  />
                  <button
                    type="submit"
                    disabled={!inputText.trim() || sending}
                    className="bg-emerald-700 hover:bg-emerald-800 disabled:opacity-40 text-white p-2.5 rounded-full shadow-sm transition-all focus:outline-none shrink-0"
                    title="Send response"
                  >
                    <IconSend size={18} />
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-500">
              <IconMessageCircle className="w-12 h-12 text-slate-300 mb-3" />
              <p className="text-sm font-medium">Select a course to view inquiries</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
