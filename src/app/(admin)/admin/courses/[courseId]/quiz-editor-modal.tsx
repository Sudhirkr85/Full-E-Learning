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
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  // Options for MCQ
  const [mcqOptions, setMcqOptions] = useState<Array<{ id?: string; label: string; isCorrect: boolean }>>([
    { label: "", isCorrect: true },
    { label: "", isCorrect: false }
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
      { label: "", isCorrect: true },
      { label: "", isCorrect: false }
    ]);
    setFitbAnswers([""]);
    setIsEditorOpen(true);
  };

  const handleCloseEditor = () => {
    setEditingQuestionId(null);
    setQuestionPrompt("");
    setQuestionKind("SINGLE_CHOICE");
    setQuestionPoints(1);
    setQuestionExplanation("");
    setIsCaseSensitive(false);
    setIsEditorOpen(false);
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
    setIsEditorOpen(true);
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
        handleCloseEditor();
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
    <div className="fixed inset-0 z-50 bg-[#06060a]/95 backdrop-blur-xl flex items-start justify-center p-0 md:p-6 overflow-y-auto">
      <div className="bg-[#0f0f18] border border-white/10 rounded-none md:rounded-2xl w-full max-w-7xl h-full md:h-[94vh] flex flex-col shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
        
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
            <div className="space-y-6">
              {/* Question list & bank header */}
              <div className="flex items-center justify-between pb-2 border-b border-white/5">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Questions Bank</h3>
                  <p className="text-[10px] text-slate-500 mt-0.5">Manage and organize the assessment questions.</p>
                </div>
                <Button onClick={handleStartAddQuestion} className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs h-10 px-4 font-bold uppercase tracking-wider shadow-lg shadow-indigo-650/15">
                  <Plus className="mr-1.5 h-4 w-4" /> Add Question
                </Button>
              </div>

              {test?.questions && test.questions.length > 0 ? (
                <div className="space-y-3">
                  {test.questions.map((q: any, index: number) => (
                    <div key={q.id} className="p-5 rounded-2xl border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] hover:border-white/10 transition-all flex items-start justify-between gap-6">
                      <div className="space-y-2 flex-1">
                        <div className="flex flex-wrap items-center gap-2 text-[9px] uppercase tracking-wider font-extrabold text-slate-400">
                          <Badge className="bg-indigo-500/10 text-indigo-300 border-indigo-500/20 text-[8px] py-0 h-4.5 px-2.5 rounded-full font-black">Q{index + 1}</Badge>
                          <span className={`px-2 py-0.5 rounded text-[8px] border ${q.kind === "SHORT_ANSWER" ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/20" : "bg-indigo-500/10 text-indigo-300 border-indigo-500/20"}`}>
                            {q.kind === "SHORT_ANSWER" ? "Fill In The Blank" : "Multiple Choice"}
                          </span>
                          <span className="text-slate-600">•</span>
                          <span className="text-indigo-400/80">{q.points} {q.points === 1 ? "point" : "points"}</span>
                        </div>
                        <h4 className="text-sm font-bold text-white leading-relaxed">{q.prompt}</h4>
                        {q.explanation && (
                          <div className="flex gap-1.5 items-start bg-white/[0.02] border border-white/5 rounded-lg p-2.5 max-w-2xl mt-2">
                            <FileText className="h-3.5 w-3.5 text-indigo-400 shrink-0 mt-0.5" />
                            <p className="text-[10px] text-slate-400 leading-relaxed"><span className="font-bold text-slate-300">Explanation:</span> {q.explanation}</p>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0 bg-white/5 p-1 rounded-xl border border-white/5">
                        <Button onClick={() => handleReorderQuestion(q.id, "up")} disabled={index === 0} variant="ghost" className="h-8 w-8 rounded-lg p-0 text-slate-400 hover:text-white hover:bg-white/5 disabled:opacity-30">
                          <ArrowUp className="h-4 w-4" />
                        </Button>
                        <Button onClick={() => handleReorderQuestion(q.id, "down")} disabled={index === test.questions.length - 1} variant="ghost" className="h-8 w-8 rounded-lg p-0 text-slate-400 hover:text-white hover:bg-white/5 disabled:opacity-30">
                          <ArrowDown className="h-4 w-4" />
                        </Button>
                        <div className="w-px h-5 bg-white/10 mx-1" />
                        <Button onClick={() => handleStartEditQuestion(q)} variant="outline" className="h-8 text-[10px] font-bold uppercase tracking-wider rounded-lg px-3 border-indigo-500/20 text-indigo-400 bg-indigo-500/5 hover:bg-indigo-600 hover:text-white">Edit</Button>
                        <Button onClick={() => handleDeleteQuestion(q.id)} variant="ghost" className="h-8 w-8 rounded-lg text-rose-400 hover:text-rose-350 hover:bg-rose-500/10 p-0">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-16 border border-dashed border-white/10 rounded-2xl text-center space-y-4 max-w-xl mx-auto my-12 bg-white/[0.01]">
                  <div className="h-16 w-16 mx-auto rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                    <HelpCircle className="h-8 w-8" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-white uppercase tracking-wider">Your Quiz is Empty</h4>
                    <p className="text-[11px] text-slate-400 max-w-sm mx-auto leading-relaxed">Add multiple choice or fill-in-the-blank questions to build an engaging assessment for your students.</p>
                  </div>
                  <Button onClick={handleStartAddQuestion} className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs h-10 px-5 font-bold uppercase tracking-wider mt-2">
                    <Plus className="mr-1.5 h-4 w-4" /> Add First Question
                  </Button>
                </div>
              )}

              {/* Centered Glass Question Editor Sub-Modal Overlay */}
              {isEditorOpen && (
                <div className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
                  <div className="bg-[#0b0c16] border border-white/10 rounded-2xl w-full max-w-lg shadow-2xl relative flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95 duration-200">
                    
                    {/* Sub-Modal Header */}
                    <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-white">
                        <Sparkles className="h-4.5 w-4.5 text-indigo-400" />
                        <h3 className="text-sm font-black uppercase tracking-wider">
                          {editingQuestionId ? "Modify Question" : "Create Question"}
                        </h3>
                      </div>
                      <button 
                        onClick={() => setIsEditorOpen(false)} 
                        className="h-7 w-7 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center text-slate-400 hover:text-white transition"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    {/* Sub-Modal Scrollable content */}
                    <div className="p-5 space-y-4 overflow-y-auto flex-1">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Question Prompt</label>
                        <textarea 
                          value={questionPrompt} 
                          onChange={(e) => setQuestionPrompt(e.target.value)} 
                          placeholder="Enter assessment question prompt..." 
                          className="w-full min-h-20 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white outline-none focus:ring-1 focus:ring-indigo-500" 
                          required 
                        />
                      </div>

                      <div className="grid gap-3 grid-cols-2">
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Question Type</label>
                          <select 
                            value={questionKind} 
                            onChange={(e) => setQuestionKind(e.target.value as any)} 
                            className="h-10 w-full rounded-xl border border-white/10 bg-[#06070d] px-3 text-xs text-white"
                          >
                            <option value="SINGLE_CHOICE">Multiple Choice (MCQ)</option>
                            <option value="SHORT_ANSWER">Fill In The Blank</option>
                          </select>
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Question Marks</label>
                          <Input 
                            type="number" 
                            min="1" 
                            value={questionPoints} 
                            onChange={(e) => setQuestionPoints(Number(e.target.value))} 
                            className="bg-white/5 border-white/10 text-white h-10 text-xs rounded-xl" 
                          />
                        </div>
                      </div>

                      {/* MCQ Option Compilation */}
                      {questionKind === "SINGLE_CHOICE" && (
                        <div className="space-y-3 pt-2">
                          <div className="flex items-center justify-between">
                            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between w-full">
                              <span>Answer Options</span>
                              <span className="text-[9px] text-slate-500 italic font-mono">Select the correct choice</span>
                            </label>
                            <Button 
                              type="button" 
                              onClick={() => setMcqOptions([...mcqOptions, { label: "", isCorrect: false }])} 
                              variant="ghost" 
                              className="h-6 text-[9px] uppercase font-bold text-indigo-400 p-0 hover:bg-transparent"
                            >
                              + Add Option
                            </Button>
                          </div>
                          <div className="space-y-2">
                            {mcqOptions.map((opt, idx) => (
                              <div key={idx} className="flex gap-2.5 items-center">
                                <button 
                                  type="button" 
                                  onClick={() => {
                                    setMcqOptions(mcqOptions.map((o, oIdx) => ({
                                      ...o,
                                      isCorrect: oIdx === idx
                                    })));
                                  }}
                                  className={`h-6 w-6 rounded-full border border-slate-500 shrink-0 flex items-center justify-center transition-all ${
                                    opt.isCorrect 
                                      ? "bg-indigo-600 border-indigo-500 shadow-md shadow-indigo-500/20 text-white" 
                                      : "bg-[#0c0d18] hover:border-indigo-400 hover:bg-indigo-950/20 text-transparent"
                                  }`}
                                >
                                  {opt.isCorrect && <Check className="h-3.5 w-3.5 text-white" />}
                                </button>
                                <Input 
                                  value={opt.label} 
                                  onChange={(e) => {
                                    const newOpts = [...mcqOptions];
                                    newOpts[idx].label = e.target.value;
                                    setMcqOptions(newOpts);
                                  }} 
                                  className="bg-white/5 border border-white/10 text-white text-xs h-9.5 rounded-xl flex-1" 
                                  placeholder={`Option ${String.fromCharCode(65 + idx)}`} 
                                  required 
                                />
                                {mcqOptions.length > 2 && (
                                  <Button 
                                    type="button" 
                                    onClick={() => {
                                      const wasCorrect = opt.isCorrect;
                                      const filtered = mcqOptions.filter((_, oIdx) => oIdx !== idx);
                                      if (wasCorrect && filtered.length > 0) {
                                        filtered[0].isCorrect = true;
                                      }
                                      setMcqOptions(filtered);
                                    }} 
                                    variant="ghost" 
                                    className="h-9 w-9 text-rose-400 hover:text-rose-350 p-0 hover:bg-rose-500/10 rounded-xl"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Fill In The Blank Option Compilation */}
                      {questionKind === "SHORT_ANSWER" && (
                        <div className="space-y-3 pt-2">
                          <div className="flex items-center justify-between">
                            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Correct & Accepted Answers</label>
                            <Button 
                              type="button" 
                              onClick={() => setFitbAnswers([...fitbAnswers, ""])} 
                              variant="ghost" 
                              className="h-6 text-[9px] uppercase font-bold text-indigo-400 p-0 hover:bg-transparent"
                            >
                              + Add Alt
                            </Button>
                          </div>
                          <div className="space-y-2">
                            {fitbAnswers.map((ans, idx) => (
                              <div key={idx} className="flex gap-2 items-center">
                                <Input 
                                  value={ans} 
                                  onChange={(e) => {
                                    const newAns = [...fitbAnswers];
                                    newAns[idx] = e.target.value;
                                    setFitbAnswers(newAns);
                                  }} 
                                  className="bg-white/5 border border-white/10 text-white text-xs h-9.5 rounded-xl flex-1" 
                                  placeholder={idx === 0 ? "Primary Correct Answer" : "Alternative Answer"} 
                                  required 
                                />
                                {fitbAnswers.length > 1 && (
                                  <Button 
                                    type="button" 
                                    onClick={() => setFitbAnswers(fitbAnswers.filter((_, aIdx) => aIdx !== idx))} 
                                    variant="ghost" 
                                    className="h-9 w-9 text-rose-400 hover:text-rose-350 p-0 hover:bg-rose-500/10 rounded-xl"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                )}
                              </div>
                            ))}
                          </div>

                          <div className="flex items-center justify-between pt-2">
                            <div>
                              <h4 className="text-[10px] font-bold uppercase text-white leading-none">Case Sensitive Toggle</h4>
                              <p className="text-[8px] text-slate-500 mt-1">Requires exact upper/lowercase text match.</p>
                            </div>
                            <button type="button" onClick={() => setIsCaseSensitive(!isCaseSensitive)} className="text-indigo-400">
                              {isCaseSensitive ? <ToggleRight className="h-7 w-7" /> : <ToggleLeft className="h-7 w-7 text-slate-500" />}
                            </button>
                          </div>
                        </div>
                      )}

                      <div className="space-y-1.5 pt-2 border-t border-white/5">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Explanation (Optional)</label>
                        <textarea 
                          value={questionExplanation} 
                          onChange={(e) => setQuestionExplanation(e.target.value)} 
                          placeholder="Provide context or explanation for why the answer is correct..." 
                          className="w-full min-h-16 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white outline-none focus:ring-1 focus:ring-indigo-500" 
                        />
                      </div>
                    </div>

                    {/* Sub-Modal Actions Footer */}
                    <div className="px-5 py-4 border-t border-white/10 flex gap-2 justify-end bg-white/[0.01]">
                      <Button 
                        type="button" 
                        onClick={() => setIsEditorOpen(false)} 
                        className="rounded-xl text-xs h-10 px-4 bg-white/5 border border-white/5 text-slate-300 hover:bg-white/10 hover:text-white transition-all"
                      >
                        Cancel
                      </Button>
                      <Button 
                        onClick={handleSaveQuestion} 
                        disabled={isPending} 
                        className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs h-10 px-5 font-bold uppercase tracking-wider shadow-lg shadow-indigo-600/15"
                      >
                        {isPending ? <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" /> : <Save className="mr-1.5 h-4 w-4" />}
                        Save Question
                      </Button>
                    </div>
                  </div>
                </div>
              )}
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
