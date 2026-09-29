"use client";

import { useState, useEffect, useRef, useTransition, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  IconSend,
  IconMessageCircle,
  IconUser,
  IconCheck,
  IconChecklist,
  IconArrowLeft,
  IconCircleCheckFilled,
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

type CourseItem = {
  id: string;
  title: string;
  description?: string;
  trainer?: {
    id: string;
    name: string;
    email?: string;
  };
};

function TraineeMessagesContent() {
  const searchParams = useSearchParams();
  const initialCourseId = searchParams.get("courseId");

  const [courses, setCourses] = useState<CourseItem[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<CourseItem | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [currentUserId, setCurrentUserId] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [socketConnected, setSocketConnected] = useState(false);
  const [mobileShowChat, setMobileShowChat] = useState(false);

  const socketRef = useRef<Socket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // 1. Fetch Current User Profile
  useEffect(() => {
    fetch("/api/profile")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.userId) {
          setCurrentUserId(data.userId);
        }
      })
      .catch((err) => console.error("Error loading user profile:", err));
  }, []);

  // 2. Fetch User's Enrolled Courses (with fallback to all courses)
  useEffect(() => {
    async function loadCourses() {
      try {
        const enrollRes = await fetch("/api/enrollments");
        let courseList: CourseItem[] = [];

        if (enrollRes.ok) {
          const enrollments = await enrollRes.json();
          if (Array.isArray(enrollments) && enrollments.length > 0) {
            courseList = enrollments
              .filter((e) => e.course)
              .map((e) => ({
                id: e.course.id,
                title: e.course.title,
                description: e.course.description,
                trainer: e.course.trainer,
              }));
          }
        }

        // If no enrollments found, fetch available courses so user can message
        if (courseList.length === 0) {
          const coursesRes = await fetch("/api/courses");
          if (coursesRes.ok) {
            const allCourses = await coursesRes.json();
            if (Array.isArray(allCourses)) {
              courseList = allCourses.map((c) => ({
                id: c.id,
                title: c.title,
                description: c.description,
                trainer: c.trainer,
              }));
            }
          }
        }

        setCourses(courseList);

        if (courseList.length > 0) {
          const matched = initialCourseId
            ? courseList.find((c) => c.id === initialCourseId)
            : null;
          setSelectedCourse(matched || courseList[0]);
          if (initialCourseId) {
            setMobileShowChat(true);
          }
        }
      } catch (err) {
        console.error("Error loading courses for messaging:", err);
      } finally {
        setLoading(false);
      }
    }

    loadCourses();
  }, [initialCourseId]);

  // 3. Connect to Socket.io for Real-time chat
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

      socket.on("disconnect", () => {
        setSocketConnected(false);
      });

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
      console.warn("Socket.io server unreachable, falling back to HTTP polling");
    }

    return () => {
      if (socket) socket.disconnect();
    };
  }, [selectedCourse?.id]);

  // 4. Fetch Messages for Selected Course
  const fetchMessages = async (courseId: string) => {
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
      console.error("Failed to fetch messages:", err);
    }
  };

  useEffect(() => {
    if (!selectedCourse?.id) return;

    fetchMessages(selectedCourse.id);

    // If socket isn't connected, poll every 6 seconds
    const interval = setInterval(() => {
      if (!socketConnected && selectedCourse?.id) {
        fetchMessages(selectedCourse.id);
      }
    }, 6000);

    return () => clearInterval(interval);
  }, [selectedCourse?.id, socketConnected]);

  // 5. Send Message
  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !selectedCourse?.id || sending) return;

    const content = inputText.trim();
    const courseId = selectedCourse.id;
    const receiverId = selectedCourse.trainer?.id;
    setInputText("");
    setSending(true);

    // Optimistic message update
    const tempId = `temp-${Date.now()}`;
    const optimisticMsg: Message = {
      id: tempId,
      content,
      senderId: currentUserId,
      receiverId,
      sentAt: new Date().toISOString(),
      roomId: `course:${courseId}`,
      sender: {
        id: currentUserId,
        name: "You",
      },
    };

    setMessages((prev) => [...prev, optimisticMsg]);
    scrollToBottom();

    try {
      const payload = {
        receiverId,
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
        const savedMsg = await res.json();
        setMessages((prev) =>
          prev.map((m) => (m.id === tempId ? savedMsg : m))
        );
        if (socketRef.current?.connected) {
          socketRef.current.emit("send_message", payload);
        }
      } else {
        console.error("Server rejected message");
      }
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setSending(false);
      scrollToBottom();
    }
  };

  return (
    <div className="max-w-6xl mx-auto h-[calc(100vh-8.5rem)] flex flex-col">
      <div className="bg-[#FAF9F6] rounded-2xl shadow-sm border border-slate-200 h-full flex overflow-hidden">
        {/* Sidebar: Course Conversations */}
        <div
          className={`w-full md:w-80 lg:w-96 border-r border-slate-200 bg-[#FAF9F6] flex flex-col ${
            mobileShowChat ? "hidden md:flex" : "flex"
          }`}
        >
          <div className="p-4 border-b border-slate-200">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <IconMessageCircle size={20} className="text-blue-600" />
              Course Mentorship
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Direct discussions with faculty & instructors
            </p>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {loading ? (
              <div className="p-4 text-center text-xs text-slate-400">
                Loading course channels...
              </div>
            ) : courses.length === 0 ? (
              <div className="p-6 text-center text-slate-500 text-xs">
                No active courses enrolled. Enroll in a course to access mentor chat.
              </div>
            ) : (
              courses.map((c) => {
                const isSelected = selectedCourse?.id === c.id;
                return (
                  <button
                    key={c.id}
                    onClick={() => {
                      setSelectedCourse(c);
                      setMobileShowChat(true);
                    }}
                    className={`w-full text-left p-3.5 rounded-xl transition-all ${
                      isSelected
                        ? "bg-blue-50/80 border border-blue-200 shadow-xs"
                        : "hover:bg-slate-100/70 border border-transparent"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p
                        className={`text-sm font-semibold line-clamp-1 ${
                          isSelected ? "text-blue-950" : "text-slate-900"
                        }`}
                      >
                        {c.title}
                      </p>
                      {isSelected && (
                        <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0 mt-1"></span>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 mt-1.5 text-xs text-slate-500">
                      <IconUser size={13} className="text-slate-400" />
                      <span className="truncate">
                        {c.trainer?.name ? `Trainer: ${c.trainer.name}` : "Faculty Channel"}
                      </span>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div
          className={`flex-1 flex flex-col bg-[#FAF9F6] ${
            !mobileShowChat ? "hidden md:flex" : "flex"
          }`}
        >
          {selectedCourse ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-slate-200 bg-white/50 backdrop-blur-xs flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setMobileShowChat(false)}
                    className="md:hidden p-1.5 rounded-lg text-slate-600 hover:bg-slate-100"
                  >
                    <IconArrowLeft size={18} />
                  </button>

                  <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm shrink-0">
                    {selectedCourse.trainer?.name?.charAt(0) || "T"}
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-slate-900 line-clamp-1">
                      {selectedCourse.title}
                    </h3>
                    <p className="text-xs text-slate-500 flex items-center gap-1">
                      <span>Instructor: {selectedCourse.trainer?.name || "Department Faculty"}</span>
                      {socketConnected && (
                        <span className="inline-flex items-center gap-1 text-[11px] text-emerald-600 font-semibold ml-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Live
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              </div>

              {/* Messages Body */}
              <div className="flex-1 p-4 md:p-6 overflow-y-auto space-y-4">
                {messages.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-6">
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
                      <IconSparkles size={24} />
                    </div>
                    <h4 className="text-sm font-bold text-slate-800 mb-1">
                      Course Mentorship Discussion
                    </h4>
                    <p className="text-xs text-slate-500 max-w-sm">
                      Send your questions, assignment doubts, or curriculum feedback directly to
                      the faculty trainer.
                    </p>
                  </div>
                ) : (
                  messages.map((msg) => {
                    const isMine =
                      msg.senderId === currentUserId ||
                      msg.sender?.id === currentUserId ||
                      msg.sender?.name === "You";

                    return (
                      <div
                        key={msg.id}
                        className={`flex flex-col ${isMine ? "items-end" : "items-start"}`}
                      >
                        {!isMine && (
                          <span className="text-[11px] font-semibold text-slate-500 mb-1 ml-1">
                            {msg.sender?.name || selectedCourse.trainer?.name || "Instructor"}
                          </span>
                        )}
                        <div
                          className={`max-w-[78%] sm:max-w-[65%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-2xs ${
                            isMine
                              ? "bg-blue-600 text-white rounded-br-xs"
                              : "bg-white text-slate-900 border border-slate-200/80 rounded-bl-xs"
                          }`}
                        >
                          <p className="whitespace-pre-wrap break-words">{msg.content}</p>
                          <div
                            className={`text-[10px] mt-1 text-right flex items-center justify-end gap-1 ${
                              isMine ? "text-blue-200" : "text-slate-400"
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
                    placeholder="Type your question for the trainer..."
                    className="flex-1 bg-slate-100/80 hover:bg-slate-100 border border-slate-200 focus:border-blue-500 rounded-full px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-900 placeholder:text-slate-400 transition"
                  />
                  <button
                    type="submit"
                    disabled={!inputText.trim() || sending}
                    className="bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white p-2.5 rounded-full shadow-sm transition-all focus:outline-none shrink-0"
                    title="Send message"
                  >
                    <IconSend size={18} />
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-500">
              <IconMessageCircle className="w-12 h-12 text-slate-300 mb-3" />
              <p className="text-sm font-medium">Select a course to start messaging</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function TraineeMessagesPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-500">Loading messages...</div>}>
      <TraineeMessagesContent />
    </Suspense>
  );
}
