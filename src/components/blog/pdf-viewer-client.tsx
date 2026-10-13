"use client";

import React, { useState } from "react";
import { FileText, Maximize2, ExternalLink, Eye, EyeOff } from "lucide-react";
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

  // Anti-theft: prevent Ctrl+S, Ctrl+P, and Print attempts
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && (e.key === "s" || e.key === "p" || e.key === "S" || e.key === "P")) {
        e.preventDefault();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      <style>{`
        @media print {
          body { display: none !important; }
        }
      `}</style>
      <div
        onContextMenu={(e) => e.preventDefault()}
        className="my-8 overflow-hidden rounded-2xl border-2 border-indigo-500/30 bg-slate-900/90 shadow-2xl select-none"
      >
        {/* Viewer Header Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 bg-gradient-to-r from-indigo-950/80 via-slate-900 to-slate-900 p-4">
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
            <button
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

            <PyqDownloadButton
              slug={slug}
              pdfTitle={pdfFileName}
              isAdmin={isAdmin}
              className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 px-3.5 py-1.5 text-xs font-bold text-slate-950 shadow transition hover:from-amber-400 hover:to-orange-400"
            />
          </div>
        </div>

        {/* Embedded PDF Frame - Served via secure internal proxy */}
        {showViewer && (
          <div className="relative w-full bg-slate-950">
            <iframe
              src={`/api/pyq/${slug}/preview#toolbar=0&navpanes=0`}
              title={pdfFileName}
              className="h-[600px] w-full border-0 sm:h-[750px]"
            />

            {/* Mobile Overlay Note */}
            <div className="flex items-center justify-between border-t border-white/10 bg-slate-900/90 px-4 py-2 text-xs text-slate-400">
              <span>
                💡 मोबाइल में प्रश्न पत्र को स्पष्ट पढ़ने के लिए दो उंगलियों (Pinch to Zoom) से ज़ूम कर सकते हैं।
              </span>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
