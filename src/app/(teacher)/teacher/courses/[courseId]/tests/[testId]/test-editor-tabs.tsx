"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { updateTestSettingsAction, deleteTestAction } from "@/lib/tests/actions";
import { QuestionType, TestType, AttemptStatus } from "@prisma/client";
import QuestionBuilder from "./question-builder";
import { Settings, ClipboardList, BookOpen, Clock, Users, ShieldAlert, CheckCircle2, XCircle, AlertTriangle, ArrowLeft, Save, Trash2 } from "lucide-react";
import Link from "next/link";

type SectionItem = {
  id: string;
  title: string;
  orderIndex: number;
};

type OptionData = {
  id?: string;
  label: string;
  value?: string | null;
  isCorrect: boolean;
  orderIndex: number;
  explanation?: string | null;
};

type QuestionData = {
  id: string;
  prompt: string;
  explanation: string | null;
  kind: QuestionType;
  points: number;
  orderIndex: number;
  options: OptionData[];
};

type AttemptItem = {
  id: string;
  attemptNumber: number;
  startedAt: Date;
  submittedAt: Date | null;
  status: AttemptStatus;
  scorePercent: number | null;
  correctAnswersCount: number;
  totalQuestionsCount: number;
  timeSpentSeconds: number | null;
  user: {
    name: string | null;
    email: string;
  };
};

type TestData = {
  id: string;
  courseId: string;
  sectionId: string | null;
  title: string;
  description: string | null;
  type: TestType;
  passingScore: number;
  timeLimitMinutes: number | null;
  attemptLimit: number | null;
  shuffleQuestions: boolean;
  isPublished: boolean;
};

type TestEditorTabsProps = {
  test: TestData;
  sections: SectionItem[];
  questions: QuestionData[];
  attempts: AttemptItem[];
  courseId: string;
};

