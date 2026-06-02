"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  X, 
  Plus, 
  Trash2, 
  Save, 
  HelpCircle, 
  FileText, 
  Settings, 
  Sparkles, 
  Loader2,
  CheckCircle,
  Eye,
  Check,
  ToggleLeft,
  ToggleRight,
  ArrowUp,
  ArrowDown
} from "lucide-react";
import { 
  updateTestSettingsAction, 
  upsertQuestionAction, 
  deleteQuestionAction 
} from "@/lib/tests/actions";
import { CustomPopup } from "@/components/courses/custom-popup";

type QuizEditorModalProps = {
  courseId: string;
  lesson: any;
  test: any;
  onClose: () => void;
  onRefresh: () => void;
};

export function QuizEditorModal({
  courseId,
  lesson,
  test,
  onClose,
  onRefresh
}: QuizEditorModalProps) {
  const [activeSubTab, setActiveSubTab] = useState<"questions" | "settings">("questions");
  const [isPending, startTransition] = useTransition();

  // Custom popup states
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

  const showAlert = (message: string, isError = true, title = "Quiz Builder Notification") => {
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
      confirmText: "Confirm",
      onConfirm: () => {
        onConfirm();
        setPopup(prev => ({ ...prev, isOpen: false }));
      },
      onCancel: () => setPopup(prev => ({ ...prev, isOpen: false }))
    });
  };

  // Test settings state
  const [title, setTitle] = useState(test?.title || lesson.title);
  const [description, setDescription] = useState(test?.description || "");
  const [passingScore, setPassingScore] = useState(test?.passingScore ?? 70);
  const [timeLimitMinutes, setTimeLimitMinutes] = useState(test?.timeLimitMinutes ?? "");
  const [attemptLimit, setAttemptLimit] = useState(test?.attemptLimit ?? "");
  const [shuffleQuestions, setShuffleQuestions] = useState(test?.shuffleQuestions ?? false);
  const [showResults, setShowResults] = useState(
    test?.metadata && typeof test.metadata === "object"
      ? (test.metadata as any).showResults !== false
      : true
  );
  const [isPublished, setIsPublished] = useState(test?.isPublished ?? true);

  // Active question editing states
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null);
  const [questionPrompt, setQuestionPrompt] = useState("");
  const [questionKind, setQuestionKind] = useState<"SINGLE_CHOICE" | "SHORT_ANSWER">("SINGLE_CHOICE");
  const [questionPoints, setQuestionPoints] = useState(1);
  const [questionExplanation, setQuestionExplanation] = useState("");
  const [isCaseSensitive, setIsCaseSensitive] = useState(false);

  // Options for MCQ
  const [mcqOptions, setMcqOptions] = useState<Array<{ id?: string; label: string; isCorrect: boolean }>>([
    { label: "Option 1", isCorrect: true },
    { label: "Option 2", isCorrect: false },
    { label: "Option 3", isCorrect: false },
    { label: "Option 4", isCorrect: false }
  ]);

  // Options for Fill in the Blank (alternative answers)
  const [fitbAnswers, setFitbAnswers] = useState<string[]>([""]);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!test?.id) return;

    startTransition(async () => {
      try {
        const payload = {
          title,
          description,
          type: "QUIZ",
          passingScore: Number(passingScore),
          timeLimitMinutes: timeLimitMinutes ? Number(timeLimitMinutes) : null,
          attemptLimit: attemptLimit ? Number(attemptLimit) : null,
          shuffleQuestions,
          isPublished,
          metadata: {
            showResults
          }
        };
        await updateTestSettingsAction(test.id, payload);
        onRefresh();
        showAlert("Settings saved successfully!", false, "Success");
      } catch (err: any) {
        showAlert(err.message || "Failed to save settings.");
      }
    });
  };

  const handleStartAddQuestion = () => {
    setEditingQuestionId(null);
    setQuestionPrompt("");
    setQuestionKind("SINGLE_CHOICE");
    setQuestionPoints(1);
    setQuestionExplanation("");
    setIsCaseSensitive(false);
    setMcqOptions([
      { label: "Option A", isCorrect: true },
      { label: "Option B", isCorrect: false },
      { label: "Option C", isCorrect: false },
      { label: "Option D", isCorrect: false }
    ]);
    setFitbAnswers([""]);
  };

  const handleStartEditQuestion = (q: any) => {
    setEditingQuestionId(q.id);
    setQuestionPrompt(q.prompt);
    setQuestionKind(q.kind === "SHORT_ANSWER" ? "SHORT_ANSWER" : "SINGLE_CHOICE");
    setQuestionPoints(q.points);
    setQuestionExplanation(q.explanation || "");
    setIsCaseSensitive(q.metadata?.caseSensitive === true);
    
    if (q.kind === "SHORT_ANSWER") {
      setFitbAnswers(q.options.map((o: any) => o.label));
    } else {
      setMcqOptions(q.options.map((o: any) => ({
        id: o.id,
        label: o.label,
        isCorrect: o.isCorrect
      })));
    }
  };

  const handleSaveQuestion = async () => {
    if (!test?.id) return;
    if (!questionPrompt.trim()) {
      showAlert("Question prompt is required.");
      return;
    }

    let finalOptions: any[] = [];
    if (questionKind === "SINGLE_CHOICE") {
      if (mcqOptions.length < 2) {
        showAlert("At least 2 options are required for MCQ.");
        return;
      }
      const hasCorrect = mcqOptions.some(o => o.isCorrect);
      if (!hasCorrect) {
        showAlert("Please select at least one correct option.");
        return;
      }
      finalOptions = mcqOptions.map((opt, idx) => ({
        id: opt.id,
        label: opt.label.trim(),
        isCorrect: opt.isCorrect,
        orderIndex: idx
      }));
    } else {
      // Fill In The Blank
      const validAnswers = fitbAnswers.filter(ans => ans.trim());
      if (validAnswers.length === 0) {
        showAlert("Please provide at least one correct answer.");
        return;
      }
      finalOptions = validAnswers.map((ans, idx) => ({
        label: ans.trim(),
        value: ans.trim(),
        isCorrect: true,
        orderIndex: idx
      }));
    }

    startTransition(async () => {
      try {
        const orderIndex = editingQuestionId 
          ? (test.questions.find((q: any) => q.id === editingQuestionId)?.orderIndex ?? test.questions.length)
          : test.questions.length;

        const payload = {
          prompt: questionPrompt.trim(),
          explanation: questionExplanation.trim() || undefined,
          kind: questionKind === "SHORT_ANSWER" ? "SHORT_ANSWER" as any : "SINGLE_CHOICE" as any,
          points: Number(questionPoints),
          orderIndex,
          options: finalOptions,
          metadata: {
            caseSensitive: questionKind === "SHORT_ANSWER" ? isCaseSensitive : undefined
          }
        };

        await upsertQuestionAction(test.id, editingQuestionId, payload);
        handleStartAddQuestion();
        onRefresh();
      } catch (err: any) {
        showAlert(err.message || "Failed to save question.");
      }
    });
  };

  const handleDeleteQuestion = async (qId: string) => {
    showConfirm(
      "Are you sure you want to delete this question?",
      async () => {
        startTransition(async () => {
          try {
            await deleteQuestionAction(test.id, qId);
            onRefresh();
          } catch (err: any) {
            showAlert(err.message || "Failed to delete question.");
          }
        });
      }
    );
  };

  const handleReorderQuestion = async (qId: string, direction: "up" | "down") => {
    const questionsList = [...(test?.questions || [])];
    const currentIndex = questionsList.findIndex((q: any) => q.id === qId);
    if (currentIndex === -1) return;

    const targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex < 0 || targetIndex >= questionsList.length) return;

    startTransition(async () => {
      try {
        const currentQ = questionsList[currentIndex];
        const targetQ = questionsList[targetIndex];

        // Swap orderIndexes
        const tempOrder = currentQ.orderIndex;
        
        await upsertQuestionAction(test.id, currentQ.id, {
          prompt: currentQ.prompt,
          explanation: currentQ.explanation,
          kind: currentQ.kind,
          points: currentQ.points,
          orderIndex: targetQ.orderIndex,
          options: currentQ.options
        });

        await upsertQuestionAction(test.id, targetQ.id, {
          prompt: targetQ.prompt,
          explanation: targetQ.explanation,
          kind: targetQ.kind,
          points: targetQ.points,
          orderIndex: tempOrder,
          options: targetQ.options
        });

        onRefresh();
      } catch (err: any) {
        showAlert("Failed to swap order indexes.");
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#06060a]/90 backdrop-blur-xl flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#0f0f18] border border-white/10 rounded-2xl w-full max-w-5xl h-[90vh] flex flex-col shadow-2xl relative">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest font-mono">Quiz Assessment Designer</span>
            <h2 className="text-lg font-bold text-white leading-none">{lesson.title}</h2>
          </div>
          <button onClick={onClose} className="h-8 w-8 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center text-slate-400 hover:text-white transition">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Modal Tabs */}
        <div className="px-6 border-b border-white/5 flex gap-4 bg-white/[0.01]">
          <button 
            onClick={() => setActiveSubTab("questions")}
            className={`py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition ${
              activeSubTab === "questions" 
                ? "border-indigo-500 text-white font-black" 
                : "border-transparent text-slate-400 hover:text-white"
            }`}
          >
            Manage Questions ({test?.questions?.length || 0})
          </button>
          <button 
            onClick={() => setActiveSubTab("settings")}
            className={`py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition ${
              activeSubTab === "settings" 
                ? "border-indigo-500 text-white font-black" 
                : "border-transparent text-slate-400 hover:text-white"
            }`}
          >
            Quiz Settings
          </button>
        </div>

        {/* Main Editor Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeSubTab === "settings" && (
            <form onSubmit={handleSaveSettings} className="space-y-6 max-w-2xl">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-300">Quiz Title</label>
                  <Input value={title} onChange={(e) => setTitle(e.target.value)} className="bg-white/5 border-white/10 text-white" required />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-300">Pass Percentage (%)</label>
                  <Input type="number" min="1" max="100" value={passingScore} onChange={(e) => setPassingScore(Number(e.target.value))} className="bg-white/5 border-white/10 text-white" required />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300">Description</label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Quiz instructions..." className="w-full min-h-24 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-xs text-white outline-none focus:ring-1 focus:ring-indigo-500" />
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-300">Time Limit (mins)</label>
                  <Input type="number" min="1" placeholder="Unlimited" value={timeLimitMinutes} onChange={(e) => setTimeLimitMinutes(e.target.value)} className="bg-white/5 border-white/10 text-white" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-300">Max Attempts</label>
                  <Input type="number" min="1" placeholder="Unlimited" value={attemptLimit} onChange={(e) => setAttemptLimit(e.target.value)} className="bg-white/5 border-white/10 text-white" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-300">Status</label>
                  <select value={isPublished ? "true" : "false"} onChange={(e) => setIsPublished(e.target.value === "true")} className="h-10 w-full rounded-xl border border-white/10 bg-[#0a0f24] px-4 text-xs text-white">
                    <option value="true">Published</option>
                    <option value="false">Draft</option>
                  </select>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-white/5">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold uppercase text-white">Shuffle Questions</h4>
                    <p className="text-[10px] text-slate-400">Randomize order of questions for students on each attempt.</p>
                  </div>
                  <button type="button" onClick={() => setShuffleQuestions(!shuffleQuestions)} className="text-indigo-400">
                    {shuffleQuestions ? <ToggleRight className="h-8 w-8" /> : <ToggleLeft className="h-8 w-8 text-slate-500" />}
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold uppercase text-white">Show Results Post-Submission</h4>
                    <p className="text-[10px] text-slate-400">Show detailed score, correct options, and explanations immediately.</p>
                  </div>
                  <button type="button" onClick={() => setShowResults(!showResults)} className="text-indigo-400">
                    {showResults ? <ToggleRight className="h-8 w-8" /> : <ToggleLeft className="h-8 w-8 text-slate-500" />}
                  </button>
                </div>
              </div>

              <Button type="submit" disabled={isPending} className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs h-11 px-6 font-bold uppercase tracking-wider">
                {isPending ? <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" /> : <Save className="mr-1.5 h-4 w-4" />}
                Save Quiz Settings
              </Button>
            </form>
          )}

          {activeSubTab === "questions" && (
            <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
              
              {/* Left Column: Questions Bank */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Questions Bank</h3>
                  <Button onClick={handleStartAddQuestion} variant="outline" className="border-indigo-500/20 text-indigo-300 bg-indigo-500/5 hover:bg-indigo-600 hover:text-white rounded-xl text-xs h-9 px-3">
                    <Plus className="mr-1 h-4 w-4" /> Add Question
                  </Button>
                </div>

                {test?.questions && test.questions.length > 0 ? (
                  <div className="space-y-3">
                    {test.questions.map((q: any, index: number) => (
                      <div key={q.id} className="p-4 rounded-xl border border-white/5 bg-white/[0.01] hover:bg-white/[0.02] flex items-start justify-between gap-4">
                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-1.5 text-[9px] uppercase tracking-wider font-extrabold text-slate-400">
                            <Badge className="bg-indigo-500/10 text-indigo-300 border-indigo-500/20 text-[8px] py-0 h-4">Q{index + 1}</Badge>
                            <span>{q.kind === "SHORT_ANSWER" ? "Fill In The Blank" : "Multiple Choice"}</span>
                            <span>•</span>
                            <span>{q.points} {q.points === 1 ? "point" : "points"}</span>
                          </div>
                          <h4 className="text-xs font-bold text-white pt-1">{q.prompt}</h4>
                          <p className="text-[10px] text-slate-400 italic mt-0.5 line-clamp-1">{q.explanation || "No explanation set."}</p>
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          <Button onClick={() => handleReorderQuestion(q.id, "up")} disabled={index === 0} variant="ghost" className="h-8 w-8 rounded p-0 text-slate-400">
                            <ArrowUp className="h-4 w-4" />
                          </Button>
                          <Button onClick={() => handleReorderQuestion(q.id, "down")} disabled={index === test.questions.length - 1} variant="ghost" className="h-8 w-8 rounded p-0 text-slate-400">
                            <ArrowDown className="h-4 w-4" />
                          </Button>
                          <Button onClick={() => handleStartEditQuestion(q)} variant="outline" className="h-8 text-[10px] font-bold uppercase tracking-wider rounded px-2">Edit</Button>
                          <Button onClick={() => handleDeleteQuestion(q.id)} variant="ghost" className="h-8 w-8 rounded text-rose-400 hover:text-rose-300 p-0">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-12 border border-dashed border-white/10 rounded-2xl text-center text-slate-500 text-xs italic">
                    No questions have been added to this quiz yet. Add your first assessment question on the right!
                  </div>
                )}
              </div>

              {/* Right Column: Question Creator / Editor */}
              <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-5 space-y-4 h-fit">
                <h3 className="text-xs font-black uppercase text-white tracking-widest flex items-center gap-1">
                  <Sparkles className="h-4 w-4 text-indigo-400" />
                  {editingQuestionId ? "Modify Question" : "Create Question"}
                </h3>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Question Prompt</label>
                    <textarea value={questionPrompt} onChange={(e) => setQuestionPrompt(e.target.value)} placeholder="Enter assessment question prompt..." className="w-full min-h-20 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white outline-none focus:ring-1 focus:ring-indigo-500" required />
                  </div>

                  <div className="grid gap-3 grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Question Type</label>
                      <select value={questionKind} onChange={(e) => setQuestionKind(e.target.value as any)} className="h-10 w-full rounded-xl border border-white/10 bg-[#0a0f24] px-3 text-xs text-white">
                        <option value="SINGLE_CHOICE">Multiple Choice (MCQ)</option>
                        <option value="SHORT_ANSWER">Fill In The Blank</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Question Marks</label>
                      <Input type="number" min="1" value={questionPoints} onChange={(e) => setQuestionPoints(Number(e.target.value))} className="bg-white/5 border-white/10 text-white h-10 text-xs" />
                    </div>
                  </div>

                  {/* MCQ OPTION COMPILATIONS */}
                  {questionKind === "SINGLE_CHOICE" && (
                    <div className="space-y-3 pt-2">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
                        <span>Answer Options</span>
                        <span className="text-[9px] text-slate-500 italic">Select the correct radio</span>
                      </label>
                      <div className="space-y-2">
                        {mcqOptions.map((opt, idx) => (
                          <div key={idx} className="flex gap-2 items-center">
                            <button 
                              type="button" 
                              onClick={() => {
                                setMcqOptions(mcqOptions.map((o, oIdx) => ({
                                  ...o,
                                  isCorrect: oIdx === idx
                                })));
                              }}
                              className={`h-5 w-5 rounded-full border shrink-0 flex items-center justify-center ${
                                opt.isCorrect ? "bg-indigo-600 border-indigo-500" : "bg-transparent border-white/20"
                              }`}
                            >
                              {opt.isCorrect && <Check className="h-3 w-3 text-white" />}
                            </button>
                            <Input value={opt.label} onChange={(e) => {
                              const newOpts = [...mcqOptions];
                              newOpts[idx].label = e.target.value;
                              setMcqOptions(newOpts);
                            }} className="bg-white/5 border-white/10 text-white text-xs h-9" placeholder={`Option ${idx + 1}`} required />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* FILL IN THE BLANK OPTIONS */}
                  {questionKind === "SHORT_ANSWER" && (
                    <div className="space-y-3 pt-2">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
                        <span>Correct & Accepted Answers</span>
                        <Button type="button" onClick={() => setFitbAnswers([...fitbAnswers, ""])} variant="ghost" className="h-6 text-[9px] uppercase font-bold text-indigo-400 p-0 hover:bg-transparent">
                          + Add Alt
                        </Button>
                      </label>
                      <div className="space-y-2">
                        {fitbAnswers.map((ans, idx) => (
                          <div key={idx} className="flex gap-2 items-center">
                            <Input value={ans} onChange={(e) => {
                              const newAns = [...fitbAnswers];
                              newAns[idx] = e.target.value;
                              setFitbAnswers(newAns);
                            }} className="bg-white/5 border-white/10 text-white text-xs h-9" placeholder={idx === 0 ? "Primary Correct Answer" : "Alternative Answer"} required />
                            {fitbAnswers.length > 1 && (
                              <Button type="button" onClick={() => setFitbAnswers(fitbAnswers.filter((_, aIdx) => aIdx !== idx))} variant="ghost" className="h-9 w-9 text-rose-400 hover:text-rose-300 p-0">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        ))}
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        <div>
                          <h4 className="text-[10px] font-bold uppercase text-white leading-none">Case Sensitive Toggle</h4>
                          <p className="text-[8px] text-slate-400 mt-1">Requires exact upper/lowercase text match.</p>
                        </div>
                        <button type="button" onClick={() => setIsCaseSensitive(!isCaseSensitive)} className="text-indigo-400">
                          {isCaseSensitive ? <ToggleRight className="h-7 w-7" /> : <ToggleLeft className="h-7 w-7 text-slate-500" />}
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="space-y-2 pt-2 border-t border-white/5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Explanation (Optional)</label>
                    <textarea value={questionExplanation} onChange={(e) => setQuestionExplanation(e.target.value)} placeholder="Provide context or explanation for why the answer is correct..." className="w-full min-h-16 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white outline-none focus:ring-1 focus:ring-indigo-500" />
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button onClick={handleSaveQuestion} disabled={isPending} className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs h-10 w-full font-bold uppercase tracking-wider">
                      {isPending ? <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" /> : <Save className="mr-1.5 h-4 w-4" />}
                      Save Question
                    </Button>
                    {editingQuestionId && (
                      <Button onClick={handleStartAddQuestion} variant="ghost" className="rounded-xl text-xs h-10 px-4 text-slate-400">
                        Cancel
                      </Button>
                    )}
                  </div>
                </div>
              </div>

            </div>
          )}
        </div>
      </div>

      <CustomPopup
        isOpen={popup.isOpen}
        title={popup.title}
        message={popup.message}
        type={popup.type}
        confirmText={popup.confirmText}
        isError={popup.isError}
        onConfirm={popup.onConfirm}
        onCancel={popup.onCancel}
      />
    </div>
  );
}
