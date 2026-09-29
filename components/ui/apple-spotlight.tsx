"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IconSearch } from "@tabler/icons-react";
import { useOutsideClick } from "@/hooks/use-outside-click";

interface AppleSpotlightProps {
  open: boolean;
  onClose: () => void;
  onSearch: (query: string) => void;
}

export function AppleSpotlight({ open, onClose, onSearch }: AppleSpotlightProps) {
  const [query, setQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  useOutsideClick(containerRef, onClose);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (!open) {
          // Open logic needs to be handled by the parent typically,
          // but if we are just exposing open state, parent should listen to Cmd+K.
          // Since the prompt says "Trigger: Cmd+K / Ctrl+K", we'll just fire a custom event or expect parent to handle it.
        }
      }
      if (e.key === "Escape" && open) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    onSearch(e.target.value);
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 sm:pt-32">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm"
          />
          <motion.div
            ref={containerRef}
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30,
            }}
            className="relative w-full max-w-2xl bg-[#FAF9F6] rounded-2xl shadow-2xl overflow-hidden border border-slate-200 z-10"
          >
            <div className="flex items-center px-4 py-4 border-b border-slate-200">
              <IconSearch className="w-6 h-6 text-slate-400 mr-3" />
              <input
                type="text"
                autoFocus
                placeholder="Search courses, trainers, resources..."
                className="flex-1 bg-transparent border-none outline-none text-lg text-slate-900 placeholder:text-slate-400"
                value={query}
                onChange={handleSearchChange}
              />
              <div className="flex items-center gap-1 text-xs text-slate-400 bg-slate-100 px-2 py-1 rounded-md">
                <span>ESC</span>
              </div>
            </div>

            <div className="p-4 max-h-[60vh] overflow-y-auto">
              {query === "" ? (
                <div className="text-center py-10 text-slate-500 text-sm">
                  Search to discover content.
                </div>
              ) : (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 px-2">Courses</h3>
                    <div className="space-y-1">
                      <div className="px-2 py-3 hover:bg-slate-100 rounded-lg cursor-pointer text-slate-700 text-sm">
                        Advanced React Patterns
                      </div>
                      <div className="px-2 py-3 hover:bg-slate-100 rounded-lg cursor-pointer text-slate-700 text-sm">
                        Node.js Microservices
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 px-2">Trainers</h3>
                    <div className="space-y-1">
                      <div className="px-2 py-3 hover:bg-slate-100 rounded-lg cursor-pointer text-slate-700 text-sm flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full bg-slate-200"></div>
                        <span>Sarah Johnson</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-slate-50 px-4 py-3 border-t border-slate-200 flex flex-wrap gap-2">
              <button className="px-3 py-1.5 text-xs font-medium text-slate-600 bg-[\#FAF9F6] border border-slate-200 rounded-full hover:bg-slate-100">
                React
              </button>
              <button className="px-3 py-1.5 text-xs font-medium text-slate-600 bg-[\#FAF9F6] border border-slate-200 rounded-full hover:bg-slate-100">
                Data Science
              </button>
              <button className="px-3 py-1.5 text-xs font-medium text-slate-600 bg-[\#FAF9F6] border border-slate-200 rounded-full hover:bg-slate-100">
                Design Systems
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