export default function TestEditorTabs({ test, sections, questions, attempts, courseId }: TestEditorTabsProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"settings" | "questions" | "attempts">("settings");
  
  // Settings form states
  const [title, setTitle] = useState(test.title);
  const [description, setDescription] = useState(test.description ?? "");
  const [type, setType] = useState<TestType>(test.type);
  const [passingScore, setPassingScore] = useState(test.passingScore);
  const [timeLimitMinutes, setTimeLimitMinutes] = useState(test.timeLimitMinutes ?? "");
  const [attemptLimit, setAttemptLimit] = useState(test.attemptLimit ?? "");
  const [shuffleQuestions, setShuffleQuestions] = useState(test.shuffleQuestions);
  const [isPublished, setIsPublished] = useState(test.isPublished);
  const [sectionId, setSectionId] = useState(test.sectionId ?? "");

  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage(null);

    try {
      const data = {
        courseId,
        sectionId: sectionId || null,
        title,
        description: description || null,
        type,
        passingScore: Number(passingScore),
        timeLimitMinutes: timeLimitMinutes ? Number(timeLimitMinutes) : null,
        attemptLimit: attemptLimit ? Number(attemptLimit) : null,
        shuffleQuestions,
        isPublished,
      };

      const res = await updateTestSettingsAction(test.id, data);
      if (res.success) {
        setMessage({ type: "success", text: "Test settings updated successfully!" });
        router.refresh();
      }
    } catch (err: any) {
      setMessage({ type: "error", text: err.message ?? "Failed to save settings." });
    } finally {
      setIsSaving(false);
    }
  };

  const formatDuration = (seconds: number | null) => {
    if (seconds === null) return "N/A";
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  return (
    <div className="space-y-8">
      {/* Back & Title Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-6">
        <div>
          <Button asChild variant="ghost" size="sm" className="mb-2">
            <Link href={`/teacher/courses/${courseId}/tests`} className="flex items-center gap-1">
              <ArrowLeft className="h-4 w-4" />
              Back to assessments
            </Link>
          </Button>
          <div className="flex items-center gap-3">
            <h1 className="font-display text-3xl font-semibold tracking-tight">{title}</h1>
            <Badge variant="outline" className="capitalize">{type.toLowerCase()}</Badge>
            {isPublished ? (
              <Badge className="bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 border-emerald-500/25">Published</Badge>
            ) : (
              <Badge variant="secondary">Draft</Badge>
            )}
          </div>
        </div>
      </div>

      {/* Custom Sleek Tabs Navigation */}
      <div className="flex border-b border-border gap-2">
        <button
          onClick={() => setActiveTab("settings")}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-all -mb-px ${
            activeTab === "settings"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <Settings className="h-4 w-4" />
          Test Settings
        </button>
        <button
          onClick={() => setActiveTab("questions")}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-all -mb-px ${
            activeTab === "questions"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <ClipboardList className="h-4 w-4" />
          Question Builder ({questions.length})
        </button>
        <button
          onClick={() => setActiveTab("attempts")}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-all -mb-px ${
            activeTab === "attempts"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <Users className="h-4 w-4" />
          Attempts & Results ({attempts.length})
        </button>
      </div>

      {/* Tab Contents */}
      {activeTab === "settings" && (
        <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
          <Card>
            <CardHeader>
              <CardTitle>Configuration details</CardTitle>
              <CardDescription>Configure passing scores, time limits, and section associations.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSaveSettings} className="space-y-4">
                {message && (
                  <div className={`p-4 rounded-xl text-sm ${
                    message.type === "success" 
                      ? "bg-emerald-500/10 text-emerald-500" 
                      : "bg-destructive/10 text-destructive"
                  }`}>
                    {message.text}
                  </div>
                )}

                <div className="grid gap-2">
                  <label className="text-sm font-medium">Title</label>
                  <Input 
                    value={title} 
                    onChange={(e) => setTitle(e.target.value)} 
                    placeholder="e.g. Chapter 1 Quiz" 
                    required 
                  />
                </div>

                <div className="grid gap-2">
                  <label className="text-sm font-medium">Description (Optional)</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Brief description or taking guidelines..."
                    className="min-h-24 rounded-xl border border-input bg-background px-4 py-3 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="grid gap-1">
                    <label className="text-sm font-medium">Assessment Type</label>
                    <select
                      value={type}
                      onChange={(e) => setType(e.target.value as TestType)}
                      className="h-11 rounded-xl border border-input bg-background px-4 text-sm"
                    >
                      <option value="QUIZ">Quiz</option>
                      <option value="PRACTICE">Practice Test</option>
                      <option value="EXAM">Exam</option>
                    </select>
                  </div>

                  <div className="grid gap-1">
                    <label className="text-sm font-medium">Link to Section (Optional)</label>
                    <select
                      value={sectionId}
                      onChange={(e) => setSectionId(e.target.value)}
                      className="h-11 rounded-xl border border-input bg-background px-4 text-sm"
                    >
                      <option value="">Standalone / No Section</option>
                      {sections.map((sec) => (
                        <option key={sec.id} value={sec.id}>
                          {sec.orderIndex + 1}. {sec.title}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <div className="grid gap-1">
                    <label className="text-sm font-medium">Passing Score (%)</label>
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      value={passingScore}
                      onChange={(e) => setPassingScore(Number(e.target.value))}
                      required
                    />
                  </div>

                  <div className="grid gap-1">
                    <label className="text-sm font-medium">Time Limit (Minutes)</label>
                    <Input
                      type="number"
                      min="1"
                      placeholder="No limit"
                      value={timeLimitMinutes}
                      onChange={(e) => setTimeLimitMinutes(e.target.value)}
                    />
                  </div>

                  <div className="grid gap-1">
                    <label className="text-sm font-medium">Attempt Limit</label>
                    <Input
                      type="number"
                      min="1"
                      placeholder="Unlimited"
                      value={attemptLimit}
                      onChange={(e) => setAttemptLimit(e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 pt-2">
                  <div className="flex items-center gap-3 p-3 rounded-xl border border-border">
                    <input
                      type="checkbox"
                      id="shuffleQuestions"
                      checked={shuffleQuestions}
                      onChange={(e) => setShuffleQuestions(e.target.checked)}
                      className="h-4 w-4 cursor-pointer rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <label htmlFor="shuffleQuestions" className="text-sm font-medium cursor-pointer flex-1">
                      Shuffle Questions
                      <span className="block text-xs font-normal text-muted-foreground">Randomize question order for each attempt.</span>
                    </label>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-xl border border-border">
                    <input
                      type="checkbox"
                      id="isPublished"
                      checked={isPublished}
                      onChange={(e) => setIsPublished(e.target.checked)}
                      className="h-4 w-4 cursor-pointer rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <label htmlFor="isPublished" className="text-sm font-medium cursor-pointer flex-1">
                      Publish Assessment
                      <span className="block text-xs font-normal text-muted-foreground">Make this assessment visible and active to students.</span>
                    </label>
                  </div>
                </div>

                <Button type="submit" disabled={isSaving} className="mt-4 flex items-center gap-1.5">
                  <Save className="h-4 w-4" />
                  {isSaving ? "Saving changes..." : "Save changes"}
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="bg-muted/10">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-1.5">
                  <Clock className="h-4 w-4 text-primary" />
                  Quick Assessment Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex justify-between py-1 border-b border-border/30">
                  <span className="text-muted-foreground">Total Questions:</span>
                  <span className="font-semibold">{questions.length}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-border/30">
                  <span className="text-muted-foreground">Total Points:</span>
                  <span className="font-semibold">{questions.reduce((acc, q) => acc + q.points, 0)}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-border/30">
                  <span className="text-muted-foreground">Passing Percentage:</span>
                  <span className="font-semibold text-emerald-500">{passingScore}%</span>
                </div>
                <div className="flex justify-between py-1 border-b border-border/30">
                  <span className="text-muted-foreground">Time Limit:</span>
                  <span className="font-semibold">{timeLimitMinutes ? `${timeLimitMinutes} minutes` : "No timer"}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-border/30">
                  <span className="text-muted-foreground">Attempt Limit:</span>
                  <span className="font-semibold">{attemptLimit ? `${attemptLimit} attempts` : "Unlimited"}</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-destructive/30">
              <CardHeader>
                <CardTitle className="text-destructive text-base flex items-center gap-1.5">
                  <ShieldAlert className="h-4 w-4" />
                  Danger Zone
                </CardTitle>
                <CardDescription>Permanently delete this test and all related student submissions.</CardDescription>
              </CardHeader>
              <CardContent>
                <form action={deleteTestAction} className="w-full">
                  <input type="hidden" name="testId" value={test.id} />
                  <Button type="submit" variant="destructive" className="w-full flex items-center justify-center gap-1" onClick={(e) => {
                    if (!confirm("Are you absolutely sure you want to delete this test? All graded student attempts will be deleted!")) {
                      e.preventDefault();
                    }
                  }}>
                    <Trash2 className="h-4 w-4" />
                    Delete Assessment
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {activeTab === "questions" && (
        <Card>
          <CardHeader>
            <CardTitle>Assessment Question Bank</CardTitle>
            <CardDescription>Add, edit, or delete questions and specify their weights and explanations.</CardDescription>
          </CardHeader>
          <CardContent>
            <QuestionBuilder testId={test.id} initialQuestions={questions} />
          </CardContent>
        </Card>
      )}

      {activeTab === "attempts" && (
        <Card>
          <CardHeader>
            <CardTitle>Student Assessment Attempts</CardTitle>
            <CardDescription>Track all completed and ongoing attempts by students in this course.</CardDescription>
          </CardHeader>
          <CardContent>
            {attempts.length === 0 ? (
              <div className="text-center py-12 border border-dashed rounded-2xl bg-muted/10 text-muted-foreground text-sm flex flex-col items-center justify-center">
                <Users className="h-10 w-10 text-muted-foreground/40 mb-2" />
                No student attempts recorded for this assessment yet.
              </div>
            ) : (
              <div className="overflow-x-auto rounded-xl border border-border">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-muted/40 border-b border-border text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                      <th className="p-4">Student</th>
                      <th className="p-4">Attempt #</th>
                      <th className="p-4">Score</th>
                      <th className="p-4">Duration</th>
                      <th className="p-4">Date</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border text-sm">
                    {attempts.map((attempt) => {
                      const isPassing = attempt.scorePercent !== null && attempt.scorePercent >= passingScore;
                      return (
                        <tr key={attempt.id} className="hover:bg-muted/10">
                          <td className="p-4">
                            <div className="font-medium text-foreground">{attempt.user.name ?? "Student"}</div>
                            <div className="text-xs text-muted-foreground">{attempt.user.email}</div>
                          </td>
                          <td className="p-4 font-mono">#{attempt.attemptNumber}</td>
                          <td className="p-4">
                            {attempt.scorePercent !== null ? (
                              <div className="flex items-center gap-1.5">
                                <span className={`font-semibold ${isPassing ? "text-emerald-500" : "text-destructive"}`}>
                                  {attempt.scorePercent}%
                                </span>
                                {isPassing ? (
                                  <Badge className="bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 border-emerald-500/25 text-xs py-0 h-5">Pass</Badge>
                                ) : (
                                  <Badge variant="destructive" className="bg-destructive/10 text-destructive border-destructive/25 text-xs py-0 h-5">Fail</Badge>
                                )}
                              </div>
                            ) : (
                              <span className="text-muted-foreground">--</span>
                            )}
                          </td>
                          <td className="p-4 font-mono">{formatDuration(attempt.timeSpentSeconds)}</td>
                          <td className="p-4 text-xs text-muted-foreground">
                            {attempt.submittedAt 
                              ? new Date(attempt.submittedAt).toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit"
                                }) 
                              : "Started: " + new Date(attempt.startedAt).toLocaleDateString()}
                          </td>
                          <td className="p-4">
                            {attempt.status === AttemptStatus.GRADED ? (
                              <Badge className="bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 border-emerald-500/25">Graded</Badge>
                            ) : attempt.status === AttemptStatus.IN_PROGRESS ? (
                              <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/25">Taking</Badge>
                            ) : (
                              <Badge variant="outline">{attempt.status.toLowerCase()}</Badge>
                            )}
                          </td>
                          <td className="p-4 text-right">
                            {attempt.status === AttemptStatus.GRADED ? (
                              <Button asChild size="sm" variant="outline">
                                <Link href={`/courses/${courseId}/tests/${test.id}?reviewAttemptId=${attempt.id}`} target="_blank">
                                  Review Attempt
                                </Link>
                              </Button>
                            ) : (
                              <span className="text-xs text-muted-foreground">Active Taking</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
