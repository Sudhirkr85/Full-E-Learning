"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  X, 
  Save, 
  Loader2,
  Video,
  FileText,
  HelpCircle,
  Radio
} from "lucide-react";
import { updateLessonAction } from "./actions";
import { CustomPopup } from "@/components/courses/custom-popup";

type LessonEditorModalProps = {
  courseId: string;
  lesson: any;
  onClose: () => void;
  onRefresh: () => void;
};

export function LessonEditorModal({
  courseId,
  lesson,
  onClose,
  onRefresh
}: LessonEditorModalProps) {
  const [isPending, startTransition] = useTransition();

  // State initialization
  const [title, setTitle] = useState(lesson.title);
  const [description, setDescription] = useState(lesson.description ?? "");
  const [youtubeVideoId, setYoutubeVideoId] = useState(() => {
    if (!lesson.youtubeUrl) return "";
    let url = lesson.youtubeUrl;
    if (url.includes("v=")) {
      return url.split("v=")[1]?.split("&")[0] ?? url;
    }
    return url;
  });
  const [pdfUrl, setPdfUrl] = useState(lesson.r2AssetUrl ?? "");
  const [accessType, setAccessType] = useState<"FREE" | "PAID">(lesson.isPreview ? "FREE" : "PAID");
  const [liveScheduledAt, setLiveScheduledAt] = useState(() => {
    if (!lesson.scheduledAt) return "";
    try {
      const d = new Date(lesson.scheduledAt);
      // Format as YYYY-MM-DDThh:mm for datetime-local input
      const pad = (n: number) => String(n).padStart(2, "0");
      return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
    } catch {
      return "";
    }
  });

  const [popup, setPopup] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    type: "alert" | "confirm";
    isError?: boolean;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: "",
    message: "",
    type: "alert",
    onConfirm: () => {}
  });

  const showAlert = (message: string, isError = true, title = "Lesson Editor Notification") => {
    setPopup({
      isOpen: true,
      title,
      message,
      type: "alert",
      isError,
      onConfirm: () => setPopup(prev => ({ ...prev, isOpen: false }))
    });
  };

  const handleSaveLesson = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      showAlert("Lesson title is required.");
      return;
    }

    if (lesson.contentType === "ARTICLE" && !pdfUrl.trim()) {
      showAlert("Please upload a PDF playbook file first.");
      return;
    }

    let youtubeUrl: string | undefined;
    if ((lesson.contentType === "VIDEO" || lesson.contentType === "LIVE") && youtubeVideoId.trim()) {
      let videoId = youtubeVideoId.trim();
      if (videoId.includes("youtu.be/")) {
        videoId = videoId.split("youtu.be/")[1]?.split("?")[0] ?? videoId;
      } else if (videoId.includes("v=")) {
        videoId = videoId.split("v=")[1]?.split("&")[0] ?? videoId;
      } else if (videoId.includes("youtube.com/live/")) {
        videoId = videoId.split("youtube.com/live/")[1]?.split("?")[0] ?? videoId;
      }
      youtubeUrl = `https://www.youtube.com/watch?v=${videoId}`;
    }

    startTransition(async () => {
      const res = await updateLessonAction(
        courseId,
        lesson.id,
        title,
        lesson.contentType,
        {
          description: description.trim() || undefined,
          youtubeUrl,
          r2AssetUrl: lesson.contentType === "ARTICLE" ? pdfUrl.trim() || undefined : undefined,
          isPreview: accessType === "FREE",
          scheduledAt: lesson.contentType === "LIVE" ? liveScheduledAt || undefined : undefined
        }
      );
      if (res.error) {
        showAlert(res.error);
      } else {
        onRefresh();
        onClose();
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#06060a]/95 backdrop-blur-xl flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#0f0f18] border border-white/10 rounded-2xl w-full max-w-xl shadow-2xl relative flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest font-mono">Curriculum Module Editor</span>
            <h2 className="text-lg font-bold text-white leading-none">Edit Details</h2>
          </div>
          <button onClick={onClose} className="h-8 w-8 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center text-slate-400 hover:text-white transition">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSaveLesson} className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-white/5">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              {lesson.contentType === "VIDEO" && <Video className="h-4 w-4 text-indigo-400" />}
              {lesson.contentType === "ARTICLE" && <FileText className="h-4 w-4 text-emerald-400" />}
              {lesson.contentType === "QUIZ" && <HelpCircle className="h-4 w-4 text-amber-400" />}
              {lesson.contentType === "LIVE" && <Radio className="h-4 w-4 text-rose-400 animate-pulse" />}
              {lesson.contentType} Lesson Details
            </h4>
          </div>

          <div className="space-y-3">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Lesson Title</label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Lesson Title" className="bg-white/5 border-white/10 text-white" required />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Description (Optional)</label>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Enter details..." className="w-full min-h-20 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white outline-none focus:ring-1 focus:ring-indigo-500" />
            </div>
            
            {(lesson.contentType === "VIDEO" || lesson.contentType === "LIVE") && (
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">YouTube URL</label>
                <Input value={youtubeVideoId} onChange={(e) => setYoutubeVideoId(e.target.value)} placeholder="YouTube URL (e.g. https://youtube.com/watch?v=xxxxx)" className="bg-white/5 border-white/10 text-white" required />
              </div>
            )}

            {lesson.contentType === "LIVE" && (
              <div className="space-y-1.5 text-left">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300">Scheduled Date & Time (IST)</label>
                <Input type="datetime-local" value={liveScheduledAt} onChange={(e) => setLiveScheduledAt(e.target.value)} className="bg-[#0a0f24] border-white/10 text-white" required />
              </div>
            )}
            
            {lesson.contentType === "ARTICLE" && (
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">PDF Playbook</label>
                <div className="flex items-center gap-2">
                  <input 
                    type="file" 
                    accept="application/pdf"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      const formData = new FormData();
                      formData.append("pdf", file);
                      
                      const label = document.getElementById("edit-pdf-upload-label");
                      if (label) label.innerText = "Uploading PDF...";
                      
                      try {
                        const res = await fetch("/api/courses/upload-pdf", {
                          method: "POST",
                          body: formData
                        });
                        const data = await res.json();
                        if (data.pdfUrl) {
                          setPdfUrl(data.pdfUrl);
                          if (label) label.innerText = "PDF Uploaded successfully!";
                        } else {
                          alert(data.error || "Upload failed.");
                          if (label) label.innerText = "Upload failed.";
                        }
                      } catch (err) {
                        alert("Upload failed.");
                        if (label) label.innerText = "Upload failed.";
                      }
                    }}
                    className="hidden" 
                    id="edit-pdf-file-upload" 
                  />
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="text-xs h-9 border-indigo-500/20 text-indigo-300 bg-indigo-500/5 hover:bg-indigo-600 hover:text-white"
                    onClick={() => document.getElementById("edit-pdf-file-upload")?.click()}
                  >
                    Change PDF File
                  </Button>
                  <span id="edit-pdf-upload-label" className="text-[10px] text-slate-400">
                    {pdfUrl ? "Currently uploaded playbook present" : "Max size 50 MB"}
                  </span>
                </div>
              </div>
            )}

            <div className="flex gap-4 items-center pt-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Access</span>
              <div className="flex gap-2">
                <button type="button" onClick={() => setAccessType("PAID")} className={`px-3 py-1 rounded text-xs font-semibold border ${accessType === "PAID" ? "bg-indigo-600/30 border-indigo-500/50 text-indigo-300" : "bg-white/5 border-white/10 text-slate-400"}`}>Paid</button>
                <button type="button" onClick={() => setAccessType("FREE")} className={`px-3 py-1 rounded text-xs font-semibold border ${accessType === "FREE" ? "bg-emerald-600/30 border-emerald-500/50 text-emerald-300" : "bg-white/5 border-white/10 text-slate-400"}`}>Free Preview</button>
              </div>
            </div>
          </div>

          {/* Save footer */}
          <div className="pt-4 border-t border-white/10 flex gap-2 justify-end">
            <Button 
              type="button" 
              onClick={onClose} 
              className="rounded-xl text-xs h-10 px-4 bg-white/5 border border-white/5 text-slate-300 hover:bg-white/10 hover:text-white transition-all"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isPending} 
              className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs h-10 px-5 font-bold uppercase tracking-wider shadow-lg shadow-indigo-600/15"
            >
              {isPending ? <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" /> : <Save className="mr-1.5 h-4 w-4" />}
              Save Changes
            </Button>
          </div>
        </form>
      </div>

      <CustomPopup
        isOpen={popup.isOpen}
        title={popup.title}
        message={popup.message}
        type={popup.type}
        isError={popup.isError}
        onConfirm={popup.onConfirm}
      />
    </div>
  );
}
