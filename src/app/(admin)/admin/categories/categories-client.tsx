"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Plus, Edit2, Trash2, X, Check, Loader2 } from "lucide-react";
import { createCategoryAction, updateCategoryAction, deleteCategoryAction } from "./actions";

export function AddCategoryForm() {
  const [name, setName] = useState("");
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setError(null);
    setSuccess(null);

    startTransition(async () => {
      const res = await createCategoryAction(name);
      if (res.error) {
        setError(res.error);
      } else {
        setSuccess("Category added successfully!");
        setName("");
      }
    });
  };

  return (
    <Card className="bg-[#090d20]/60 border-white/5 backdrop-blur-xl">
      <CardHeader className="pb-3">
        <CardTitle className="text-white text-base">Add New Category</CardTitle>
        <CardDescription className="text-slate-400">Establish a new relational taxonomy tag for public catalog lookup.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Input
              placeholder="e.g. Mobile Development"
              className="bg-white/5 border-white/10 text-white placeholder-slate-500 focus-visible:ring-indigo-500"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isPending}
              required
            />
          </div>

          {error && <div className="text-xs font-semibold text-red-400">{error}</div>}
          {success && <div className="text-xs font-semibold text-green-400">{success}</div>}

          <Button type="submit" disabled={isPending} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl border border-white/10 shadow-[0_0_10px_rgba(99,102,241,0.2)]">
            {isPending ? <Loader2 className="h-4 w-4 animate-spin mx-auto" /> : <><Plus className="h-4 w-4 mr-2" /> Add Category</>}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

export function CategoryRowActions({ categoryId, categoryName, coursesCount }: { categoryId: string; categoryName: string; coursesCount: number }) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(categoryName);
  const [isPending, startTransition] = useTransition();

  const handleUpdate = () => {
    if (!name.trim()) return;
    startTransition(async () => {
      const res = await updateCategoryAction(categoryId, name);
      if (res.error) {
        alert(res.error);
      } else {
        setIsEditing(false);
      }
    });
  };

  const handleDelete = () => {
    if (coursesCount > 0) {
      alert("Cannot delete category with existing courses");
      return;
    }

    if (confirm(`Are you sure you want to delete "${categoryName}"?`)) {
      startTransition(async () => {
        const res = await deleteCategoryAction(categoryId);
        if (res.error) {
          alert(res.error);
        }
      });
    }
  };

  return (
    <div className="flex items-center justify-end gap-2">
      {isEditing ? (
        <div className="flex items-center gap-1.5">
          <Input
            className="h-8 py-1 bg-white/5 border-white/10 text-white max-w-[180px] text-xs focus-visible:ring-indigo-500"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={isPending}
            required
            autoFocus
          />
          <Button onClick={handleUpdate} disabled={isPending} size="sm" className="h-8 w-8 p-0 bg-emerald-600 hover:bg-emerald-500 rounded-lg text-white">
            {isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />}
          </Button>
          <Button onClick={() => setIsEditing(false)} disabled={isPending} variant="ghost" size="sm" className="h-8 w-8 p-0 text-slate-400 hover:text-white rounded-lg">
            <X className="h-3.5 w-3.5" />
          </Button>
        </div>
      ) : (
        <>
          <Button onClick={() => setIsEditing(true)} variant="ghost" size="sm" className="text-slate-400 hover:text-indigo-400 hover:bg-white/5 rounded-xl h-8 w-8 p-0">
            <Edit2 className="h-3.5 w-3.5" />
          </Button>
          <Button onClick={handleDelete} variant="ghost" size="sm" className="text-slate-400 hover:text-red-400 hover:bg-white/5 rounded-xl h-8 w-8 p-0">
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </>
      )}
    </div>
  );
}
