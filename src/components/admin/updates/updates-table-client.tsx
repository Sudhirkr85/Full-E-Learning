"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { UpdatePostData } from "@/lib/updates/types";
import { Plus, Edit, Trash2, ExternalLink, Loader2 } from "lucide-react";

interface UpdatesTableClientProps {
  initialUpdates: UpdatePostData[];
}

export function UpdatesTableClient({ initialUpdates }: UpdatesTableClientProps) {
  const router = useRouter();
  const [updates, setUpdates] = useState<UpdatePostData[]>(initialUpdates);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async (id: string, title: string) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete update:\n"${title}"?\nThis action cannot be undone.`
    );
    if (!confirmed) return;

    setDeletingId(id);
    setError(null);

    try {
      const res = await fetch(`/api/admin/updates/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to delete update");
      }

      setUpdates(updates.filter((u) => u.id !== id));
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Delete error");
    } finally {
      setDeletingId(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PUBLISHED":
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            PUBLISHED
          </span>
        );
      case "EXPIRED":
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-500/20 text-amber-400 border border-amber-500/30">
            EXPIRED
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-700/60 text-slate-300 border border-white/10">
            DRAFT
          </span>
        );
    }
  };

  const getTypeBadge = (type: string) => {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-indigo-500/15 text-indigo-300 border border-indigo-500/20">
        {type}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Updates & Exam Alerts
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Publish admit cards, application dates, results, answer keys, and evergreen guides.
          </p>
        </div>
        <Link
          href="/admin/updates/new"
          className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs sm:text-sm font-semibold text-white shadow hover:bg-indigo-500 self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          <span>New Update</span>
        </Link>
      </div>

      {error && (
        <div className="rounded-xl border border-red-500/30 bg-red-950/40 p-4 text-xs text-red-300">
          ⚠️ {error}
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border border-white/10 bg-slate-900/60 shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm text-slate-300">
            <thead className="bg-slate-950/80 border-b border-white/10 text-slate-400 uppercase text-[10px] font-bold tracking-wider">
              <tr>
                <th className="py-3 px-4">Title / Slug</th>
                <th className="py-3 px-3">Type</th>
                <th className="py-3 px-3">State</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3">Updated</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-normal">
              {updates.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500 italic">
                    No updates found. Click &quot;New Update&quot; to create your first exam update.
                  </td>
                </tr>
              ) : (
                updates.map((update) => (
                  <tr
                    key={update.id}
                    className="hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="py-3 px-4 max-w-sm">
                      <div className="font-semibold text-white line-clamp-1">
                        {update.title}
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono line-clamp-1 mt-0.5">
                        /updates/{update.slug}
                      </div>
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap">
                      {getTypeBadge(update.type)}
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap text-xs text-slate-300">
                      {update.state || "—"}
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap">
                      {getStatusBadge(update.status)}
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap text-xs text-slate-400">
                      {new Date(update.updatedAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-2">
                        {update.status !== "DRAFT" && (
                          <Link
                            href={`/updates/${update.slug}`}
                            target="_blank"
                            className="p-1.5 rounded-lg border border-white/10 bg-white/5 text-slate-300 hover:text-white hover:bg-white/10"
                            title="View Public Page"
                          >
                            <ExternalLink className="h-3.5 w-3.5" />
                          </Link>
                        )}
                        <Link
                          href={`/admin/updates/${update.id}/edit`}
                          className="p-1.5 rounded-lg border border-indigo-500/30 bg-indigo-600/10 text-indigo-300 hover:bg-indigo-600/20"
                          title="Edit Update"
                        >
                          <Edit className="h-3.5 w-3.5" />
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleDelete(update.id, update.title)}
                          disabled={deletingId === update.id}
                          className="p-1.5 rounded-lg border border-red-500/30 bg-red-950/20 text-red-400 hover:bg-red-950/40 disabled:opacity-40"
                          title="Delete Update"
                        >
                          {deletingId === update.id ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          ) : (
                            <Trash2 className="h-3.5 w-3.5" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
