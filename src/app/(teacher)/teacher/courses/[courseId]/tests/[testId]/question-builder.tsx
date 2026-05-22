"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { upsertQuestionAction, deleteQuestionAction } from "@/lib/tests/actions";
import { QuestionType } from "@prisma/client";
import { Plus, Trash2, Edit2, Check, X, HelpCircle, Save } from "lucide-react";

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

type QuestionBuilderProps = {
  testId: string;
  initialQuestions: QuestionData[];
};

export default function QuestionBuilder({ testId, initialQuestions }: QuestionBuilderProps) {
  const [questions, setQuestions] = useState<QuestionData[]>(initialQuestions);
  const [editingQuestion, setEditingQuestion] = useState<Partial<QuestionData> | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize new question drafting state
  const handleAddNewQuestion = () => {
    setError(null);
    setEditingQuestion({
      prompt: "",
      explanation: "",
      kind: QuestionType.SINGLE_CHOICE,
      points: 1,
      orderIndex: questions.length,
      options: [
        { label: "Option A", isCorrect: true, orderIndex: 0 },
        { label: "Option B", isCorrect: false, orderIndex: 1 },
      ],
    });
  };

  // Select an existing question for editing
  const handleEditQuestion = (question: QuestionData) => {
    setError(null);
    setEditingQuestion({
      ...question,
      options: question.options.map((opt) => ({ ...opt })), // deep clone options
    });
  };

  // Handle Question core updates
  const handleFieldChange = (field: keyof QuestionData, value: any) => {
    if (!editingQuestion) return;

    const updated = { ...editingQuestion, [field]: value };

    // Reset options automatically if true/false kind is selected
    if (field === "kind" && value === QuestionType.TRUE_FALSE) {
      updated.options = [
        { label: "True", isCorrect: true, orderIndex: 0 },
        { label: "False", isCorrect: false, orderIndex: 1 },
      ];
    } else if (field === "kind" && (value === QuestionType.SINGLE_CHOICE || value === QuestionType.MULTIPLE_CHOICE) && (editingQuestion.kind === QuestionType.TRUE_FALSE || editingQuestion.kind === QuestionType.SHORT_ANSWER)) {
      updated.options = [
        { label: "Option A", isCorrect: true, orderIndex: 0 },
        { label: "Option B", isCorrect: false, orderIndex: 1 },
      ];
    } else if (field === "kind" && value === QuestionType.SHORT_ANSWER) {
      updated.options = [
        { label: "Enter correct answer text", isCorrect: true, orderIndex: 0 },
      ];
    }

    setEditingQuestion(updated);
  };

  // Option level updates
  const handleOptionChange = (index: number, field: keyof OptionData, value: any) => {
    if (!editingQuestion || !editingQuestion.options) return;

    const opts = [...editingQuestion.options];
    const opt = { ...opts[index]!, [field]: value };

    if (field === "isCorrect" && value === true) {
      // If single choice or true/false, only one can be correct
      if (editingQuestion.kind === QuestionType.SINGLE_CHOICE || editingQuestion.kind === QuestionType.TRUE_FALSE) {
        opts.forEach((o, i) => {
          opts[i] = { ...o, isCorrect: i === index };
        });
      } else {
        opts[index] = opt;
      }
    } else {
      opts[index] = opt;
    }

    setEditingQuestion({ ...editingQuestion, options: opts });
  };

  // Add a new blank option option
  const handleAddOption = () => {
    if (!editingQuestion || !editingQuestion.options) return;
    const opts = [...editingQuestion.options];
    opts.push({
      label: `Option ${String.fromCharCode(65 + opts.length)}`,
      isCorrect: false,
      orderIndex: opts.length,
    });
    setEditingQuestion({ ...editingQuestion, options: opts });
  };

  // Delete an option option
  const handleDeleteOption = (index: number) => {
    if (!editingQuestion || !editingQuestion.options || editingQuestion.options.length <= 1) return;
    const opts = editingQuestion.options.filter((_, i) => i !== index).map((opt, i) => ({
      ...opt,
      orderIndex: i,
    }));
    setEditingQuestion({ ...editingQuestion, options: opts });
  };

  // Save changes via Server Action
  const handleSaveQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingQuestion || !editingQuestion.prompt) return;

    // Validate correct options
    if (editingQuestion.kind !== QuestionType.SHORT_ANSWER) {
      const correctCount = editingQuestion.options?.filter((o) => o.isCorrect).length ?? 0;
      if (correctCount === 0) {
        setError("You must select at least one correct option for this question.");
        return;
      }
    } else {
      // Short answer validations
      if (!editingQuestion.options || editingQuestion.options.length === 0 || !editingQuestion.options[0]?.label) {
        setError("You must specify at least one correct short answer value in the label field.");
        return;
      }
      // Set all options to correct for short answers
      editingQuestion.options = editingQuestion.options.map((opt) => ({ ...opt, isCorrect: true }));
    }

    setIsSaving(true);
    setError(null);

    try {
      const res = await upsertQuestionAction(testId, editingQuestion.id || null, {
        prompt: editingQuestion.prompt,
        explanation: editingQuestion.explanation || null,
        kind: editingQuestion.kind || QuestionType.SINGLE_CHOICE,
        points: Number(editingQuestion.points || 1),
        orderIndex: Number(editingQuestion.orderIndex || 0),
        options: editingQuestion.options || [],
      });

      if (res.success) {
        // Optimistic refresh - in production next page revalidation handles it
        // We will just close editing pane
        window.location.reload();
      }
    } catch (err: any) {
      setError(err.message ?? "Failed to save question.");
    } finally {
      setIsSaving(false);
    }
  };

  // Delete a Question
  const handleDeleteQuestion = async (questionId: string) => {
    if (!confirm("Are you sure you want to delete this question?")) return;

    try {
      const res = await deleteQuestionAction(testId, questionId);
      if (res.success) {
        window.location.reload();
      }
    } catch (err: any) {
      alert(err.message ?? "Failed to delete question.");
    }
  };

  return (
    <div className="space-y-6">
      {editingQuestion ? (
        <Card className="border-primary/45 bg-primary/5">
          <CardHeader>
            <CardTitle>{editingQuestion.id ? "Edit Question" : "New Question"}</CardTitle>
            <CardDescription>Setup prompt and correct options.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSaveQuestion} className="space-y-4">
              {error ? (
                <div className="bg-destructive/10 text-destructive text-sm px-4 py-3 rounded-xl">
                  {error}
                </div>
              ) : null}

              <div className="grid gap-2">
                <label className="text-sm font-medium">Prompt / Question Text</label>
                <textarea
                  value={editingQuestion.prompt}
                  onChange={(e) => handleFieldChange("prompt", e.target.value)}
                  placeholder="e.g. What is the value of Pi to 2 decimal places?"
                  required
                  className="min-h-20 w-full rounded-xl border border-input bg-background px-4 py-3 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                />
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="grid gap-1">
                  <label className="text-sm font-medium">Question Type</label>
                  <select
                    value={editingQuestion.kind}
                    onChange={(e) => handleFieldChange("kind", e.target.value)}
                    className="h-11 rounded-xl border border-input bg-background px-4 text-sm"
                  >
                    <option value={QuestionType.SINGLE_CHOICE}>Single Choice (MCQ)</option>
                    <option value={QuestionType.MULTIPLE_CHOICE}>Multiple Choice</option>
                    <option value={QuestionType.TRUE_FALSE}>True / False</option>
                    <option value={QuestionType.SHORT_ANSWER}>Short Answer (Text Match)</option>
                  </select>
                </div>

                <div className="grid gap-1">
                  <label className="text-sm font-medium">Points / Weight</label>
                  <Input
                    type="number"
                    min="1"
                    value={editingQuestion.points}
                    onChange={(e) => handleFieldChange("points", e.target.value)}
                    required
                  />
                </div>

                <div className="grid gap-1">
                  <label className="text-sm font-medium">Order Index</label>
                  <Input
                    type="number"
                    min="0"
                    value={editingQuestion.orderIndex}
                    onChange={(e) => handleFieldChange("orderIndex", e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <label className="text-sm font-medium">Explanation (Optional)</label>
                <textarea
                  value={editingQuestion.explanation ?? ""}
                  onChange={(e) => handleFieldChange("explanation", e.target.value)}
                  placeholder="Feedback shown to students after submitting their answers..."
                  className="min-h-16 w-full rounded-xl border border-input bg-background px-4 py-3 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                />
              </div>

              {/* Dynamic Options Bank */}
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-4">
                  <h3 className="font-semibold text-sm">
                    {editingQuestion.kind === QuestionType.SHORT_ANSWER
                      ? "Acceptable Answers (Exact Matches)"
                      : "Answers & Options"}
                  </h3>
                  {editingQuestion.kind !== QuestionType.TRUE_FALSE ? (
                    <Button type="button" size="sm" variant="outline" onClick={handleAddOption}>
                      <Plus className="h-4 w-4 mr-1" /> Add Option
                    </Button>
                  ) : null}
                </div>

                <div className="grid gap-3">
                  {editingQuestion.options?.map((opt, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 rounded-xl border border-border bg-background">
                      {editingQuestion.kind !== QuestionType.SHORT_ANSWER ? (
                        <input
                          type={
                            editingQuestion.kind === QuestionType.SINGLE_CHOICE ||
                            editingQuestion.kind === QuestionType.TRUE_FALSE
                              ? "radio"
                              : "checkbox"
                          }
                          name="isCorrectOption"
                          checked={opt.isCorrect}
                          onChange={(e) => handleOptionChange(index, "isCorrect", e.target.checked)}
                          className="h-4 w-4 rounded text-primary focus:ring-primary border-border shrink-0 cursor-pointer"
                        />
                      ) : null}

                      <Input
                        value={opt.label}
                        onChange={(e) => handleOptionChange(index, "label", e.target.value)}
                        placeholder={
                          editingQuestion.kind === QuestionType.SHORT_ANSWER
                            ? "Acceptable text answer value (e.g. 'pi' or '3.14')"
                            : `Option choice text`
                        }
                        required
                        className="flex-1"
                      />

                      {editingQuestion.kind !== QuestionType.TRUE_FALSE &&
                      editingQuestion.kind !== QuestionType.SHORT_ANSWER &&
                      (editingQuestion.options?.length ?? 0) > 1 ? (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteOption(index)}
                          className="text-destructive shrink-0 hover:bg-destructive/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      ) : null}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={() => setEditingQuestion(null)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSaving} className="flex items-center gap-1">
                  <Save className="h-4 w-4" />
                  {isSaving ? "Saving..." : "Save Question"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      ) : (
        <div className="flex justify-between items-center gap-4">
          <h3 className="font-semibold text-lg">Question Bank ({questions.length})</h3>
          <Button onClick={handleAddNewQuestion} className="flex items-center gap-1">
            <Plus className="h-4 w-4" /> Add Question
          </Button>
        </div>
      )}

      {/* Questions Listing */}
      <div className="grid gap-4 mt-4">
        {questions.length === 0 ? (
          <div className="text-center py-10 border border-dashed rounded-2xl bg-muted/10 text-muted-foreground text-sm">
            No questions created in this assessment yet. Click "Add Question" above.
          </div>
        ) : (
          questions.map((q, idx) => (
            <Card key={q.id} className="border-border/60 hover:border-border transition-all">
              <CardHeader className="p-5 pb-3">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">Q{idx + 1}</Badge>
                      <Badge variant="secondary" className="text-xs uppercase">
                        {q.kind.replace("_", " ").toLowerCase()}
                      </Badge>
                      <Badge variant="outline" className="text-xs text-muted-foreground">
                        {q.points} {q.points === 1 ? "point" : "points"}
                      </Badge>
                    </div>
                    <CardTitle className="text-base pt-2 font-medium leading-relaxed">
                      {q.prompt}
                    </CardTitle>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <Button size="icon" variant="ghost" onClick={() => handleEditQuestion(q)}>
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="ghost" className="text-destructive hover:bg-destructive/10" onClick={() => handleDeleteQuestion(q.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-5 pt-0">
                <div className="grid gap-2 pl-6 border-l border-border mt-3 text-sm">
                  {q.options.map((opt) => (
                    <div key={opt.id} className="flex items-center gap-2 py-1">
                      {q.kind !== QuestionType.SHORT_ANSWER ? (
                        opt.isCorrect ? (
                          <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                        ) : (
                          <X className="h-4 w-4 text-muted-foreground/35 shrink-0" />
                        )
                      ) : (
                        <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                      )}
                      <span className={opt.isCorrect && q.kind !== QuestionType.SHORT_ANSWER ? "font-medium text-foreground" : "text-muted-foreground"}>
                        {opt.label}
                      </span>
                    </div>
                  ))}
                </div>

                {q.explanation ? (
                  <div className="mt-4 p-3 bg-muted/40 rounded-xl text-xs flex gap-2 items-start text-muted-foreground">
                    <HelpCircle className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <div>
                      <strong>Explanation: </strong>
                      {q.explanation}
                    </div>
                  </div>
                ) : null}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
