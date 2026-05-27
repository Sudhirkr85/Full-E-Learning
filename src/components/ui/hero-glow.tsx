"use client";

import React, { useEffect, useState, useRef } from "react";

export function HeroGlow() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [glowPos, setGlowPos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initial center position in case mouse is off-screen
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const initialPos = { x: rect.width / 2, y: rect.height / 2 };
      setMousePos(initialPos);
      setGlowPos(initialPos);
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      // Ensure hover state turns on
      setIsHovered(true);
      setMousePos({ x, y });
    };

    const handleMouseLeave = () => {
      setIsHovered(false);
    };

    const handleMouseEnter = () => {
      setIsHovered(true);
    };

    window.addEventListener("mousemove", handleMouseMove);
    const container = containerRef.current;
    if (container) {
      container.addEventListener("mouseleave", handleMouseLeave);
      container.addEventListener("mouseenter", handleMouseEnter);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (container) {
        container.removeEventListener("mouseleave", handleMouseLeave);
        container.removeEventListener("mouseenter", handleMouseEnter);
      }
    };
  }, []);

  // Smooth ease-out interpolation (Spring dynamics for premium lag)
  useEffect(() => {
    let animationFrameId: number;

    const updateGlow = () => {
      setGlowPos((current) => {
        const dx = mousePos.x - current.x;
        const dy = mousePos.y - current.y;
        
        // Easing factor (0.06 creates a highly fluid, elegant trailing drift)
        return {
          x: current.x + dx * 0.06,
          y: current.y + dy * 0.06,
        };
      });
      animationFrameId = requestAnimationFrame(updateGlow);
    };

    animationFrameId = requestAnimationFrame(updateGlow);
    return () => cancelAnimationFrame(animationFrameId);
  }, [mousePos]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 overflow-hidden pointer-events-none -z-10"
    >
      {/* 1. Drift glow circle */}
      <div
        className="absolute h-[600px] w-[600px] rounded-full bg-gradient-to-br from-indigo-500/10 via-[#8b5cf6]/5 to-transparent blur-[130px] transition-opacity duration-1000 will-change-transform"
        style={{
          transform: `translate3d(${glowPos.x - 300}px, ${glowPos.y - 300}px, 0)`,
          opacity: isHovered ? 1 : 0.4,
        }}
      />

      {/* 2. Secondary cyber cyan streak follow accent */}
      <div
        className="absolute h-[2px] w-[180px] bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent blur-[2px] transition-opacity duration-1000 will-change-transform"
        style={{
          transform: `translate3d(${glowPos.x - 90}px, ${glowPos.y - 150}px, 0)`,
          opacity: isHovered ? 1 : 0,
        }}
      />
    </div>
  );
}
