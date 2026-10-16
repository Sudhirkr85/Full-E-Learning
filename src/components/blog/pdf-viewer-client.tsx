"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  FileText,
  Maximize2,
  Minimize2,
  Eye,
  EyeOff,
  Loader2,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Smartphone,
  Monitor,
} from "lucide-react";
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
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [viewerMode, setViewerMode] = useState<"canvas" | "iframe">("canvas");

  // Canvas Reader States
  const [pdfDoc, setPdfDoc] = useState<any>(null);
  const [pageNum, setPageNum] = useState(1);
  const [totalPages, setTotalPages] = useState(pdfPages || 1);
  const [scale, setScale] = useState(1.0);
  const [isPdfLoading, setIsPdfLoading] = useState(true);
  const [isPageRendering, setIsPageRendering] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const activeRenderTaskRef = useRef<any>(null);

  // Touch gesture tracking for swipe & pinch
  const touchStartX = useRef<number | null>(null);
  const touchStartDist = useRef<number | null>(null);
  const touchStartScale = useRef<number>(1.0);

  // 1. Detect mobile screen
  useEffect(() => {
    const checkMobile = () => {
      const mobile =
        window.innerWidth < 768 ||
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        );
      setIsMobile(mobile);
      // On mobile, always default to high-compatibility Canvas mode
      setViewerMode(mobile ? "canvas" : "iframe");
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // 2. Anti-theft: prevent Ctrl+S, Ctrl+P, and print
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        (e.ctrlKey || e.metaKey) &&
        (e.key === "s" || e.key === "p" || e.key === "S" || e.key === "P")
      ) {
        e.preventDefault();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // 3. Fullscreen change listener
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  // 4. Toggle Fullscreen (In-app, anti-theft)
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

  // 5. Load PDF.js dynamically when in canvas mode
  useEffect(() => {
    if (!showViewer || viewerMode !== "canvas") return;
    if (pdfDoc) return; // already loaded

    let active = true;

    const initPdfJs = async () => {
      try {
        setIsPdfLoading(true);
        setLoadError(null);

        // Dynamically load PDF.js from trusted CDN if not present
        if (!(window as any).pdfjsLib) {
          const script = document.createElement("script");
          script.src =
            "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.min.js";
          script.async = true;
          document.body.appendChild(script);

          await new Promise((resolve, reject) => {
            script.onload = resolve;
            script.onerror = () =>
              reject(new Error("PDF reader library load failed"));
          });
        }

        const pdfjsLib = (window as any).pdfjsLib;
        if (!pdfjsLib) throw new Error("PDF library not initialized");
        pdfjsLib.GlobalWorkerOptions.workerSrc =
          "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js";

        // Fetch PDF data buffer via secure proxy
        const res = await fetch(`/api/pyq/${slug}/preview`);
        if (!res.ok) {
          throw new Error(`Failed to load document (${res.status})`);
        }
        const data = await res.arrayBuffer();

        if (!active) return;

        const loadingTask = pdfjsLib.getDocument({ data });
        const doc = await loadingTask.promise;

        if (!active) return;
        setPdfDoc(doc);
        setTotalPages(doc.numPages);
        setIsPdfLoading(false);
      } catch (err: any) {
        console.error("[CANVAS_PDF_ERROR]", err);
        if (active) {
          setLoadError(
            err.message || "PDF लोड करने में असमर्थ। कृपया पुनः प्रयास करें।"
          );
          setIsPdfLoading(false);
        }
      }
    };

    initPdfJs();

    return () => {
      active = false;
    };
  }, [showViewer, viewerMode, slug, pdfDoc]);

  // 6. Render current page on canvas
  useEffect(() => {
    if (!pdfDoc || !canvasRef.current || viewerMode !== "canvas") return;

    let active = true;

    const renderPage = async () => {
      try {
        setIsPageRendering(true);

        if (activeRenderTaskRef.current) {
          try {
            activeRenderTaskRef.current.cancel();
          } catch (_) {}
          activeRenderTaskRef.current = null;
        }

        const page = await pdfDoc.getPage(pageNum);
        if (!active || !canvasRef.current) return;

        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");
        if (!context) return;

        const dpr = window.devicePixelRatio || 1;
        // Compute responsive scale to fit container width
        const containerWidth =
          containerRef.current?.clientWidth || window.innerWidth || 360;
        const unscaledViewport = page.getViewport({ scale: 1.0 });
        const availableWidth = Math.max(containerWidth - 24, 280);
        const baseFitScale = availableWidth / unscaledViewport.width;
        const effectiveScale = baseFitScale * scale;

        const viewport = page.getViewport({ scale: effectiveScale * dpr });

        canvas.width = viewport.width;
        canvas.height = viewport.height;
        canvas.style.width = `${viewport.width / dpr}px`;
        canvas.style.height = `${viewport.height / dpr}px`;

        const renderTask = page.render({
          canvasContext: context,
          viewport: viewport,
        });

        activeRenderTaskRef.current = renderTask;
        await renderTask.promise;

        if (active) {
          activeRenderTaskRef.current = null;
          setIsPageRendering(false);
        }
      } catch (err: any) {
        if (err?.name !== "RenderingCancelledException") {
          console.error("Page render error:", err);
        }
      } finally {
        if (active) setIsPageRendering(false);
      }
    };

    renderPage();

    return () => {
      active = false;
      if (activeRenderTaskRef.current) {
        try {
          activeRenderTaskRef.current.cancel();
        } catch (_) {}
      }
    };
  }, [pdfDoc, pageNum, scale, viewerMode]);

  // 7. Page Navigation Handlers
  const handlePrevPage = () => {
    if (pageNum > 1) {
      setPageNum((prev) => prev - 1);
    }
  };

  const handleNextPage = () => {
    if (pageNum < totalPages) {
      setPageNum((prev) => prev + 1);
    }
  };

  const handleZoomIn = () => {
    setScale((prev) => Math.min(prev + 0.25, 2.5));
  };

  const handleZoomOut = () => {
    setScale((prev) => Math.max(prev - 0.25, 0.75));
  };

  const handleResetZoom = () => {
    setScale(1.0);
  };

  // 8. Mobile touch swipe & pinch handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const dist = Math.hypot(
        e.touches[1].clientX - e.touches[0].clientX,
        e.touches[1].clientY - e.touches[0].clientY
      );
      touchStartDist.current = dist;
      touchStartScale.current = scale;
    } else if (e.touches.length === 1) {
      touchStartX.current = e.touches[0].clientX;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2 && touchStartDist.current !== null) {
      const dist = Math.hypot(
        e.touches[1].clientX - e.touches[0].clientX,
        e.touches[1].clientY - e.touches[0].clientY
      );
      const ratio = dist / touchStartDist.current;
      const newScale = Math.min(Math.max(touchStartScale.current * ratio, 0.75), 2.5);
      setScale(newScale);
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    touchStartDist.current = null;
    if (touchStartX.current === null) return;

    if (e.changedTouches.length === 1 && scale === 1.0) {
      const touchEndX = e.changedTouches[0].clientX;
      const diff = touchStartX.current - touchEndX;

      // 60px swipe threshold
      if (Math.abs(diff) > 60) {
        if (diff > 0 && pageNum < totalPages) {
          handleNextPage(); // Swipe Left -> Next Page
        } else if (diff < 0 && pageNum > 1) {
          handlePrevPage(); // Swipe Right -> Prev Page
        }
      }
    }
    touchStartX.current = null;
  };

  const previewIframeUrl = `/api/pyq/${slug}/preview#toolbar=0&navpanes=0`;

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
          isFullscreen
            ? "!my-0 !rounded-none fixed inset-0 z-50 flex flex-col h-screen w-screen bg-slate-950"
            : ""
        }`}
      >
        {/* ── Top Bar ── */}
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
                कुल {totalPages} पृष्ठ • {pdfSize} • ऑनलाइन फ्री पढ़ें
              </p>
            </div>
          </div>

          {/* Action Controls */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Mode Toggle Button on Desktop */}
            {!isMobile && (
              <button
                type="button"
                onClick={() =>
                  setViewerMode(viewerMode === "canvas" ? "iframe" : "canvas")
                }
                className="hidden sm:inline-flex items-center gap-1 rounded-lg border border-white/15 bg-white/5 px-2.5 py-1.5 text-xs font-medium text-slate-300 transition hover:bg-white/10"
                title="व्यूअर मोड बदलें"
              >
                {viewerMode === "canvas" ? (
                  <>
                    <Monitor className="h-3.5 w-3.5 text-indigo-400" />
                    <span>क्लासिक व्यूअर</span>
                  </>
                ) : (
                  <>
                    <Smartphone className="h-3.5 w-3.5 text-amber-400" />
                    <span>मोबाइल कैनवस</span>
                  </>
                )}
              </button>
            )}

            {/* Fullscreen Button */}
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
                    <span>बंद करें</span>
                  </>
                ) : (
                  <>
                    <Maximize2 className="h-3.5 w-3.5" />
                    <span>फुल स्क्रीन</span>
                  </>
                )}
              </button>
            )}

            {/* Show / Hide Viewer Button */}
            {!isFullscreen && (
              <button
                type="button"
                onClick={() => setShowViewer(!showViewer)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-semibold text-slate-300 transition hover:bg-white/10 hover:text-white"
              >
                {showViewer ? (
                  <>
                    <EyeOff className="h-3.5 w-3.5" />
                    <span>छिपाएँ</span>
                  </>
                ) : (
                  <>
                    <Eye className="h-3.5 w-3.5" />
                    <span>खोलें</span>
                  </>
                )}
              </button>
            )}

            {/* Paid Download Button */}
            <PyqDownloadButton
              slug={slug}
              pdfTitle={pdfFileName}
              isAdmin={isAdmin}
              className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 px-3.5 py-1.5 text-xs font-bold text-slate-950 shadow transition hover:from-amber-400 hover:to-orange-400"
            />
          </div>
        </div>

        {/* ── Main Viewer Content Area ── */}
        {showViewer && (
          <div
            className={`relative w-full bg-slate-950 flex flex-col items-center ${
              isFullscreen ? "flex-1 h-full overflow-hidden" : ""
            }`}
          >
            {/* ════ MODE A: Mobile Canvas Viewer (High Compatibility) ════ */}
            {viewerMode === "canvas" ? (
              <div
                className={`relative w-full flex flex-col items-center bg-slate-950 ${
                  isFullscreen ? "flex-1 overflow-auto p-2" : "p-2 sm:p-4"
                }`}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              >
                {/* Canvas Navigation Toolbar */}
                <div className="w-full max-w-2xl flex items-center justify-between gap-2 rounded-xl bg-slate-900/90 border border-white/10 px-3 py-2 text-xs text-slate-200 mb-2 shrink-0">
                  {/* Prev Page Button */}
                  <button
                    type="button"
                    onClick={handlePrevPage}
                    disabled={pageNum <= 1 || isPdfLoading}
                    className="inline-flex items-center gap-1 rounded-lg bg-white/5 border border-white/10 px-2.5 py-1 text-xs font-semibold text-slate-200 transition hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="h-3.5 w-3.5" />
                    <span className="hidden xs:inline">पिछला</span>
                  </button>

                  {/* Page Indicator / Selector */}
                  <div className="flex items-center gap-1 font-bold text-amber-300">
                    <span>पेज</span>
                    <select
                      value={pageNum}
                      onChange={(e) => setPageNum(Number(e.target.value))}
                      disabled={isPdfLoading}
                      className="rounded bg-slate-800 border border-white/20 px-1.5 py-0.5 text-xs font-bold text-white focus:outline-none focus:border-indigo-500"
                    >
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                        (num) => (
                          <option key={num} value={num}>
                            {num}
                          </option>
                        )
                      )}
                    </select>
                    <span className="text-slate-400 font-normal">
                      / {totalPages}
                    </span>
                  </div>

                  {/* Zoom Controls */}
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={handleZoomOut}
                      disabled={scale <= 0.75}
                      className="rounded bg-white/5 border border-white/10 p-1 text-slate-300 hover:bg-white/10 disabled:opacity-40"
                      title="ज़ूम कम करें"
                    >
                      <ZoomOut className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={handleResetZoom}
                      className="px-1 text-[11px] font-mono text-slate-400 hover:text-white"
                      title="रीसेट ज़ूम"
                    >
                      {Math.round(scale * 100)}%
                    </button>
                    <button
                      type="button"
                      onClick={handleZoomIn}
                      disabled={scale >= 2.5}
                      className="rounded bg-white/5 border border-white/10 p-1 text-slate-300 hover:bg-white/10 disabled:opacity-40"
                      title="ज़ूम बढ़ाएँ"
                    >
                      <ZoomIn className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  {/* Next Page Button */}
                  <button
                    type="button"
                    onClick={handleNextPage}
                    disabled={pageNum >= totalPages || isPdfLoading}
                    className="inline-flex items-center gap-1 rounded-lg bg-indigo-600 px-2.5 py-1 text-xs font-semibold text-white transition hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <span className="hidden xs:inline">अगला</span>
                    <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                </div>

                {/* PDF Loading / Error Overlay */}
                {isPdfLoading && (
                  <div className="flex flex-col items-center justify-center gap-3 py-20 text-slate-300">
                    <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
                    <p className="text-xs font-medium text-slate-400">
                      मोबाइल में प्रश्न पत्र लोड हो रहा है, कृपया प्रतीक्षा करें...
                    </p>
                  </div>
                )}

                {loadError && (
                  <div className="flex flex-col items-center justify-center gap-3 py-16 text-center px-4">
                    <p className="text-xs font-semibold text-red-400">
                      {loadError}
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setPdfDoc(null);
                        setViewerMode("iframe");
                      }}
                      className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-500"
                    >
                      क्लासिक व्यूअर से खोलें
                    </button>
                  </div>
                )}

                {/* Canvas Render Area */}
                {!isPdfLoading && !loadError && (
                  <div
                    className={`relative w-full max-w-3xl flex justify-center overflow-auto rounded-xl bg-slate-900/50 border border-white/5 shadow-inner ${
                      isFullscreen ? "flex-1" : "min-h-[450px]"
                    }`}
                  >
                    {isPageRendering && (
                      <div className="absolute top-2 right-2 z-10 flex items-center gap-1.5 rounded-full bg-slate-950/80 px-2.5 py-1 text-[10px] text-amber-300 border border-white/10 backdrop-blur">
                        <Loader2 className="h-3 w-3 animate-spin" />
                        <span>पेज तैयार हो रहा है...</span>
                      </div>
                    )}
                    <canvas
                      ref={canvasRef}
                      className="block max-w-full h-auto shadow-2xl rounded"
                    />
                  </div>
                )}

                {/* Bottom Quick Jump / Swipe Instruction */}
                <div className="w-full max-w-2xl flex items-center justify-between gap-2 mt-2 px-1 text-[11px] text-slate-400">
                  <span>
                    👉 <span>पेज पलटने के लिए स्क्रीन पर स्वाइप करें</span>
                  </span>
                  <span>
                    पेज <b>{pageNum}</b> / {totalPages}
                  </span>
                </div>
              </div>
            ) : (
              /* ════ MODE B: Desktop Native Iframe Viewer ════ */
              <div
                className={`w-full relative ${
                  isFullscreen ? "flex-1 h-full" : ""
                }`}
              >
                <iframe
                  src={previewIframeUrl}
                  title={pdfFileName}
                  className={`w-full border-0 ${
                    isFullscreen
                      ? "h-[calc(100vh-110px)]"
                      : "h-[550px] sm:h-[750px]"
                  }`}
                />
              </div>
            )}

            {/* Bottom Controls / Help Banner */}
            <div className="w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-t border-white/10 bg-slate-900/95 px-4 py-2.5 text-xs text-slate-400 shrink-0">
              <span className="flex items-center gap-1.5">
                <span>💡</span>
                <span className="sm:hidden">
                  स्पष्ट पढ़ने के लिए ऊपर + बटन से ज़ूम करें या फुल स्क्रीन दबाएँ।
                </span>
                <span className="hidden sm:inline">
                  प्रश्न पत्र को सीधे यहाँ पढ़ें। ऑफलाइन डिजिटल कॉपी सुरक्षित रखने के लिए ऊपर डाउनलोड करें।
                </span>
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={toggleFullscreen}
                  className="inline-flex items-center gap-1 font-semibold text-indigo-400 hover:text-indigo-300 hover:underline shrink-0"
                >
                  <Maximize2 className="h-3 w-3" />
                  <span>
                    {isFullscreen ? "फुल स्क्रीन बंद करें" : "फुल स्क्रीन में पढ़ें"}
                  </span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
