"use client";

import React, { useEffect, useState } from "react";
import { IconBell, IconCheck } from "@tabler/icons-react";
import { useSocket } from "@/hooks/use-socket";

interface NotificationItem {
  id: string;
  type: string;
  content: string;
  read: boolean;
  createdAt: string;
}

export function NotificationBell() {
  const { socket } = useSocket();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    async function fetchNotifications() {
      try {
        const res = await fetch("/api/notifications");
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) {
            setNotifications(data);
          }
        }
      } catch (e) {
        console.error("Could not fetch notifications:", e);
      }
    }

    fetchNotifications();
  }, []);

  useEffect(() => {
    if (!socket) return;

    const handleNewNotification = (notif: any) => {
      setNotifications((prev) => [
        {
          id: notif.id || `temp-${Date.now()}`,
          type: notif.type || "INFO",
          content: notif.content,
          read: false,
          createdAt: notif.createdAt || new Date().toISOString(),
        },
        ...prev,
      ]);
    };

    socket.on("new_notification", handleNewNotification);
    return () => {
      socket.off("new_notification", handleNewNotification);
    };
  }, [socket]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllAsRead = async () => {
    try {
      await fetch("/api/notifications/read-all", { method: "PATCH" });
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch (e) {
      console.error("Failed to mark notifications read:", e);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => {
          setOpen(!open);
          if (!open && unreadCount > 0) {
            markAllAsRead();
          }
        }}
        className="relative p-2 rounded-lg text-neutral-600 hover:text-neutral-900 hover:bg-neutral-200/50 transition-colors"
        aria-label="Notifications"
      >
        <IconBell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-600 rounded-full ring-2 ring-[#FAF9F6]" />
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 rounded-xl bg-[#FAF9F6] border border-neutral-300 shadow-xl py-2 z-50">
          <div className="flex items-center justify-between px-4 py-2 border-b border-neutral-200">
            <span className="text-xs font-semibold text-neutral-700 uppercase tracking-wider">
              Notifications
            </span>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-xs text-[#2c3e6b] hover:underline flex items-center gap-1"
              >
                <IconCheck className="w-3.5 h-3.5" /> Mark all read
              </button>
            )}
          </div>

          <div className="max-h-72 overflow-y-auto divide-y divide-neutral-100">
            {notifications.length === 0 ? (
              <div className="px-4 py-6 text-center text-xs text-neutral-400">
                No notifications to display
              </div>
            ) : (
              notifications.slice(0, 10).map((n) => (
                <div
                  key={n.id}
                  className={`px-4 py-3 text-xs ${
                    !n.read ? "bg-[#F7F4EF]/80 font-medium" : "text-neutral-600"
                  }`}
                >
                  <p className="text-neutral-800 leading-snug">{n.content}</p>
                  <span className="text-[10px] text-neutral-400 mt-1 block">
                    {new Date(n.createdAt).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
