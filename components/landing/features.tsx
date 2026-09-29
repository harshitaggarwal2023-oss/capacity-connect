"use client";

import { motion } from "framer-motion";
import { IconUsers, IconClipboard, IconMessage, IconBrain, IconCertificate, IconFolder } from "@tabler/icons-react";

const features = [
  { title: "Role-Based Portals", icon: <IconUsers size={24} />, colSpan: "col-span-1 md:col-span-2", rowSpan: "row-span-1" },
  { title: "Timed MCQ Assessments", icon: <IconClipboard size={24} />, colSpan: "col-span-1 md:col-span-1", rowSpan: "row-span-2" },
  { title: "Real-time Messaging", icon: <IconMessage size={24} />, colSpan: "col-span-1 md:col-span-1", rowSpan: "row-span-1" },
  { title: "AI Competency Mapping", icon: <IconBrain size={24} />, colSpan: "col-span-1 md:col-span-2", rowSpan: "row-span-1", hasShadow: true },
  { title: "Automated Certificates", icon: <IconCertificate size={24} />, colSpan: "col-span-1 md:col-span-1", rowSpan: "row-span-1" },
  { title: "Secure File Library", icon: <IconFolder size={24} />, colSpan: "col-span-1 md:col-span-2", rowSpan: "row-span-1" },
];

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export function Features() {
  return (
    <section className="py-24 bg-[#F4F4F5] px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-4">Core Capabilities</h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">Everything you need to run large scale assessments and training programs.</p>
        </div>
        
        <motion.div 
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-4 gap-4 auto-rows-[200px]"
        >
          {features.map((f, i) => (
            <motion.div 
              key={i} 
              variants={item}
              className={`bg-[#FAF9F6] border border-slate-200 rounded-2xl p-8 flex flex-col justify-end ${f.colSpan} ${f.rowSpan} ${f.hasShadow ? 'shadow-xl' : ''}`}
            >
              <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center text-slate-700 mb-auto">
                {f.icon}
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mt-4">{f.title}</h3>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
