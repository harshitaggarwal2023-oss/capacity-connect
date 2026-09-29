"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { IconMenu2, IconX } from "@tabler/icons-react";
import { cn } from "@/lib/utils";

export const Navbar = ({ children }: { children: React.ReactNode }) => {
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
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={cn(
        "fixed top-0 inset-x-0 z-50 transition-all duration-300",
        scrolled ? "py-2 backdrop-blur-md bg-white/70 shadow-sm border-b border-slate-200/50" : "py-4 bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {children}
      </div>
    </motion.header>
  );
};

export const NavbarLogo = () => (
  <Link href="/" className="flex items-center gap-2">
    <span className="font-bold text-xl tracking-tight text-slate-900">CAPACITY CONNECT</span>
  </Link>
);

export const NavBody = ({ children }: { children: React.ReactNode }) => (
  <div className="hidden md:flex items-center gap-8">{children}</div>
);

export const NavItems = ({ items }: { items: { name: string; link: string }[] }) => (
  <nav className="flex items-center gap-6">
    {items.map((item) => (
      <Link key={item.name} href={item.link} className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
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
      "px-4 py-2 rounded-xl text-sm font-medium transition-colors",
      variant === "primary" ? "bg-[#1a1a1a] text-[#FAF9F6] hover:bg-[#333]" : "bg-slate-100 text-slate-900 hover:bg-slate-200"
    )}
  >
    {children}
  </button>
);

export const MobileNav = ({ children }: { children: React.ReactNode }) => {
  return <div className="md:hidden flex items-center">{children}</div>;
};

export const MobileNavToggle = ({ isOpen, toggle }: { isOpen: boolean; toggle: () => void }) => (
  <button onClick={toggle} className="p-2 -mr-2 text-slate-600 hover:text-slate-900">
    {isOpen ? <IconX className="w-6 h-6" /> : <IconMenu2 className="w-6 h-6" />}
  </button>
);

export const MobileNavHeader = ({ children }: { children: React.ReactNode }) => <>{children}</>;

export const MobileNavMenu = ({ isOpen, items, onClose }: { isOpen: boolean; items: { name: string; link: string }[]; onClose: () => void }) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: "auto" }}
        exit={{ opacity: 0, height: 0 }}
        className="absolute top-full left-0 right-0 bg-white border-b border-slate-200 shadow-lg overflow-hidden md:hidden"
      >
        <div className="px-4 py-6 space-y-4 flex flex-col">
          {items.map((item) => (
            <Link
              key={item.name}
              href={item.link}
              onClick={onClose}
              className="text-base font-medium text-slate-600 hover:text-slate-900 p-2 rounded-lg hover:bg-slate-50"
            >
              {item.name}
            </Link>
          ))}
        </div>
      </motion.div>
    )}
  </AnimatePresence>
);
