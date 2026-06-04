"use client";

import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { 
  ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Maximize2, Minimize2,
  BookOpen, Bookmark, FileText, Settings, X, Loader2, Sparkles,
  Sun, Moon, Trash2, Edit3, ShieldAlert, AlignJustify
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface PdfReaderProps {
  productId: string;
  orderId: string;
  fileUrl: string;
  userName: string;
  userEmail: string;
  productName: string;
  className?: string;
}

interface Note {
  id: string;
  page: number;
  x: number; // percentage from left
  y: number; // percentage from top
  text: string;
  createdAt: string;
}

interface Highlight {
  id: string;
  page: number;
  x: number;
  y: number;
  width: number;
  color: string;
}

// ----------------------------------------------------
// Sub-component: Real-time Page Thumbnail Canvas Preview
// ----------------------------------------------------
interface ThumbnailPageProps {
  pdfDoc: any;
  pageNumber: number;
  isActive: boolean;
  onClick: () => void;
}

function ThumbnailPage({ pdfDoc, pageNumber, isActive, onClick }: ThumbnailPageProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [loading, setLoading] = useState(true);
  const activeRenderTaskRef = useRef<any>(null);

  useEffect(() => {
    if (!pdfDoc) return;
    let active = true;

    const renderThumbnail = async () => {
      try {
        setLoading(true);
        if (activeRenderTaskRef.current) {
          try {
            activeRenderTaskRef.current.cancel();
          } catch (_) {}
          activeRenderTaskRef.current = null;
        }

        const page = await pdfDoc.getPage(pageNumber);
        if (!active || !canvasRef.current) return;

        const originalViewport = page.getViewport({ scale: 1.0 });
        const baseScale = 100 / originalViewport.width; // fits width={100} perfectly
        const dpr = window.devicePixelRatio || 1;
        const viewport = page.getViewport({ scale: baseScale * dpr });

        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");

        if (context) {
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
            setLoading(false);
          }
        }
      } catch (err: any) {
        if (err.name !== "RenderingCancelledException") {
          console.error("Thumbnail render failed for page", pageNumber, err);
        }
      }
    };

    renderThumbnail();

    return () => {
      active = false;
      if (activeRenderTaskRef.current) {
        try {
          activeRenderTaskRef.current.cancel();
        } catch (_) {}
      }
    };
  }, [pdfDoc, pageNumber]);

  return (
    <button
      onClick={onClick}
      className={`relative w-full text-left p-2 rounded-xl transition duration-200 border flex flex-col items-center gap-1.5 shrink-0 ${
        isActive
          ? "bg-indigo-600/20 border-indigo-500 text-white font-bold ring-2 ring-indigo-500"
          : "bg-white/5 border-transparent text-slate-400 hover:text-white"
      }`}
    >
      <div className="relative w-[100px] bg-slate-950/40 rounded overflow-hidden flex items-center justify-center min-h-[130px] border border-white/5">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-900/60 z-10">
            <Loader2 className="w-5 h-5 text-indigo-500 animate-spin" />
          </div>
        )}
        <canvas ref={canvasRef} className="block w-[100px] h-auto object-contain pointer-events-none" />
      </div>
      <span className="text-[10px]">Page {pageNumber}</span>
    </button>
  );
}

