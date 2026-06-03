"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Loader2, Video, Radio, Lock, Unlock, Calendar, Clock } from "lucide-react";
import { createSectionAction, createLessonAction } from "./actions";

export function AddSectionForm({ courseId }: { courseId: string }) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    startTransition(async () => {
      const res = await createSectionAction(courseId, title);
      if (res.error) {
        alert(res.error);
      } else {
        setTitle("");
        setIsFormOpen(false);
      }
    });
  };

  return (
    <div className="mt-4">
      {isFormOpen ? (
        <form onSubmit={handleSubmit} className="flex gap-2 items-center">
          <Input
            placeholder="Enter section title..."
            className="bg-white/5 border-white/10 text-white placeholder-slate-500 max-w-sm focus-visible:ring-indigo-500"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={isPending}
            required
            autoFocus
          />
          <Button type="submit" disabled={isPending} size="sm" className="bg-indigo-600 hover:bg-indigo-500 rounded-xl">
            {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save"}
          </Button>
          <Button
            type="button"
            onClick={() => setIsFormOpen(false)}
            variant="ghost"
            size="sm"
            className="text-slate-400 hover:text-white rounded-xl"
            disabled={isPending}
          >
            Cancel
          </Button>
        </form>
      ) : (
        <Button
          onClick={() => setIsFormOpen(true)}
          variant="outline"
          size="sm"
          className="border-dashed border-white/10 bg-white/5 text-slate-200 hover:bg-white/10 rounded-xl"
        >
          <Plus className="h-4 w-4 mr-2" /> Add Section
        </Button>
      )}
    </div>
  );
}

type SessionType = "RECORDED" | "LIVE";
type AccessType = "FREE" | "PAID";
type ContentType = "VIDEO" | "ARTICLE" | "RESOURCE";

