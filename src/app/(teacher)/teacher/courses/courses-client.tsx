"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { publishCourseAction, archiveCourseAction, deleteCourseAction } from "./actions";

export function CoursesSearchFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialQ = searchParams.get("q") || "";
  const initialFilter = searchParams.get("filter") || "ALL";

  const [q, setQ] = useState(initialQ);
  const [filter, setFilter] = useState(initialFilter);
  const [, startTransition] = useTransition();

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      startTransition(() => {
        const params = new URLSearchParams(searchParams.toString());
        if (q.trim()) {
          params.set("q", q.trim());
        } else {
          params.delete("q");
        }
        params.set("page", "0");
        router.push(`/teacher/courses?${params.toString()}`);
      });
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [q, router, searchParams]);

  const handleFilterChange = (newFilter: string) => {
    setFilter(newFilter);
    const params = new URLSearchParams(searchParams.toString());
    if (newFilter !== "ALL") {
      params.set("filter", newFilter);
    } else {
      params.delete("filter");
    }
    params.set("page", "0");
    router.push(`/teacher/courses?${params.toString()}`);
  };

  const statuses = ["ALL", "DRAFT", "PUBLISHED", "ARCHIVED"];

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between w-full">
      <div className="relative max-w-md w-full">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search courses by title..."
          className="pl-9 bg-white/5 border-white/10 text-white placeholder-slate-500 focus-visible:ring-indigo-500"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>

      <div className="flex flex-wrap gap-1.5 bg-[#090d20]/80 p-1 rounded-xl border border-white/5 w-fit">
        {statuses.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => handleFilterChange(s)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-300 ${
              filter === s
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/10"
                : "text-slate-400 hover:text-white hover:bg-white/5"
            }`}
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}

export function CourseActionButtons({ courseId, status }: { courseId: string; status: string }) {
  const [isPending, startTransition] = useTransition();
  const [confirmConfig, setConfirmConfig] = useState<{
    title: string;
    message: string;
    confirmText: string;
    confirmVariant: "emerald" | "amber" | "red";
    action: () => void;
  } | null>(null);

  const handlePublish = () => {
    setConfirmConfig({
      title: "Publish Course",
      message: "Are you sure you want to publish this course? It will become visible in the public catalog.",
      confirmText: "Publish Now",
      confirmVariant: "emerald",
      action: () => {
        startTransition(async () => {
          const res = await publishCourseAction(courseId);
          if (res.error) alert(res.error);
        });
      }
    });
  };

  const handleArchive = () => {
    setConfirmConfig({
      title: "Archive Course",
      message: "Are you sure you want to archive this course?",
      confirmText: "Archive",
      confirmVariant: "amber",
      action: () => {
        startTransition(async () => {
          const res = await archiveCourseAction(courseId);
          if (res.error) alert(res.error);
        });
      }
    });
  };

  const handleDelete = () => {
    setConfirmConfig({
      title: "Delete Course",
      message: "Are you sure you want to permanently delete this DRAFT course? This cannot be undone.",
      confirmText: "Delete Permanently",
      confirmVariant: "red",
      action: () => {
        startTransition(async () => {
          const res = await deleteCourseAction(courseId);
          if (res.error) alert(res.error);
        });
      }
    });
  };

  return (
    <>
      <div className="flex items-center gap-1.5 justify-end">
        {status === "DRAFT" && (
          <>
            <Button
              onClick={handlePublish}
              disabled={isPending}
              variant="outline"
              size="sm"
              className="text-emerald-400 hover:text-emerald-300 border-emerald-500/20 bg-emerald-500/5 hover:bg-emerald-500/10 rounded-xl"
            >
              Publish
            </Button>
            <Button
              onClick={handleDelete}
              disabled={isPending}
              variant="outline"
              size="sm"
              className="text-red-400 hover:text-red-300 border-red-500/20 bg-red-500/5 hover:bg-red-500/10 rounded-xl"
            >
              Delete
            </Button>
          </>
        )}

        {status === "PUBLISHED" && (
          <Button
            onClick={handleArchive}
            disabled={isPending}
            variant="outline"
            size="sm"
            className="text-amber-400 hover:text-amber-300 border-amber-500/20 bg-amber-500/5 hover:bg-amber-500/10 rounded-xl"
          >
            Archive
          </Button>
        )}

        {status === "ARCHIVED" && (
          <Button
            onClick={handlePublish}
            disabled={isPending}
            variant="outline"
            size="sm"
            className="text-emerald-400 hover:text-emerald-300 border-emerald-500/20 bg-emerald-500/5 hover:bg-emerald-500/10 rounded-xl"
          >
            Republish
          </Button>
        )}
      </div>

      {confirmConfig && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md overflow-hidden bg-[#0b0f19] border border-white/10 rounded-2xl shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-white">
                {confirmConfig.title}
              </h3>
              <p className="mt-2 text-sm text-slate-400">
                {confirmConfig.message}
              </p>
            </div>
            <div className="flex items-center justify-end gap-2 px-6 py-4 bg-white/5 border-t border-white/5">
              <button
                onClick={() => setConfirmConfig(null)}
                disabled={isPending}
                className="px-4 py-2 text-xs font-semibold text-slate-400 transition-all rounded-xl hover:text-white hover:bg-white/5"
              >
                Cancel
              </button>
              <Button
                onClick={() => {
                  confirmConfig.action();
                  setConfirmConfig(null);
                }}
                disabled={isPending}
                size="sm"
                className={`rounded-xl border-none font-semibold text-white transition-all ${
                  confirmConfig.confirmVariant === "emerald"
                    ? "bg-emerald-500 hover:bg-emerald-600"
                    : confirmConfig.confirmVariant === "amber"
                    ? "bg-amber-500 hover:bg-amber-600"
                    : "bg-red-500 hover:bg-red-600"
                }`}
              >
                {confirmConfig.confirmText}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
