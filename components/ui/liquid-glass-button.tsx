"use client";

import React, { useRef, useState } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const metalButtonVariants = cva(
  "relative inline-flex items-center justify-center overflow-hidden font-medium transition-all focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none rounded-xl shadow-sm",
  {
    variants: {
      variant: {
        default: "bg-gradient-to-b from-slate-100 to-slate-200 border border-slate-300 text-slate-800 hover:from-slate-200 hover:to-slate-300",
        success: "bg-gradient-to-b from-green-400 to-green-500 border border-green-600 text-white hover:from-green-500 hover:to-green-600 shadow-green-500/20",
        error: "bg-gradient-to-b from-red-400 to-red-500 border border-red-600 text-white hover:from-red-500 hover:to-red-600 shadow-red-500/20",
        gold: "bg-gradient-to-b from-yellow-300 to-yellow-500 border border-yellow-600 text-yellow-950 hover:from-yellow-400 hover:to-yellow-600 shadow-yellow-500/20",
        bronze: "bg-gradient-to-b from-orange-300 to-orange-500 border border-orange-600 text-orange-950 hover:from-orange-400 hover:to-orange-600 shadow-orange-500/20",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-lg px-3 text-sm",
        lg: "h-12 rounded-xl px-8 text-lg",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface MetalButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof metalButtonVariants> {}

export const MetalButton = React.forwardRef<HTMLButtonElement, MetalButtonProps>(
  ({ className, variant, size, children, onClick, ...props }, ref) => {
    const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      setRipples((prev) => [...prev, { id: Date.now(), x, y }]);
      setTimeout(() => {
        setRipples((prev) => prev.slice(1));
      }, 600);

      if (onClick) onClick(e);
    };

    return (
      <button
        ref={ref}
        className={cn(metalButtonVariants({ variant, size, className }))}
        onClick={handleClick}
        {...props}
      >
        <div className="absolute inset-0 bg-[\#FAF9F6]/20 opacity-0 hover:opacity-100 transition-opacity" />
        <AnimatePresence>
          {ripples.map((ripple) => (
            <motion.span
              key={ripple.id}
              initial={{ scale: 0, opacity: 0.5 }}
              animate={{ scale: 15, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="absolute bg-[\#FAF9F6]/40 rounded-full pointer-events-none"
              style={{
                left: ripple.x,
                top: ripple.y,
                width: 20,
                height: 20,
                transform: "translate(-50%, -50%)",
              }}
            />
          ))}
        </AnimatePresence>
        <span className="relative z-10 flex items-center justify-center gap-2">{children}</span>
      </button>
    );
  }
);
MetalButton.displayName = "MetalButton";

export interface LiquidButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  glassColor?: string;
}

export const LiquidButton = React.forwardRef<HTMLButtonElement, LiquidButtonProps>(
  ({ className, children, glassColor = "rgba(255, 255, 255, 0.2)", onClick, ...props }, ref) => {
    const filterId = useRef(`liquid-glass-filter-${Math.random().toString(36).substr(2, 9)}`);
    const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      setRipples((prev) => [...prev, { id: Date.now(), x, y }]);
      setTimeout(() => {
        setRipples((prev) => prev.slice(1));
      }, 800);

      if (onClick) onClick(e);
    };

    return (
      <>
        <svg className="hidden">
          <defs>
            <filter id={filterId.current}>
              <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="3" result="noise" />
              <feDisplacementMap in="SourceGraphic" in2="noise" scale="5" xChannelSelector="R" yChannelSelector="G" />
            </filter>
          </defs>
        </svg>

        <button
          ref={ref}
          className={cn(
            "relative inline-flex items-center justify-center overflow-hidden rounded-2xl px-6 py-3 font-medium text-slate-800 transition-transform hover:scale-105 active:scale-95 border border-white/40 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] backdrop-blur-md",
            className
          )}
          style={{ background: glassColor }}
          onClick={handleClick}
          {...props}
        >
          <div 
            className="absolute inset-0 z-0 opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none"
            style={{ filter: `url(#${filterId.current})`, background: "linear-gradient(120deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.5) 50%, rgba(255,255,255,0) 100%)" }} 
          />
          
          <AnimatePresence>
            {ripples.map((ripple) => (
              <motion.span
                key={ripple.id}
                initial={{ scale: 0, opacity: 0.8 }}
                animate={{ scale: 20, opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="absolute bg-[\#FAF9F6]/40 rounded-full pointer-events-none z-0"
                style={{
                  left: ripple.x,
                  top: ripple.y,
                  width: 10,
                  height: 10,
                  transform: "translate(-50%, -50%)",
                }}
              />
            ))}
          </AnimatePresence>

          <span className="relative z-10">{children}</span>
        </button>
      </>
    );
  }
);
LiquidButton.displayName = "LiquidButton";