// ----------------------------------------------------
// Main Component: Secure PDF Playbook Desk
// ----------------------------------------------------
export function PdfReader({
  productId,
  orderId,
  fileUrl,
  userName,
  userEmail,
  productName,
  className
}: PdfReaderProps) {
  const router = useRouter();

  // PDF.js State
  const [pdfDoc, setPdfDoc] = useState<any>(null);
  const [pageNum, setPageNum] = useState(1);
  const [numPages, setNumPages] = useState(0);
  const [scale, setScale] = useState(1.0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // View Layout States
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [studyPanelOpen, setStudyPanelOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [studyTab, setStudyTab] = useState<"notes" | "bookmarks">("notes");

  // Mobile Sheets Overlay states
  const [mobilePanel, setMobilePanel] = useState<null | "thumbnails" | "notes">(null);

  // Study Tools State (Bookmarks, Notes, Highlights)
  const [bookmarks, setBookmarks] = useState<number[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const [activeHighlightColor, setActiveHighlightColor] = useState<string>("rgba(234, 179, 8, 0.4)"); // yellow default
  const [activeTool, setActiveTool] = useState<"view" | "highlight" | "note">("view");

  // Local Storage Key
  const storageKey = `pdf_study_${orderId}_${productId}`;

  // Canvas & Containers Refs
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const viewerRef = useRef<HTMLDivElement | null>(null);
  const activeRenderTaskRef = useRef<any>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  // Drag-to-scroll panning states
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [scrollTop, setScrollTop] = useState(0);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.button !== 0 || activeTool !== "view") return;
    const container = scrollRef.current;
    if (!container) return;

    setIsDragging(true);
    setStartX(e.clientX - container.offsetLeft);
    setStartY(e.clientY - container.offsetTop);
    setScrollLeft(container.scrollLeft);
    setScrollTop(container.scrollTop);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const container = scrollRef.current;
    if (!container) return;

    e.preventDefault();
    const x = e.clientX - container.offsetLeft;
    const y = e.clientY - container.offsetTop;
    const walkX = (x - startX) * 1.5;
    const walkY = (y - startY) * 1.5;
    
    container.scrollLeft = scrollLeft - walkX;
    container.scrollTop = scrollTop - walkY;
  };

  // Load PDF.js Script from CDN dynamically to bypass React 19 and Turbopack SSR worker build crashes
  useEffect(() => {
    let active = true;

    const loadPdfJs = async () => {
      try {
        if (!(window as any).pdfjsLib) {
          const script = document.createElement("script");
          script.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.min.js";
          script.async = true;
          document.body.appendChild(script);

          await new Promise((resolve, reject) => {
            script.onload = resolve;
            script.onerror = () => reject(new Error("Failed to load PDF library."));
          });
        }

        const pdfjsLib = (window as any).pdfjsLib;
        pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js";

        if (!active) return;

        const proxiedUrl = `/api/pdf-proxy?url=${encodeURIComponent(fileUrl)}`;
        console.log("Loading secure playbook document via proxy:", proxiedUrl);
        const loadingTask = pdfjsLib.getDocument(proxiedUrl);
        const doc = await loadingTask.promise;

        if (!active) return;
        setPdfDoc(doc);
        setNumPages(doc.numPages);
        setIsLoading(false);
      } catch (err: any) {
        console.error("PDF Loading Error:", err);
        if (active) {
          setError(err.message || "Failed to load PDF document.");
          setIsLoading(false);
        }
      }
    };

    loadPdfJs();

    // Load persisted study states
    try {
      const persisted = localStorage.getItem(storageKey);
      if (persisted) {
        const parsed = JSON.parse(persisted);
        if (parsed.bookmarks) setBookmarks(parsed.bookmarks);
        if (parsed.notes) setNotes(parsed.notes);
        if (parsed.highlights) setHighlights(parsed.highlights);
      }
    } catch (e) {
      console.error("Failed to load study notes:", e);
    }

    return () => {
      active = false;
    };
  }, [fileUrl, storageKey]);

  // Persist study tools state
  const saveStudyState = (updatedBookmarks: number[], updatedNotes: Note[], updatedHighlights: Highlight[]) => {
    try {
      localStorage.setItem(
        storageKey,
        JSON.stringify({ bookmarks: updatedBookmarks, notes: updatedNotes, highlights: updatedHighlights })
      );
    } catch (e) {
      console.error("Failed to persist notes:", e);
    }
  };

  // Render current page onto canvas
  useEffect(() => {
    if (!pdfDoc || !canvasRef.current) return;

    let active = true;

    const renderPage = async () => {
      try {
        if (activeRenderTaskRef.current) {
          try {
            activeRenderTaskRef.current.cancel();
          } catch (_) {}
          activeRenderTaskRef.current = null;
        }

        const page = await pdfDoc.getPage(pageNum);
        if (!active || !canvasRef.current) return;

        const dpr = window.devicePixelRatio || 1;
        const viewport = page.getViewport({ scale: scale * dpr });
        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");

        if (context) {
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
          }
        }
      } catch (e: any) {
        if (e.name !== "RenderingCancelledException") {
          console.error("Page rendering failed:", e);
        }
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
  }, [pdfDoc, pageNum, scale]);

  // Gestural zoom: Ctrl+Scroll wheel zoom on desktop
  useEffect(() => {
    const container = viewerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      if (e.ctrlKey) {
        e.preventDefault();
        setScale((s) => Math.min(Math.max(s + (e.deltaY > 0 ? -0.1 : 0.1), 0.5), 3.0));
      }
    };

    container.addEventListener("wheel", handleWheel, { passive: false });
    return () => {
      container.removeEventListener("wheel", handleWheel);
    };
  }, [viewerRef.current]);

  // Gestural zoom: Pinch-to-zoom & swipe-to-change on mobile/tablet viewports
  const touchStartX = useRef<number | null>(null);
  const touchStartDist = useRef<number | null>(null);
  const touchStartScale = useRef<number>(1.0);

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
      const newScale = Math.min(Math.max(touchStartScale.current * ratio, 0.5), 3.0);
      setScale(newScale);
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    touchStartDist.current = null;
    if (touchStartX.current === null) return;
    
    if (e.changedTouches.length === 1) {
      const touchEndX = e.changedTouches[0].clientX;
      const diff = touchStartX.current - touchEndX;

      if (Math.abs(diff) > 80) {
        if (diff > 0 && pageNum < numPages) {
          setPageNum((prev) => prev + 1); // Swipe Left -> Next Page
        } else if (diff < 0 && pageNum > 1) {
          setPageNum((prev) => prev - 1); // Swipe Right -> Prev Page
        }
      }
    }
    touchStartX.current = null;
  };

  // Gestural zoom: Double-tap on canvas toggle
  const lastTapRef = useRef<number>(0);
  const handleDoubleTap = (e: React.MouseEvent) => {
    const now = Date.now();
    if (now - lastTapRef.current < 300) {
      setScale((s) => (s >= 1.45 && s <= 1.55 ? 1.0 : 1.5));
    }
    lastTapRef.current = now;
  };

  // Fullscreen Management
  const toggleFullscreen = () => {
    if (!containerRef.current) return;

    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  // Zoom Controllers
  const zoomIn = () => setScale((prev) => Math.min(prev + 0.2, 3.0));
  const zoomOut = () => setScale((prev) => Math.max(prev - 0.2, 0.5));
  
  // Calculate dynamic Fit-to-width
  const fitWidth = async () => {
    if (!pdfDoc || !viewerRef.current) return;
    try {
      const page = await pdfDoc.getPage(pageNum);
      const originalViewport = page.getViewport({ scale: 1.0 });
      const containerWidth = viewerRef.current.clientWidth - 48; // account for margins/paddings
      const dpr = window.devicePixelRatio || 1;
      const calculatedScale = Math.min(Math.max((containerWidth / originalViewport.width) / dpr, 0.5), 3.0);
      setScale(calculatedScale);
      toast.success("Adjusted to fit screen width");
    } catch (e) {
      console.error("Fit width computation failed:", e);
    }
  };

  // Bookmarks Logic
  const toggleBookmark = () => {
    const next = bookmarks.includes(pageNum)
      ? bookmarks.filter((b) => b !== pageNum)
      : [...bookmarks, pageNum].sort((a, b) => a - b);
    setBookmarks(next);
    saveStudyState(next, notes, highlights);
    toast.success(bookmarks.includes(pageNum) ? "Bookmark removed" : "Page bookmarked successfully!");
  };

  // Click Canvas -> Drop Sticky Note or Highlight
  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Only capture double taps for zooming, single clicks trigger tools
    const now = Date.now();
    if (now - lastTapRef.current < 300) {
      handleDoubleTap(e);
      return;
    }
    lastTapRef.current = now;

    if (!canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    if (activeTool === "note") {
      const noteText = prompt("Type your sticky note for this section:");
      if (!noteText) return;

      const newNote: Note = {
        id: `note_${Date.now()}`,
        page: pageNum,
        x,
        y,
        text: noteText,
        createdAt: new Date().toISOString()
      };

      const nextNotes = [...notes, newNote];
      setNotes(nextNotes);
      saveStudyState(bookmarks, nextNotes, highlights);
      setActiveTool("view");
      toast.success("Sticky note pinned!");
    } else if (activeTool === "highlight") {
      const newHighlight: Highlight = {
        id: `hl_${Date.now()}`,
        page: pageNum,
        x,
        y: y - 1, // center slightly
        width: 15, // default horizontal bar block
        color: activeHighlightColor
      };

      const nextHighlights = [...highlights, newHighlight];
      setHighlights(nextHighlights);
      saveStudyState(bookmarks, notes, nextHighlights);
      setActiveTool("view");
      toast.success("Section highlighted!");
    }
  };

  // Delete Study items
  const deleteNote = (id: string) => {
    const next = notes.filter((n) => n.id !== id);
    setNotes(next);
    saveStudyState(bookmarks, next, highlights);
    toast.success("Sticky note deleted.");
  };

  const clearPageHighlights = () => {
    const next = highlights.filter((h) => h.page !== pageNum);
    setHighlights(next);
    saveStudyState(bookmarks, notes, next);
    toast.success("Highlights cleared on this page.");
  };

  const formatDate = (isoString: string) => {
    try {
      return new Date(isoString).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "";
    }
  };

  const watermarkText = `${userName} • ${userEmail} • Secure Reader`;

  // Render Page Selection Thumbnails
  const renderThumbnailsList = () => {
    return (
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {Array.from({ length: numPages }).map((_, i) => {
          const pageIdx = i + 1;
          return (
            <ThumbnailPage
              key={pageIdx}
              pdfDoc={pdfDoc}
              pageNumber={pageIdx}
              isActive={pageNum === pageIdx}
              onClick={() => {
                setPageNum(pageIdx);
                setMobilePanel(null); // dismiss sheets on tap
              }}
            />
          );
        })}
      </div>
    );
  };

  // Render Right-Aligned Study Desk (Notes & Bookmarks)
  const renderStudyDesk = () => {
    return (
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header Tabs toggler */}
        <div className="grid grid-cols-2 border-b border-white/5 p-1 text-[10px] font-bold uppercase tracking-wider shrink-0 bg-slate-900/10">
          <button
            onClick={() => setStudyTab("notes")}
            className={`py-2 text-center rounded-lg transition duration-200 flex items-center justify-center gap-1.5 ${
              studyTab === "notes" ? "bg-indigo-600/20 text-white" : "text-slate-400 hover:text-white"
            }`}
          >
            <Edit3 className="h-3.5 w-3.5" />
            <span className="hidden md:inline">Notes</span> ({notes.length})
          </button>
          <button
            onClick={() => setStudyTab("bookmarks")}
            className={`py-2 text-center rounded-lg transition duration-200 flex items-center justify-center gap-1.5 ${
              studyTab === "bookmarks" ? "bg-indigo-600/20 text-white" : "text-slate-400 hover:text-white"
            }`}
          >
            <Bookmark className="h-3.5 w-3.5" />
            <span className="hidden md:inline">Bookmarks</span> ({bookmarks.length})
          </button>
        </div>

        {/* Scrollable Study content area */}
        <div className="flex-1 overflow-y-auto p-4">
          {studyTab === "notes" ? (
            <div className="space-y-3">
              {notes.length === 0 ? (
                <div className="text-center py-8 text-slate-500 text-[10px]">
                  No sticky notes saved. Click "+ Pin Note" and tap the canvas to register a note.
                </div>
              ) : (
                notes.map((note) => (
                  <div 
                    key={note.id} 
                    className="bg-white/5 border border-white/5 rounded-xl p-3 text-[10px] leading-relaxed space-y-2 relative"
                  >
                    <div className="flex justify-between items-center text-slate-400 font-semibold border-b border-white/5 pb-1">
                      <button
                        onClick={() => {
                          setPageNum(note.page);
                          setMobilePanel(null);
                        }}
                        className="hover:underline text-indigo-400 font-bold"
                      >
                        Page {note.page}
                      </button>
                      <span>{formatDate(note.createdAt)}</span>
                    </div>
                    <p className="text-white whitespace-pre-line leading-normal">{note.text}</p>
                    <div className="flex justify-end pt-1">
                      <button
                        onClick={() => deleteNote(note.id)}
                        className="text-rose-400 hover:text-rose-300 font-bold hover:underline"
                      >
                        [Delete]
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          ) : (
            <div className="space-y-2.5">
              {bookmarks.length === 0 ? (
                <div className="text-center py-8 text-slate-500 text-[10px]">
                  No bookmarked pages yet. Click the bookmark icon in the header bar.
                </div>
              ) : (
                bookmarks.map((bookmark) => (
                  <button
                    key={bookmark}
                    onClick={() => {
                      setPageNum(bookmark);
                      setMobilePanel(null);
                    }}
                    className="w-full bg-white/5 border border-white/5 hover:border-indigo-500/20 rounded-xl p-3 text-[11px] font-semibold text-white hover:bg-white/10 transition flex items-center justify-between text-left"
                  >
                    <span>📄 Page {bookmark}</span>
                    <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
                  </button>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div 
      ref={containerRef}
      className={`flex flex-col select-none relative ${className || "h-screen"} bg-[#0a0a0f] text-slate-100`}
      onContextMenu={(e) => e.preventDefault()} // Disable Right Click completely
    >
      {/* Printable block shield */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          body, html, #__next, div, canvas, iframe {
            display: none !important;
          }
        }
      `}} />

      {/* Top Header Bar with responsive horizontal scroll bounds */}
      <div className="sticky top-0 z-40 bg-[#0d1117]/95 backdrop-blur-md border-b border-white/10 px-4 py-3 flex items-center justify-between gap-3 shrink-0 overflow-x-auto scrollbar-none flex-nowrap">
        <div className="flex items-center gap-3 min-w-0 flex-shrink-0">
          <Button 
            onClick={() => router.back()} 
            variant="ghost" 
            size="sm" 
            className="hover:bg-white/5 text-slate-300 hover:text-white min-w-[44px] min-h-[44px] rounded-xl flex items-center"
          >
            <ChevronLeft className="h-5 w-5 mr-1" />
            Back
          </Button>
          <div className="h-4 w-[1px] bg-white/10 hidden sm:block"></div>
          <div className="min-w-0 hidden xs:block">
            <h1 className="text-xs sm:text-sm font-semibold text-white truncate flex items-center gap-1.5">
              <BookOpen className="h-4 w-4 text-indigo-400" />
              {productName}
            </h1>
          </div>
        </div>

        {/* Core Controls Row - Min 44px tap targets */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Zoom Buttons */}
          <div className="flex items-center border border-white/10 bg-white/5 rounded-xl p-0.5">
            <Button onClick={zoomOut} variant="ghost" size="icon" className="h-11 w-11 text-slate-300 hover:bg-white/5" title="Zoom Out">
              <ZoomOut className="h-4.5 w-4.5" />
            </Button>
            <span className="text-[10px] font-mono px-2 text-slate-300">
              {Math.round(scale * 100)}%
            </span>
            <Button onClick={zoomIn} variant="ghost" size="icon" className="h-11 w-11 text-slate-300 hover:bg-white/5" title="Zoom In">
              <ZoomIn className="h-4.5 w-4.5" />
            </Button>
            <Button onClick={fitWidth} variant="ghost" size="sm" className="h-11 px-3 text-[10px] text-slate-300 hover:bg-white/5" title="Fit to Screen Width">
              Fit Width
            </Button>
          </div>

          {/* Desktop Toggles */}
          <div className="hidden md:flex items-center gap-2">
            <Button 
              onClick={() => setSidebarOpen(!sidebarOpen)} 
              variant="ghost" 
              size="icon" 
              className={`h-11 w-11 text-slate-300 hover:bg-white/5 ${sidebarOpen ? "bg-white/10" : ""}`}
              title="Toggle Thumbnails"
            >
              <AlignJustify className="h-4.5 w-4.5" />
            </Button>

            <Button 
              onClick={() => setStudyPanelOpen(!studyPanelOpen)} 
              variant="ghost" 
              size="icon" 
              className={`h-11 w-11 text-slate-300 hover:bg-white/5 ${studyPanelOpen ? "bg-white/10" : ""}`}
              title="Study Panel"
            >
              <Edit3 className="h-4.5 w-4.5" />
            </Button>
          </div>

          {/* Bookmarks Toggle button */}
          <Button 
            onClick={toggleBookmark} 
            variant="ghost" 
            size="icon" 
            className={`h-11 w-11 text-slate-300 hover:bg-white/5 ${bookmarks.includes(pageNum) ? "text-yellow-400 hover:text-yellow-300 bg-white/5" : ""}`}
            title="Bookmark Page"
          >
            <Bookmark className="h-4.5 w-4.5 fill-current" />
          </Button>



          {/* Fullscreen Toggle */}
          <Button 
            onClick={toggleFullscreen} 
            variant="ghost" 
            size="icon" 
            className="h-11 w-11 text-slate-300 hover:bg-white/5"
            title="Fullscreen"
          >
            {isFullscreen ? <Minimize2 className="h-4.5 w-4.5" /> : <Maximize2 className="h-4.5 w-4.5" />}
          </Button>
        </div>
      </div>

      {/* Main Workspace Frame */}
      <div className="flex-1 flex overflow-hidden relative">
        
        {/* DESKTOP Left Sidebar: Page Thumbnails */}
        {sidebarOpen && (
          <div className="hidden md:flex w-[200px] border-r border-white/10 bg-[#0d1117]/30 flex-col shrink-0">
            <div className="p-3 border-b border-white/5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Pages ({numPages})
            </div>
            {renderThumbnailsList()}
          </div>
        )}

        {/* Center: Secure Document Viewer with full horizontal scroll and centering */}
        <div 
          ref={viewerRef}
          className="flex-1 flex flex-col overflow-hidden relative"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Top Info Bar inside viewer */}
          <div className="h-10 bg-slate-900/40 border-b border-white/5 flex items-center justify-between px-4 text-xs select-none">
            <div className="flex items-center gap-4">
              <span>Page {pageNum} of {numPages}</span>
            </div>

            {/* In-PDF Study Toolbar */}
            <div className="flex items-center gap-1.5">
              <Button 
                onClick={() => setActiveTool(activeTool === "note" ? "view" : "note")} 
                size="sm" 
                variant="ghost" 
                className={`h-7 text-[10px] rounded-lg ${activeTool === "note" ? "bg-amber-500/20 text-amber-300 animate-pulse" : "text-slate-300"}`}
              >
                + Pin Note
              </Button>
              <Button 
                onClick={() => setActiveTool(activeTool === "highlight" ? "view" : "highlight")} 
                size="sm" 
                variant="ghost" 
                className={`h-7 text-[10px] rounded-lg ${activeTool === "highlight" ? "bg-indigo-500/20 text-indigo-300 animate-pulse" : "text-slate-300"}`}
              >
                + Highlight
              </Button>
              {highlights.some(h => h.page === pageNum) && (
                <Button 
                  onClick={clearPageHighlights} 
                  size="sm" 
                  variant="ghost" 
                  className="h-7 text-[10px] text-rose-400 hover:text-rose-300"
                >
                  Clear Highlights
                </Button>
              )}
            </div>
          </div>

          {/* Secure Scrollable Center Canvas Viewport */}
          <div 
            ref={scrollRef}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
            onMouseMove={handleMouseMove}
            className={`flex-1 w-full overflow-auto flex justify-center items-start p-4 sm:p-6 bg-[#07070a]/90 relative ${
              activeTool === "view" ? (isDragging ? "cursor-grabbing select-none" : "cursor-grab") : ""
            }`}
          >
            {isLoading ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
                <p className="text-xs text-slate-400">Loading secure digital playbook asset...</p>
              </div>
            ) : error ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 max-w-sm mx-auto text-center px-4">
                <ShieldAlert className="w-12 h-12 text-rose-500" />
                <h3 className="text-white font-bold text-sm">Failed to Load Document</h3>
                <p className="text-xs text-slate-400">{error}</p>
                <Button onClick={() => router.back()} size="sm" className="bg-indigo-600 hover:bg-indigo-500 rounded-xl mt-2">
                  Go Back
                </Button>
              </div>
            ) : (
              /* Canvas Container box with watermark and annotation overlays */
              <div 
                className="relative border border-white/10 rounded-xl overflow-hidden shadow-2xl bg-white select-none shrink-0"
                onClick={handleCanvasClick}
                style={{ cursor: activeTool !== "view" ? "crosshair" : "default" }}
              >
                <canvas 
                  ref={canvasRef} 
                  className="block pointer-events-none select-none"
                  onContextMenu={(e) => e.preventDefault()}
                />

                {/* Diagonal Floating Student Security Watermark */}
                <div className="absolute inset-0 pointer-events-none select-none overflow-hidden flex items-center justify-center">
                  <div className="text-black/[0.04] dark:text-black/[0.05] font-black text-xl sm:text-3xl tracking-widest uppercase select-none pointer-events-none rotate-[-45deg] whitespace-nowrap">
                    {watermarkText}
                  </div>
                </div>

                {/* Page Interactive Sticky Notes overlays */}
                {notes
                  .filter((n) => n.page === pageNum)
                  .map((note) => (
                    <div
                      key={note.id}
                      className="absolute group z-20 cursor-pointer"
                      style={{ left: `${note.x}%`, top: `${note.y}%` }}
                      title={note.text}
                    >
                      <div className="w-6 h-6 rounded-full bg-amber-500 border border-white/20 shadow-md flex items-center justify-center text-xs font-bold text-slate-950 hover:scale-110 active:scale-95 transition">
                        📌
                      </div>
                      {/* Hover Tooltip */}
                      <div className="absolute left-7 top-0 w-48 bg-slate-900/95 border border-white/10 rounded-xl p-2.5 shadow-2xl text-[10px] text-slate-100 hidden group-hover:block z-30 leading-normal">
                        <p className="font-semibold mb-1 text-slate-400">Sticky Note:</p>
                        <p className="whitespace-pre-line text-white">{note.text}</p>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteNote(note.id);
                          }}
                          className="mt-1.5 text-[9px] text-rose-400 hover:text-rose-300 font-bold block"
                        >
                          [Delete Note]
                        </button>
                      </div>
                    </div>
                  ))}

                {/* Page Interactive Highlight Overlays */}
                {highlights
                  .filter((h) => h.page === pageNum)
                  .map((hl) => (
                    <div
                      key={hl.id}
                      className="absolute pointer-events-none mix-blend-multiply"
                      style={{ 
                        left: `${hl.x}%`, 
                        top: `${hl.y}%`, 
                        width: `${hl.width}%`, 
                        height: "2.5%", 
                        backgroundColor: hl.color 
                      }}
                    />
                  ))}
              </div>
            )}
          </div>

          {/* Sticky Bottom Control Bar for mobile viewports */}
          <div className="sticky bottom-0 z-30 bg-[#0d1117] border-t border-white/10 px-4 py-3 flex items-center justify-between md:hidden shrink-0">
            <Button 
              disabled={pageNum <= 1} 
              onClick={() => setPageNum(pageNum - 1)}
              variant="outline" 
              size="sm" 
              className="border-white/10 text-slate-300 hover:bg-white/5 rounded-xl h-9"
            >
              Prev
            </Button>
            <span className="text-xs">Page {pageNum} / {numPages}</span>
            <Button 
              disabled={pageNum >= numPages} 
              onClick={() => setPageNum(pageNum + 1)}
              variant="outline" 
              size="sm" 
              className="border-white/10 text-slate-300 hover:bg-white/5 rounded-xl h-9"
            >
              Next
            </Button>
          </div>
        </div>

        {/* DESKTOP Right Panel: Notes & Bookmarks Tabs */}
        {studyPanelOpen && (
          <div className="hidden md:flex w-[280px] border-l border-white/10 bg-[#0d1117]/30 flex-col shrink-0">
            {renderStudyDesk()}
          </div>
        )}
      </div>

      {/* Floating Action Buttons for Mobile Viewports */}
      <div className="md:hidden">
        {/* Bottom Left: Thumbnails Trigger */}
        <button
          onClick={() => setMobilePanel(mobilePanel === "thumbnails" ? null : "thumbnails")}
          className="fixed bottom-16 left-4 z-40 w-12 h-12 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white shadow-2xl flex items-center justify-center active:scale-95 transition"
          title="Open Pages"
        >
          <AlignJustify className="w-5 h-5" />
        </button>

        {/* Bottom Right: Notes Trigger */}
        <button
          onClick={() => setMobilePanel(mobilePanel === "notes" ? null : "notes")}
          className="fixed bottom-16 right-4 z-40 w-12 h-12 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white shadow-2xl flex items-center justify-center active:scale-95 transition"
          title="Open Notes"
        >
          <Edit3 className="w-5 h-5" />
        </button>
      </div>

      {/* Mobile Bottom Sheets */}
      {mobilePanel !== null && (
        <>
          {/* Dark Backdrop */}
          <div 
            onClick={() => setMobilePanel(null)}
            className="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm"
          />

          {/* Sheet Body */}
          <div className="fixed inset-x-0 bottom-0 z-50 h-[70vh] bg-[#0a0a0f]/95 border-t border-white/10 rounded-t-2xl flex flex-col overflow-hidden shadow-[0_-10px_40px_rgba(0,0,0,0.5)] transition-transform transform translate-y-0">
            {/* Sheet Handle */}
            <div className="w-12 h-1 bg-white/20 rounded-full mx-auto my-3 shrink-0" />

            <div className="flex items-center justify-between px-4 pb-2 border-b border-white/5 shrink-0">
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">
                {mobilePanel === "thumbnails" ? "Page Browser" : "Study Workspace"}
              </h3>
              <button 
                onClick={() => setMobilePanel(null)}
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {mobilePanel === "thumbnails" ? (
              <div className="flex-1 overflow-y-auto flex flex-col">
                {renderThumbnailsList()}
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto flex flex-col">
                {renderStudyDesk()}
              </div>
            )}
          </div>
        </>
      )}

      {/* Footer controls for larger screens */}
      <div className="hidden sm:flex h-11 bg-slate-900 border-t border-white/10 px-4 items-center justify-between text-[11px] text-slate-400 shrink-0">
        <span>Student: {userName} ({userEmail})</span>
        <div className="flex items-center gap-3">
          <Button 
            disabled={pageNum <= 1} 
            onClick={() => setPageNum(pageNum - 1)}
            variant="ghost" 
            size="sm" 
            className="h-8 hover:bg-white/5 text-slate-300 hover:text-white"
          >
            Previous
          </Button>
          <span>Page {pageNum} of {numPages}</span>
          <Button 
            disabled={pageNum >= numPages} 
            onClick={() => setPageNum(pageNum + 1)}
            variant="ghost" 
            size="sm" 
            className="h-8 hover:bg-white/5 text-slate-300 hover:text-white"
          >
            Next
          </Button>
        </div>
        <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
          <span>🔒 Secured PDF Reader Desk</span>
        </div>
      </div>
    </div>
  );
}
