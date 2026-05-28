"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { promoteToTeacherAction } from "./actions";

export function UsersSearchFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const initialQ = searchParams.get("q") || "";
  const initialFilter = searchParams.get("filter") || "ALL";

  const [q, setQ] = useState(initialQ);
  const [filter, setFilter] = useState(initialFilter);
  const [, startTransition] = useTransition();

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      startTransition(() => {
        const params = new URLSearchParams(searchParams.toString());
        if (q.trim()) {
          params.set("q", q.trim());
        } else {
          params.delete("q");
        }
        params.set("page", "0");
        router.push(`/admin/users?${params.toString()}`);
      });
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [q, router, searchParams]);

  const handleFilterChange = (newFilter: string) => {
    setFilter(newFilter);
    const params = new URLSearchParams(searchParams.toString());
    if (newFilter !== "ALL") {
      params.set("filter", newFilter);
    } else {
      params.delete("filter");
    }
    params.set("page", "0");
    router.push(`/admin/users?${params.toString()}`);
  };

  const roles = ["ALL", "STUDENT", "TEACHER", "ADMIN"];

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between w-full">
      <div className="relative max-w-md w-full">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search users by name or email..."
          className="pl-9 bg-white/5 border-white/10 text-white placeholder-slate-500 focus-visible:ring-indigo-500"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>

      <div className="flex flex-wrap gap-1.5 bg-[#090d20]/80 p-1 rounded-xl border border-white/5 w-fit">
        {roles.map((r) => (
          <button
            key={r}
            type="button"
            onClick={() => handleFilterChange(r)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-300 ${
              filter === r
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/10"
                : "text-slate-400 hover:text-white hover:bg-white/5"
            }`}
          >
            {r}
          </button>
        ))}
      </div>
    </div>
  );
}

export function PromoteButton({ userId, userRole }: { userId: string; userRole: string }) {
  const [isPending, startTransition] = useTransition();

  if (userRole !== "STUDENT") {
    return null;
  }

  const handlePromote = () => {
    if (confirm("Are you sure you want to promote this student to a Teacher?")) {
      startTransition(async () => {
        const res = await promoteToTeacherAction(userId);
        if (res.error) {
          alert(res.error);
        }
      });
    }
  };

  return (
    <Button
      onClick={handlePromote}
      disabled={isPending}
      variant="secondary"
      size="sm"
      className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl border border-white/10 shadow-[0_0_10px_rgba(99,102,241,0.2)] disabled:opacity-50"
    >
      {isPending ? "Promoting..." : "Promote to Teacher"}
    </Button>
  );
}
