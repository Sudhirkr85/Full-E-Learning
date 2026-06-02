"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  PlayCircle, 
  FileText, 
  Lock, 
  CheckCircle, 
  ArrowLeft, 
  ArrowRight, 
  Sparkles, 
  Trophy, 
  Download, 
  BookOpen, 
  ExternalLink,
  GraduationCap,
  Eye,
  Loader2,
  Maximize2,
  Minimize2,
  ChevronDown,
  ChevronRight,
  Menu
} from "lucide-react";
import { toggleLessonCompletionAction } from "@/lib/courses/actions";
import { cn, getYoutubeEmbedUrl } from "@/lib/utils";

type LessonPlayerClientProps = {
  slug: string;
  lessonSlug: string;
  currentUser: any;
  bundle: any;
  isCompleted: boolean;
  canTrackProgress: boolean;
};

export function LessonPlayerClient({
  slug,
  lessonSlug,
  currentUser,
  bundle,
  isCompleted,
  canTrackProgress
}: LessonPlayerClientProps) {
  const [mounted, setMounted] = useState(false);
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [isMobileSyllabusOpen, setIsMobileSyllabusOpen] = useState(false);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setMounted(true);
    // Auto-open current section
    if (bundle.section?.id) {
      setOpenSections(prev => ({ ...prev, [bundle.section.id]: true }));
    }
  }, [bundle.section?.id]);

  const toggleSection = (sectionId: string) => {
    setOpenSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const getLessonHref = (targetSlug: string) => `/courses/${slug}/lessons/${targetSlug}`;

  // Helper to check if a lesson is completed based on progresses array
  const isLessonIdCompleted = (lessonId: string) => {
    return Boolean(bundle.enrollment?.lessonProgresses.find((p: any) => p.lessonId === lessonId)?.isCompleted);
  };

  const activeProgress = bundle.enrollment?.progress;

  const renderSyllabusContent = () => (
    <div className="space-y-4">
      <div className="pb-3 border-b border-white/10">
        <span className="text-[9px] font-black uppercase tracking-widest text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-0.5 rounded">
          Syllabus Outline
        </span>
        <h3 className="text-sm font-bold text-white mt-2 truncate" title={bundle.course.title}>
          {bundle.course.title}
        </h3>
        {activeProgress && (
          <div className="mt-3 space-y-1.5">
            <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              <span>Path Progress</span>
              <span className="text-indigo-400">{activeProgress.progressPercent ?? 0}%</span>
            </div>
            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
              <div 
                className="h-full bg-gradient-to-r from-indigo-500 to-pink-500 rounded-full transition-all duration-300"
                style={{ width: `${activeProgress.progressPercent ?? 0}%` }}
              />
            </div>
          </div>
        )}
      </div>

      <div className="space-y-2">
        {bundle.course.sections.map((section: any, sIdx: number) => {
          const isOpen = openSections[section.id];
          return (
            <div key={section.id} className="rounded-xl border border-white/5 bg-white/[0.01] overflow-hidden">
              <button
                type="button"
                onClick={() => toggleSection(section.id)}
                className="w-full px-3.5 py-3 flex items-center justify-between text-left hover:bg-white/[0.02] transition"
              >
                <div className="min-w-0">
                  <p className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">
                    Module {sIdx + 1}
                  </p>
                  <p className="text-xs font-bold text-white truncate mt-0.5" title={section.title}>
                    {section.title}
                  </p>
                </div>
                {isOpen ? (
                  <ChevronDown className="h-4 w-4 text-slate-400 shrink-0 ml-2" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-slate-400 shrink-0 ml-2" />
                )}
              </button>

              {isOpen && (
                <div className="border-t border-white/5 bg-[#070914]/40 p-1.5 space-y-1">
                  {section.lessons.map((lesson: any) => {
                    const isActive = lesson.slug === lessonSlug;
                    const completed = isLessonIdCompleted(lesson.id);
                    return (
                      <Link
                        key={lesson.id}
                        href={getLessonHref(lesson.slug)}
                        onClick={() => setIsMobileSyllabusOpen(false)}
                        className={cn(
                          "w-full rounded-lg px-3 py-2 flex items-center justify-between text-left text-xs font-semibold border transition-all duration-200",
                          isActive 
                            ? "bg-indigo-600/10 text-indigo-300 border-indigo-500/20 shadow-[0_0_15px_rgba(99,102,241,0.1)]"
                            : "bg-transparent text-slate-400 border-transparent hover:border-white/5 hover:bg-white/5 hover:text-white"
                        )}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          {completed ? (
                            <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0" />
                          ) : lesson.contentType === "QUIZ" ? (
                            <Sparkles className="h-4 w-4 text-violet-400 shrink-0" />
                          ) : (
                            <PlayCircle className="h-4 w-4 text-slate-500 shrink-0" />
                          )}
                          <span className="truncate">{lesson.title}</span>
                        </div>
                        {lesson.isPreview && !bundle.enrollment && (
                          <span className="text-[8px] font-bold uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded ml-2 shrink-0">
                            Free
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 pt-8 relative z-10">
      {/* Compact Header */}
      <div className="flex flex-col gap-4 border-b border-white/10 pb-6 mb-8">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-0.5 rounded">
            LMS Learning Player
          </span>
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 bg-white/5 border border-white/10 px-2.5 py-0.5 rounded capitalize">
            {bundle.lesson.contentType.toLowerCase()}
          </span>
          {bundle.lesson.isPreview && (
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded flex items-center gap-1">
              <Eye className="h-3 w-3" /> Preview
            </span>
          )}
          {bundle.enrollment && (
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-violet-300 bg-violet-500/10 border border-violet-500/20 px-2.5 py-0.5 rounded capitalize">
              {bundle.enrollment.status.toLowerCase()} Path
            </span>
          )}
        </div>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white leading-tight">
              {bundle.lesson.title}
            </h1>
            <p className="text-sm text-slate-400 max-w-3xl leading-relaxed">
              {bundle.lesson.description ?? bundle.course.description ?? "Access protected modules, system designs, and code playbooks."}
            </p>
          </div>

          {/* Syllabus Drawer Trigger for Mobile */}
          <Button
            onClick={() => setIsMobileSyllabusOpen(true)}
            variant="outline"
            className="flex md:hidden border-white/10 text-slate-300 hover:bg-white/5 rounded-xl text-xs h-10 px-4 font-bold uppercase tracking-wider items-center gap-2"
          >
            <Menu className="h-4 w-4" />
            Syllabus Outline
          </Button>
        </div>
      </div>

      {/* Core Split Screen Layout Grid */}
      <div className={cn(
        "grid gap-8 transition-all duration-500",
        isFocusMode ? "grid-cols-1" : "lg:grid-cols-[1fr_320px]"
      )}>
        {/* Left Column: Media Player Workspace */}
        <div className="space-y-6">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5 sm:p-6 backdrop-blur-md shadow-2xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-violet-500/5 opacity-40 pointer-events-none" />
            
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/5 relative z-10">
              <div className="flex items-center gap-2">
                <PlayCircle className="h-4.5 w-4.5 text-indigo-400" />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">Mastery Sandbox Screen</h3>
              </div>

              {/* Theater Focus Mode Button (Desktop Only) */}
              <button
                type="button"
                onClick={() => setIsFocusMode(!isFocusMode)}
                className="hidden lg:flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white px-2.5 py-1.5 rounded-lg border border-white/5 hover:border-white/10 bg-white/5 transition"
                title={isFocusMode ? "Exit Theater Focus Mode" : "Cinema Focus Mode (Hide Outline)"}
              >
                {isFocusMode ? (
                  <>
                    <Minimize2 className="h-3.5 w-3.5" />
                    <span>Split Screen</span>
                  </>
                ) : (
                  <>
                    <Maximize2 className="h-3.5 w-3.5" />
                    <span>Focus Mode</span>
                  </>
                )}
              </button>
            </div>

            {/* Media Player Container */}
            <div className="relative z-10">
              {bundle.lesson.youtubeUrl ? (
                <div className="overflow-hidden rounded-xl border border-white/10 bg-black/60 shadow-[0_0_30px_rgba(99,102,241,0.1)] relative">
                  <iframe
                    className="aspect-video w-full"
                    src={getYoutubeEmbedUrl(bundle.lesson.youtubeUrl)}
                    title={bundle.lesson.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                </div>
              ) : (
                <div className="rounded-xl border border-dashed border-white/15 bg-white/[0.01] p-10 text-center flex flex-col items-center justify-center min-h-[300px]">
                  <div className="h-12 w-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 mb-4 shadow-[0_0_15px_rgba(255,255,255,0.02)]">
                    <FileText className="h-6 w-6 text-indigo-400" />
                  </div>
                  {bundle.lesson.r2AssetUrl ? (
                    <div className="space-y-3">
                      <h4 className="text-slate-200 font-bold text-sm">Interactive Syllabus Document</h4>
                      <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">This lesson features an online playbook resource instead of a primary video stream.</p>
                      <a 
                        href={bundle.lesson.r2AssetUrl} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl h-10 px-5 text-xs font-bold uppercase tracking-wider transition-all duration-200 shadow-[0_0_15px_rgba(99,102,241,0.2)] mt-2"
                      >
                        Open Playbook Document
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    </div>
                  ) : (
                    <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">No video or playbook asset published for this lesson yet.</p>
                  )}
                </div>
              )}
            </div>

            {/* Action Rows */}
            <div className="mt-6 flex flex-wrap gap-3 justify-between items-center relative z-10 pt-4 border-t border-white/5">
              {bundle.lesson.transcriptUrl ? (
                <Button asChild variant="outline" className="border-white/10 text-slate-300 hover:bg-white/10 hover:text-white rounded-xl h-10 text-xs font-bold uppercase tracking-wider">
                  <Link href={bundle.lesson.transcriptUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1.5">
                    <BookOpen className="h-4 w-4" />
                    View Transcript
                  </Link>
                </Button>
              ) : <div />}

              {bundle.lesson.resources.length ? (
                <div className="w-full space-y-3 mt-4">
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Download className="h-4 w-4 text-emerald-400" />
                    Downloadable Study Materials
                  </h4>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {bundle.lesson.resources.map((resource: any) => (
                      <Button key={resource.id} asChild variant="outline" className="justify-start border-white/10 text-slate-300 hover:bg-white/10 hover:text-white rounded-xl text-xs h-11 font-medium p-3">
                        <Link href={`/courses/${bundle.course.slug}/lessons/${bundle.lesson.slug}/resources/${resource.id}`} className="truncate flex items-center w-full gap-2">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shrink-0" />
                          <span className="truncate">{resource.title}</span>
                        </Link>
                      </Button>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>

        {/* Right Column: Sidebar (Desktop Only) */}
        {!isFocusMode && (
          <div className="hidden lg:flex flex-col gap-6">
            {/* Desktop Syllabus Sidebar */}
            <div className="bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-5 shadow-2xl relative overflow-hidden group max-h-[calc(100vh-160px)] overflow-y-auto">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-violet-500/5 opacity-40 pointer-events-none" />
              <div className="relative z-10">
                {renderSyllabusContent()}
              </div>
            </div>

            {/* Nav & Milestone Controls */}
            {bundle.enrollment && (
              <div className="bg-[#090d20]/50 border border-white/5 backdrop-blur-md rounded-2xl p-5 space-y-4">
                {canTrackProgress && (
                  <form action={toggleLessonCompletionAction}>
                    <input type="hidden" name="courseId" value={bundle.course.id} />
                    <input type="hidden" name="lessonId" value={bundle.lesson.id} />
                    <input type="hidden" name="completed" value={isCompleted ? "false" : "true"} />
                    
                    {isCompleted ? (
                      <Button 
                        type="submit" 
                        variant="outline" 
                        className="w-full border-emerald-500/30 text-emerald-400 hover:bg-emerald-600 hover:text-white rounded-xl h-11 text-xs font-extrabold uppercase tracking-wider"
                      >
                        <CheckCircle className="mr-2 h-4.5 w-4.5" />
                        Mastery Completed!
                      </Button>
                    ) : (
                      <Button 
                        type="submit" 
                        className="w-full bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl h-11 text-xs font-extrabold uppercase tracking-wider shadow-[0_0_20px_rgba(99,102,241,0.2)]"
                      >
                        Mark Lesson Complete
                      </Button>
                    )}
                  </form>
                )}

                <div className="flex flex-col gap-2">
                  {bundle.nextLesson && (
                    <Button asChild className="w-full bg-white/5 hover:bg-white/10 border border-white/5 text-white rounded-xl h-10 text-xs font-extrabold uppercase tracking-wider">
                      <Link href={getLessonHref(bundle.nextLesson.slug)} className="flex items-center justify-center gap-1.5">
                        Next Lesson
                        <ArrowRight className="h-3.5 w-3.5 animate-pulse" />
                      </Link>
                    </Button>
                  )}
                  {bundle.previousLesson && (
                    <Button asChild variant="outline" className="w-full border-white/5 text-slate-400 hover:text-white rounded-xl h-10 text-xs font-bold uppercase tracking-wider">
                      <Link href={getLessonHref(bundle.previousLesson.slug)} className="flex items-center justify-center gap-1.5">
                        <ArrowLeft className="h-3.5 w-3.5" />
                        Previous Lesson
                      </Link>
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Focus Mode floating escape trigger */}
      {isFocusMode && (
        <div className="mt-6 flex justify-end">
          <Button
            onClick={() => setIsFocusMode(false)}
            variant="outline"
            className="border-indigo-500/20 text-indigo-400 hover:bg-indigo-600 hover:text-white rounded-xl text-xs h-10 px-4 font-bold uppercase tracking-wider flex items-center gap-1.5"
          >
            <Minimize2 className="h-4 w-4" />
            Exit Focus Mode
          </Button>
        </div>
      )}

      {/* Mobile Syllabus Outline Drawer Portal */}
      {isMobileSyllabusOpen && mounted && createPortal(
        <div className="fixed inset-0 z-[110] flex justify-end md:hidden">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setIsMobileSyllabusOpen(false)}
          />
          {/* Drawer container */}
          <div className="relative w-[85vw] max-w-[320px] bg-[#0d1224] border-l border-white/10 h-full p-5 overflow-y-auto shadow-2xl flex flex-col justify-between z-10 animate-in slide-in-from-right duration-300">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-white/5">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Classroom Menu</span>
                <Button 
                  onClick={() => setIsMobileSyllabusOpen(false)}
                  variant="ghost" 
                  className="h-8 w-8 rounded-lg p-0 text-slate-400 hover:text-white hover:bg-white/5"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {renderSyllabusContent()}
            </div>

            {/* Sticky Mobile Completion controls */}
            {bundle.enrollment && (
              <div className="mt-8 pt-4 border-t border-white/5 space-y-3">
                {canTrackProgress && (
                  <form action={toggleLessonCompletionAction}>
                    <input type="hidden" name="courseId" value={bundle.course.id} />
                    <input type="hidden" name="lessonId" value={bundle.lesson.id} />
                    <input type="hidden" name="completed" value={isCompleted ? "false" : "true"} />
                    
                    {isCompleted ? (
                      <Button 
                        type="submit" 
                        variant="outline" 
                        className="w-full border-emerald-500/30 text-emerald-400 hover:bg-emerald-600 hover:text-white rounded-xl h-11 text-xs font-extrabold uppercase tracking-wider"
                      >
                        <CheckCircle className="mr-2 h-4.5 w-4.5" />
                        Completed!
                      </Button>
                    ) : (
                      <Button 
                        type="submit" 
                        className="w-full bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl h-11 text-xs font-extrabold uppercase tracking-wider shadow-[0_0_20px_rgba(99,102,241,0.2)]"
                      >
                        Mark Completed
                      </Button>
                    )}
                  </form>
                )}

                <div className="grid grid-cols-2 gap-2">
                  {bundle.previousLesson && (
                    <Button asChild variant="outline" className="border-white/5 text-slate-400 rounded-xl h-10 text-[10px] font-bold uppercase tracking-wider">
                      <Link href={getLessonHref(bundle.previousLesson.slug)} className="flex items-center gap-1 justify-center">
                        <ArrowLeft className="h-3 w-3" />
                        Prev
                      </Link>
                    </Button>
                  )}
                  {bundle.nextLesson && (
                    <Button asChild className="bg-white/5 hover:bg-white/10 border border-white/5 text-white rounded-xl h-10 text-[10px] font-extrabold uppercase tracking-wider">
                      <Link href={getLessonHref(bundle.nextLesson.slug)} className="flex items-center gap-1 justify-center">
                        Next
                        <ArrowRight className="h-3 w-3" />
                      </Link>
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}

// Mobile helper close icon
function X(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}
