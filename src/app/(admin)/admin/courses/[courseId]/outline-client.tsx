"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Loader2 } from "lucide-react";
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

export function AddLessonForm({ courseId, sectionId }: { courseId: string; sectionId: string }) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [contentType, setContentType] = useState<"VIDEO" | "ARTICLE" | "RESOURCE">("VIDEO");
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    startTransition(async () => {
      const res = await createLessonAction(courseId, sectionId, title, contentType);
      if (res.error) {
        alert(res.error);
      } else {
        setTitle("");
        setIsFormOpen(false);
      }
    });
  };

  return (
    <div className="mt-2">
      {isFormOpen ? (
        <form onSubmit={handleSubmit} className="flex flex-col gap-2 p-3 bg-white/[0.02] border border-white/5 rounded-xl max-w-md">
          <Input
            placeholder="Enter lesson title..."
            className="bg-white/5 border-white/10 text-white placeholder-slate-500 focus-visible:ring-indigo-500"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={isPending}
            required
            autoFocus
          />
          <div className="flex gap-2 items-center">
            <select
              value={contentType}
              onChange={(e) => setContentType(e.target.value as any)}
              className="bg-[#0b0f1e] border border-white/10 text-slate-200 text-xs rounded-xl p-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              disabled={isPending}
            >
              <option value="VIDEO">Video Lesson</option>
              <option value="ARTICLE">Article Text</option>
              <option value="RESOURCE">Resource Asset</option>
            </select>
            <div className="ml-auto flex gap-1.5">
              <Button type="submit" disabled={isPending} size="sm" className="bg-indigo-600 hover:bg-indigo-500 rounded-xl">
                {isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : "Save"}
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
          </div>
        </form>
      ) : (
        <Button
          onClick={() => setIsFormOpen(true)}
          variant="ghost"
          size="sm"
          className="text-indigo-400 hover:text-indigo-300 hover:bg-white/5 rounded-xl text-xs py-1 h-7"
        >
          <Plus className="h-3 w-3 mr-1" /> Add Lesson
        </Button>
      )}
    </div>
  );
}
