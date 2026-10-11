"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, Lock, Eye, CheckCircle, HelpCircle, PlayCircle } from "lucide-react";

type LessonItem = {
  id: string;
  title: string;
  slug: string;
  contentType: string;
  isPreview: boolean;
  thumbnailUrl?: string | null;
};

type SectionItem = {
  id: string;
  title: string;
  lessons: LessonItem[];
};

type CourseDetailClientProps = {
  slug: string;
  description: string;
  sections: SectionItem[];
  isEnrolled: boolean;
  outcomes: string[];
};

function toLessonTypeLabel(type: string) {
  return type.toLowerCase();
}

export function CourseDetailClient({ slug, description, sections, isEnrolled, outcomes }: CourseDetailClientProps) {
  const [expandedSectionId, setExpandedSectionId] = useState<string | null>(sections[0]?.id || null);
  const [expandedDescription, setExpandedDescription] = useState(false);
  const hasLongDescription = description.length > 220;

  return (
    <div className="space-y-8">
      {/* Course Description */}
      <div className="bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-6 shadow-xl relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-violet-500/5 opacity-50 pointer-events-none" />
        <h2 className="text-lg font-bold text-white mb-3 tracking-wide">Course Overview</h2>
        <p className={`${expandedDescription ? "" : "line-clamp-4"} text-sm text-slate-300 leading-relaxed relative z-10`}>
          {description}
        </p>
        {hasLongDescription ? (
          <button
            type="button"
            className="mt-3 text-xs font-bold uppercase tracking-wider text-indigo-400 hover:text-indigo-300 transition-colors duration-200 relative z-10"
            onClick={() => setExpandedDescription((prev) => !prev)}
          >
            {expandedDescription ? "Show less" : "Show more"}
          </button>
        ) : null}
      </div>

      {/* Course Outcomes */}
      {outcomes.length ? (
        <div className="bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-6 shadow-xl relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-indigo-500/5 opacity-50 pointer-events-none" />
          <h2 className="mb-5 text-lg font-bold text-white tracking-wide flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
            What you'll master
          </h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative z-10">
            {outcomes.map((item, index) => (
              <li key={`${item}-${index}`} className="flex items-start gap-3 text-sm text-slate-300 leading-relaxed">
                <div className="mt-0.5 shrink-0 flex items-center justify-center h-5 w-5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.1)]">
                  <CheckCircle className="h-3 w-3" />
                </div>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {/* Curriculum Accordion */}
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white tracking-wide">Course Curriculum</h2>
          <span className="text-xs font-medium uppercase tracking-wider text-slate-400 bg-white/5 border border-white/10 px-2.5 py-1 rounded-full">
            {sections.reduce((acc, s) => acc + s.lessons.length, 0)} Lessons
          </span>
        </div>
        <div className="space-y-4">
          {sections.map((section) => {
            const isExpanded = expandedSectionId === section.id;
            return (
              <div
                key={section.id}
                className={`bg-white/5 border backdrop-blur-md rounded-2xl overflow-hidden transition-all duration-300 ${
                  isExpanded ? "border-indigo-500/30 shadow-[0_0_20px_rgba(99,102,241,0.05)]" : "border-white/10"
                }`}
              >
                <button
                  type="button"
                  onClick={() => setExpandedSectionId((prev) => (prev === section.id ? null : section.id))}
                  className="w-full px-5 py-4 flex items-center justify-between text-left transition-colors duration-200 hover:bg-white/[0.02]"
                >
                  <span className="flex items-center gap-3 font-semibold text-white text-sm sm:text-base">
                    <div className="p-1 rounded-lg bg-white/5 border border-white/10 group-hover:border-white/20 transition-colors">
                      <ChevronRight className={`h-4 w-4 text-slate-400 transition-transform duration-300 ease-out ${isExpanded ? "rotate-90 text-indigo-400" : ""}`} />
                    </div>
                    {section.title}
                  </span>
                  <span className="text-xs font-semibold text-slate-400 bg-white/5 px-2.5 py-1 rounded-full border border-white/5">
                    {section.lessons.length} {section.lessons.length === 1 ? "lesson" : "lessons"}
                  </span>
                </button>
                {isExpanded ? (
                  <div className="border-t border-white/10 bg-black/20 p-4 space-y-3">
                    {section.lessons.map((lesson) => (
                      <div
                        key={lesson.id}
                        className="group/lesson flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 rounded-2xl border border-white/10 bg-white/[0.03] p-3.5 sm:p-4 transition-all duration-300 hover:bg-white/[0.06] hover:border-indigo-500/40 hover:shadow-lg hover:shadow-indigo-500/10"
                      >
                        <div className="flex items-center gap-3.5 min-w-0 flex-1">
                          {lesson.thumbnailUrl ? (
                            <div className="relative h-14 w-24 rounded-xl overflow-hidden shrink-0 border border-white/15 bg-slate-900 shadow-md">
                              <Image
                                src={lesson.thumbnailUrl}
                                alt={lesson.title}
                                fill
                                sizes="96px"
                                className="object-cover transition-transform duration-300 group-hover/lesson:scale-105"
                              />
                            </div>
                          ) : (
                            <div className="h-12 w-12 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center shrink-0 text-indigo-400">
                              <PlayCircle className="h-6 w-6" />
                            </div>
                          )}

                          <div className="flex flex-col gap-1 min-w-0">
                            <span className="text-sm sm:text-base font-bold text-white group-hover/lesson:text-indigo-300 transition-colors line-clamp-1">
                              {lesson.title}
                            </span>
                            <div className="flex flex-wrap items-center gap-2">
                              <Badge variant="outline" className="text-[10px] uppercase tracking-wider font-extrabold border-indigo-500/30 text-indigo-300 bg-indigo-500/10 px-2 py-0.5 rounded-md">
                                {lesson.contentType === "QUIZ" ? "मॉक टेस्ट • 90 प्रश्न" : toLessonTypeLabel(lesson.contentType)}
                              </Badge>
                              {lesson.isPreview ? (
                                <span className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-wider font-extrabold text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 rounded-md">
                                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
                                  100% Free
                                </span>
                              ) : null}
                            </div>
                          </div>
                        </div>

                        {/* Action CTA with Pulsing Animated Glow */}
                        <div className="w-full sm:w-auto shrink-0 pt-1 sm:pt-0">
                          {lesson.isPreview || isEnrolled ? (
                            <Link
                              href={`/courses/${slug}/lessons/${lesson.slug}`}
                              className="relative group/btn w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs sm:text-sm font-black shadow-[0_0_20px_rgba(99,102,241,0.4)] hover:shadow-[0_0_25px_rgba(99,102,241,0.6)] border border-indigo-400/30 transition-all duration-300 hover:scale-[1.03] active:scale-95"
                            >
                              {/* Pulsing glow aura */}
                              <span className="absolute -inset-0.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 opacity-60 blur-sm group-hover/btn:opacity-100 transition-opacity -z-10 animate-pulse" />
                              
                              <PlayCircle className="h-4 w-4 fill-white/20 text-white shrink-0 group-hover/btn:scale-110 transition-transform" />
                              <span className="tracking-wide">टेस्ट शुरू करें (Start Test)</span>
                              <ChevronRight className="h-4 w-4 shrink-0 group-hover/btn:translate-x-1 transition-transform" />
                            </Link>
                          ) : (
                            <button
                              type="button"
                              onClick={() => {
                                document.getElementById("enroll-section")?.scrollIntoView({ behavior: "smooth" });
                              }}
                              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-300 bg-white/5 hover:bg-white/10 px-4 py-2.5 rounded-xl border border-white/10 transition"
                            >
                              <Lock className="h-3.5 w-3.5" />
                              Locked
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
