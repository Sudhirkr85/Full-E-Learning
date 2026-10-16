"use client";

import React, { useState, useRef, useEffect } from "react";
import { FileText, Maximize2, Minimize2, Eye, EyeOff, Loader2 } from "lucide-react";
import { PyqDownloadButton } from "@/components/blog/pyq-download-button";

interface PdfViewerClientProps {
  slug: string;
  pdfUrl: string;
  pdfFileName: string;
  downloadUrl: string;
  pdfPages: number;
  pdfSize: string;
  isAdmin?: boolean;
}

export function PdfViewerClient({
  slug,
  pdfUrl,
  pdfFileName,
  downloadUrl,
  pdfPages,
  pdfSize,
  isAdmin = false,
}: PdfViewerClientProps) {
  const [showViewer, setShowViewer] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Anti-theft: prevent Ctrl+S, Ctrl+P, and Print attempts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && (e.key === "s" || e.key === "p" || e.key === "S" || e.key === "P")) {
        e.preventDefault();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Listen to fullscreen changes (e.g. user presses Esc key)
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  const toggleFullscreen = async () => {
    if (!containerRef.current) return;
    try {
      if (!document.fullscreenElement) {
        if (containerRef.current.requestFullscreen) {
          await containerRef.current.requestFullscreen();
        } else if ((containerRef.current as any).webkitRequestFullscreen) {
          await (containerRef.current as any).webkitRequestFullscreen();
        }
        setIsFullscreen(true);
      } else {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        } else if ((document as any).webkitExitFullscreen) {
          await (document as any).webkitExitFullscreen();
        }
        setIsFullscreen(false);
      }
    } catch (err) {
      console.warn("Fullscreen toggle error:", err);
    }
  };

  const previewUrl = `/api/pyq/${slug}/preview#toolbar=0&navpanes=0`;

  return (
    <>
      <style>{`
        @media print {
          body { display: none !important; }
        }
      `}</style>
      <div
        ref={containerRef}
        onContextMenu={(e) => e.preventDefault()}
        className={`my-8 overflow-hidden rounded-2xl border-2 border-indigo-500/30 bg-slate-900 shadow-2xl select-none ${
          isFullscreen ? "!my-0 !rounded-none fixed inset-0 z-50 flex flex-col h-screen w-screen bg-slate-950" : ""
        }`}
      >
        {/* Viewer Header Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 bg-gradient-to-r from-indigo-950/90 via-slate-900 to-slate-900 p-3 sm:p-4 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600/30 text-indigo-400">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white sm:text-base">
                सुरक्षित PDF व्यूअर (Secure PDF Viewer)
              </h3>
              <p className="text-xs text-slate-400">
                पेज स्क्रॉल करके प्रश्न पत्र सीधे यहाँ पढ़ें ({pdfPages} पृष्ठ • {pdfSize})
              </p>
            </div>
          </div>

          {/* Action Controls */}
          <div className="flex flex-wrap items-center gap-2">
            {showViewer && (
              <button
                type="button"
                onClick={toggleFullscreen}
                className="inline-flex items-center gap-1.5 rounded-lg border border-indigo-500/40 bg-indigo-500/15 px-3 py-1.5 text-xs font-semibold text-indigo-300 transition hover:bg-indigo-500/25 hover:text-white"
                title={isFullscreen ? "फुल स्क्रीन बंद करें" : "फुल स्क्रीन में पढ़ें"}
              >
                {isFullscreen ? (
                  <>
                    <Minimize2 className="h-3.5 w-3.5" />
                    <span>फुल स्क्रीन बंद करें</span>
                  </>
                ) : (
                  <>
                    <Maximize2 className="h-3.5 w-3.5" />
                    <span>फुल स्क्रीन</span>
                  </>
                )}
              </button>
            )}

            {!isFullscreen && (
              <button
                type="button"
                onClick={() => setShowViewer(!showViewer)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-semibold text-slate-300 transition hover:bg-white/10 hover:text-white"
              >
                {showViewer ? (
                  <>
                    <EyeOff className="h-3.5 w-3.5" />
                    <span>व्यूअर छिपाएँ</span>
                  </>
                ) : (
                  <>
                    <Eye className="h-3.5 w-3.5" />
                    <span>व्यूअर खोलें</span>
                  </>
                )}
              </button>
            )}

            <PyqDownloadButton
              slug={slug}
              pdfTitle={pdfFileName}
              isAdmin={isAdmin}
              className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 px-3.5 py-1.5 text-xs font-bold text-slate-950 shadow transition hover:from-amber-400 hover:to-orange-400"
            />
          </div>
        </div>

        {/* Embedded PDF Frame - Served via secure internal proxy with hidden toolbar */}
        {showViewer && (
          <div className={`relative w-full bg-slate-950 ${isFullscreen ? "flex-1 h-full" : ""}`}>
            {isLoading && (
              <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-slate-950/90 text-slate-300">
                <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
                <p className="text-xs font-medium text-slate-400">
                  PDF लोड हो रहा है, कृपया प्रतीक्षा करें...
                </p>
              </div>
            )}
            <iframe
              src={previewUrl}
              title={pdfFileName}
              onLoad={() => setIsLoading(false)}
              className={`w-full border-0 ${
                isFullscreen ? "h-[calc(100vh-110px)]" : "h-[550px] sm:h-[750px]"
              }`}
            />

            {/* Actions & Zoom Note Bar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-t border-white/10 bg-slate-900/95 px-4 py-2.5 text-xs text-slate-400 shrink-0">
              <span className="flex items-center gap-1.5">
                <span>💡</span>
                <span className="sm:hidden">
                  मोबाइल में प्रश्न पत्र को स्पष्ट पढ़ने के लिए दो उंगलियों (Pinch to Zoom) से ज़ूम कर सकते हैं।
                </span>
                <span className="hidden sm:inline">
                  प्रश्न पत्र को सीधे यहाँ स्क्रॉल करके पढ़ें। ऑफलाइन PDF सुरक्षित रखने के लिए ऊपर डाउनलोड करें।
                </span>
              </span>
              <button
                type="button"
                onClick={toggleFullscreen}
                className="inline-flex items-center gap-1 font-semibold text-indigo-400 hover:text-indigo-300 hover:underline shrink-0 cursor-pointer"
              >
                <Maximize2 className="h-3 w-3" />
                <span>{isFullscreen ? "फुल स्क्रीन बंद करें" : "फुल स्क्रीन में पढ़ें"}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}


