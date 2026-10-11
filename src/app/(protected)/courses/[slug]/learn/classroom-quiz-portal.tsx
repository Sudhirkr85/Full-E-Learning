"use client";

import React, { useState, useEffect, useTransition } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Clock, 
  HelpCircle, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  ChevronLeft, 
  ChevronRight, 
  Sparkles, 
  Loader2,
  FileText,
  RotateCcw,
  BookOpen,
  Trophy,
  ZoomIn,
  ZoomOut,
  X,
  Bookmark,
  Languages
} from "lucide-react";
import { submitAttemptAction, startClassroomAttemptAction } from "@/lib/tests/actions";
import { QuestionType, AttemptStatus } from "@prisma/client";
import { CustomPopup } from "@/components/courses/custom-popup";

type OptionData = {
  id: string;
  label: string;
  isCorrect?: boolean;
  explanation?: string | null;
  value?: string | null;
};

export function QuestionPromptDisplay({ prompt }: { prompt: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const imgRegex = /\[img:\s*([^\]]+)\]/i;
  const match = prompt.match(imgRegex);

  // Close modal on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  if (match) {
    const textBefore = prompt.replace(imgRegex, "").trim();
    const imgSrc = match[1].trim();

    return (
      <div className="space-y-4">
        {textBefore && <p className="leading-relaxed whitespace-pre-line">{textBefore}</p>}
        <div 
          className="relative group flex justify-center p-3 bg-white/95 dark:bg-zinc-900 rounded-xl border border-white/10 shadow-sm max-w-lg mx-auto cursor-pointer hover:border-indigo-500/50 hover:shadow-indigo-500/10 transition-all select-none"
          onClick={() => { setIsOpen(true); setZoomLevel(1); }}
          title="चित्र बड़ा देखने के लिए क्लिक करें"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={imgSrc} alt="Question figure" className="max-h-64 object-contain rounded transition-transform duration-200 group-hover:scale-[1.02]" />
          
          {/* Hover overlay hint */}
          <div className="absolute bottom-2.5 right-2.5 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black/80 backdrop-blur-md text-[11px] text-white font-semibold shadow-lg border border-white/10 group-hover:bg-indigo-600 group-hover:border-indigo-400 transition-colors">
            <ZoomIn className="h-3.5 w-3.5" />
            <span>🔍 बड़ा देखें (Click to Zoom)</span>
          </div>
        </div>

        {/* Fullscreen Lightbox Modal */}
        {isOpen && (
          <div 
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md p-3 sm:p-6 animate-in fade-in duration-200"
            onClick={() => setIsOpen(false)}
          >
            <div 
              className="relative max-w-5xl w-full max-h-[92vh] flex flex-col items-center justify-between p-4 bg-zinc-950/95 rounded-2xl border border-white/15 shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Controls bar */}
              <div className="w-full flex items-center justify-between pb-3 mb-2 border-b border-white/10 text-xs">
                <span className="font-semibold flex items-center gap-2 text-white">
                  <Sparkles className="h-4 w-4 text-indigo-400" />
                  <span>चित्र / आरेख विवरण (Full HD View)</span>
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setZoomLevel((z) => Math.max(0.75, z - 0.25))}
                    className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition flex items-center gap-1 text-xs px-2.5"
                    title="Zoom Out"
                  >
                    <ZoomOut className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">छोटा</span>
                  </button>
                  <span className="font-mono text-xs px-1.5 text-indigo-300 font-bold min-w-12 text-center">
                    {Math.round(zoomLevel * 100)}%
                  </span>
                  <button
                    type="button"
                    onClick={() => setZoomLevel((z) => Math.min(2.5, z + 0.25))}
                    className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition flex items-center gap-1 text-xs px-2.5"
                    title="Zoom In"
                  >
                    <ZoomIn className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">बड़ा</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="p-1.5 rounded-lg bg-rose-600/80 hover:bg-rose-600 text-white transition flex items-center gap-1 text-xs px-3 ml-2 font-bold"
                    title="बंद करें (Close)"
                  >
                    <X className="h-4 w-4" />
                    <span>बंद करें</span>
                  </button>
                </div>
              </div>

              {/* Scrollable / Zoomed Image container */}
              <div className="w-full flex-1 overflow-auto max-h-[75vh] flex items-center justify-center p-3 rounded-xl bg-white dark:bg-zinc-900 border border-white/10">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={imgSrc} 
                  alt="Enlarged figure" 
                  style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'center center' }}
                  className="max-h-[70vh] object-contain transition-transform duration-150 select-none" 
                />
              </div>

              <div className="w-full flex items-center justify-between pt-2.5 text-[11px] text-slate-400 font-mono">
                <span>💡 सुझाव: ज़ूम बटन से बड़ा/छोटा करें</span>
                <span>बाहर क्लिक करें या Esc दबाएं</span>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return <span className="leading-relaxed whitespace-pre-line">{prompt}</span>;
}


type QuestionData = {
  id: string;
  prompt: string;
  kind: QuestionType;
  points: number;
  explanation?: string | null;
  options: OptionData[];
  metadata?: any;
  answers?: Array<{
    selectedOptionId: string | null;
    answerText: string | null;
    isCorrect: boolean | null;
    metadata: any;
  }>;
};

type AttemptData = {
  id: string;
  testId: string;
  status: AttemptStatus;
  attemptNumber: number;
  startedAt: Date;
  submittedAt: Date | null;
  scorePercent: number | null;
  correctAnswersCount: number;
  totalQuestionsCount: number;
  timeSpentSeconds: number | null;
};

type TestData = {
  id: string;
  title: string;
  description: string | null;
  type: string;
  passingScore: number;
  timeLimitMinutes: number | null;
  attemptLimit: number | null;
  courseId: string;
  metadata?: any;
};

type ClassroomQuizPortalProps = {
  phase: "overview" | "taking" | "review";
  courseSlug: string;
  lessonSlug: string;
  test: TestData;
  attempts?: AttemptData[];
  activeAttempt?: AttemptData | null;
  questions?: QuestionData[];
  reviewAttempt?: AttemptData | null;
  ranking?: {
    userRank: number;
    totalCandidates: number;
    percentile: number;
    leaderboard: Array<{
      rank: number;
      name: string;
      scorePercent: number;
      timeSpentSeconds: number;
    }>;
  };
  onRefresh: () => void;
  isGuest?: boolean;
};

