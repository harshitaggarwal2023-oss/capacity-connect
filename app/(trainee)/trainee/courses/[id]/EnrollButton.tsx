"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LiquidMetalButton } from "@/components/ui/liquid-metal-button";

export default function EnrollButton({ courseId }: { courseId: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleEnroll = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/enrollments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId }),
      });
      if (res.ok) {
        router.refresh();
      } else {
        console.error("Failed to enroll");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <LiquidMetalButton onClick={handleEnroll} className={loading ? "opacity-50 pointer-events-none" : ""} label={loading ? "Enrolling..." : "Enroll Now"} />
  );
}
