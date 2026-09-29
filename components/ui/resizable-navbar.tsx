"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { IconMenu2, IconX, IconShieldCheck } from "@tabler/icons-react";
import { cn } from "@/lib/utils";

export const Navbar = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={cn(
        "fixed top-3 md:top-4 inset-x-0 mx-auto z-50 w-[95%] max-w-6xl transition-all duration-300",
        className
      )}
    >
      <div
        className={cn(
          "rounded-full px-4 sm:px-6 py-2.5 flex items-center justify-between transition-all duration-300",
          scrolled
            ? "bg-[#FAF9F6]/90 backdrop-blur-xl border border-slate-300/80 shadow-[0_8px_30px_rgb(0,0,0,0.1)] py-2"
            : "bg-[#FAF9F6]/80 backdrop-blur-md border border-slate-200/80 shadow-[0_4px_20px_rgb(0,0,0,0.05)]"
        )}
      >
        {children}
      </div>
    </motion.header>
  );
};

export const NavbarLogo = ({
  subtitle,
}: {
  subtitle?: string;
}) => (
  <Link href="/" className="flex items-center gap-2.5 group">
    <div className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform">
      <IconShieldCheck size={18} className="text-emerald-400" />
    </div>
    <div className="flex flex-col">
      <span className="font-bold text-base sm:text-lg tracking-tight text-slate-900 group-hover:text-slate-800 transition-colors leading-tight">
        CAPACITY CONNECT
      </span>
      {subtitle && (
        <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-500">
          {subtitle}
        </span>
      )}
    </div>
  </Link>
);

export const NavBody = ({ children }: { children: React.ReactNode }) => (
  <div className="hidden md:flex items-center gap-6">{children}</div>
);

export const NavItems = ({
  items,
}: {
  items: { name: string; link: string; active?: boolean }[];
}) => (
  <nav className="flex items-center gap-1 sm:gap-2">
    {items.map((item) => (
      <Link
        key={item.name}
        href={item.link}
        className={cn(
          "px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all duration-200",
          item.active
            ? "bg-slate-900 text-white shadow-sm"
            : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/70"
        )}
      >
        {item.name}
      </Link>
    ))}
  </nav>
);

export const NavbarButton = ({
  children,
  variant = "primary",
  onClick,
}: {
  children: React.ReactNode;
  variant?: "primary" | "secondary";
  onClick?: () => void;
}) => (
  <button
    onClick={onClick}
    className={cn(
      "px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 shadow-sm",
      variant === "primary"
        ? "bg-slate-900 text-white hover:bg-slate-800 hover:shadow"
        : "bg-slate-100 text-slate-800 hover:bg-slate-200/80 border border-slate-200/60"
    )}
  >
    {children}
  </button>
);

export const MobileNav = ({ children }: { children: React.ReactNode }) => {
  return <div className="md:hidden flex items-center gap-2">{children}</div>;
};

export const MobileNavToggle = ({
  isOpen,
  toggle,
}: {
  isOpen: boolean;
  toggle: () => void;
}) => (
  <button
    onClick={toggle}
    className="p-1.5 rounded-full text-slate-700 hover:bg-slate-100 transition-colors focus:outline-none"
    aria-label="Toggle navigation menu"
  >
    {isOpen ? <IconX className="w-5 h-5" /> : <IconMenu2 className="w-5 h-5" />}
  </button>
);

export const MobileNavHeader = ({ children }: { children: React.ReactNode }) => (
  <>{children}</>
);

export const MobileNavMenu = ({
  isOpen,
  items,
  onClose,
}: {
  isOpen: boolean;
  items: { name: string; link: string }[];
  onClose: () => void;
}) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div
        initial={{ opacity: 0, y: -10, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -10, scale: 0.98 }}
        transition={{ duration: 0.2 }}
        className="fixed top-16 inset-x-4 max-w-sm mx-auto bg-[#FAF9F6]/95 backdrop-blur-2xl border border-slate-200/90 shadow-2xl rounded-2xl p-4 z-50 md:hidden"
      >
        <div className="space-y-1 flex flex-col">
          {items.map((item) => (
            <Link
              key={item.name}
              href={item.link}
              onClick={onClose}
              className="text-sm font-medium text-slate-700 hover:text-slate-900 px-3 py-2.5 rounded-xl hover:bg-slate-100/80 transition-colors"
            >
              {item.name}
            </Link>
          ))}
        </div>
      </motion.div>
    )}
  </AnimatePresence>
);
