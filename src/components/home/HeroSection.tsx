"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { 
  ArrowRight, 
  Award, 
  Video, 
  WifiOff, 
  Smartphone, 
  Flame 
} from "lucide-react";
import { siteConfig } from "@/lib/site";

// Canvas constants
const PARTICLE_COUNT = 100;
const PALETTE = ["#7f77dd", "#5dcaa5", "#f0997b", "#a89ef5", "#85b7eb"];
const ORB_COLORS = ["#7f77dd", "#5dcaa5", "#f0997b", "#85b7eb"];

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
}

interface Orb {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
}

interface Sparkle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  color: string;
  decay: number;
  shrink: number;
}

export function HeroSection() {
  const heroRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);

  // Stats count-up state
  const [counts, setCounts] = useState<number[]>(siteConfig.stats.map(() => 0));
  
  // Progress bar animation state
  const [progressWidth, setProgressWidth] = useState(0);

  // Mouse tracking state for the loop
  const mouseRef = useRef<{ x: number; y: number; active: boolean }>({
    x: 0,
    y: 0,
    active: false,
  });

  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [studentName, setStudentName] = useState("Sonam Sagar");

  useEffect(() => {
    fetch("/api/profile")
      .then((res) => res.json())
      .then((data) => {
        if (data?.user?.name) {
          setStudentName(data.user.name);
        }
      })
      .catch(() => {});
  }, []);

  const studentInitials = studentName.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) || "SS";

  // 1. Stats count-up: triggered 400ms after mount, runs over ~1800ms
  useEffect(() => {
    const timer = setTimeout(() => {
      const statsTimers = siteConfig.stats.map((stat, index) => {
        const target = parseInt(stat.value.replace(/[^0-9]/g, ""), 10) || 0;
        const startTime = Date.now();
        const duration = 1800;
        
        const interval = setInterval(() => {
          const elapsed = Date.now() - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const current = Math.floor(progress * target);
          
          setCounts((prev) => {
            const next = [...prev];
            next[index] = current;
            return next;
          });
          
          if (progress === 1) {
            clearInterval(interval);
          }
        }, 30);

        return interval;
      });

      return () => {
        statsTimers.forEach((interval) => clearInterval(interval));
      };
    }, 400);

    return () => clearTimeout(timer);
  }, []);

  // 2. Progress bar: triggered 600ms after mount
  useEffect(() => {
    const t = setTimeout(() => setProgressWidth(72), 600);
    return () => clearTimeout(t);
  }, []);

  // 3. Canvas magic particle system
  useEffect(() => {
    const canvas = canvasRef.current;
    const hero = heroRef.current;
    if (!canvas || !hero) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let time = 0;

    // Resize handler using hero dimensions
    const resizeCanvas = () => {
      if (!canvas || !hero) return;
      width = hero.offsetWidth;
      height = hero.offsetHeight;
      canvas.width = width;
      canvas.height = height;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Initialize particles
    const particles: Particle[] = Array.from({ length: PARTICLE_COUNT }).map(() => {
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: -(Math.random() * 0.5 + 0.3), // upward float
        size: Math.random() * 1.6 + 0.4, // size 0.4-2px
        color: PALETTE[Math.floor(Math.random() * PALETTE.length)],
      };
    });

    // Initialize ambient color orbs
    const orbs: Orb[] = ORB_COLORS.map((color) => {
      const radius = Math.random() * 110 + 90; // 90-200px
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.6,
        radius,
        color,
      };
    });

    // Sparkle trail state
    let sparkles: Sparkle[] = [];
    let lastMousePos = { x: 0, y: 0 };

    // Mouse movement handler inside hero element
    const handleMouseMove = (e: MouseEvent) => {
      const rect = hero.getBoundingClientRect();
      const relativeX = e.clientX - rect.left;
      const relativeY = e.clientY - rect.top;

      mouseRef.current = { x: relativeX, y: relativeY, active: true };

      // Sparkle trail spawn on move > 2px
      const dx = relativeX - lastMousePos.x;
      const dy = relativeY - lastMousePos.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist > 2) {
        sparkles.push({
          x: relativeX,
          y: relativeY,
          vx: (Math.random() - 0.5) * 1.0,
          vy: (Math.random() - 0.5) * 0.8 - 0.3,
          size: Math.random() * 4 + 3,
          alpha: 1.0,
          color: PALETTE[Math.floor(Math.random() * PALETTE.length)],
          decay: Math.random() * 0.02 + 0.015,
          shrink: Math.random() * 0.05 + 0.04,
        });
        lastMousePos = { x: relativeX, y: relativeY };
      }
    };

    // Document-level handler to check if cursor is inside bounding rect
    const handleDocumentMouseMove = (e: MouseEvent) => {
      const rect = hero.getBoundingClientRect();
      const isInside = 
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom;

      if (isInside) {
        const relativeX = e.clientX - rect.left;
        const relativeY = e.clientY - rect.top;
        mouseRef.current = { x: relativeX, y: relativeY, active: true };
      } else {
        mouseRef.current.active = false;
      }
    };

    hero.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mousemove", handleDocumentMouseMove);

    // Animation Loop
    const draw = () => {
      time++;
      ctx.clearRect(0, 0, width, height);

      // 1. Draw 4 ambient color orbs
      orbs.forEach((orb) => {
        orb.x += orb.vx;
        orb.y += orb.vy;

        if (orb.x - orb.radius < 0 || orb.x + orb.radius > width) orb.vx *= -1;
        if (orb.y - orb.radius < 0 || orb.y + orb.radius > height) orb.vy *= -1;

        const grad = ctx.createRadialGradient(orb.x, orb.y, 0, orb.x, orb.y, orb.radius);
        grad.addColorStop(0, orb.color + "15");
        grad.addColorStop(1, orb.color + "00");

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(orb.x, orb.y, orb.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      const currentMouse = mouseRef.current;

      // 2. Draw & Update particles
      particles.forEach((p) => {
        p.y += p.vy;
        p.x += p.vx;

        // Mouse repulsion
        if (currentMouse.active) {
          const dx = p.x - currentMouse.x;
          const dy = p.y - currentMouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 100) {
            const force = (100 - dist) / 100;
            const angle = Math.atan2(dy, dx);
            p.x += Math.cos(angle) * force * 3.5;
            p.y += Math.sin(angle) * force * 3.5;
          }
        }

        // Wrap around boundaries
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) {
          p.y = height;
          p.x = Math.random() * width;
        }

        const opacity = 0.35 + Math.abs(Math.sin(time * 0.018 + p.x * 0.05)) * 0.65;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = opacity;
        ctx.fill();
        ctx.globalAlpha = 1.0;
      });

      // 3. Draw constellation lines
      ctx.lineWidth = 0.5;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const pi = particles[i];
          const pj = particles[j];
          const dx = pi.x - pj.x;
          const dy = pi.y - pj.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 80) {
            const lineOpacity = (1 - dist / 80) * 0.15;
            ctx.strokeStyle = `rgba(127, 119, 221, ${lineOpacity})`;
            ctx.beginPath();
            ctx.moveTo(pi.x, pi.y);
            ctx.lineTo(pj.x, pj.y);
            ctx.stroke();
          }
        }
      }

      // 4. Update & Draw Sparkles (cross shape)
      sparkles.forEach((s, index) => {
        s.vy += 0.08;
        s.x += s.vx;
        s.y += s.vy;
        s.alpha -= s.decay;
        s.size -= s.shrink;

        if (s.alpha <= 0 || s.size <= 0) {
          sparkles.splice(index, 1);
          return;
        }

        ctx.strokeStyle = s.color;
        ctx.globalAlpha = s.alpha;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(s.x - s.size, s.y);
        ctx.lineTo(s.x + s.size, s.y);
        ctx.moveTo(s.x, s.y - s.size);
        ctx.lineTo(s.x, s.y + s.size);
        ctx.stroke();
      });
      ctx.globalAlpha = 1.0;

      // 5. Draw Cursor glow dot
      if (currentMouse.active) {
        ctx.strokeStyle = "rgba(127, 119, 221, 0.2)";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(currentMouse.x, currentMouse.y, 12, 0, Math.PI * 2);
        ctx.stroke();

        ctx.fillStyle = "#7f77dd";
        ctx.beginPath();
        ctx.arc(currentMouse.x, currentMouse.y, 4, 0, Math.PI * 2);
        ctx.fill();
      }

      animRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resizeCanvas);
      hero.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mousemove", handleDocumentMouseMove);
    };
  }, []);

  // Helper to format values for count-up
  const formatStatValue = (val: number, originalValue: string) => {
    const isPercentage = originalValue.includes("%");
    const isPlus = originalValue.includes("+");
    
    if (isPercentage) {
      return `${val}%`;
    }
    if (isPlus) {
      return `${val.toLocaleString()}+`;
    }
    return val.toLocaleString();
  };

  // Headline shimmer manipulation
  const headline = siteConfig.hero.headline;
  const targetHighlight = "Scholarship";
  const hasHighlight = headline.includes(targetHighlight);
  const headlineParts = hasHighlight 
    ? headline.split(targetHighlight) 
    : [headline, ""];

  return (
    <section 
      ref={heroRef}
      className="relative overflow-hidden bg-[#08091a] text-slate-100 flex items-center min-h-[85vh]"
    >
      <style jsx global>{`
        @keyframes pulseDot {
          0%, 100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.5);
            opacity: 0.5;
          }
        }
        .animate-pulse-dot {
          animation: pulseDot 2s infinite ease-in-out;
        }
      `}</style>

      {/* Magic Particle Canvas behind hero content */}
      <canvas 
        ref={canvasRef} 
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          zIndex: 0
        }}
      />

      <div className="relative z-10 w-full max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center px-5 py-12 sm:px-8 sm:py-16 lg:px-12 lg:py-20">
          
          {/* LEFT SIDE: Copy & CTA */}
          <div className="space-y-6 md:space-y-8 text-left relative z-[2]">
            
            {/* Animated badge pill */}
            <div className="inline-flex items-center gap-2.5 rounded-full border border-purple-500/25 bg-purple-950/30 px-4 py-2 text-xs md:text-sm font-medium text-purple-300 backdrop-blur-md">
              <span className="h-2 w-2 rounded-full bg-purple-400 animate-pulse-dot" />
              <span>{siteConfig.hero.badgeText || "Modern Learning Platform"}</span>
            </div>

            {/* H1 headline with gradient shimmer animation */}
            <h1 className="text-4xl sm:text-5xl lg:text-[52px] font-bold leading-tight text-white mb-4 tracking-tight">
              {hasHighlight ? (
                <>
                  {headlineParts[0]}
                  <span className="shimmer-text">
                    {targetHighlight}
                  </span>
                  {headlineParts[1]}
                </>
              ) : (
                headline
              )}
            </h1>

            {/* Subheading */}
            <p className="max-w-2xl text-base md:text-lg text-slate-400 leading-relaxed">
              {siteConfig.hero.subheadline}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Link 
                href="/courses" 
                className="bg-[#7f77dd] text-white font-semibold hover:bg-[#6c64ca] rounded-xl px-7 py-4 text-base shadow-[0_0_30px_rgba(127,119,221,0.35)] hover:scale-[1.03] active:scale-[0.97] transition-all duration-300 flex items-center justify-center gap-2 group"
              >
                <span>{siteConfig.hero.ctaPrimary}</span>
                <ArrowRight className="h-5 w-5 transition duration-300 group-hover:translate-x-1" />
              </Link>
              
              <Link 
                href="/register" 
                className="border border-white/10 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white rounded-xl px-7 py-4 text-base backdrop-blur-md hover:scale-[1.03] active:scale-[0.97] transition-all duration-300 text-center"
              >
                {siteConfig.hero.ctaSecondary}
              </Link>
            </div>

            {/* Stats row with count-up animation */}
            <div className="pt-8 border-t border-white/5 flex flex-wrap gap-x-6 gap-y-3 text-left">
              {siteConfig.stats.map((stat, i) => (
                <div key={stat.label} className="min-w-[120px]">
                  <p className="font-display text-2xl sm:text-3xl font-extrabold text-white">
                    {formatStatValue(counts[i], stat.value)}
                  </p>
                  <p className="text-xs md:text-sm text-slate-400 mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT SIDE: Interactive Visual cards */}
          {/* Desktop Version */}
          <div className="hidden lg:flex flex-col gap-3 relative z-[2] overflow-visible">
            
            {/* Floating macOS-style code card */}
            <div className="relative bg-[#10132a] border border-white/10 rounded-2xl p-5 shadow-[0_20px_50px_rgba(0,0,0,0.6)] group overflow-visible flex flex-col gap-4">
              
              {/* macOS traffic light window controls */}
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-rose-500" />
                  <span className="h-3 w-3 rounded-full bg-amber-500" />
                  <span className="h-3 w-3 rounded-full bg-emerald-500" />
                </div>
                
                {/* Live badge */}
                <span className="inline-flex items-center gap-1.5 rounded-full border border-purple-500/35 bg-purple-950/40 px-2.5 py-0.5 text-[10px] font-semibold text-purple-300 backdrop-blur-md">
                  <span className="h-1.5 w-1.5 rounded-full bg-purple-400 animate-pulse-dot" />
                  Tech Mastery Preview
                </span>
              </div>

              {/* Interactive Scholarship Quiz Card */}
              <div className="rounded-xl bg-slate-900/60 p-4 border border-white/10 text-xs text-left relative flex flex-col gap-3 font-sans">
                <div className="flex justify-between items-center text-[10px] text-slate-500 font-mono">
                  <span>EXAM PREPARATION QUIZ</span>
                  <span>SUBJECT: MENTAL ABILITY (MAT)</span>
                </div>
                <div className="font-bold text-slate-200 text-sm">
                  Q: Find the missing number in the series / श्रृंखला में लुप्त संख्या ज्ञात करें:
                  <div className="text-cyan-400 mt-1 font-mono text-base">3, 9, 27, 81, ?</div>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  {[
                    { key: "A", label: "120", isCorrect: false },
                    { key: "B", label: "243", isCorrect: true },
                    { key: "C", label: "162", isCorrect: false },
                    { key: "D", label: "100", isCorrect: false },
                  ].map((opt) => {
                    let btnStyle = "bg-white/5 hover:bg-white/10 text-slate-300 border-white/5";
                    if (selectedAnswer !== null) {
                      if (opt.isCorrect) {
                        btnStyle = "bg-emerald-500/20 text-emerald-300 border-emerald-500/40";
                      } else if (selectedAnswer === opt.key) {
                        btnStyle = "bg-rose-500/20 text-rose-300 border-rose-500/40";
                      }
                    }
                    return (
                      <button
                        key={opt.key}
                        type="button"
                        onClick={() => setSelectedAnswer(opt.key)}
                        className={`px-3 py-2 rounded-lg border text-left font-medium transition duration-200 ${btnStyle}`}
                      >
                        {opt.key}) {opt.label}
                        {selectedAnswer !== null && opt.isCorrect && (
                          <span className="float-right text-emerald-400 font-bold">✓</span>
                        )}
                        {selectedAnswer === opt.key && !opt.isCorrect && (
                          <span className="float-right text-rose-400 font-bold">✗</span>
                        )}
                      </button>
                    );
                  })}
                </div>
                {selectedAnswer !== null && (
                  <p className="text-[10px] text-emerald-400 mt-1 font-semibold animate-pulse">
                    {selectedAnswer === "B" 
                      ? "✓ Correct Answer! Well done! (3 × 3 = 9, 9 × 3 = 27, 27 × 3 = 81, 81 × 3 = 243)" 
                      : "✗ Wrong Answer. Try again! Solution: Every term is multiplied by 3."}
                  </p>
                )}
              </div>

              {/* Feature Pill Grid (2x2) */}
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center gap-2 rounded-xl bg-white/5 border border-white/5 px-3 py-2 text-xs text-slate-300">
                  <Award className="h-4 w-4 text-[#7f77dd] shrink-0" />
                  <span>Scholarships</span>
                </div>
                <div className="flex items-center gap-2 rounded-xl bg-white/5 border border-white/5 px-3 py-2 text-xs text-slate-300">
                  <Video className="h-4 w-4 text-[#7f77dd] shrink-0" />
                  <span>Free Live Classes</span>
                </div>
                <div className="flex items-center gap-2 rounded-xl bg-white/5 border border-white/5 px-3 py-2 text-xs text-slate-300">
                  <WifiOff className="h-4 w-4 text-[#7f77dd] shrink-0" />
                  <span>Offline Study Material</span>
                </div>
                <div className="flex items-center gap-2 rounded-xl bg-white/5 border border-white/5 px-3 py-2 text-xs text-slate-300">
                  <Smartphone className="h-4 w-4 text-[#7f77dd] shrink-0" />
                  <span>Android Mobile App</span>
                </div>
              </div>

              {/* Floating Notification Badges inside code card */}
              {/* Certificate badge — top right of card column */}
              <div style={{
                position: 'absolute', top: '-12px', right: '-12px',
                background: '#10132a',
                border: '0.5px solid rgba(93,202,165,0.35)',
                borderRadius: '10px',
                padding: '8px 14px',
                display: 'flex', alignItems: 'center', gap: '8px',
                fontSize: '12px', color: 'rgba(255,255,255,0.85)',
                animation: 'floatY 4s ease-in-out infinite',
                zIndex: 10, whiteSpace: 'nowrap'
              }}>
                <Award size={15} color="#5dcaa5" /> {siteConfig.hero.floatingBadge1 || "छात्रवृत्ति मिली! 🎉"}
              </div>

              {/* Streak badge — bottom left of card column */}
              <div style={{
                position: 'absolute', bottom: '80px', left: '-12px',
                background: '#10132a',
                border: '0.5px solid rgba(240,153,123,0.35)',
                borderRadius: '10px',
                padding: '8px 14px',
                display: 'flex', alignItems: 'center', gap: '8px',
                fontSize: '12px', color: 'rgba(255,255,255,0.85)',
                animation: 'floatY 4s ease-in-out infinite 0.9s',
                zIndex: 10, whiteSpace: 'nowrap'
              }}>
                <Flame size={14} color="#f0997b" /> {siteConfig.hero.floatingBadge2 || "Navodaya में Selection ✅"}
              </div>
            </div>

            {/* Course progress card */}
            <div className="bg-[#10132a] border border-white/10 rounded-2xl p-4 shadow-[0_15px_35px_rgba(0,0,0,0.5)] flex items-center gap-4">
              <div className="h-10 w-10 rounded-full bg-purple-500 flex items-center justify-center font-bold text-sm text-white shrink-0">
                {studentInitials}
              </div>
              <div className="flex-1 min-w-0 text-left">
                <div className="flex justify-between items-center mb-1.5">
                  <h4 className="text-xs font-semibold text-white truncate">
                    NMMS & Navodaya Mock Test Series
                  </h4>
                  <span className="text-[10px] font-bold text-purple-400">
                    72%
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-black/40 overflow-hidden">
                  <div 
                    style={{ 
                      width: `${progressWidth}%`, 
                      transition: 'width 1.5s cubic-bezier(0.4, 0, 0.2, 1)',
                      height: '4px',
                      borderRadius: '3px',
                      background: 'linear-gradient(90deg, #6350dc, #5dcaa5)'
                    }} 
                  />
                </div>
              </div>
            </div>

          </div>

          {/* Simplified mobile version */}
          <div className="flex lg:hidden flex-col gap-3 relative z-[2]">
            {/* Floating macOS-style code card (without absolute floating badges to avoid screen clipping) */}
            <div className="bg-[#10132a] border border-white/10 rounded-2xl p-5 shadow-[0_20px_50px_rgba(0,0,0,0.6)] flex flex-col gap-4">
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-rose-500" />
                  <span className="h-3 w-3 rounded-full bg-amber-500" />
                  <span className="h-3 w-3 rounded-full bg-emerald-500" />
                </div>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-purple-500/35 bg-purple-950/40 px-2.5 py-0.5 text-[10px] font-semibold text-purple-300">
                  <span className="h-1.5 w-1.5 rounded-full bg-purple-400 animate-pulse-dot" />
                  Scholarship Prep Practice
                </span>
              </div>

              {/* Interactive Scholarship Quiz Card (Mobile) */}
              <div className="rounded-xl bg-slate-900/60 p-4 border border-white/10 text-xs text-left relative flex flex-col gap-3 font-sans">
                <div className="flex justify-between items-center text-[10px] text-slate-500 font-mono">
                  <span>EXAM PREPARATION QUIZ</span>
                </div>
                <div className="font-bold text-slate-200 text-sm">
                  Q: Find the missing number / लुप्त संख्या ज्ञात करें: 3, 9, 27, 81, ?
                </div>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  {[
                    { key: "A", label: "120", isCorrect: false },
                    { key: "B", label: "243", isCorrect: true },
                    { key: "C", label: "162", isCorrect: false },
                    { key: "D", label: "100", isCorrect: false },
                  ].map((opt) => {
                    let btnStyle = "bg-white/5 hover:bg-white/10 text-slate-300 border-white/5";
                    if (selectedAnswer !== null) {
                      if (opt.isCorrect) {
                        btnStyle = "bg-emerald-500/20 text-emerald-300 border-emerald-500/40";
                      } else if (selectedAnswer === opt.key) {
                        btnStyle = "bg-rose-500/20 text-rose-300 border-rose-500/40";
                      }
                    }
                    return (
                      <button
                        key={opt.key + "_mob"}
                        type="button"
                        onClick={() => setSelectedAnswer(opt.key)}
                        className={`px-3 py-2 rounded-lg border text-left font-medium transition duration-200 ${btnStyle}`}
                      >
                        {opt.key}) {opt.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center gap-2 rounded-xl bg-white/5 border border-white/5 px-3 py-2 text-xs text-slate-300">
                  <Award className="h-4 w-4 text-[#7f77dd] shrink-0" />
                  <span>Certifications</span>
                </div>
                <div className="flex items-center gap-2 rounded-xl bg-white/5 border border-white/5 px-3 py-2 text-xs text-slate-300">
                  <Video className="h-4 w-4 text-[#7f77dd] shrink-0" />
                  <span>HD Video Lessons</span>
                </div>
              </div>
            </div>

            {/* Progress card */}
            <div className="bg-[#10132a] border border-white/10 rounded-2xl p-4 shadow-[0_15px_35px_rgba(0,0,0,0.5)] flex items-center gap-4">
              <div className="h-10 w-10 rounded-full bg-purple-500 flex items-center justify-center font-bold text-sm text-white shrink-0">
                {studentInitials}
              </div>
              <div className="flex-1 min-w-0 text-left">
                <div className="flex justify-between items-center mb-1.5">
                  <h4 className="text-xs font-semibold text-white truncate">
                    NMMS & Navodaya Mock Test Series
                  </h4>
                  <span className="text-[10px] font-bold text-purple-400">
                    72%
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-black/40 overflow-hidden">
                  <div 
                    style={{ 
                      width: `${progressWidth}%`, 
                      transition: 'width 1.5s cubic-bezier(0.4, 0, 0.2, 1)',
                      height: '4px',
                      borderRadius: '3px',
                      background: 'linear-gradient(90deg, #6350dc, #5dcaa5)'
                    }} 
                  />
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
