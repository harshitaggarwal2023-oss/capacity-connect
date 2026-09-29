"use client";

import { useState, useEffect } from "react";
import { AppleSpotlight } from "@/components/ui/apple-spotlight";

export function GlobalSearch() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <AppleSpotlight
      open={open}
      onClose={() => setOpen(false)}
      onSearch={(q) => {}}
    />
  );
}
