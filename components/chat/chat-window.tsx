"use client";

import React, { useEffect, useRef, useState } from "react";
import { useSocket } from "@/hooks/use-socket";
import { IconSend, IconMessageCircle } from "@tabler/icons-react";

interface MessageItem {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  sentAt?: string;
  createdAt?: string;
}

interface ChatWindowProps {
  courseId: string;
  receiverId: string;
  currentUserId: string;
  receiverName?: string;
}

export function ChatWindow({
  courseId,
  receiverId,
  currentUserId,
  receiverName = "Participant",
}: ChatWindowProps) {
  const { socket, isConnected } = useSocket();
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch initial messages history
  useEffect(() => {
    async function loadMessages() {
      try {
        const res = await fetch(`/api/messages?courseId=${courseId}`);
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) {
            setMessages(data);
          }
        }
      } catch (err) {
        console.error("Failed to load conversation:", err);
      }
    }
    if (courseId) {
      loadMessages();
    }
  }, [courseId]);

  // Handle incoming socket messages
  useEffect(() => {
    if (!socket) return;

    if (courseId) {
      socket.emit("join_course", courseId);
    }

    const handleNewMessage = (msg: MessageItem) => {
      setMessages((prev) => {
        if (prev.some((m) => m.id === msg.id)) return prev;
        return [...prev, msg];
      });
    };

    socket.on("new_message", handleNewMessage);

    return () => {
      socket.off("new_message", handleNewMessage);
    };
  }, [socket, courseId]);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const content = inputMessage.trim();
    setInputMessage("");

    if (socket && isConnected) {
      socket.emit("send_message", {
        receiverId,
        content,
        roomId: courseId,
      });
    } else {
      // Fallback HTTP POST
      try {
        const res = await fetch("/api/messages", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            receiverId,
            content,
            roomId: courseId,
          }),
        });
        if (res.ok) {
          const saved = await res.json();
          setMessages((prev) => [...prev, saved]);
        }
      } catch (err) {
        console.error("Fallback message send failed:", err);
      }
    }
  };

  return (
    <div className="flex flex-col h-[520px] rounded-xl border border-neutral-300 bg-[#FAF9F6] shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-neutral-200 bg-[#F4F1EA]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#2c3e6b] text-white flex items-center justify-center text-xs font-semibold">
            {receiverName.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 className="text-sm font-semibold text-neutral-800">{receiverName}</h3>
            <p className="text-xs text-neutral-500">
              {isConnected ? "Connected to real-time chat" : "Offline / polling mode"}
            </p>
          </div>
        </div>
      </div>

      {/* Message List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#F7F4EF]">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-neutral-400">
            <IconMessageCircle className="w-8 h-8 stroke-1 mb-2 opacity-60" />
            <p className="text-xs">No messages yet. Send a message to start discussion.</p>
          </div>
        ) : (
          messages.map((m, idx) => {
            const isMine = m.senderId === currentUserId;
            return (
              <div
                key={m.id || idx}
                className={`flex ${isMine ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[78%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                    isMine
                      ? "bg-[#2c3e6b] text-white rounded-br-sm"
                      : "bg-[#EFECE6] text-neutral-800 border border-neutral-200 rounded-bl-sm"
                  }`}
                >
                  <p>{m.content}</p>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <form
        onSubmit={handleSend}
        className="p-3 border-t border-neutral-200 bg-[#FAF9F6] flex items-center gap-2"
      >
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 px-4 py-2.5 rounded-lg border border-neutral-300 bg-[\#FAF9F6] text-sm text-neutral-800 focus:outline-none focus:ring-1 focus:ring-[#2c3e6b]"
        />
        <button
          type="submit"
          disabled={!inputMessage.trim()}
          className="p-2.5 rounded-lg bg-[#2c3e6b] text-white hover:bg-[#233257] disabled:opacity-50 transition-colors"
        >
          <IconSend className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
