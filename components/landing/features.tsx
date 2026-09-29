"use client";

import { motion } from "framer-motion";
import {
  IconUsers,
  IconClipboard,
  IconMessage,
  IconBrain,
  IconCertificate,
  IconFolder,
  IconShieldCheck,
  IconClock,
  IconCheck,
  IconSparkles,
  IconDownload,
  IconLock,
} from "@tabler/icons-react";

const features = [
  {
    title: "Role-Based Institutional Portals",
    tag: "RBAC Governance",
    description:
      "Independent, segregated environments engineered for Trainees, Certified Instructors, and System Administrators with cryptographic permission boundaries.",
    icon: <IconUsers size={22} className="text-blue-600" />,
    badgeColor: "bg-blue-100 text-blue-800 border-blue-200",
    cardBg: "bg-gradient-to-br from-blue-50/50 via-[#FAF9F6] to-slate-50",
    colSpan: "col-span-1 md:col-span-2",
    element: (
      <div className="mt-4 flex flex-wrap gap-2">
        <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-blue-900/10 text-blue-900 border border-blue-200/60 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span> Trainee Dashboard
        </span>
        <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-900/10 text-emerald-900 border border-emerald-200/60 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span> Trainer Suite
        </span>
        <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-900/10 text-slate-900 border border-slate-300/60 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-slate-800"></span> Admin Dossier
        </span>
      </div>
    ),
  },
  {
    title: "Server-Authoritative Quizzes",
    tag: "Anti-Cheat Engine",
    description:
      "Deterministic countdown timers locked to server clock with automatic submission, answer scrambling, and real-time proctor audit logs.",
    icon: <IconClipboard size={22} className="text-emerald-600" />,
    badgeColor: "bg-emerald-100 text-emerald-800 border-emerald-200",
    cardBg: "bg-gradient-to-br from-emerald-50/50 via-[#FAF9F6] to-slate-50",
    colSpan: "col-span-1 md:col-span-2",
    element: (
      <div className="mt-4 p-3 rounded-xl bg-emerald-950/5 border border-emerald-200/70 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-medium text-emerald-900">
          <IconClock size={16} className="text-emerald-600" />
          <span>Timer Enforced</span>
        </div>
        <span className="text-xs font-mono font-bold bg-white px-2 py-0.5 rounded text-emerald-800 shadow-sm border border-emerald-200">
          14:59 Remaining
        </span>
      </div>
    ),
  },
  {
    title: "Real-time Course Messaging",
    tag: "WebSocket Powered",
    description:
      "Instant query resolution between trainees and certified mentors with persistent chat logs, read receipts, and course-room isolation.",
    icon: <IconMessage size={22} className="text-indigo-600" />,
    badgeColor: "bg-indigo-100 text-indigo-800 border-indigo-200",
    cardBg: "bg-gradient-to-br from-indigo-50/50 via-[#FAF9F6] to-slate-50",
    colSpan: "col-span-1 md:col-span-2",
    element: (
      <div className="mt-4 p-3 rounded-xl bg-indigo-950/5 border border-indigo-200/70 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-xs font-medium text-slate-700">Trainer Active</span>
        </div>
        <span className="text-xs text-indigo-700 font-semibold bg-indigo-100/80 px-2 py-0.5 rounded">
          Low Latency
        </span>
      </div>
    ),
  },
  {
    title: "AI Competency & Gap Analysis",
    tag: "Analytics Engine",
    description:
      "Automatic mapping of participant scores against competency matrix standards with diagnostic recommendations and strengths profiling.",
    icon: <IconBrain size={22} className="text-purple-600" />,
    badgeColor: "bg-purple-100 text-purple-800 border-purple-200",
    cardBg: "bg-gradient-to-br from-purple-50/50 via-[#FAF9F6] to-slate-50",
    colSpan: "col-span-1 md:col-span-2",
    element: (
      <div className="mt-4 space-y-2">
        <div className="flex justify-between text-xs font-semibold text-slate-700">
          <span>Digital Governance</span>
          <span className="text-purple-700">92%</span>
        </div>
        <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
          <div className="bg-purple-600 h-full rounded-full w-[92%]"></div>
        </div>
      </div>
    ),
  },
  {
    title: "Cryptographic QR Certificates",
    tag: "Instant Verification",
    description:
      "Automated PDF credentials equipped with verifiable public hash strings, tamper-evident seals, and instant one-click validation.",
    icon: <IconCertificate size={22} className="text-amber-600" />,
    badgeColor: "bg-amber-100 text-amber-800 border-amber-200",
    cardBg: "bg-gradient-to-br from-amber-50/50 via-[#FAF9F6] to-slate-50",
    colSpan: "col-span-1 md:col-span-2",
    element: (
      <div className="mt-4 flex items-center justify-between p-2.5 rounded-xl bg-amber-500/10 border border-amber-200">
        <span className="text-xs font-mono font-medium text-amber-900">#CAP-2026-CERT-092</span>
        <span className="text-xs font-semibold bg-emerald-600 text-white px-2 py-0.5 rounded-full flex items-center gap-1">
          <IconCheck size={12} /> Verified
        </span>
      </div>
    ),
  },
  {
    title: "Secure Curriculum & Library",
    tag: "Resource Vault",
    description:
      "Central repository for departmental policy briefs, circulars, video lectures, and syllabus slides with authenticated stream downloads.",
    icon: <IconFolder size={22} className="text-teal-600" />,
    badgeColor: "bg-teal-100 text-teal-800 border-teal-200",
    cardBg: "bg-gradient-to-br from-teal-50/50 via-[#FAF9F6] to-slate-50",
    colSpan: "col-span-1 md:col-span-2",
    element: (
      <div className="mt-4 flex items-center justify-between text-xs text-slate-600 p-2.5 rounded-xl bg-teal-900/5 border border-teal-200/60">
        <span className="font-medium text-teal-900 flex items-center gap-1.5">
          <IconLock size={14} className="text-teal-700" /> AES-256 Storage
        </span>
        <span className="font-semibold text-teal-800">48 Resources</span>
      </div>
    ),
  },
];

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export function Features() {
  return (
    <section className="py-20 md:py-28 bg-[#F4F4F5] px-4 sm:px-6 lg:px-8 border-y border-slate-200">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14 md:mb-16">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-200/80 text-slate-800 mb-3">
            <IconSparkles size={14} className="text-amber-600" />
            National Standards Architecture
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
            Core Capabilities
          </h2>
          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Engineered specifically to modernize departmental training, eliminate administrative overhead,
            and enforce verified capacity outcomes.
          </p>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-4 gap-5"
        >
          {features.map((f, i) => (
            <motion.div
              key={i}
              variants={item}
              className={`${f.cardBg} ${f.colSpan} border border-slate-200/90 rounded-2xl p-6 sm:p-7 flex flex-col justify-between hover:shadow-lg hover:border-slate-300 transition-all duration-300 group`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-11 h-11 bg-white rounded-xl shadow-sm border border-slate-200/80 flex items-center justify-center group-hover:scale-105 transition-transform">
                    {f.icon}
                  </div>
                  <span
                    className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${f.badgeColor}`}
                  >
                    {f.tag}
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-2 group-hover:text-slate-800 transition-colors">
                  {f.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                  {f.description}
                </p>
              </div>

              {f.element}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
