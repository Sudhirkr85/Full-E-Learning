"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  FileText,
  Maximize2,
  Minimize2,
  ZoomIn,
  ZoomOut,
  ChevronLeft,
  ChevronRight,
  Eye,
  EyeOff,
  Loader2,
  ShieldAlert,
} from "lucide-react";
import { PyqDownloadButton } from "@/components/blog/pyq-download-button";

interface PdfViewerClientProps {
  slug: string;
  pdfUrl?: string;
  pdfFileName: string;
  downloadUrl?: string;
  pdfPages: number;
  pdfSize: string;
  isAdmin?: boolean;
}

export function PdfViewerClient({
  slug,
  pdfFileName,
  pdfPages,
  pdfSize,
  isAdmin = false,
}: PdfViewerClientProps) {
  const [showViewer, setShowViewer] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState<number>(pdfPages || 1);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.2);

  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pdfDocRef = useRef<any>(null);

  // 1. Load PDF.js from CDN dynamically
  useEffect(() => {
    let isMounted = true;

    async function initPdf() {
      try {
        setLoading(true);
        setError(null);

        // Load script if not already present
        if (!(window as any).pdfjsLib) {
          await new Promise<void>((resolve, reject) => {
            const script = document.createElement("script");
            script.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
            script.async = true;
            script.onload = () => resolve();
            script.onerror = () => reject(new Error("PDF.js CDN failed to load"));
            document.body.appendChild(script);
          });
        }

        const pdfjsLib = (window as any).pdfjsLib;
        pdfjsLib.GlobalWorkerOptions.workerSrc =
          "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";

        // Fetch via secure internal preview endpoint (never exposes raw R2 link)
        const previewUrl = `/api/pyq/${slug}/preview`;
        const loadingTask = pdfjsLib.getDocument(previewUrl);
        const pdf = await loadingTask.promise;

        if (!isMounted) return;
        pdfDocRef.current = pdf;
        setTotalPages(pdf.numPages);
        renderPage(1, pdf, scale);
      } catch (err: any) {
        if (!isMounted) return;
        console.error("PDF preview error:", err);
        setError("प्रश्न पत्र लोड करने में समस्या हुई। कृपया पुनः प्रयास करें।");
        setLoading(false);
      }
    }

    if (showViewer) {
      initPdf();
    }

    return () => {
      isMounted = false;
    };
  }, [slug, showViewer]);

  // 2. Render Page to Canvas
  const renderPage = async (num: number, pdfInstance?: any, currentScale = scale) => {
    const pdf = pdfInstance || pdfDocRef.current;
    if (!pdf || !canvasRef.current) return;

    try {
      setLoading(true);
      const page = await pdf.getPage(num);
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const viewport = page.getViewport({ scale: currentScale });
      canvas.height = viewport.height;
      canvas.width = viewport.width;

      const renderContext = {
        canvasContext: ctx,
        viewport,
      };

      await page.render(renderContext).promise;
      setCurrentPage(num);
      setLoading(false);
    } catch (err) {
      console.error("Page render error:", err);
      setLoading(false);
    }
  };

  // Zoom handlers
  const handleZoomIn = () => {
    const newScale = Math.min(scale + 0.25, 2.5);
    setScale(newScale);
    renderPage(currentPage, undefined, newScale);
  };

  const handleZoomOut = () => {
    const newScale = Math.max(scale - 0.25, 0.75);
    setScale(newScale);
    renderPage(currentPage, undefined, newScale);
  };

  // Fullscreen handler (In-Page, NO new tab, NO raw URL)
  const toggleFullscreen = () => {
    if (!containerRef.current) return;

    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => {
        setIsFullscreen(true);
      }).catch(err => {
        console.warn("Fullscreen request failed:", err);
      });
    } else {
      document.exitFullscreen().then(() => {
        setIsFullscreen(false);
      });
    }
  };

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFsChange);
    return () => document.removeEventListener("fullscreenchange", handleFsChange);
  }, []);

  return (
    <div
      ref={containerRef}
      onContextMenu={(e) => e.preventDefault()}
      className={`my-8 overflow-hidden rounded-2xl border-2 border-indigo-500/30 bg-slate-950 shadow-2xl select-none ${
        isFullscreen ? "fixed inset-0 z-50 m-0 h-screen w-screen rounded-none p-4" : ""
      }`}
    >
      {/* ── Top Header Toolbar ── */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 bg-gradient-to-r from-indigo-950/80 via-slate-900 to-slate-900 p-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600/30 text-indigo-400">
            <FileText className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white sm:text-base">
              सुरक्षित PDF व्यूअर (Secure PDF Reader)
            </h3>
            <p className="text-xs text-slate-400">
              पृष्ठ {currentPage} / {totalPages} • {pdfSize}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Zoom Controls */}
          <div className="flex items-center rounded-lg border border-white/10 bg-white/5 p-1">
            <button
              onClick={handleZoomOut}
              title="ज़ूम कम करें"
              className="rounded p-1 text-slate-300 hover:bg-white/10 hover:text-white"
            >
              <ZoomOut className="h-4 w-4" />
            </button>
            <span className="px-2 text-xs font-semibold text-slate-300">
              {Math.round(scale * 100)}%
            </span>
            <button
              onClick={handleZoomIn}
              title="ज़ूम बढ़ाएँ"
              className="rounded p-1 text-slate-300 hover:bg-white/10 hover:text-white"
            >
              <ZoomIn className="h-4 w-4" />
            </button>
          </div>

          {/* Fullscreen Button */}
          <button
            onClick={toggleFullscreen}
            className="inline-flex items-center gap-1.5 rounded-lg border border-indigo-500/40 bg-indigo-600/20 px-3.5 py-2 text-xs font-semibold text-indigo-300 transition hover:bg-indigo-600 hover:text-white"
          >
            {isFullscreen ? (
              <>
                <Minimize2 className="h-3.5 w-3.5" />
                <span>स्क्रीन छोटी करें</span>
              </>
            ) : (
              <>
                <Maximize2 className="h-3.5 w-3.5" />
                <span>फुलस्क्रीन में देखें</span>
              </>
            )}
          </button>

          {/* Download Button */}
          <PyqDownloadButton
            slug={slug}
            pdfTitle={pdfFileName}
            isAdmin={isAdmin}
            className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-2 text-xs font-bold text-slate-950 shadow transition hover:from-amber-400 hover:to-orange-400"
          />
        </div>
      </div>

      {/* ── Canvas Display Area ── */}
      {showViewer && (
        <div className="relative flex min-h-[500px] flex-col items-center justify-center overflow-auto bg-slate-950 p-4">
          {loading && (
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-slate-950/80 backdrop-blur-sm">
              <Loader2 className="h-8 w-8 animate-spin text-amber-400" />
              <p className="mt-3 text-xs font-semibold text-slate-300">
                पेज {currentPage} तैयार हो रहा है...
              </p>
            </div>
          )}

          {error ? (
            <div className="flex flex-col items-center text-center p-8 text-rose-400">
              <ShieldAlert className="h-10 w-10 mb-2" />
              <p className="text-sm font-semibold">{error}</p>
            </div>
          ) : (
            <div className="relative inline-block max-w-full rounded-lg shadow-2xl border border-white/10 bg-white">
              <canvas ref={canvasRef} className="max-w-full h-auto block" />
              {/* Anti-theft transparent overlay over canvas */}
              <div
                className="absolute inset-0 cursor-default"
                onContextMenu={(e) => e.preventDefault()}
              />
            </div>
          )}

          {/* ── Bottom Page Navigator Bar ── */}
          <div className="sticky bottom-2 mt-4 flex items-center gap-3 rounded-full border border-white/15 bg-slate-900/90 px-4 py-2 shadow-xl backdrop-blur">
            <button
              onClick={() => currentPage > 1 && renderPage(currentPage - 1)}
              disabled={currentPage <= 1 || loading}
              className="rounded-full p-1.5 text-slate-300 transition hover:bg-white/10 hover:text-white disabled:opacity-30"
              title="पिछला पृष्ठ"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            <span className="text-xs font-bold text-white">
              पृष्ठ {currentPage} / {totalPages}
            </span>

            <button
              onClick={() => currentPage < totalPages && renderPage(currentPage + 1)}
              disabled={currentPage >= totalPages || loading}
              className="rounded-full p-1.5 text-slate-300 transition hover:bg-white/10 hover:text-white disabled:opacity-30"
              title="अगला पृष्ठ"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
