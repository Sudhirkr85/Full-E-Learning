"use client";

import React, { useState } from "react";
import Link from "next/link";
import { UpdatePostData } from "@/lib/updates/types";
import { Calendar, ArrowRight, AlertTriangle, Sparkles, Filter } from "lucide-react";

interface UpdatesFilterClientProps {
  initialPosts: UpdatePostData[];
}

const TYPE_LABELS: Record<string, string> = {
  ALL: "सभी अपडेट्स (All)",
  ADMIT_CARD: "प्रवेश पत्र (Admit Card)",
  APPLY: "ऑनलाइन आवेदन (Apply)",
  RESULT: "परीक्षा परिणाम (Result)",
  ANSWER_KEY: "उत्तर कुंजी (Answer Key)",
  SYLLABUS: "पाठ्यक्रम (Syllabus)",
  GUIDE: "मार्गदर्शिका (Guides)",
  NEWS: "ताज़ा सूचनाएं (News)",
};

export function UpdatesFilterClient({ initialPosts }: UpdatesFilterClientProps) {
  const [selectedType, setSelectedType] = useState<string>("ALL");
  const [selectedExam, setSelectedExam] = useState<string>("ALL");

  // Get distinct exams
  const exams = ["ALL", ...Array.from(new Set(initialPosts.map((p) => p.exam).filter(Boolean)))];

  const filtered = initialPosts.filter((post) => {
    const matchesType = selectedType === "ALL" || post.type === selectedType;
    const matchesExam = selectedExam === "ALL" || post.exam.toLowerCase() === selectedExam.toLowerCase();
    return matchesType && matchesExam;
  });

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "ADMIT_CARD":
        return "bg-rose-50 text-rose-800 border-rose-200";
      case "RESULT":
        return "bg-emerald-50 text-emerald-800 border-emerald-200";
      case "APPLY":
        return "bg-amber-50 text-amber-900 border-amber-200";
      case "ANSWER_KEY":
        return "bg-sky-50 text-sky-800 border-sky-200";
      case "GUIDE":
        return "bg-purple-50 text-purple-800 border-purple-200";
      default:
        return "bg-indigo-50 text-indigo-800 border-indigo-200";
    }
  };

  return (
    <div className="space-y-8">
      {/* Filter Controls */}
      <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 shadow-xs">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider">
          <Filter className="h-3.5 w-3.5 text-indigo-600" />
          <span>अपडेट्स फ़िल्टर करें</span>
        </div>

        {/* Type Filter Chips */}
        <div className="flex flex-wrap gap-2">
          {Object.entries(TYPE_LABELS).map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => setSelectedType(key)}
              className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition ${
                selectedType === key
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200 border border-slate-200"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Exam Filter Chips (if more than 1 exam) */}
        {exams.length > 2 && (
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
            <span className="text-xs text-slate-500 font-medium">परीक्षा:</span>
            {exams.map((ex) => (
              <button
                key={ex}
                type="button"
                onClick={() => setSelectedExam(ex)}
                className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
                  selectedExam === ex
                    ? "bg-amber-500 text-slate-950 font-bold shadow-xs"
                    : "bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200"
                }`}
              >
                {ex === "ALL" ? "सभी परीक्षाएं" : ex}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Posts Grid */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center text-slate-500 shadow-xs">
          <p className="text-sm">चयनित फ़िल्टर के लिए कोई अपडेट उपलब्ध नहीं है।</p>
          <button
            type="button"
            onClick={() => {
              setSelectedType("ALL");
              setSelectedExam("ALL");
            }}
            className="mt-3 text-xs font-bold text-indigo-600 hover:underline"
          >
            फ़िल्टर रीसेट करें
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((post) => (
            <article
              key={post.id}
              className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-xs transition hover:border-indigo-400 hover:shadow-md"
            >
              <div>
                {/* Meta Header */}
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <span
                    className={`inline-flex items-center rounded-lg px-2.5 py-0.5 text-[10px] font-bold border ${getTypeBadge(
                      post.type
                    )}`}
                  >
                    {TYPE_LABELS[post.type] || post.type}
                  </span>

                  {post.state && (
                    <span className="inline-flex items-center rounded-lg bg-slate-100 border border-slate-200 px-2 py-0.5 text-[10px] text-slate-700 font-medium">
                      {post.state}
                    </span>
                  )}

                  {post.status === "EXPIRED" && (
                    <span className="inline-flex items-center gap-1 rounded-lg bg-amber-50 border border-amber-200 px-2 py-0.5 text-[10px] font-bold text-amber-800">
                      <AlertTriangle className="h-3 w-3 text-amber-600" />
                      <span>पुराना अपडेट</span>
                    </span>
                  )}
                </div>

                {/* Title */}
                <h2 className="text-base sm:text-lg font-bold text-slate-900 hover:text-indigo-600 transition leading-snug font-display">
                  <Link href={`/updates/${post.slug}`}>{post.title}</Link>
                </h2>

                {/* Summary */}
                <p className="mt-2.5 text-xs sm:text-sm text-slate-600 line-clamp-3 leading-relaxed">
                  {post.summary}
                </p>
              </div>

              {/* Card Footer */}
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span className="inline-flex items-center gap-1.5 text-[11px] font-medium">
                  <Calendar className="h-3.5 w-3.5 text-slate-400" />
                  <span>
                    {new Date(post.publishedAt || post.createdAt).toLocaleDateString("hi-IN", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                </span>

                <Link
                  href={`/updates/${post.slug}`}
                  className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-800 transition group"
                >
                  <span>विस्तार से पढ़ें</span>
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
