"use client";

import { useState, useTransition } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { savePlatformConfigAction } from "./actions";

interface PlatformFormProps {
  initialConfig: {
    siteName: string;
    supportEmail: string;
    maintenance: boolean;
  } | null;
}

export function PlatformForm({ initialConfig }: PlatformFormProps) {
  const [siteName, setSiteName] = useState(initialConfig?.siteName || "E-Learning Academy");
  const [supportEmail, setSupportEmail] = useState(initialConfig?.supportEmail || "support@yourapp.com");
  const [maintenance, setMaintenance] = useState(initialConfig?.maintenance || false);

  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    startTransition(async () => {
      const formData = new FormData();
      formData.append("siteName", siteName);
      formData.append("supportEmail", supportEmail);
      formData.append("maintenance", maintenance ? "true" : "false");

      const res = await savePlatformConfigAction(null, formData);

      if (res.error) {
        setError(res.error);
      } else if (res.success) {
        setSuccess(res.success);
      }
    });
  };

  return (
    <Card className="bg-[#090d20]/60 border-white/5 backdrop-blur-xl">
      <CardHeader>
        <CardTitle className="text-white">Global Configuration Settings</CardTitle>
        <CardDescription className="text-slate-400">Configure global metadata and toggle system-wide maintenance states.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300">Site Name</label>
            <Input
              type="text"
              placeholder="e.g. E-Learning Academy"
              className="bg-white/5 border-white/10 text-white placeholder-slate-500 focus-visible:ring-indigo-500"
              value={siteName}
              onChange={(e) => setSiteName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300">Support Email Address</label>
            <Input
              type="email"
              placeholder="e.g. support@yourapp.com"
              className="bg-white/5 border-white/10 text-white placeholder-slate-500 focus-visible:ring-indigo-500"
              value={supportEmail}
              onChange={(e) => setSupportEmail(e.target.value)}
              required
            />
          </div>

          <div className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.02] p-4">
            <div className="space-y-0.5 pr-4">
              <label className="text-sm font-bold text-white cursor-pointer select-none" htmlFor="maintenance-mode">
                Maintenance Mode
              </label>
              <p className="text-xs text-slate-400">
                Put the public platform under scheduled maintenance. Only administrative accounts will be allowed to bypass and login.
              </p>
            </div>
            <div className="flex items-center">
              <input
                id="maintenance-mode"
                type="checkbox"
                className="h-4 w-4 rounded border-white/10 bg-white/5 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-slate-900 cursor-pointer"
                checked={maintenance}
                onChange={(e) => setMaintenance(e.target.checked)}
              />
            </div>
          </div>

          {error && (
            <div className="rounded-xl border border-red-500/10 bg-red-500/5 px-4 py-2.5 text-xs font-semibold text-red-400">
              {error}
            </div>
          )}

          {success && (
            <div className="rounded-xl border border-green-500/10 bg-green-500/5 px-4 py-2.5 text-xs font-semibold text-green-400">
              {success}
            </div>
          )}

          <Button
            type="submit"
            disabled={isPending}
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl border border-white/10 shadow-[0_0_15px_rgba(99,102,241,0.2)] disabled:opacity-50"
          >
            {isPending ? "Saving Configurations..." : "Save Settings"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
