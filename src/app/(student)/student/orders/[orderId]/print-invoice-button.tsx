"use client";

import { Printer } from "lucide-react";
import { Button } from "@/components/ui/button";

export function PrintInvoiceButton() {
  return (
    <Button
      type="button"
      onClick={() => window.print()}
      variant="ghost"
      size="sm"
      className="flex items-center gap-1.5 bg-white/5 border border-white/10 text-slate-200 hover:bg-white/10 hover:text-white transition-colors h-9 px-3 rounded-lg"
    >
      <Printer className="h-4 w-4 text-slate-400" />
      Print Invoice
    </Button>
  );
}
