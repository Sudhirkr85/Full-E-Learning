"use client";

import React, { useEffect, useRef, useState } from "react";
import { Loader2, RotateCw } from "lucide-react";
import { cn } from "@/lib/utils";

type CustomYoutubePlayerProps = {
  videoId: string;
  title?: string;
};

export function CustomYoutubePlayer({ videoId, title }: CustomYoutubePlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<HTMLDivElement>(null);
  const plyrInstanceRef = useRef<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLandscape, setIsLandscape] = useState(false);
  const [showRotateBtn, setShowRotateBtn] = useState(false);

  useEffect(() => {
    // Show rotation controls on all mobile viewports (managed natively by md:hidden CSS)
    if (typeof window !== "undefined") {
      setShowRotateBtn(true);
    }

    const handleFullscreenChange = () => {
      if (document.fullscreenElement === null && (document as any).webkitFullscreenElement === null) {
        if (screen.orientation && screen.orientation.unlock) {
          try {
            screen.orientation.unlock();
          } catch (e) {}
        }
        setIsLandscape(false);
      }
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
    document.addEventListener("mozfullscreenchange", handleFullscreenChange);
    document.addEventListener("MSFullscreenChange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener("webkitfullscreenchange", handleFullscreenChange);
      document.removeEventListener("mozfullscreenchange", handleFullscreenChange);
      document.removeEventListener("MSFullscreenChange", handleFullscreenChange);
    };
  }, []);

  const toggleOrientation = async () => {
    if (typeof window === "undefined") return;
    
    const container = containerRef.current;
    if (!container) return;

    try {
      if (!isLandscape) {
        // Try to enter native Fullscreen first if supported
        if (document.fullscreenElement === null && (document as any).webkitFullscreenElement === null) {
          try {
            if (container.requestFullscreen) {
              await container.requestFullscreen();
            } else if ((container as any).webkitRequestFullscreen) {
              await (container as any).webkitRequestFullscreen();
            }
          } catch (fsErr) {
            console.log("Native browser fullscreen request skipped or not supported (iOS):", fsErr);
          }
        }
        
        // Lock Orientation programmatically if supported
        if (screen.orientation && (screen.orientation as any).lock) {
          try {
            await (screen.orientation as any).lock("landscape");
          } catch (orientErr) {
            console.log("Device orientation lock skipped:", orientErr);
          }
        }
        
        // Trigger landscape orientation state (which applies the visual CSS rotation fallback)
        setIsLandscape(true);
      } else {
        // Unlock orientation
        if (screen.orientation && screen.orientation.unlock) {
          try {
            screen.orientation.unlock();
          } catch (e) {}
        }
        setIsLandscape(false);

        // Exit fullscreen if active
        if (document.fullscreenElement !== null || (document as any).webkitFullscreenElement !== null) {
          try {
            if (document.exitFullscreen) {
              await document.exitFullscreen();
            } else if ((document as any).webkitExitFullscreen) {
              await (document as any).webkitExitFullscreen();
            }
          } catch (exitErr) {
            console.log("Exit fullscreen error skipped:", exitErr);
          }
        }
      }
    } catch (err) {
      console.log("Orientation toggle error:", err);
    }
  };

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Load stylesheet dynamically
    if (!document.getElementById("plyr-css")) {
      const link = document.createElement("link");
      link.id = "plyr-css";
      link.rel = "stylesheet";
      link.href = "https://cdn.plyr.io/3.7.8/plyr.css";
      document.head.appendChild(link);
    }

    // Custom dark-mode styles overriding default Plyr values + landscape visual fallback style
    if (!document.getElementById("plyr-custom-theme")) {
      const style = document.createElement("style");
      style.id = "plyr-custom-theme";
      style.innerHTML = `
        .plyr {
          --plyr-color-main: #6366f1; /* Premium Indigo */
          --plyr-video-background: #030306;
          --plyr-menu-background: rgba(15, 17, 26, 0.95);
          --plyr-menu-color: #cbd5e1;
          font-family: inherit;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 0 40px rgba(99, 102, 241, 0.15);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        .plyr--full-ui input[type=range] {
          color: #6366f1;
        }
        .plyr__control--overlaid {
          background: rgba(99, 102, 241, 0.9) !important;
          box-shadow: 0 0 20px rgba(99, 102, 241, 0.4);
        }
        .plyr__control--overlaid:hover {
          background: #4f46e5 !important;
        }
        .plyr__menu__container {
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
        }
        /* Mathematical CSS Rotate Fallback for iOS/Safari where orient lock is locked */
        .rotated-landscape-mode {
          position: fixed !important;
          top: 0 !important;
          left: 0 !important;
          width: 100vh !important;
          height: 100vw !important;
          transform: rotate(90deg) translate(0, -100vw) !important;
          transform-origin: top left !important;
          z-index: 99999 !important;
          background-color: #030306 !important;
          border-radius: 0px !important;
          border: none !important;
        }
      `;
      document.head.appendChild(style);
    }

    const initPlyr = () => {
      if (!playerRef.current) return;

      // Recycle/Destroy previous instance if it exists
      if (plyrInstanceRef.current) {
        try {
          plyrInstanceRef.current.destroy();
        } catch (e) {
          console.error("Failed to destroy plyr instance: ", e);
        }
      }

      const Plyr = (window as any).Plyr;
      if (Plyr) {
        plyrInstanceRef.current = new Plyr(playerRef.current, {
          controls: [
            "play-large",
            "play",
            "progress",
            "current-time",
            "duration",
            "mute",
            "volume",
            "captions",
            "settings",
            "pip",
            "fullscreen"
          ],
          settings: ["speed", "quality"],
          speed: { selected: 1, options: [0.5, 0.75, 1, 1.25, 1.5, 2] },
          youtube: {
            noCookie: true,
            rel: 0,
            showinfo: 0,
            iv_load_policy: 3,
            modestbranding: 1
          }
        });

        plyrInstanceRef.current.on("ready", () => {
          setIsLoaded(true);
        });
      }
    };

    // Load plyr script if not loaded
    const scriptId = "plyr-js";
    let script = document.getElementById(scriptId) as HTMLScriptElement;

    if (!(window as any).Plyr) {
      if (!script) {
        script = document.createElement("script");
        script.id = scriptId;
        script.src = "https://cdn.plyr.io/3.7.8/plyr.js";
        script.async = true;
        document.body.appendChild(script);
      }
      script.addEventListener("load", initPlyr);
    } else {
      initPlyr();
      // If Plyr script was already loaded, it might be ready instantly
      setIsLoaded(true);
    }

    return () => {
      if (plyrInstanceRef.current) {
        try {
          plyrInstanceRef.current.destroy();
        } catch (e) {
          console.error("Failed to destroy plyr on unmount: ", e);
        }
      }
    };
  }, [videoId]);

  return (
    <div className={cn(
      "relative w-full aspect-video rounded-xl overflow-hidden bg-[#030306] border border-white/10 group shadow-[0_0_50px_rgba(99,102,241,0.08)]",
      isLandscape && "rotated-landscape-mode"
    )}>
      {/* Immersive Dark Glow & Loader */}
      {!isLoaded && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-[#030306]/95 gap-3">
          <Loader2 className="h-10 w-10 text-indigo-500 animate-spin" />
          <span className="text-xs text-indigo-300 font-extrabold uppercase tracking-widest animate-pulse">
            Configuring Custom Stream...
          </span>
        </div>
      )}

      {/* Floating Manual Orientation Toggle Option (Overlaid strictly for touch/mobile screens, hidden on desktop) */}
      {isLoaded && showRotateBtn && (
        <button
          onClick={toggleOrientation}
          className="md:hidden absolute top-4 right-4 z-30 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/70 hover:bg-black/90 border border-white/10 backdrop-blur-md text-[10px] font-extrabold uppercase tracking-widest text-slate-300 hover:text-white transition-all shadow-[0_0_15px_rgba(0,0,0,0.5)] cursor-pointer active:scale-95 animate-fade-in"
          title="Toggle Manual Rotate Landscape"
        >
          <RotateCw className={`h-3 w-3 text-indigo-400 transition-transform duration-300 ${isLandscape ? "rotate-90 text-emerald-400" : ""}`} />
          <span>{isLandscape ? "Unlock View" : "Rotate View"}</span>
        </button>
      )}

      {/* Plyr Element Container */}
      <div className="w-full h-full" ref={containerRef}>
        <div
          ref={playerRef}
          data-plyr-provider="youtube"
          data-plyr-embed-id={videoId}
        />
      </div>
    </div>
  );
}
