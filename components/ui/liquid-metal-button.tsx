"use client";

import { liquidMetalFragmentShader, ShaderMount } from "@paper-design/shaders";
import { IconSparkles } from "@tabler/icons-react";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface LiquidMetalButtonProps {
  label?: string;
  onClick?: () => void;
  viewMode?: "text" | "icon";
  className?: string;
}

export function LiquidMetalButton({ 
  label = "Get Started", 
  onClick, 
  viewMode = "text",
  className = "" 
}: LiquidMetalButtonProps) {
  const [isHovered, setIsHovered] = useState(false);
  const mountRef = useRef<HTMLDivElement>(null);
  const [shader, setShader] = useState<any>(null);

  useEffect(() => {
    if (!mountRef.current) return;
    
    // We try to mount the shader on the ref
    const shaderInstance = new ShaderMount(mountRef.current, {
      fragmentShader: liquidMetalFragmentShader,
      uniforms: {
        u_time: { value: 0 },
        u_intensity: { value: 0.1 },
        u_color1: { value: [0.95, 0.95, 0.96] }, // Light silver/metal
        u_color2: { value: [0.8, 0.8, 0.85] }
      }
    });

    setShader(shaderInstance);

    return () => {
      shaderInstance.destroy();
    };
  }, []);

  useEffect(() => {
    if (!shader) return;
    // Animate intensity based on hover
    if (isHovered) {
      shader.uniforms.u_intensity.value = 0.8;
    } else {
      shader.uniforms.u_intensity.value = 0.2;
    }
  }, [isHovered, shader]);

  const [ripples, setRipples] = useState<{id: number, x: number, y: number}[]>([]);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setRipples(prev => [...prev, { id: Date.now(), x, y }]);
    
    setTimeout(() => {
      setRipples(prev => prev.slice(1));
    }, 1000);

    if (onClick) onClick();
  };

  return (
    <button
      className={`relative overflow-hidden rounded-2xl flex items-center justify-center transition-all shadow-sm border border-slate-200/50 group ${
        viewMode === "icon" ? "w-12 h-12" : "px-6 py-3 min-w-[140px]"
      } ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
    >
      {/* Shader Background */}
      <div 
        ref={mountRef} 
        className="absolute inset-0 z-0 pointer-events-none opacity-80"
      />
      
      {/* Ripple Effect */}
      <AnimatePresence>
        {ripples.map(ripple => (
          <motion.span
            key={ripple.id}
            initial={{ scale: 0, opacity: 0.5 }}
            animate={{ scale: 20, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="absolute bg-white/40 rounded-full pointer-events-none"
            style={{ 
              left: ripple.x, 
              top: ripple.y,
              width: 10,
              height: 10,
              transform: 'translate(-50%, -50%)'
            }}
          />
        ))}
      </AnimatePresence>

      {/* Content */}
      <div className="relative z-10 flex items-center justify-center gap-2 text-slate-800 font-medium">
        {viewMode === "icon" ? (
          <IconSparkles className={`w-5 h-5 transition-transform duration-300 ${isHovered ? "rotate-12 scale-110" : ""}`} />
        ) : (
          <>
            <span>{label}</span>
            <IconSparkles className={`w-4 h-4 transition-transform duration-300 ${isHovered ? "rotate-12 scale-110" : ""}`} />
          </>
        )}
      </div>
    </button>
  );
}