export function AddLessonForm({ courseId, sectionId }: { courseId: string; sectionId: string }) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [sessionType, setSessionType] = useState<SessionType>("RECORDED");
  const [youtubeVideoId, setYoutubeVideoId] = useState("");
  const [accessType, setAccessType] = useState<AccessType>("PAID");
  const [liveDateTime, setLiveDateTime] = useState("");
  const [publishDate, setPublishDate] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    // Map session type to content type
    const contentType: ContentType = sessionType === "LIVE" ? "VIDEO" : "VIDEO";

    // Build YouTube URL from video ID
    let youtubeUrl: string | undefined;
    if (youtubeVideoId.trim()) {
      // Accept video ID or short link like youtu.be/ID
      let videoId = youtubeVideoId.trim();
      if (videoId.includes("youtu.be/")) {
        videoId = videoId.split("youtu.be/")[1]?.split("?")[0] ?? videoId;
      } else if (videoId.includes("v=")) {
        videoId = videoId.split("v=")[1]?.split("&")[0] ?? videoId;
      }
      youtubeUrl = `https://www.youtube.com/watch?v=${videoId}`;
    }

    startTransition(async () => {
      const res = await createLessonAction(courseId, sectionId, title, contentType, {
        description: description.trim() || undefined,
        youtubeUrl,
        sessionType,
        accessType,
        liveDateTime: sessionType === "LIVE" ? liveDateTime : undefined,
        publishDate: sessionType === "RECORDED" ? publishDate : undefined,
        isPreview: accessType === "FREE",
      });
      if (res.error) {
        alert(res.error);
      } else {
        setTitle("");
        setDescription("");
        setYoutubeVideoId("");
        setLiveDateTime("");
        setPublishDate("");
        setSessionType("RECORDED");
        setAccessType("PAID");
        setIsFormOpen(false);
      }
    });
  };

  return (
    <div className="mt-2">
      {isFormOpen ? (
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-3 p-4 bg-white/[0.02] border border-white/5 rounded-xl"
        >
          {/* Session Title */}
          <Input
            placeholder="Session title..."
            className="bg-white/5 border-white/10 text-white placeholder-slate-500 focus-visible:ring-indigo-500"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={isPending}
            required
            autoFocus
          />

          {/* Session Description */}
          <Input
            placeholder="Session description (optional)"
            className="bg-white/5 border-white/10 text-white placeholder-slate-500 focus-visible:ring-indigo-500"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={isPending}
          />

          {/* Session Type & Access Type row */}
          <div className="grid grid-cols-2 gap-2">
            {/* Session Type */}
            <div className="space-y-1">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Session Type</p>
              <div className="flex gap-1.5">
                <button
                  type="button"
                  onClick={() => setSessionType("RECORDED")}
                  disabled={isPending}
                  className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[11px] font-semibold border transition duration-200 ${
                    sessionType === "RECORDED"
                      ? "bg-indigo-600/30 border-indigo-500/50 text-indigo-300"
                      : "bg-white/5 border-white/10 text-slate-400 hover:text-white"
                  }`}
                >
                  <Video className="h-3 w-3" /> Recorded
                </button>
                <button
                  type="button"
                  onClick={() => setSessionType("LIVE")}
                  disabled={isPending}
                  className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[11px] font-semibold border transition duration-200 ${
                    sessionType === "LIVE"
                      ? "bg-rose-600/30 border-rose-500/50 text-rose-300"
                      : "bg-white/5 border-white/10 text-slate-400 hover:text-white"
                  }`}
                >
                  <Radio className="h-3 w-3" /> Live
                </button>
              </div>
            </div>

            {/* Access Type */}
            <div className="space-y-1">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Access Type</p>
              <div className="flex gap-1.5">
                <button
                  type="button"
                  onClick={() => setAccessType("PAID")}
                  disabled={isPending}
                  className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[11px] font-semibold border transition duration-200 ${
                    accessType === "PAID"
                      ? "bg-amber-600/30 border-amber-500/50 text-amber-300"
                      : "bg-white/5 border-white/10 text-slate-400 hover:text-white"
                  }`}
                >
                  <Lock className="h-3 w-3" /> Paid
                </button>
                <button
                  type="button"
                  onClick={() => setAccessType("FREE")}
                  disabled={isPending}
                  className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[11px] font-semibold border transition duration-200 ${
                    accessType === "FREE"
                      ? "bg-emerald-600/30 border-emerald-500/50 text-emerald-300"
                      : "bg-white/5 border-white/10 text-slate-400 hover:text-white"
                  }`}
                >
                  <Unlock className="h-3 w-3" /> Free
                </button>
              </div>
            </div>
          </div>

          {/* YouTube Video ID */}
          <div className="space-y-1">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">YouTube URL</p>
            <div className="relative">
              <Video className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-500" />
              <Input
                placeholder="e.g. https://youtube.com/watch?v=dQw4w9WgXcQ"
                className="pl-9 bg-white/5 border-white/10 text-white placeholder-slate-500 focus-visible:ring-indigo-500 text-xs"
                value={youtubeVideoId}
                onChange={(e) => setYoutubeVideoId(e.target.value)}
                disabled={isPending}
              />
            </div>
          </div>

          {/* Conditional date fields */}
          {sessionType === "LIVE" && (
            <div className="space-y-1">
              <p className="text-[10px] font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1">
                <Clock className="h-3 w-3" /> Live Date &amp; Time
              </p>
              <Input
                type="datetime-local"
                className="bg-white/5 border-white/10 text-white focus-visible:ring-rose-500 text-xs"
                value={liveDateTime}
                onChange={(e) => setLiveDateTime(e.target.value)}
                disabled={isPending}
                required
              />
            </div>
          )}

          {sessionType === "RECORDED" && (
            <div className="space-y-1">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                <Calendar className="h-3 w-3" /> Publish Date
              </p>
              <Input
                type="date"
                className="bg-white/5 border-white/10 text-white focus-visible:ring-indigo-500 text-xs"
                value={publishDate}
                onChange={(e) => setPublishDate(e.target.value)}
                disabled={isPending}
              />
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-1.5 pt-1">
            <Button type="submit" disabled={isPending} size="sm" className="bg-indigo-600 hover:bg-indigo-500 rounded-xl">
              {isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : "Save Session"}
            </Button>
            <Button
              type="button"
              onClick={() => setIsFormOpen(false)}
              variant="ghost"
              size="sm"
              className="text-slate-400 hover:text-white rounded-xl"
              disabled={isPending}
            >
              Cancel
            </Button>
          </div>
        </form>
      ) : (
        <Button
          onClick={() => setIsFormOpen(true)}
          variant="ghost"
          size="sm"
          className="text-indigo-400 hover:text-indigo-300 hover:bg-white/5 rounded-xl text-xs py-1 h-7"
        >
          <Plus className="h-3 w-3 mr-1" /> Add Session
        </Button>
      )}
    </div>
  );
}
