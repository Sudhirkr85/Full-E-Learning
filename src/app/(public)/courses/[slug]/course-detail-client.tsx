"use client";

import Link from "next/link";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, Lock, Eye, CheckCircle } from "lucide-react";

type LessonItem = {
  id: string;
  title: string;
  slug: string;
  contentType: string;
  isPreview: boolean;
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
  const [expandedSectionId, setExpandedSectionId] = useState<string | null>(null);
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
                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-white/5 bg-white/[0.02] p-4 transition-all duration-200 hover:bg-white/5 hover:border-white/10"
                      >
                        <div className="flex flex-wrap items-center gap-2 min-w-0">
                          <span className="text-sm font-medium text-slate-200 truncate">{lesson.title}</span>
                          <Badge variant="outline" className="text-[10px] uppercase tracking-wider font-bold border-white/10 text-slate-400 px-2 py-0.5 rounded">
                            {toLessonTypeLabel(lesson.contentType)}
                          </Badge>
                          {lesson.isPreview ? (
                            <Badge variant="secondary" className="text-[10px] uppercase tracking-wider font-bold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 px-2 py-0.5 rounded flex items-center gap-1">
                              <Eye className="h-3 w-3" />
                              Preview
                            </Badge>
                          ) : null}
                        </div>
                        <div className="self-start sm:self-center shrink-0">
                          {lesson.isPreview ? (
                            <Link
                              href={`/courses/${slug}/lessons/${lesson.slug}`}
                              className="inline-flex items-center text-xs font-bold uppercase tracking-wider text-indigo-400 hover:text-indigo-300 transition-colors duration-200"
                            >
                              Start Preview
                              <ChevronRight className="h-3 w-3 ml-1" />
                            </Link>
                          ) : isEnrolled ? (
                            <Link
                              href={`/courses/${slug}/lessons/${lesson.slug}`}
                              className="inline-flex items-center text-xs font-bold uppercase tracking-wider text-emerald-400 hover:text-emerald-300 transition-colors duration-200"
                            >
                              Learn Now
                              <ChevronRight className="h-3 w-3 ml-1" />
                            </Link>
                          ) : (
                            <button
                              type="button"
                              onClick={() => {
                                document.getElementById("enroll-section")?.scrollIntoView({ behavior: "smooth" });
                              }}
                              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-300 bg-white/5 hover:bg-white/10 px-2.5 py-1 rounded-full border border-white/5 transition"
                            >
                              <Lock className="h-3 w-3" />
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
