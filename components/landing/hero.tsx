"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { IconArrowRight } from "@tabler/icons-react";

export function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center bg-[#FAF9F6] overflow-hidden px-4">
      <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="relative z-10 max-w-4xl mx-auto text-center space-y-8"
      >
        <h1 className="text-5xl md:text-7xl font-bold font-playfair text-slate-900 leading-tight">
          Building Capability. <br className="hidden md:block"/> At Scale.
        </h1>
        
        <p className="text-xl md:text-2xl font-plus-jakarta text-slate-600 max-w-2xl mx-auto">
          A unified platform for organizational training, assessment, and growth.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link href="/trainee/login" className="w-full sm:w-auto">
            <button className="w-full px-8 py-4 rounded-lg bg-gradient-to-b from-slate-200 to-slate-400 text-slate-900 font-semibold shadow-inner border border-slate-500 hover:from-slate-300 hover:to-slate-500 transition-all flex items-center justify-center gap-2">
              Get Started as Trainee <IconArrowRight size={20} />
            </button>
          </Link>
          <Link href="/trainer/signup" className="w-full sm:w-auto">
            <button className="w-full px-8 py-4 rounded-lg bg-slate-900 text-white font-semibold hover:bg-slate-800 transition-colors flex items-center justify-center border border-slate-700">
              Join as Trainer
            </button>
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
