"use client";

import React, { useState, useEffect, useTransition } from "react";
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
  BookOpen
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

  useEffect(() => {
    setMounted(true);
  }, []);

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
      "Are you sure you want to submit your answers and complete this attempt?",
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
      "Submit Quiz"
    );
  };

  const handleMCQSelect = (questionId: string, optionId: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: {
        selectedOptionId: optionId,
      },
    }));
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
        <CardHeader className="p-6 md:p-8 border-b border-white/5 bg-gradient-to-br from-indigo-950/20 to-slate-950/40">
          <div className="flex flex-wrap items-center gap-2 mb-3">
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

    return (
      <div className="space-y-4 text-left">
        {/* Sticky attempt timer and control */}
        <div className="p-4 rounded-xl border border-white/5 bg-[#0a0a14]/60 backdrop-blur-md flex items-center justify-between gap-4">
          <div className="space-y-0.5">
            <span className="text-[10px] text-slate-500 uppercase tracking-widest font-mono">Timed Assessment Attempt</span>
            <h4 className="text-xs font-bold text-white leading-none">
              Attempt #{currentAttempt.attemptNumber}
              {isGuest && <span className="text-[10px] text-amber-400 font-bold ml-2">[Guest Mode]</span>}
              <span className="text-[10px] text-slate-400 font-mono font-normal ml-3">Started At: {mounted ? new Date(currentAttempt.startedAt).toLocaleTimeString("en-IN", { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }) : ""}</span>
            </h4>
          </div>

          <div className="flex items-center gap-3">
            {test.timeLimitMinutes && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/25 font-mono font-bold animate-pulse text-xs">
                <Clock className="h-3.5 w-3.5" />
                {formatTimer(timeRemaining)}
              </div>
            )}
            <Button onClick={handleManualSubmit} disabled={isPending} className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs h-9 px-4 rounded-lg">
              {isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Finish Quiz"}
            </Button>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-[1fr_260px]">
          {/* Question card */}
          <div className="space-y-4">
            {currentQuestion ? (
              <Card className="border-white/5 bg-[#0a0a14]/60">
                <CardHeader className="p-6 border-b border-white/5 bg-white/[0.01]">
                  <div className="flex items-center justify-between gap-4 mb-2">
                    <Badge variant="secondary">Question {currentQuestionIdx + 1} of {activeQuestions.length}</Badge>
                    <span className="text-[10px] font-mono text-slate-500">{currentQuestion.points} Marks</span>
                  </div>
                  <CardTitle className="text-sm md:text-base font-bold text-white leading-relaxed">{currentQuestion.prompt}</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  {/* MCQ SELECTORS */}
                  {currentQuestion.kind === "SINGLE_CHOICE" && (
                    <div className="grid gap-2">
                      {currentQuestion.options.map((opt) => {
                        const isSelected = answers[currentQuestion.id]?.selectedOptionId === opt.id;
                        return (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => handleMCQSelect(currentQuestion.id, opt.id)}
                            className={`w-full text-left p-3.5 rounded-xl border text-xs transition-all flex items-center justify-between gap-3 ${
                              isSelected
                                ? "border-indigo-500 bg-indigo-500/5 font-semibold text-white shadow"
                                : "border-white/5 bg-white/[0.01] hover:bg-white/[0.03] text-slate-300"
                            }`}
                          >
                            <span>{opt.label}</span>
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
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Type Your Answer</label>
                      <Input
                        value={answers[currentQuestion.id]?.answerText || ""}
                        onChange={(e) => handleFitbChange(currentQuestion.id, e.target.value)}
                        placeholder="Enter primary answer match..."
                        className="h-11 text-xs rounded-xl bg-white/5 border-white/10 text-white"
                      />
                      <p className="text-[10px] text-slate-500 italic">Matches can be case-sensitive or insensitive as configured by the instructor.</p>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="p-5 border-t border-white/5 bg-white/[0.01] flex justify-between">
                  <Button 
                    onClick={() => setCurrentQuestionIdx(idx => Math.max(0, idx - 1))} 
                    disabled={isFirst} 
                    variant="outline" 
                    className="h-9 text-xs rounded-xl border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white disabled:opacity-20 disabled:bg-transparent disabled:text-slate-500 disabled:border-white/5 transition-all"
                  >
                    Previous
                  </Button>
                  {isLast ? (
                    <Button onClick={handleManualSubmit} disabled={isPending} className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs h-9 px-4 rounded-lg">
                      Submit Assessment
                    </Button>
                  ) : (
                    <Button onClick={() => setCurrentQuestionIdx(idx => Math.min(activeQuestions.length - 1, idx + 1))} className="h-9 text-xs rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white">
                      Next Question
                    </Button>
                  )}
                </CardFooter>
              </Card>
            ) : (
              <p className="text-center text-slate-500 py-6 text-xs italic">No questions found.</p>
            )}
          </div>

          {/* Nav sidebar */}
          <Card className="border-white/5 bg-[#0a0a14]/60 self-start">
            <CardHeader className="p-4 border-b border-white/5">
              <CardTitle className="text-xs font-bold uppercase text-white tracking-wider flex items-center gap-1">
                <FileText className="h-4 w-4 text-indigo-400" />
                Navigator
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="grid grid-cols-4 gap-2">
                {activeQuestions.map((q, idx) => {
                  const isCurrent = idx === currentQuestionIdx;
                  const answered = isAnswered(q.id);

                  let bgClass = "bg-white/5 border-white/5 text-slate-400";
                  if (isCurrent) {
                    bgClass = "bg-indigo-600 border-indigo-500 text-white font-extrabold";
                  } else if (answered) {
                    bgClass = "bg-emerald-500/10 border-emerald-500/20 text-emerald-400";
                  }

                  return (
                    <button
                      key={q.id}
                      onClick={() => setCurrentQuestionIdx(idx)}
                      className={`h-9 w-full rounded-xl border text-xs flex items-center justify-center transition-all ${bgClass}`}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
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
                      <CardTitle className="text-xs md:text-sm font-bold text-white pt-2 leading-relaxed">{q.prompt}</CardTitle>
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
