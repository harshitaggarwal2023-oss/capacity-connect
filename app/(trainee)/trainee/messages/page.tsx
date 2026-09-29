"use client";

import { useState, useEffect } from "react";
import { IconSend } from "@tabler/icons-react";

type Message = {
  id: string;
  content: string;
  senderId: string;
  sentAt: string;
};

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [courseId, setCourseId] = useState("course-1"); // mock course ID for now
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState(""); // would be fetched from session or API

  useEffect(() => {
    // get user ID from session/profile in real app, mocked for now
    fetch("/api/profile")
      .then(res => res.json())
      .then(data => setUserId(data.userId || "temp-id"))
      .catch(console.error);
  }, []);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/messages?courseId=${courseId}`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setMessages(data);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [courseId]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    
    const newMsg = {
      receiverId: "trainer-1", // mocked
      content: inputText,
      roomId: `course:${courseId}`,
    };

    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newMsg),
      });

      if (res.ok) {
        const savedMsg = await res.json();
        setMessages([...messages, savedMsg]);
        setInputText("");
      }
    } catch (error) {
      console.error("Failed to send message", error);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 bg-[#F7F4EF] h-[calc(100vh-4rem)]">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 h-full flex overflow-hidden">
        
        {/* Sidebar */}
        <div className="w-1/3 border-r border-gray-200 bg-[#FAF9F6] p-4 flex flex-col">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Conversations</h2>
          <div className="flex-1 overflow-y-auto space-y-2">
            <button 
              className={`w-full text-left p-3 rounded-lg ${courseId === 'course-1' ? 'bg-blue-50 border border-blue-200' : 'hover:bg-gray-50 border border-transparent'}`}
              onClick={() => setCourseId('course-1')}
            >
              <p className="font-semibold text-gray-900">General Training</p>
              <p className="text-sm text-gray-500 truncate">Trainer: John Doe</p>
            </button>
            <button 
              className={`w-full text-left p-3 rounded-lg ${courseId === 'course-2' ? 'bg-blue-50 border border-blue-200' : 'hover:bg-gray-50 border border-transparent'}`}
              onClick={() => setCourseId('course-2')}
            >
              <p className="font-semibold text-gray-900">Advanced React</p>
              <p className="text-sm text-gray-500 truncate">Trainer: Jane Smith</p>
            </button>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col bg-white">
          <div className="p-4 border-b border-gray-200 bg-[#FAF9F6]">
            <h3 className="font-bold text-gray-900">Chat</h3>
          </div>
          
          <div className="flex-1 p-4 overflow-y-auto space-y-4">
            {loading ? (
              <p className="text-gray-500 text-center">Loading messages...</p>
            ) : messages.length === 0 ? (
              <p className="text-gray-500 text-center mt-10">No messages yet. Start the conversation!</p>
            ) : (
              messages.map(msg => {
                const isMine = msg.senderId === userId;
                return (
                  <div key={msg.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[70%] rounded-xl p-3 ${isMine ? 'bg-blue-600 text-white rounded-br-none' : 'bg-gray-100 text-gray-900 rounded-bl-none'}`}>
                      <p className="text-sm">{msg.content}</p>
                      <p className={`text-[10px] mt-1 ${isMine ? 'text-blue-100' : 'text-gray-500'}`}>
                        {new Date(msg.sentAt).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <div className="p-4 bg-gray-50 border-t border-gray-200">
            <form onSubmit={handleSend} className="flex items-center gap-2">
              <input
                type="text"
                value={inputText}
                onChange={e => setInputText(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                disabled={!inputText.trim()}
                className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 disabled:opacity-50 transition"
              >
                <IconSend size={20} />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
