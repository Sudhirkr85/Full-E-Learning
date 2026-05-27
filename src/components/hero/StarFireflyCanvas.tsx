"use client";

import React, { useEffect, useRef, useState } from "react";

interface StarOptions {
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  baseR: number;
  r: number;
  type: "circle" | "cross";
  twinkleSpeed: number;
  twinkleOffset: number;
  baseAlpha: number;
  alpha: number;
  vx: number;
  vy: number;
  cr: number;
  cg: number;
  cb: number;
}

interface FireflyOptions {
  x: number;
  y: number;
  r: number;
  vx: number;
  vy: number;
  cr: number;
  cg: number;
  cb: number;
  trail: { x: number; y: number }[];
}

interface StarFireflyCanvasProps {
  className?: string;
}

export function StarFireflyCanvas({ className }: StarFireflyCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0, isInside: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const parent = canvas.parentElement;
    if (!parent) return;

    let stars: StarOptions[] = [];
    let fireflies: FireflyOptions[] = [];
    let animationFrameId: number;
    let lastWidthCategory = "";

    // Parse specific design colors into RGB buckets
    const starColors = [
      { r: 220, g: 220, b: 255 }, // White (#DCDCFF)
      { r: 175, g: 169, b: 236 }, // Purple (#AFA9EC)
      { r: 255, g: 245, b: 200 }, // Warm Yellow (#FFF5C8)
      { r: 180, g: 232, b: 255 }, // Icy Blue (#B4E8FF)
    ];

    const fireflyColors = [
      { r: 127, g: 119, b: 221 }, // #7F77DD
      { r: 143, g: 135, b: 237 }, // #8F87ED
      { r: 175, g: 169, b: 236 }, // #AFA9EC
    ];

    // Determine current viewport category to optimize arrays regeneration
    const getViewportCategory = (width: number) => {
      if (width < 640) return "mobile";
      if (width < 1024) return "tablet";
      return "desktop";
    };

    // Initialization loop
    const initializeParticles = (w: number, h: number, starCount: number, fireflyCount: number) => {
      stars = [];
      fireflies = [];

      // Generate stars
      for (let i = 0; i < starCount; i++) {
        const x = Math.random() * w;
        const y = Math.random() * h;
        const isCross = Math.random() < 0.3; // 30% sparkle, 70% dot
        const baseR = isCross ? 0.8 + Math.random() * 1.0 : 0.3 + Math.random() * 0.7;
        const baseAlpha = 0.2 + Math.random() * 0.6;
        const color = starColors[Math.floor(Math.random() * starColors.length)];

        stars.push({
          x,
          y,
          baseX: x,
          baseY: y,
          baseR,
          r: baseR,
          type: isCross ? "cross" : "circle",
          twinkleSpeed: 0.01 + Math.random() * 0.03,
          twinkleOffset: Math.random() * Math.PI * 2,
          baseAlpha,
          alpha: baseAlpha,
          vx: 0,
          vy: 0,
          cr: color.r,
          cg: color.g,
          cb: color.b,
        });
      }

      // Generate fireflies
      for (let i = 0; i < fireflyCount; i++) {
        const color = fireflyColors[Math.floor(Math.random() * fireflyColors.length)];
        fireflies.push({
          x: Math.random() * w,
          y: Math.random() * h,
          r: 1.2 + Math.random() * 2.5,
          vx: (Math.random() - 0.5) * 1.5,
          vy: (Math.random() - 0.5) * 1.5,
          cr: color.r,
          cg: color.g,
          cb: color.b,
          trail: [],
        });
      }
    };

    // Handle resizing & breakpoints
    const handleResize = () => {
      const w = canvas.width = parent.clientWidth;
      const h = canvas.height = parent.clientHeight;
      
      const width = window.innerWidth;
      const currentCategory = getViewportCategory(width);

      let starCount = 110;
      let fireflyCount = 22;

      if (currentCategory === "mobile") {
        starCount = 60;
        fireflyCount = 10;
      } else if (currentCategory === "tablet") {
        starCount = 80;
        fireflyCount = 16;
      }

      // Only regenerate particles if moving between breakpoints (prevents jumpy resize resets)
      if (currentCategory !== lastWidthCategory || stars.length === 0) {
        initializeParticles(w, h, starCount, fireflyCount);
        lastWidthCategory = currentCategory;
      }
    };

    // First resize trigger
    handleResize();
    window.addEventListener("resize", handleResize);

    // parent-bound cursor movements to respect pointer-events: none
    const handleMouseMove = (e: MouseEvent) => {
      const rect = parent.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      mouseRef.current = { x, y, isInside: true };
    };

    const handleMouseEnter = () => {
      mouseRef.current.isInside = true;
    };

    const handleMouseLeave = () => {
      mouseRef.current.isInside = false;
    };

    // Click effect shockwave blast
    const handleMouseDown = (e: MouseEvent) => {
      const rect = parent.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;

      fireflies.forEach((firefly) => {
        const dx = clickX - firefly.x;
        const dy = clickY - firefly.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 220 && dist > 0.1) {
          const force = (220 - dist) / 220;
          // powerful outward shockwave velocity vector
          firefly.vx -= (dx / dist) * force * 16;
          firefly.vy -= (dy / dist) * force * 16;
        }
      });
    };

    parent.addEventListener("mousemove", handleMouseMove);
    parent.addEventListener("mouseenter", handleMouseEnter);
    parent.addEventListener("mouseleave", handleMouseLeave);
    parent.addEventListener("mousedown", handleMouseDown);

    // Hide default cursor inside hero div only (dynamically injected for ease)
    parent.style.cursor = "none";

    // Main animation 60fps render loop
    const render = () => {
      const W = canvas.width;
      const H = canvas.height;
      const mouse = mouseRef.current;
      const isMobile = window.innerWidth < 640;
      const maxTrail = isMobile ? 8 : 14;

      ctx.clearRect(0, 0, W, H);

      // --- 1. DRAW STARS ---
      stars.forEach((star) => {
        // Twinkle factor calculations
        star.twinkleOffset += star.twinkleSpeed;
        const twinkleFactor = Math.sin(star.twinkleOffset);
        star.alpha = Math.max(0.1, Math.min(1.0, star.baseAlpha + twinkleFactor * 0.25));
        star.r = Math.max(0.2, star.baseR + twinkleFactor * 0.15);

        let isAttracted = false;

        // Cursor attraction & repulsion physics
        if (mouse.isInside) {
          const dx = mouse.x - star.x;
          const dy = mouse.y - star.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 140 && dist >= 40) {
            const force = (140 - dist) / 140;
            star.vx += (dx / dist) * force * 0.15;
            star.vy += (dy / dist) * force * 0.15;
            isAttracted = true;
          } else if (dist < 40 && dist > 0.1) {
            const force = (40 - dist) / 40;
            star.vx -= (dx / dist) * force * 0.8;
            star.vy -= (dy / dist) * force * 0.8;
          }
        }

        // Return home spring vector force
        const dxHome = star.baseX - star.x;
        const dyHome = star.baseY - star.y;
        star.vx += dxHome * 0.015;
        star.vy += dyHome * 0.015;

        // Friction dampening
        star.vx *= 0.94;
        star.vy *= 0.94;

        // Position shifts
        star.x += star.vx;
        star.y += star.vy;

        // Rendering steps
        ctx.shadowBlur = 0;
        if (isAttracted) {
          ctx.shadowBlur = 10;
          ctx.shadowColor = `rgba(${star.cr}, ${star.cg}, ${star.cb}, ${star.alpha})`;
        }

        ctx.fillStyle = `rgba(${star.cr}, ${star.cg}, ${star.cb}, ${star.alpha})`;
        ctx.strokeStyle = `rgba(${star.cr}, ${star.cg}, ${star.cb}, ${star.alpha})`;

        if (star.type === "cross") {
          // 4-point sparkle cross
          ctx.lineWidth = 0.6;
          ctx.beginPath();
          ctx.moveTo(star.x - star.r * 2.5, star.y);
          ctx.lineTo(star.x + star.r * 2.5, star.y);
          ctx.moveTo(star.x, star.y - star.r * 2.5);
          ctx.lineTo(star.x, star.y + star.r * 2.5);
          ctx.stroke();

          // tiny solid core center
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.r * 0.5, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // standard dot star
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
          ctx.fill();
        }

        // Draw soft outer halo (3x radius, 15% alpha)
        ctx.shadowBlur = 0;
        ctx.fillStyle = `rgba(${star.cr}, ${star.cg}, ${star.cb}, ${star.alpha} * 0.15)`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.r * 3, 0, Math.PI * 2);
        ctx.fill();
      });

      // --- 2. DRAW FIREFLIES ---
      fireflies.forEach((firefly) => {
        // float nudge velocity updates
        firefly.vx += (Math.random() - 0.5) * 0.12;
        firefly.vy += (Math.random() - 0.5) * 0.12;

        // Cursor attraction & repulsion
        if (mouse.isInside) {
          const dx = mouse.x - firefly.x;
          const dy = mouse.y - firefly.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 150 && dist >= 50) {
            const force = (150 - dist) / 150;
            firefly.vx += (dx / dist) * force * 0.12;
            firefly.vy += (dy / dist) * force * 0.12;
          } else if (dist < 50 && dist > 0.1) {
            const force = (50 - dist) / 50;
            firefly.vx -= (dx / dist) * force * 0.65;
            firefly.vy -= (dy / dist) * force * 0.65;
          }
        }

        // Friction dampening
        firefly.vx *= 0.95;
        firefly.vy *= 0.95;

        // Position updates
        firefly.x += firefly.vx;
        firefly.y += firefly.vy;

        // screen boundary wraps
        if (firefly.x < 0) { firefly.x = 0; firefly.vx *= -1; }
        if (firefly.x > W) { firefly.x = W; firefly.vx *= -1; }
        if (firefly.y < 0) { firefly.y = 0; firefly.vy *= -1; }
        if (firefly.y > H) { firefly.y = H; firefly.vy *= -1; }

        // append trail
        firefly.trail.push({ x: firefly.x, y: firefly.y });
        if (firefly.trail.length > maxTrail) {
          firefly.trail.shift();
        }

        // draw trail elements
        firefly.trail.forEach((pos, idx) => {
          const ratio = idx / firefly.trail.length;
          const alpha = ratio * 0.35;
          const size = ratio * firefly.r;
          ctx.shadowBlur = 0;
          ctx.fillStyle = `rgba(${firefly.cr}, ${firefly.cg}, ${firefly.cb}, ${alpha})`;
          ctx.beginPath();
          ctx.arc(pos.x, pos.y, size, 0, Math.PI * 2);
          ctx.fill();
        });

        // draw core firefly
        ctx.shadowBlur = 14;
        ctx.shadowColor = `rgb(${firefly.cr}, ${firefly.cg}, ${firefly.cb})`;
        ctx.fillStyle = `rgba(${firefly.cr}, ${firefly.cg}, ${firefly.cb}, 0.9)`;
        ctx.beginPath();
        ctx.arc(firefly.x, firefly.y, firefly.r, 0, Math.PI * 2);
        ctx.fill();

        // draw soft outer halo
        ctx.shadowBlur = 0;
        ctx.fillStyle = `rgba(${firefly.cr}, ${firefly.cg}, ${firefly.cb}, 0.20)`;
        ctx.beginPath();
        ctx.arc(firefly.x, firefly.y, firefly.r * 3, 0, Math.PI * 2);
        ctx.fill();
      });

      // --- 3. DRAW CUSTOM CURSOR (Desktop only) ---
      if (!isMobile && mouse.isInside) {
        ctx.shadowBlur = 8;
        ctx.shadowColor = "rgba(127, 119, 221, 0.8)";
        ctx.strokeStyle = "#AFA9EC";
        ctx.fillStyle = "rgba(127, 119, 221, 0.25)";
        ctx.lineWidth = 1.5;
        
        ctx.beginPath();
        ctx.moveTo(mouse.x, mouse.y);
        ctx.lineTo(mouse.x + 10, mouse.y + 17);
        ctx.lineTo(mouse.x + 3, mouse.y + 13);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        
        ctx.shadowBlur = 0;
      }

      animationFrameId = requestAnimationFrame(render);
    };

    // run loop
    render();

    // Cleanup events on unmount to prevent leaks
    return () => {
      window.removeEventListener("resize", handleResize);
      parent.removeEventListener("mousemove", handleMouseMove);
      parent.removeEventListener("mouseenter", handleMouseEnter);
      parent.removeEventListener("mouseleave", handleMouseLeave);
      parent.removeEventListener("mousedown", handleMouseDown);
      parent.style.cursor = "default";
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ display: "block" }}
    />
  );
}
