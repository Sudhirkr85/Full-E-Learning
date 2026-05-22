"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { startAttemptAction, submitAttemptAction } from "@/lib/tests/actions";
import { QuestionType, AttemptStatus } from "@prisma/client";
import { 
  Clock, 
  HelpCircle, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  ArrowLeft, 
  ChevronLeft, 
  ChevronRight, 
  Lightbulb, 
  FileText, 
  RotateCcw,
  Sparkles,
  Loader2
} from "lucide-react";
import Link from "next/link";

type OptionData = {
  id: string;
  label: string;
  isCorrect?: boolean;
  explanation?: string | null;
};

type QuestionData = {
  id: string;
  prompt: string;
  kind: QuestionType;
  points: number;
  explanation?: string | null;
  options: OptionData[];
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
  courseId?: string;
};

type TestPortalClientProps = {
  phase: "overview" | "taking" | "review";
  courseSlug: string;
  testSlug: string;
  test: TestData;
  isEnrolled: boolean;
  attempts?: AttemptData[];
  activeAttempt?: AttemptData | null;
  questions?: QuestionData[];
  reviewAttempt?: AttemptData | null;
};

export default function TestPortalClient({
  phase,
  courseSlug,
  testSlug,
  test,
  isEnrolled,
  attempts = [],
  activeAttempt = null,
  questions = [],
  reviewAttempt = null,
}: TestPortalClientProps) {
  const router = useRouter();
  
  // Dynamic taking states
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, {
    selectedOptionId?: string | null;
    selectedOptionIds?: string[] | null;
    answerText?: string | null;
  }>>({});
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isStarting, setIsStarting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Timer Setup for Active Taking Phase
  useEffect(() => {
    if (phase !== "taking" || !activeAttempt || !test.timeLimitMinutes) return;

    const startedTime = new Date(activeAttempt.startedAt).getTime();
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
  }, [phase, activeAttempt, test.timeLimitMinutes]);

  const handleAutoSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    
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

      await submitAttemptAction(activeAttempt!.id, submissionPayload);
      router.push(`/courses/${courseSlug}/tests/${testSlug}?attemptId=${activeAttempt!.id}`);
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStartAttempt = async () => {
    setIsStarting(true);
    setError(null);
    try {
      await startAttemptAction(test.courseId || courseSlug, test.id);
    } catch (err: any) {
      setError(err.message ?? "Failed to start quiz attempt.");
      setIsStarting(false);
    }
  };

  const handleSingleChoiceSelect = (questionId: string, optionId: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: {
        selectedOptionId: optionId,
      },
    }));
  };

  const handleMultipleChoiceSelect = (questionId: string, optionId: string) => {
    const currentList = answers[questionId]?.selectedOptionIds || [];
    let newList;
    if (currentList.includes(optionId)) {
      newList = currentList.filter((id) => id !== optionId);
    } else {
      newList = [...currentList, optionId];
    }
    
    setAnswers((prev) => ({
      ...prev,
      [questionId]: {
        selectedOptionIds: newList,
      },
    }));
  };

  const handleShortAnswerChange = (questionId: string, text: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: {
        answerText: text,
      },
    }));
  };

  const handleManualSubmit = async () => {
    if (!confirm("Are you sure you want to submit your answers and complete this attempt?")) {
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
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

      await submitAttemptAction(activeAttempt!.id, submissionPayload);
      window.location.href = `/courses/${courseSlug}/tests/${testSlug}?attemptId=${activeAttempt!.id}`;
    } catch (err: any) {
      setError(err.message ?? "Failed to submit answers.");
      setIsSubmitting(false);
    }
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
  if (phase === "overview") {
    const hasAttemptsLeft = !test.attemptLimit || attempts.length < test.attemptLimit;
    const canTake = isEnrolled && hasAttemptsLeft;

    return (
      <div className="max-w-4xl mx-auto space-y-8 py-10 px-4 sm:px-6 lg:px-8">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link href={`/courses/${courseSlug}`} className="hover:text-primary transition-colors">Course Home</Link>
          <span>/</span>
          <span className="text-foreground font-medium">Assessments</span>
        </div>

        {error && (
          <div className="bg-destructive/10 text-destructive text-sm px-4 py-3 rounded-xl flex items-center gap-2 border border-destructive/20">
            <AlertTriangle className="h-5 w-5 shrink-0" />
            {error}
          </div>
        )}

        <Card className="overflow-hidden border-border/60 shadow-xl bg-gradient-to-br from-background via-background to-muted/10">
          <CardHeader className="p-8 border-b border-border/40">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <Badge variant="outline" className="capitalize">{test.type.toLowerCase()}</Badge>
              <Badge variant="secondary" className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {test.timeLimitMinutes ? `${test.timeLimitMinutes} Mins` : "No Time Limit"}
              </Badge>
              <Badge className="bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 border-emerald-500/25">
                Passing: {test.passingScore}%
              </Badge>
            </div>
            <CardTitle className="text-3xl font-bold tracking-tight md:text-4xl">{test.title}</CardTitle>
            <p className="mt-4 text-muted-foreground leading-relaxed text-base">{test.description ?? "Complete this assessment to test your understanding of the course materials and progress in your learning path."}</p>
          </CardHeader>
          <CardContent className="p-8 space-y-6">
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
              <div className="p-4 rounded-2xl bg-muted/40 border border-border/50 text-center">
                <div className="text-xs text-muted-foreground uppercase font-semibold tracking-wider">Passing Score</div>
                <div className="mt-2 text-2xl font-bold text-emerald-500">{test.passingScore}%</div>
              </div>
              <div className="p-4 rounded-2xl bg-muted/40 border border-border/50 text-center">
                <div className="text-xs text-muted-foreground uppercase font-semibold tracking-wider">Time Limit</div>
                <div className="mt-2 text-2xl font-bold text-foreground">
                  {test.timeLimitMinutes ? `${test.timeLimitMinutes}m` : "∞"}
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-muted/40 border border-border/50 text-center">
                <div className="text-xs text-muted-foreground uppercase font-semibold tracking-wider">Attempt Limit</div>
                <div className="mt-2 text-2xl font-bold text-foreground">
                  {test.attemptLimit ? `${test.attemptLimit}` : "∞"}
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-muted/40 border border-border/50 text-center">
                <div className="text-xs text-muted-foreground uppercase font-semibold tracking-wider">Attempts Made</div>
                <div className="mt-2 text-2xl font-bold text-foreground">{attempts.length}</div>
              </div>
            </div>

            {/* Prior Attempts List */}
            {attempts.length > 0 && (
              <div className="space-y-4 pt-4">
                <h3 className="text-lg font-semibold tracking-tight">Your Previous Attempts</h3>
                <div className="overflow-hidden rounded-xl border border-border">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-muted/40 border-b border-border text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                        <th className="p-4">Attempt</th>
                        <th className="p-4">Score</th>
                        <th className="p-4">Duration</th>
                        <th className="p-4">Date Completed</th>
                        <th className="p-4 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border text-sm">
                      {attempts.map((att) => {
                        const isPassing = att.scorePercent !== null && att.scorePercent >= test.passingScore;
                        const minutes = att.timeSpentSeconds ? Math.floor(att.timeSpentSeconds / 60) : 0;
                        const seconds = att.timeSpentSeconds ? att.timeSpentSeconds % 60 : 0;
                        return (
                          <tr key={att.id} className="hover:bg-muted/10">
                            <td className="p-4 font-semibold">Attempt #{att.attemptNumber}</td>
                            <td className="p-4">
                              {att.scorePercent !== null ? (
                                <div className="flex items-center gap-1.5">
                                  <span className={`font-semibold ${isPassing ? "text-emerald-500" : "text-destructive"}`}>
                                    {att.scorePercent}%
                                  </span>
                                  {isPassing ? (
                                    <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/25 text-xs py-0 h-5">Pass</Badge>
                                  ) : (
                                    <Badge variant="destructive" className="bg-destructive/10 text-destructive border-destructive/25 text-xs py-0 h-5">Fail</Badge>
                                  )}
                                </div>
                              ) : (
                                <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/25 text-xs">Uncompleted</Badge>
                              )}
                            </td>
                            <td className="p-4 font-mono text-muted-foreground">
                              {att.timeSpentSeconds ? `${minutes}m ${seconds}s` : "--"}
                            </td>
                            <td className="p-4 text-xs text-muted-foreground">
                              {att.submittedAt ? new Date(att.submittedAt).toLocaleDateString("en-US", {
                                month: "short", day: "numeric", year: "numeric"
                              }) : "--"}
                            </td>
                            <td className="p-4 text-right">
                              <Button asChild size="sm" variant="ghost">
                                <Link href={`/courses/${courseSlug}/tests/${testSlug}?attemptId=${att.id}`}>
                                  Review
                                </Link>
                              </Button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className="p-8 border-t border-border/40 bg-muted/5 flex items-center justify-end gap-3">
            <Button asChild variant="outline">
              <Link href={`/courses/${courseSlug}`}>
                Back to Course
              </Link>
            </Button>
            {canTake ? (
              <Button onClick={handleStartAttempt} disabled={isStarting} size="lg" className="flex items-center gap-2">
                {isStarting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Starting...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    Start Assessment
                  </>
                )}
              </Button>
            ) : (
              <Button disabled size="lg" className="bg-muted text-muted-foreground border-muted cursor-not-allowed">
                {!isEnrolled ? "Enroll to Unlock" : "Attempts Exhausted"}
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
    );
  }

  // ----------------------------------------------------
  // ACTIVE TAKING PHASE RENDER (TIMED & ONE-BY-ONE)
  // ----------------------------------------------------
  if (phase === "taking" && activeAttempt) {
    const currentQuestion = questions[currentQuestionIdx];
    const isFirstQuestion = currentQuestionIdx === 0;
    const isLastQuestion = currentQuestionIdx === questions.length - 1;

    // Check if the student has provided an answer to the current question
    const isQuestionAnswered = (qId: string) => {
      const ans = answers[qId];
      if (!ans) return false;
      if (ans.selectedOptionId) return true;
      if (ans.selectedOptionIds && ans.selectedOptionIds.length > 0) return true;
      if (ans.answerText && ans.answerText.trim() !== "") return true;
      return false;
    };

    if (isSubmitting) {
      return (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/80 backdrop-blur-md">
          <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
          <h2 className="text-xl font-bold tracking-tight">Submitting Assessment</h2>
          <p className="text-sm text-muted-foreground mt-2">Grading your answers securely on the server... Please wait.</p>
        </div>
      );
    }

    return (
      <div className="max-w-5xl mx-auto py-10 px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Top Timed Bar */}
        <div className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-card border border-border/60 shadow-lg sticky top-4 z-40">
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold text-muted-foreground">Attempt #{activeAttempt.attemptNumber}</span>
            <div className="hidden sm:flex items-center gap-1.5 text-sm font-medium">
              <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
              Live active session
            </div>
          </div>

          <div className="flex items-center gap-4">
            {test.timeLimitMinutes && (
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-destructive/10 text-destructive border border-destructive/20 font-mono font-bold animate-pulse text-sm">
                <Clock className="h-4 w-4" />
                {formatTimer(timeRemaining)}
              </div>
            )}
            
            <Button onClick={handleManualSubmit} variant="default" size="sm">
              Submit Quiz
            </Button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
          {/* Question Display Screen */}
          <div className="space-y-4">
            {currentQuestion ? (
              <Card className="border-border/60 shadow-md">
                <CardHeader className="p-6 border-b border-border/40 bg-muted/5">
                  <div className="flex items-center justify-between gap-4 mb-2">
                    <Badge variant="outline">Question {currentQuestionIdx + 1} of {questions.length}</Badge>
                    <Badge variant="outline" className="text-xs text-muted-foreground">{currentQuestion.points} Points</Badge>
                  </div>
                  <CardTitle className="text-xl font-medium leading-relaxed leading-7 text-foreground">
                    {currentQuestion.prompt}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  {/* SINGLE CHOICE & TRUE/FALSE OPTION SELECTIONS */}
                  {(currentQuestion.kind === QuestionType.SINGLE_CHOICE || currentQuestion.kind === QuestionType.TRUE_FALSE) && (
                    <div className="grid gap-3">
                      {currentQuestion.options.map((opt) => {
                        const isSelected = answers[currentQuestion.id]?.selectedOptionId === opt.id;
                        return (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => handleSingleChoiceSelect(currentQuestion.id, opt.id)}
                            className={`w-full text-left p-4 rounded-xl border transition-all flex items-center justify-between gap-3 text-sm ${
                              isSelected
                                ? "border-primary bg-primary/5 font-semibold text-primary"
                                : "border-border hover:bg-muted/30"
                            }`}
                          >
                            <span>{opt.label}</span>
                            <span className={`h-4 w-4 rounded-full border shrink-0 flex items-center justify-center ${
                              isSelected ? "border-primary bg-primary" : "border-border bg-background"
                            }`}>
                              {isSelected && <span className="h-1.5 w-1.5 rounded-full bg-background"></span>}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {/* MULTIPLE CHOICE OPTION SELECTIONS */}
                  {currentQuestion.kind === QuestionType.MULTIPLE_CHOICE && (
                    <div className="grid gap-3">
                      {currentQuestion.options.map((opt) => {
                        const isSelected = (answers[currentQuestion.id]?.selectedOptionIds || []).includes(opt.id);
                        return (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => handleMultipleChoiceSelect(currentQuestion.id, opt.id)}
                            className={`w-full text-left p-4 rounded-xl border transition-all flex items-center justify-between gap-3 text-sm ${
                              isSelected
                                ? "border-primary bg-primary/5 font-semibold text-primary"
                                : "border-border hover:bg-muted/30"
                            }`}
                          >
                            <span>{opt.label}</span>
                            <span className={`h-4 w-4 rounded border shrink-0 flex items-center justify-center ${
                              isSelected ? "border-primary bg-primary" : "border-border bg-background"
                            }`}>
                              {isSelected && <CheckCircle2 className="h-3.5 w-3.5 text-background" />}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {/* SHORT ANSWER TEXT ENTRY */}
                  {currentQuestion.kind === QuestionType.SHORT_ANSWER && (
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Type Your Answer</label>
                      <Input
                        value={answers[currentQuestion.id]?.answerText || ""}
                        onChange={(e) => handleShortAnswerChange(currentQuestion.id, e.target.value)}
                        placeholder="Enter exact short answer text match..."
                        className="h-12 text-base rounded-xl"
                      />
                      <p className="text-xs text-muted-foreground">Short text matches are case-insensitive. Provide exact answers.</p>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="p-6 border-t border-border/40 bg-muted/5 flex items-center justify-between gap-4">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentQuestionIdx((prev) => Math.max(0, prev - 1))}
                    disabled={isFirstQuestion}
                    className="flex items-center gap-1"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>

                  {isLastQuestion ? (
                    <Button onClick={handleManualSubmit} variant="default" className="flex items-center gap-1.5">
                      <CheckCircle2 className="h-4 w-4" />
                      Submit Assessment
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      onClick={() => setCurrentQuestionIdx((prev) => Math.min(questions.length - 1, prev + 1))}
                      className="flex items-center gap-1"
                    >
                      Next
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  )}
                </CardFooter>
              </Card>
            ) : (
              <div className="text-center p-12 border border-dashed rounded-2xl bg-muted/10 text-muted-foreground text-sm">
                No questions available inside this assessment.
              </div>
            )}
          </div>

          {/* Quick Navigation Panel */}
          <div className="space-y-4">
            <Card className="border-border/60 shadow-md">
              <CardHeader className="p-5 border-b border-border/40">
                <CardTitle className="text-base font-semibold flex items-center gap-1.5">
                  <FileText className="h-4 w-4 text-primary" />
                  Quiz Navigator
                </CardTitle>
                <CardDescription>Click to jump between questions.</CardDescription>
              </CardHeader>
              <CardContent className="p-5">
                <div className="grid grid-cols-5 gap-2">
                  {questions.map((q, idx) => {
                    const isCurrent = idx === currentQuestionIdx;
                    const isAnswered = isQuestionAnswered(q.id);
                    
                    let bgClass = "bg-muted/40 hover:bg-muted text-muted-foreground border-border";
                    if (isCurrent) {
                      bgClass = "bg-primary text-background border-primary ring-2 ring-primary/20 ring-offset-2 font-bold";
                    } else if (isAnswered) {
                      bgClass = "bg-emerald-500/10 text-emerald-500 border-emerald-500/30 hover:bg-emerald-500/20";
                    }

                    return (
                      <button
                        key={q.id}
                        onClick={() => setCurrentQuestionIdx(idx)}
                        className={`h-10 w-full rounded-xl border text-xs flex items-center justify-center font-medium transition-all ${bgClass}`}
                      >
                        {idx + 1}
                      </button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // GRADED REVIEW PHASE RENDER (DETAILED ANSWERS + explanationS)
  // ----------------------------------------------------
  if (phase === "review" && reviewAttempt) {
    const isPassingScore = reviewAttempt.scorePercent !== null && reviewAttempt.scorePercent >= test.passingScore;
    const timeSpentMins = reviewAttempt.timeSpentSeconds ? Math.floor(reviewAttempt.timeSpentSeconds / 60) : 0;
    const timeSpentSecs = reviewAttempt.timeSpentSeconds ? reviewAttempt.timeSpentSeconds % 60 : 0;

    return (
      <div className="max-w-4xl mx-auto space-y-8 py-10 px-4 sm:px-6 lg:px-8">
        {/* Navigation Breadcrumbs */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link href={`/courses/${courseSlug}`} className="hover:text-primary transition-colors">Course Home</Link>
          <span>/</span>
          <Link href={`/courses/${courseSlug}/tests/${testSlug}`} className="hover:text-primary transition-colors">Assessments</Link>
          <span>/</span>
          <span className="text-foreground font-medium">Attempt #{reviewAttempt.attemptNumber} Review</span>
        </div>

        {/* Scorecard Header Card */}
        <Card className={`overflow-hidden border shadow-xl ${
          isPassingScore 
            ? "border-emerald-500/30 bg-gradient-to-br from-background to-emerald-500/5" 
            : "border-destructive/30 bg-gradient-to-br from-background to-destructive/5"
        }`}>
          <CardContent className="p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="capitalize">{test.type.toLowerCase()}</Badge>
                <Badge variant="outline" className="font-mono">Attempt #{reviewAttempt.attemptNumber}</Badge>
              </div>
              <h2 className="text-2xl font-bold tracking-tight">{test.title} Results</h2>
              
              {isPassingScore ? (
                <div className="flex items-center gap-2 text-emerald-500 font-semibold">
                  <CheckCircle2 className="h-5 w-5 shrink-0" />
                  <span>Congratulations, you passed this assessment!</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-destructive font-semibold">
                  <XCircle className="h-5 w-5 shrink-0" />
                  <span>You did not reach the passing score of {test.passingScore}%.</span>
                </div>
              )}

              <p className="text-sm text-muted-foreground">
                Graded automatically on the server on {reviewAttempt.submittedAt ? new Date(reviewAttempt.submittedAt).toLocaleDateString() : "--"}.
              </p>
            </div>

            <div className="flex flex-col items-center justify-center p-6 rounded-2xl bg-background/80 backdrop-blur border border-border/50 text-center shrink-0 min-w-40">
              <div className="text-xs text-muted-foreground uppercase font-semibold tracking-wider">Your Score</div>
              <div className={`mt-2 text-4xl font-extrabold ${isPassingScore ? "text-emerald-500" : "text-destructive"}`}>
                {reviewAttempt.scorePercent}%
              </div>
              <div className="text-xs text-muted-foreground mt-1.5">
                {reviewAttempt.correctAnswersCount} / {reviewAttempt.totalQuestionsCount} Correct
              </div>
              <div className="text-xs text-muted-foreground mt-1.5 flex items-center justify-center gap-1">
                <Clock className="h-3 w-3" />
                {timeSpentMins}m {timeSpentSecs}s spent
              </div>
            </div>
          </CardContent>
          <CardFooter className="p-6 border-t border-border/20 bg-muted/5 flex items-center justify-end gap-3">
            <Button asChild variant="outline">
              <Link href={`/courses/${courseSlug}`}>
                Back to Course
              </Link>
            </Button>
            <Button asChild variant="default" className="flex items-center gap-1.5">
              <Link href={`/courses/${courseSlug}/tests/${testSlug}`}>
                <RotateCcw className="h-4 w-4" />
                Back to Test Overview
              </Link>
            </Button>
          </CardFooter>
        </Card>

        {/* Detailed Graded Question Review Panel */}
        <div className="space-y-6">
          <h3 className="text-xl font-bold tracking-tight">Question-by-Question Review</h3>
          
          {questions.map((q, idx) => {
            const answer = q.answers?.[0];
            const isCorrect = answer?.isCorrect;
            
            // Multiple Choice selections from student answers
            const studentSelectedOptionIds = answer?.metadata && typeof answer.metadata === "object"
              ? (answer.metadata as any).selectedOptionIds || []
              : [];

            return (
              <Card key={q.id} className={`border-border/60 transition-all ${
                isCorrect 
                  ? "border-l-4 border-l-emerald-500" 
                  : "border-l-4 border-l-destructive"
              }`}>
                <CardHeader className="p-6 pb-3">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">Q{idx + 1}</Badge>
                        <Badge variant="secondary" className="text-xs uppercase">
                          {q.kind.replace("_", " ").toLowerCase()}
                        </Badge>
                        <Badge variant="outline" className="text-xs text-muted-foreground">{q.points} {q.points === 1 ? "point" : "points"}</Badge>
                        {isCorrect ? (
                          <Badge className="bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 border-emerald-500/25 flex items-center gap-1 text-xs py-0 h-5">
                            <CheckCircle2 className="h-3 w-3" /> Correct
                          </Badge>
                        ) : (
                          <Badge variant="destructive" className="bg-destructive/10 text-destructive border-destructive/25 flex items-center gap-1 text-xs py-0 h-5">
                            <XCircle className="h-3 w-3" /> Incorrect
                          </Badge>
                        )}
                      </div>
                      <CardTitle className="text-lg pt-2 font-medium leading-relaxed">
                        {q.prompt}
                      </CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  {/* SINGLE CHOICE & TRUE/FALSE OPTION REVIEWS */}
                  {(q.kind === QuestionType.SINGLE_CHOICE || q.kind === QuestionType.TRUE_FALSE) && (
                    <div className="grid gap-2.5">
                      {q.options.map((opt) => {
                        const isStudentSelected = answer?.selectedOptionId === opt.id;
                        const isOptCorrect = opt.isCorrect;
                        
                        let borderClass = "border-border";
                        let bgClass = "bg-background";
                        
                        if (isOptCorrect) {
                          borderClass = "border-emerald-500/40";
                          bgClass = "bg-emerald-500/5 text-foreground";
                        } else if (isStudentSelected && !isOptCorrect) {
                          borderClass = "border-destructive/40";
                          bgClass = "bg-destructive/5 text-foreground";
                        }

                        return (
                          <div
                            key={opt.id}
                            className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 text-sm transition-all ${borderClass} ${bgClass}`}
                          >
                            <span>{opt.label}</span>
                            <div className="flex items-center gap-1.5 shrink-0">
                              {isStudentSelected && <Badge variant="secondary" className="text-[10px] px-1.5">Your Choice</Badge>}
                              {isOptCorrect ? (
                                <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                              ) : isStudentSelected ? (
                                <XCircle className="h-5 w-5 text-destructive" />
                              ) : (
                                <span className="h-5 w-5 rounded-full border border-border/60"></span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* MULTIPLE CHOICE OPTION REVIEWS */}
                  {q.kind === QuestionType.MULTIPLE_CHOICE && (
                    <div className="grid gap-2.5">
                      {q.options.map((opt) => {
                        const isStudentSelected = studentSelectedOptionIds.includes(opt.id);
                        const isOptCorrect = opt.isCorrect;
                        
                        let borderClass = "border-border";
                        let bgClass = "bg-background";
                        
                        if (isOptCorrect) {
                          borderClass = "border-emerald-500/40";
                          bgClass = "bg-emerald-500/5 text-foreground";
                        } else if (isStudentSelected && !isOptCorrect) {
                          borderClass = "border-destructive/40";
                          bgClass = "bg-destructive/5 text-foreground";
                        }

                        return (
                          <div
                            key={opt.id}
                            className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 text-sm transition-all ${borderClass} ${bgClass}`}
                          >
                            <span>{opt.label}</span>
                            <div className="flex items-center gap-1.5 shrink-0">
                              {isStudentSelected && <Badge variant="secondary" className="text-[10px] px-1.5">Your Choice</Badge>}
                              {isOptCorrect ? (
                                <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                              ) : isStudentSelected ? (
                                <XCircle className="h-5 w-5 text-destructive" />
                              ) : (
                                <span className="h-5 w-5 rounded border border-border/60"></span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* SHORT ANSWER REVIEWS */}
                  {q.kind === QuestionType.SHORT_ANSWER && (
                    <div className="space-y-3">
                      <div className="p-4 rounded-xl border border-border bg-muted/10 text-sm">
                        <div className="text-xs text-muted-foreground uppercase font-semibold">Your Answered Text</div>
                        <div className={`mt-1.5 font-mono text-base flex items-center gap-2 ${
                          isCorrect ? "text-emerald-500 font-semibold" : "text-destructive"
                        }`}>
                          {isCorrect ? <CheckCircle2 className="h-5 w-5 shrink-0" /> : <XCircle className="h-5 w-5 shrink-0" />}
                          "{answer?.answerText ?? "(No Answer)"}"
                        </div>
                      </div>

                      {!isCorrect && (
                        <div className="p-3.5 rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-sm">
                          <div className="text-xs text-emerald-600 font-semibold uppercase">Correct Answers Match Criteria</div>
                          <div className="mt-1 flex flex-wrap gap-1.5">
                            {q.options.map((opt) => (
                              <Badge key={opt.id} className="bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 border-emerald-500/25 font-mono">
                                {opt.label}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Dynamic Explanations/Feedback Bulbs */}
                  {q.explanation && (
                    <div className="mt-4 p-4 bg-muted/40 rounded-xl text-xs sm:text-sm flex gap-3 items-start border border-border/30 text-muted-foreground">
                      <Lightbulb className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-foreground font-semibold">Teacher Explanation: </strong>
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
    );
  }

  return null;
}