export default function ClassroomQuizPortal({
  phase,
  courseSlug,
  lessonSlug,
  test,
  attempts = [],
  activeAttempt = null,
  questions = [],
  reviewAttempt = null,
  ranking,
  onRefresh,
  isGuest = false
}: ClassroomQuizPortalProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const urlAttemptId = searchParams.get("attemptId");

  // Local state to override props during client-side Guest Mode
  const [localPhase, setLocalPhase] = useState<"overview" | "taking" | "review" | null>(null);
  const [guestAttempt, setGuestAttempt] = useState<AttemptData | null>(null);
  const [guestReviewAttempt, setGuestReviewAttempt] = useState<AttemptData | null>(null);
  const [guestQuestions, setGuestQuestions] = useState<QuestionData[]>([]);

  const activePhase = isGuest && localPhase ? localPhase : phase;
  const currentAttempt = isGuest ? guestAttempt : activeAttempt;
  const currentReviewAttempt = isGuest ? guestReviewAttempt : reviewAttempt;
  const activeQuestions = isGuest && guestQuestions.length > 0 ? guestQuestions : questions;

  // Automatically refresh route data when URL searchParams don't match the current rendered state (handles back/forward buttons)
  useEffect(() => {
    if (isGuest) return; // Skip in guest mode
    const renderedAttemptId = reviewAttempt?.id || activeAttempt?.id || null;
    if (urlAttemptId !== renderedAttemptId) {
      router.refresh();
    }
  }, [urlAttemptId, reviewAttempt?.id, activeAttempt?.id, router, isGuest]);

  // Active taking states
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, {
    selectedOptionId?: string | null;
    selectedOptionIds?: string[] | null;
    answerText?: string | null;
  }>>({});
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [paletteFilter, setPaletteFilter] = useState<string>("ALL");
  const [lang, setLang] = useState<"hi" | "en">("hi");
  const [fontScale, setFontScale] = useState<"md" | "lg" | "xl">("lg");
  const [reviewMarked, setReviewMarked] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setMounted(true);
    try {
      const savedLang = localStorage.getItem("preferred_quiz_lang");
      if (savedLang === "en" || savedLang === "hi") setLang(savedLang);
      const savedScale = localStorage.getItem("preferred_quiz_scale");
      if (savedScale === "md" || savedScale === "lg" || savedScale === "xl") setFontScale(savedScale);
    } catch {}
  }, []);

  const changeLang = (newLang: "hi" | "en") => {
    setLang(newLang);
    try { localStorage.setItem("preferred_quiz_lang", newLang); } catch {}
  };

  const changeFontScale = (scale: "md" | "lg" | "xl") => {
    setFontScale(scale);
    try { localStorage.setItem("preferred_quiz_scale", scale); } catch {}
  };

  const toggleMarkForReview = (questionId: string) => {
    setReviewMarked((prev) => ({
      ...prev,
      [questionId]: !prev[questionId]
    }));
  };

  // Custom Popup state
  const [popup, setPopup] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    type: "alert" | "confirm";
    confirmText?: string;
    isError?: boolean;
    onConfirm: () => void;
    onCancel?: () => void;
  }>({
    isOpen: false,
    title: "",
    message: "",
    type: "alert",
    onConfirm: () => {}
  });

  const showAlert = (message: string, isError = true, title = "Quiz Portal Notification") => {
    setPopup({
      isOpen: true,
      title,
      message,
      type: "alert",
      isError,
      onConfirm: () => setPopup(prev => ({ ...prev, isOpen: false }))
    });
  };

  const showConfirm = (message: string, onConfirm: () => void, title = "Please Confirm") => {
    setPopup({
      isOpen: true,
      title,
      message,
      type: "confirm",
      confirmText: "Submit",
      onConfirm: () => {
        onConfirm();
        setPopup(prev => ({ ...prev, isOpen: false }));
      },
      onCancel: () => setPopup(prev => ({ ...prev, isOpen: false }))
    });
  };

  // Load timer for active taking
  useEffect(() => {
    const activeAttemptObj = isGuest ? guestAttempt : activeAttempt;
    if (activePhase !== "taking" || !activeAttemptObj || !test.timeLimitMinutes) return;

    const startedTime = new Date(activeAttemptObj.startedAt).getTime();
    const limitMs = test.timeLimitMinutes * 60 * 1000;

    const calculateTimeRemaining = () => {
      const now = new Date().getTime();
      const elapsed = now - startedTime;
      const remaining = Math.max(0, Math.ceil((limitMs - elapsed) / 1000));
      setTimeRemaining(remaining);

      if (remaining <= 0) {
        handleAutoSubmit();
      }
    };

    calculateTimeRemaining();
    const interval = setInterval(calculateTimeRemaining, 1000);

    return () => clearInterval(interval);
  }, [activePhase, activeAttempt, guestAttempt, test.timeLimitMinutes, isGuest]);

  const handleStartAttempt = () => {
    setError(null);
    if (isGuest) {
      const newAttempt = {
        id: "guest-attempt",
        testId: test.id,
        status: AttemptStatus.IN_PROGRESS,
        attemptNumber: 1,
        startedAt: new Date(),
        submittedAt: null,
        scorePercent: null,
        correctAnswersCount: 0,
        totalQuestionsCount: questions.length,
        timeSpentSeconds: null,
      };
      setGuestAttempt(newAttempt);
      setGuestReviewAttempt(null);
      setGuestQuestions([]);
      setAnswers({});
      setLocalPhase("taking");
      return;
    }
    startTransition(async () => {
      try {
        await startClassroomAttemptAction(test.courseId, test.id, lessonSlug, window.location.pathname);
      } catch (err: any) {
        setError(err.message || "Failed to start quiz attempt.");
      }
    });
  };

  const gradeGuestQuiz = () => {
    if (!guestAttempt) return;
    const now = new Date();
    const timeSpentSeconds = Math.round((now.getTime() - guestAttempt.startedAt.getTime()) / 1000);
    let correctCount = 0;

    const gradedQuestions = questions.map((q) => {
      const ans = answers[q.id];
      let isCorrect = false;

      if (q.kind === QuestionType.SINGLE_CHOICE || q.kind === QuestionType.TRUE_FALSE) {
        const correctOption = q.options.find((opt) => opt.isCorrect === true);
        isCorrect = Boolean(ans && ans.selectedOptionId === correctOption?.id);
      } else if (q.kind === QuestionType.SHORT_ANSWER) {
        const studentAns = (ans?.answerText || "").trim().toLowerCase();
        isCorrect = q.options.some((opt) => {
          const acceptedVal = (opt.value || opt.label || "").trim().toLowerCase();
          return acceptedVal === studentAns;
        });
      }

      if (isCorrect) {
        correctCount++;
      }

      return {
        ...q,
        answers: [
          {
            selectedOptionId: ans?.selectedOptionId || null,
            answerText: ans?.answerText || null,
            isCorrect,
            metadata: null
          }
        ]
      };
    });

    const scorePercent = questions.length > 0 ? Math.round((correctCount / questions.length) * 100) : 0;

    const reviewAttemptData = {
      ...guestAttempt,
      status: AttemptStatus.GRADED,
      submittedAt: now,
      scorePercent,
      correctAnswersCount: correctCount,
      totalQuestionsCount: questions.length,
      timeSpentSeconds,
    };

    setGuestReviewAttempt(reviewAttemptData);
    setGuestQuestions(gradedQuestions);
    setLocalPhase("review");
  };

  const handleAutoSubmit = async () => {
    if (isGuest) {
      gradeGuestQuiz();
      return;
    }
    if (!activeAttempt) return;
    try {
      const submissionPayload = questions.map((q) => {
        const ans = answers[q.id];
        return {
          questionId: q.id,
          selectedOptionId: ans?.selectedOptionId || null,
          selectedOptionIds: ans?.selectedOptionIds || null,
          answerText: ans?.answerText || null,
        };
      });

      await submitAttemptAction(activeAttempt.id, submissionPayload);
      router.push(`${window.location.pathname}?attemptId=${activeAttempt.id}`);
      router.refresh();
    } catch (err: any) {
      console.error("Auto submit failed:", err);
    }
  };

  const handleManualSubmit = async () => {
    const activeAttemptObj = isGuest ? guestAttempt : activeAttempt;
    if (!activeAttemptObj) return;
    showConfirm(
      lang === "hi"
        ? "क्या आप वाकई अपनी परीक्षा समाप्त करके उत्तर जमा करना चाहते हैं?"
        : "Are you sure you want to submit your answers and complete this attempt?",
      async () => {
        if (isGuest) {
          gradeGuestQuiz();
          return;
        }
        startTransition(async () => {
          try {
            const submissionPayload = questions.map((q) => {
              const ans = answers[q.id];
              return {
                questionId: q.id,
                selectedOptionId: ans?.selectedOptionId || null,
                selectedOptionIds: ans?.selectedOptionIds || null,
                answerText: ans?.answerText || null,
              };
            });

            await submitAttemptAction(activeAttemptObj.id, submissionPayload);
            router.push(`${window.location.pathname}?attemptId=${activeAttemptObj.id}`);
            router.refresh();
          } catch (err: any) {
            setError(err.message || "Failed to submit answers.");
          }
        });
      },
      lang === "hi" ? "परीक्षा जमा करें (Submit)" : "Submit Quiz"
    );
  };

  const handleMCQSelect = (questionId: string, optionId: string) => {
    setAnswers((prev) => {
      if (prev[questionId]?.selectedOptionId === optionId) {
        const copy = { ...prev };
        delete copy[questionId];
        return copy;
      }
      return {
        ...prev,
        [questionId]: {
          selectedOptionId: optionId,
        },
      };
    });
  };

  const handleClearResponse = (questionId: string) => {
    setAnswers((prev) => {
      const copy = { ...prev };
      delete copy[questionId];
      return copy;
    });
  };

  const handleFitbChange = (questionId: string, text: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: {
        answerText: text,
      },
    }));
  };

  const formatTimer = (seconds: number | null) => {
    if (seconds === null) return "--:--";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // ----------------------------------------------------
  // OVERVIEW PHASE RENDER
  // ----------------------------------------------------
  if (activePhase === "overview") {
    const hasAttemptsLeft = !test.attemptLimit || attempts.length < test.attemptLimit;

    return (
      <Card className="border-white/5 bg-[#0a0a14]/60 backdrop-blur-xl shadow-2xl rounded-2xl overflow-hidden text-left">
        <CardHeader className="p-6 md:p-8 border-b border-white/5 bg-gradient-to-br from-indigo-950/20 to-slate-950/40 space-y-4">
          {/* Quiz Thumbnail Header */}
          <div className="relative aspect-[21/9] w-full rounded-xl overflow-hidden border border-white/10 shadow-lg bg-slate-950">
            <Image
              src={
                courseSlug.includes("bihar")
                  ? "/images/courses/bihar-nmms-mock-test-series.webp"
                  : "/images/courses/up-nmms-mock-test-series.webp"
              }
              alt={test.title}
              fill
              sizes="(max-width: 1024px) 100vw, 800px"
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs font-bold">
              <span className="text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] line-clamp-1">{test.title}</span>
              <span className="bg-emerald-500/90 text-white text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full shrink-0 shadow">
                Live Test
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Badge className="bg-indigo-500/10 text-indigo-300 border-indigo-500/20 text-[10px] font-bold uppercase tracking-wider">Assessment Quiz</Badge>
            <Badge variant="outline" className="border-white/10 text-slate-400 text-[10px] font-mono">
              {test.timeLimitMinutes ? `${test.timeLimitMinutes} Mins` : "No Time Limit"}
            </Badge>
            <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/25 text-[10px] font-bold">
              Passing Score: {test.passingScore}%
            </Badge>
          </div>
          <CardTitle className="text-xl md:text-2xl font-black text-white tracking-tight">{test.title}</CardTitle>
          <CardDescription className="text-slate-400 mt-2 text-xs md:text-sm leading-relaxed">{test.description ?? "Test your domain knowledge on the subjects explained in this course section."}</CardDescription>
        </CardHeader>

        <CardContent className="p-6 md:p-8 space-y-6">
          {error && (
            <div className="bg-rose-500/10 text-rose-400 text-xs px-4 py-3 rounded-xl flex items-center gap-2 border border-rose-500/20">
              <AlertTriangle className="h-4 w-4 shrink-0" />
              {error}
            </div>
          )}

          <div className="grid gap-3 grid-cols-2 md:grid-cols-4">
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 text-center">
              <span className="text-[9px] text-slate-500 font-extrabold uppercase tracking-wider block">Passing score</span>
              <span className="text-lg font-bold text-emerald-400 mt-1 block">{test.passingScore}%</span>
            </div>
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 text-center">
              <span className="text-[9px] text-slate-500 font-extrabold uppercase tracking-wider block">Time limit</span>
              <span className="text-lg font-bold text-white mt-1 block">{test.timeLimitMinutes ? `${test.timeLimitMinutes}m` : "∞"}</span>
            </div>
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 text-center">
              <span className="text-[9px] text-slate-500 font-extrabold uppercase tracking-wider block">Attempt Limit</span>
              <span className="text-lg font-bold text-white mt-1 block">{test.attemptLimit ? `${test.attemptLimit}` : "∞"}</span>
            </div>
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 text-center">
              <span className="text-[9px] text-slate-500 font-extrabold uppercase tracking-wider block">Attempts Made</span>
              <span className="text-lg font-bold text-white mt-1 block">{isGuest ? 0 : attempts.length}</span>
            </div>
          </div>

          {!isGuest && attempts.length > 0 && (
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">Attempt Roster</h4>
              <div className="rounded-xl border border-white/5 overflow-hidden bg-slate-950/20 divide-y divide-white/5">
                {attempts.map((att) => {
                  const passed = att.scorePercent !== null && att.scorePercent >= test.passingScore;
                  return (
                    <div key={att.id} className="p-3 flex items-center justify-between gap-4 text-xs">
                      <div>
                        <span className="font-extrabold text-white">Attempt #{att.attemptNumber}</span>
                        <span className="text-[10px] text-slate-500 block mt-0.5">
                          {att.submittedAt ? (mounted ? new Date(att.submittedAt).toLocaleDateString() : "") : "Draft"}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        {att.scorePercent !== null ? (
                          <div className="flex items-center gap-1.5 font-bold">
                            <span className={passed ? "text-emerald-400" : "text-rose-400"}>{att.scorePercent}%</span>
                            <Badge className={passed ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/25" : "bg-rose-500/10 text-rose-400 border-rose-500/25"}>
                              {passed ? "Pass" : "Fail"}
                            </Badge>
                          </div>
                        ) : (
                          <Badge variant="outline" className="text-amber-400 border-amber-500/25">Draft</Badge>
                        )}
                        <Button 
                          onClick={() => {
                            router.push(`${window.location.pathname}?attemptId=${att.id}`);
                            router.refresh();
                          }}
                          size="sm" 
                          variant="outline" 
                          className="h-8 rounded-xl border-indigo-500/20 text-indigo-300 bg-indigo-500/5 hover:bg-indigo-600 hover:text-white font-bold transition-all"
                        >
                          Review
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </CardContent>

        <CardFooter className="p-6 border-t border-white/5 bg-white/[0.01] flex justify-end">
          {hasAttemptsLeft ? (
            <Button onClick={handleStartAttempt} disabled={isPending} className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs h-10 px-5 font-bold uppercase tracking-wider">
              {isPending ? <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" /> : <Sparkles className="mr-1.5 h-4 w-4" />}
              Start Quiz Assessment
            </Button>
          ) : (
            <Button disabled className="bg-slate-900 border-white/5 text-slate-500 rounded-xl cursor-not-allowed">
              Attempts Limit Exhausted
            </Button>
          )}
        </CardFooter>
      </Card>
    );
  }

  // ----------------------------------------------------
  // ACTIVE TAKING PHASE RENDER
  // ----------------------------------------------------
  if (activePhase === "taking" && currentAttempt) {
    const currentQuestion = activeQuestions[currentQuestionIdx];
    const isFirst = currentQuestionIdx === 0;
    const isLast = currentQuestionIdx === activeQuestions.length - 1;

    // Check if the current question has an answer in local answers state
    const isAnswered = (qId: string) => {
      const ans = answers[qId];
      if (!ans) return false;
      if (ans.selectedOptionId) return true;
      if (ans.answerText && ans.answerText.trim()) return true;
      return false;
    };

    const promptTextClass = 
      fontScale === "xl" ? "text-lg md:text-xl font-medium" :
      fontScale === "lg" ? "text-base md:text-lg font-medium" :
      "text-sm md:text-base font-medium";

    const optionTextClass = 
      fontScale === "xl" ? "text-base py-4" :
      fontScale === "lg" ? "text-sm py-3.5" :
      "text-xs py-3";

    return (
      <div className="space-y-4 text-left">
        {/* Sticky attempt timer, language toggle, text size and control */}
        <div className="p-3.5 md:p-4 rounded-xl border border-white/5 bg-[#0a0a14]/70 backdrop-blur-md flex flex-wrap items-center justify-between gap-3">
          <div className="space-y-0.5">
            <span className="text-[10px] text-slate-500 uppercase tracking-widest font-mono">
              {lang === "hi" ? "समय-बद्ध परीक्षा सत्र" : "Timed Assessment Attempt"}
            </span>
            <h4 className="text-xs font-bold text-white flex items-center gap-2">
              <span>{lang === "hi" ? `प्रयास #${currentAttempt.attemptNumber}` : `Attempt #${currentAttempt.attemptNumber}`}</span>
              {isGuest && <span className="text-[10px] text-amber-400 font-bold">[Guest Mode]</span>}
              <span className="text-[10px] text-slate-400 font-mono font-normal hidden sm:inline">
                {lang === "hi" ? "शुरू:" : "Started:"} {mounted ? new Date(currentAttempt.startedAt).toLocaleTimeString("en-IN", { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }) : ""}
              </span>
            </h4>
          </div>

          <div className="flex items-center flex-wrap gap-2 md:gap-3">
            {/* Language Switcher */}
            <button
              type="button"
              onClick={() => changeLang(lang === "hi" ? "en" : "hi")}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-semibold text-slate-200 border border-white/10 transition-colors"
              title={lang === "hi" ? "अंग्रेजी में बदलें" : "Switch to Hindi"}
            >
              <Languages className="h-3.5 w-3.5 text-indigo-400" />
              <span>{lang === "hi" ? "हिं / ENG" : "ENG / हिं"}</span>
            </button>

            {/* Font Size Resizer */}
            <div className="flex items-center gap-0.5 bg-white/5 p-1 rounded-lg border border-white/10 text-xs">
              <span className="text-[10px] text-slate-400 px-1 font-mono hidden md:inline">
                {lang === "hi" ? "अक्षर:" : "Font:"}
              </span>
              <button
                type="button"
                onClick={() => changeFontScale("md")}
                className={`px-2 py-0.5 rounded text-[11px] font-bold transition-all ${
                  fontScale === "md" ? "bg-indigo-600 text-white shadow" : "text-slate-400 hover:text-white"
                }`}
                title={lang === "hi" ? "सामान्य अक्षर" : "Normal text"}
              >
                A-
              </button>
              <button
                type="button"
                onClick={() => changeFontScale("lg")}
                className={`px-2 py-0.5 rounded text-[11px] font-bold transition-all ${
                  fontScale === "lg" ? "bg-indigo-600 text-white shadow" : "text-slate-400 hover:text-white"
                }`}
                title={lang === "hi" ? "मध्यम अक्षर (अनुशंसित)" : "Medium text"}
              >
                A
              </button>
              <button
                type="button"
                onClick={() => changeFontScale("xl")}
                className={`px-2 py-0.5 rounded text-[11px] font-bold transition-all ${
                  fontScale === "xl" ? "bg-indigo-600 text-white shadow" : "text-slate-400 hover:text-white"
                }`}
                title={lang === "hi" ? "बड़ा अक्षर" : "Large text"}
              >
                A+
              </button>
            </div>

            {/* Timer */}
            {test.timeLimitMinutes && (
              <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/25 font-mono font-bold animate-pulse text-xs">
                <Clock className="h-3.5 w-3.5" />
                {formatTimer(timeRemaining)}
              </div>
            )}

            {/* Submit Quiz in Header */}
            <Button onClick={handleManualSubmit} disabled={isPending} className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs h-8 px-3 rounded-lg font-bold">
              {isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : (lang === "hi" ? "परीक्षा जमा करें (Submit)" : "Finish Quiz")}
            </Button>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-[1fr_270px]">
          {/* Question card */}
          <div className="space-y-4">
            {currentQuestion ? (
              <Card className="border-white/5 bg-[#0a0a14]/60">
                <CardHeader className="p-5 md:p-6 border-b border-white/5 bg-white/[0.01]">
                  <div className="flex items-center justify-between gap-4 mb-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="font-semibold text-xs">
                        {lang === "hi" 
                          ? `प्रश्न ${currentQuestionIdx + 1} / ${activeQuestions.length}`
                          : `Question ${currentQuestionIdx + 1} of ${activeQuestions.length}`}
                      </Badge>
                      {reviewMarked[currentQuestion.id] && (
                        <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30 text-[10px] font-medium flex items-center gap-1">
                          <Bookmark className="h-3 w-3 fill-purple-400 text-purple-400" />
                          {lang === "hi" ? "समीक्षा के लिए चिह्नित" : "Marked for Review"}
                        </Badge>
                      )}
                    </div>
                    <span className="text-[11px] font-mono text-slate-400">
                      {currentQuestion.points} {lang === "hi" ? "अंक" : "Marks"}
                    </span>
                  </div>
                  <CardTitle className={`font-bold text-white leading-relaxed ${promptTextClass}`}>
                    <QuestionPromptDisplay prompt={currentQuestion.prompt} />
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-5 md:p-6">
                  {/* MCQ SELECTORS */}
                  {currentQuestion.kind === "SINGLE_CHOICE" && (
                    <div className="grid gap-2.5">
                      {currentQuestion.options.map((opt, optIdx) => {
                        const isSelected = answers[currentQuestion.id]?.selectedOptionId === opt.id;
                        const optNumberLabel = `(${optIdx + 1})`;
                        return (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => handleMCQSelect(currentQuestion.id, opt.id)}
                            className={`w-full text-left rounded-xl border transition-all flex items-center justify-between gap-3 px-4 ${optionTextClass} ${
                              isSelected
                                ? "border-indigo-500 bg-indigo-500/10 font-semibold text-white shadow ring-1 ring-indigo-500"
                                : "border-white/5 bg-white/[0.01] hover:bg-white/[0.04] text-slate-200"
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <span className="font-bold text-indigo-400 font-mono shrink-0">{optNumberLabel}</span>
                              <span className="leading-snug">{opt.label}</span>
                            </div>
                            <span className={`h-4 w-4 rounded-full border shrink-0 flex items-center justify-center ${
                              isSelected ? "border-indigo-500 bg-indigo-600" : "border-white/20"
                            }`}>
                              {isSelected && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {/* FILL IN THE BLANK ENTRY */}
                  {currentQuestion.kind === "SHORT_ANSWER" && (
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        {lang === "hi" ? "अपना उत्तर यहाँ लिखें (Type Your Answer)" : "Type Your Answer"}
                      </label>
                      <Input
                        value={answers[currentQuestion.id]?.answerText || ""}
                        onChange={(e) => handleFitbChange(currentQuestion.id, e.target.value)}
                        placeholder={lang === "hi" ? "उत्तर दर्ज करें..." : "Enter primary answer match..."}
                        className="h-11 text-sm rounded-xl bg-white/5 border-white/10 text-white"
                      />
                      <p className="text-[10px] text-slate-500 italic">
                        {lang === "hi" 
                          ? "उत्तर में स्पेलिंग सही लिखें।" 
                          : "Matches can be case-sensitive or insensitive as configured by the instructor."}
                      </p>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="p-3.5 sm:p-4 border-t border-white/5 bg-white/[0.01] flex items-center justify-between gap-1.5 sm:gap-2">
                  <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                    <Button 
                      onClick={() => setCurrentQuestionIdx(idx => Math.max(0, idx - 1))} 
                      disabled={isFirst} 
                      variant="outline" 
                      className="h-9 px-2.5 sm:px-3 text-xs rounded-xl border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white disabled:opacity-20 disabled:bg-transparent disabled:text-slate-500 disabled:border-white/5 transition-all whitespace-nowrap shrink-0"
                    >
                      {lang === "hi" ? "← पिछला" : "← Previous"}
                    </Button>

                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => handleClearResponse(currentQuestion.id)}
                      disabled={
                        !answers[currentQuestion.id]?.selectedOptionId &&
                        !(answers[currentQuestion.id]?.answerText && answers[currentQuestion.id]?.answerText?.trim())
                      }
                      className="h-9 px-2 sm:px-2.5 text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 disabled:opacity-25 disabled:hover:bg-transparent transition-all whitespace-nowrap shrink-0"
                    >
                      {lang === "hi" ? "साफ़ करें" : "Clear"}
                    </Button>
                  </div>

                  <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => toggleMarkForReview(currentQuestion.id)}
                      className={`h-9 px-2.5 sm:px-3 text-xs rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
                        reviewMarked[currentQuestion.id]
                          ? "border-purple-500/50 bg-purple-500/20 text-purple-300 font-semibold hover:bg-purple-500/30"
                          : "border-white/10 bg-white/5 text-slate-400 hover:text-white hover:bg-white/10"
                      }`}
                    >
                      <Bookmark className={`h-3.5 w-3.5 ${reviewMarked[currentQuestion.id] ? "fill-purple-400 text-purple-400" : ""}`} />
                      <span>
                        {reviewMarked[currentQuestion.id]
                          ? (lang === "hi" ? "हटाएं" : "Unmark")
                          : (lang === "hi" ? "बाद में देखें" : "Review")}
                      </span>
                    </Button>

                    {isLast ? (
                      <Button onClick={handleManualSubmit} disabled={isPending} className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs h-9 px-3.5 sm:px-4 rounded-xl font-bold shadow-lg shadow-indigo-600/30 whitespace-nowrap shrink-0">
                        {lang === "hi" ? "परीक्षा जमा करें" : "Submit"}
                      </Button>
                    ) : (
                      <Button onClick={() => setCurrentQuestionIdx(idx => Math.min(activeQuestions.length - 1, idx + 1))} className="h-9 px-3 sm:px-4 text-xs rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold whitespace-nowrap shrink-0">
                        {lang === "hi" ? "अगला →" : "Next →"}
                      </Button>
                    )}
                  </div>
                </CardFooter>
              </Card>
            ) : (
              <p className="text-center text-slate-500 py-6 text-xs italic">No questions found.</p>
            )}
          </div>

          {/* Nav sidebar */}
          <Card className="border-white/5 bg-[#0a0a14]/60 self-start w-full">
            <CardHeader className="p-3.5 border-b border-white/5 space-y-2.5">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xs font-bold uppercase text-white tracking-wider flex items-center gap-1.5">
                  <FileText className="h-4 w-4 text-indigo-400" />
                  {lang === "hi" ? "प्रश्न सूची (Navigator)" : "Quiz Navigator"}
                </CardTitle>
                <Badge variant="outline" className="text-[10px] font-mono border-white/10 text-slate-300">
                  {Object.values(answers).filter(a => a.selectedOptionId || (a.answerText && a.answerText.trim())).length} / {activeQuestions.length} {lang === "hi" ? "हल किए" : "Done"}
                </Badge>
              </div>

              {/* Quick Section/Range Tabs for 90 Question Papers */}
              {activeQuestions.length > 30 && (
                <div className="flex items-center gap-1 p-1 bg-white/5 rounded-lg text-[10px] font-semibold text-slate-400">
                  <button
                    type="button"
                    onClick={() => setPaletteFilter("ALL")}
                    className={`flex-1 py-1 rounded transition text-center ${paletteFilter === "ALL" ? "bg-indigo-600 text-white font-bold" : "hover:text-white"}`}
                  >
                    {lang === "hi" ? `सभी (${activeQuestions.length})` : `All (${activeQuestions.length})`}
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaletteFilter("1-30")}
                    className={`flex-1 py-1 rounded transition text-center ${paletteFilter === "1-30" ? "bg-indigo-600 text-white font-bold" : "hover:text-white"}`}
                  >
                    1-30
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaletteFilter("31-60")}
                    className={`flex-1 py-1 rounded transition text-center ${paletteFilter === "31-60" ? "bg-indigo-600 text-white font-bold" : "hover:text-white"}`}
                  >
                    31-60
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaletteFilter("61-90")}
                    className={`flex-1 py-1 rounded transition text-center ${paletteFilter === "61-90" ? "bg-indigo-600 text-white font-bold" : "hover:text-white"}`}
                  >
                    61-90
                  </button>
                </div>
              )}
            </CardHeader>
            <CardContent className="p-3">
              <div className="grid grid-cols-6 gap-1.5 max-h-[300px] overflow-y-auto pr-1 select-none scrollbar-thin">
                {activeQuestions.map((q, idx) => {
                  if (paletteFilter === "1-30" && (idx < 0 || idx >= 30)) return null;
                  if (paletteFilter === "31-60" && (idx < 30 || idx >= 60)) return null;
                  if (paletteFilter === "61-90" && (idx < 60 || idx >= 90)) return null;

                  const isCurrent = idx === currentQuestionIdx;
                  const answered = isAnswered(q.id);
                  const isMarked = reviewMarked[q.id];

                  let bgClass = "bg-white/5 border-white/10 text-slate-400 hover:bg-white/10 hover:text-white";
                  if (isCurrent) {
                    bgClass = "bg-indigo-600 border-indigo-400 text-white font-black shadow-md shadow-indigo-500/20 ring-2 ring-indigo-400";
                  } else if (isMarked && answered) {
                    bgClass = "bg-purple-600/30 border-purple-400 text-purple-200 font-bold ring-1 ring-emerald-400/50";
                  } else if (isMarked) {
                    bgClass = "bg-purple-700/40 border-purple-500 text-purple-300 font-bold";
                  } else if (answered) {
                    bgClass = "bg-emerald-500/15 border-emerald-500/30 text-emerald-400 font-semibold hover:bg-emerald-500/25";
                  }

                  return (
                    <button
                      key={q.id}
                      onClick={() => setCurrentQuestionIdx(idx)}
                      className={`h-8 w-full rounded-lg border text-xs flex items-center justify-center transition-all relative ${bgClass}`}
                      title={lang === "hi" ? `प्रश्न ${idx + 1}` : `Question ${idx + 1}`}
                    >
                      {idx + 1}
                      {isMarked && (
                        <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-purple-400 ring-1 ring-black" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Status Legend */}
              <div className="grid grid-cols-2 gap-2 pt-3 mt-3 border-t border-white/5 text-[10px] text-slate-400">
                <span className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 shrink-0" />
                  <span>{lang === "hi" ? "हल किया (Done)" : "Answered"}</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-purple-500 shrink-0" />
                  <span>{lang === "hi" ? "समीक्षा (Review)" : "Review"}</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-indigo-500 shrink-0" />
                  <span>{lang === "hi" ? "वर्तमान (Current)" : "Current"}</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-white/20 shrink-0" />
                  <span>{lang === "hi" ? "शेष (Pending)" : "Remaining"}</span>
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
        <CustomPopup
          isOpen={popup.isOpen}
          title={popup.title}
          message={popup.message}
          type={popup.type}
          onConfirm={popup.onConfirm}
          onCancel={popup.onCancel}
          confirmText={popup.confirmText}
          isError={popup.isError}
        />
      </div>
    );
  }

  // ----------------------------------------------------
  // REVIEW PHASE RENDER
  // ----------------------------------------------------
  if (activePhase === "review" && currentReviewAttempt) {
    const passed = currentReviewAttempt.scorePercent !== null && currentReviewAttempt.scorePercent >= test.passingScore;
    const spentMins = currentReviewAttempt.timeSpentSeconds ? Math.floor(currentReviewAttempt.timeSpentSeconds / 60) : 0;
    const spentSecs = currentReviewAttempt.timeSpentSeconds ? currentReviewAttempt.timeSpentSeconds % 60 : 0;

    const showDetails = test?.metadata && typeof test.metadata === "object"
      ? (test.metadata as any).showResults !== false
      : true;

    return (
      <div className="space-y-6 text-left">
        {/* Score Card Banner */}
        <Card className={`border shadow-2xl rounded-2xl overflow-hidden ${
          passed ? "border-emerald-500/20 bg-emerald-950/10" : "border-rose-500/20 bg-rose-950/10"
        }`}>
          <CardContent className="p-6 md:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs">
                <Badge variant="outline" className="capitalize text-slate-400">Attempt Review</Badge>
                <Badge variant="outline" className="text-slate-400 font-mono">Attempt #{currentReviewAttempt.attemptNumber}</Badge>
                {isGuest && <span className="text-[10px] text-amber-400 font-bold">[Guest Mode]</span>}
              </div>
              <h2 className="text-lg md:text-xl font-black text-white tracking-tight">{test.title} Results</h2>
              <div className={`flex items-center gap-1.5 text-xs font-bold ${passed ? "text-emerald-400" : "text-rose-400"}`}>
                {passed ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                <span>{passed ? "Congratulations! You passed this assessment." : "You have not met the passing score."}</span>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-white/5 bg-[#08080f]/80 text-center shrink-0 min-w-36">
              <span className="text-[9px] text-slate-500 font-extrabold uppercase block">Your Score</span>
              <span className={`text-3xl font-black mt-1 block ${passed ? "text-emerald-400" : "text-rose-400"}`}>
                {currentReviewAttempt.scorePercent}%
              </span>
              <span className="text-[10px] text-slate-400 block mt-1">
                {currentReviewAttempt.correctAnswersCount} / {currentReviewAttempt.totalQuestionsCount} Correct
              </span>
              <span className="text-[10px] text-slate-400 block mt-1 font-mono">
                {spentMins}m {spentSecs}s spent
              </span>
            </div>
          </CardContent>
          <CardFooter className="p-5 border-t border-white/5 bg-white/[0.01] flex justify-end">
            <Button 
              onClick={() => {
                if (isGuest) {
                  setLocalPhase("overview");
                  setGuestAttempt(null);
                  setGuestReviewAttempt(null);
                  setGuestQuestions([]);
                  setAnswers({});
                  return;
                }
                router.push(window.location.pathname);
                router.refresh();
              }} 
              className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs h-9 px-4 font-bold uppercase tracking-wider flex items-center gap-1.5"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Retake / Go Back
            </Button>
          </CardFooter>
        </Card>

        {/* Real-Time Rank & State Leaderboard Section */}
        {ranking && (
          <div className="grid gap-4 md:grid-cols-3">
            {/* Rank Card */}
            <Card className="border-indigo-500/30 bg-gradient-to-br from-indigo-950/20 via-black/40 to-black/40 shadow-lg">
              <CardContent className="p-5 text-center space-y-1.5">
                <div className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest flex items-center justify-center gap-1.5">
                  <Trophy className="h-3.5 w-3.5" /> State Rank
                </div>
                <div className="text-2xl font-black text-white">
                  #{ranking.userRank}
                  <span className="text-xs font-normal text-slate-400 ml-1">/ {ranking.totalCandidates}</span>
                </div>
                <Badge variant="secondary" className="bg-indigo-500/10 text-indigo-300 border-indigo-500/20 text-[10px]">
                  Top {100 - ranking.percentile <= 1 ? 1 : 100 - ranking.percentile}% Percentile
                </Badge>
              </CardContent>
            </Card>

            {/* Total Students Attempted */}
            <Card className="border-white/10 bg-black/40 shadow-lg">
              <CardContent className="p-5 text-center space-y-1.5">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Total Candidates
                </div>
                <div className="text-2xl font-black text-white">
                  {ranking.totalCandidates}
                </div>
                <p className="text-[10px] text-slate-400">
                  Students completed this mock test
                </p>
              </CardContent>
            </Card>

            {/* Performance Level */}
            <Card className="border-emerald-500/20 bg-gradient-to-br from-emerald-950/20 via-black/40 to-black/40 shadow-lg">
              <CardContent className="p-5 text-center space-y-1.5">
                <div className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">
                  Exam Readiness
                </div>
                <div className="text-xl font-black text-white">
                  {currentReviewAttempt.scorePercent && currentReviewAttempt.scorePercent >= 70 ? "Merit Zone" : currentReviewAttempt.scorePercent && currentReviewAttempt.scorePercent >= 40 ? "Qualified" : "Practice Needed"}
                </div>
                <p className="text-[10px] text-slate-400">
                  Based on NMMS qualifying criteria
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Top Rankers Leaderboard */}
        {ranking && ranking.leaderboard.length > 0 && (
          <Card className="border-white/10 bg-black/40 shadow-xl overflow-hidden">
            <CardHeader className="p-4 border-b border-white/5 bg-white/[0.01] flex flex-row items-center justify-between">
              <div className="space-y-0.5">
                <CardTitle className="text-sm font-bold flex items-center gap-2 text-white">
                  <Trophy className="h-4 w-4 text-amber-400" />
                  Top Candidates Leaderboard
                </CardTitle>
                <CardDescription className="text-[11px] text-slate-400">
                  Real-time top scorers in this mock assessment
                </CardDescription>
              </div>
              <Badge variant="outline" className="border-amber-500/30 text-amber-400 text-[10px]">
                Live State Roster
              </Badge>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-white/5 text-xs">
                {ranking.leaderboard.map((lead) => (
                  <div key={lead.rank} className="flex items-center justify-between px-5 py-3 hover:bg-white/[0.02] transition">
                    <div className="flex items-center gap-3">
                      <span className={`h-6 w-6 rounded-full flex items-center justify-center font-bold text-[10px] ${
                        lead.rank === 1 ? "bg-amber-500/20 text-amber-400 border border-amber-500/30" :
                        lead.rank === 2 ? "bg-slate-300/20 text-slate-300 border border-slate-300/30" :
                        lead.rank === 3 ? "bg-amber-700/20 text-amber-600 border border-amber-700/30" :
                        "bg-white/5 text-slate-400"
                      }`}>
                        #{lead.rank}
                      </span>
                      <span className="font-semibold text-slate-200">{lead.name}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-mono text-slate-400 text-[10px]">
                        {Math.floor(lead.timeSpentSeconds / 60)}m {lead.timeSpentSeconds % 60}s
                      </span>
                      <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 font-bold text-[10px]">
                        {lead.scorePercent}%
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Detailed Question Review */}
        {showDetails ? (
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Detailed Feedback</h3>
            <div className="space-y-4">
              {activeQuestions.map((q, idx) => {
                const ans = q.answers?.[0];
                const isCorrect = ans?.isCorrect === true;
                
                return (
                  <Card key={q.id} className={`border-white/5 bg-[#0a0a14]/60 border-l-4 ${
                    isCorrect ? "border-l-emerald-500" : "border-l-rose-500"
                  }`}>
                    <CardHeader className="p-5 pb-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge className="border-white/10 text-slate-300 bg-white/5">Q{idx + 1}</Badge>
                        <Badge className="bg-white/5 border-white/5 text-slate-400 text-[9px] uppercase font-bold py-0 h-4">
                          {q.kind === "SHORT_ANSWER" ? "Fill In The Blank" : "MCQ"}
                        </Badge>
                        <span className="text-[10px] font-mono text-slate-400">{q.points} {q.points === 1 ? "point" : "points"}</span>
                        {isCorrect ? (
                          <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-[9px] py-0 h-4">✓ Correct</Badge>
                        ) : (
                          <Badge variant="destructive" className="bg-rose-500/10 text-rose-400 border-rose-500/20 text-[9px] py-0 h-4">× Incorrect</Badge>
                        )}
                      </div>
                      <CardTitle className="text-xs md:text-sm font-bold text-white pt-2 leading-relaxed">
                        <QuestionPromptDisplay prompt={q.prompt} />
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-5 space-y-3 text-xs">
                      {/* MCQ EXPLANATIONS */}
                      {q.kind === "SINGLE_CHOICE" && (
                        <div className="grid gap-2">
                          {q.options.map((opt) => {
                            const selected = ans?.selectedOptionId === opt.id;
                            const correct = opt.isCorrect;

                            let borderClass = "border-white/5 bg-white/[0.01] text-slate-300";
                            if (correct) {
                              borderClass = "border-emerald-500/20 bg-emerald-500/5 text-white";
                            } else if (selected) {
                              borderClass = "border-rose-500/20 bg-rose-500/5 text-white";
                            }

                            return (
                              <div key={opt.id} className={`p-3 rounded-xl border flex items-center justify-between gap-3 ${borderClass}`}>
                                <span>{opt.label}</span>
                                <div className="flex items-center gap-2 shrink-0">
                                  {selected && <Badge className="text-[9px] h-4 py-0 border-indigo-500/20 text-indigo-300 bg-indigo-500/5">Your Answer</Badge>}
                                  {correct ? (
                                    <CheckCircle2 className="h-4.5 w-4.5 text-emerald-400" />
                                  ) : selected ? (
                                    <XCircle className="h-4.5 w-4.5 text-rose-400" />
                                  ) : (
                                    <span className="h-4.5 w-4.5 rounded-full border border-white/20" />
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {/* FILL IN THE BLANK EXPLANATIONS */}
                      {q.kind === "SHORT_ANSWER" && (
                        <div className="space-y-3">
                          <div className="p-3 rounded-xl border border-white/5 bg-slate-950/40 space-y-1.5">
                            <p className="text-slate-400">Your Answer: <strong className={isCorrect ? "text-emerald-400" : "text-rose-400"}>{ans?.answerText || "[Blank]"}</strong></p>
                            <p className="text-slate-400">Accepted Matches: <strong className="text-emerald-400">{q.options.map(o => o.label).join(", ")}</strong></p>
                          </div>
                          {q.metadata && (q.metadata as any).caseSensitive && (
                            <p className="text-[10px] text-amber-400 font-bold uppercase tracking-wider animate-pulse flex items-center gap-1">
                              <AlertTriangle className="h-3 w-3" /> Strict Case-Sensitive Matching Activated
                            </p>
                          )}
                        </div>
                      )}

                      {q.explanation && (
                        <div className="p-3.5 rounded-xl border border-indigo-500/10 bg-indigo-500/5 text-slate-300 text-xs mt-3 flex items-start gap-2 leading-relaxed">
                          <BookOpen className="h-4.5 w-4.5 text-indigo-400 shrink-0 mt-0.5" />
                          <div>
                            <strong className="text-white block mb-0.5">Explanation</strong>
                            {q.explanation}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="p-6 border border-white/5 rounded-2xl bg-[#0a0a14]/60 text-slate-400 text-xs italic">
            Quiz assessment graded successfully. Question bank reviews have been disabled by the instructor.
          </div>
        )}
      </div>
    );
  }

  return null;
}
