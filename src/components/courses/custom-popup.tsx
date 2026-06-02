"use client";

import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/button";
import { AlertCircle, CheckCircle, HelpCircle } from "lucide-react";

type CustomPopupProps = {
  isOpen: boolean;
  title: string;
  message: string;
  type: "alert" | "confirm";
  onConfirm: () => void;
  onCancel?: () => void;
  confirmText?: string;
  cancelText?: string;
  isError?: boolean;
  position?: "center" | "top" | "bottom";
};

export function CustomPopup({
  isOpen,
  title,
  message,
  type,
  onConfirm,
  onCancel,
  confirmText = "OK",
  cancelText = "Cancel",
  isError = false,
  position = "center"
}: CustomPopupProps) {
  const confirmButtonRef = useRef<HTMLButtonElement>(null);
  const cancelButtonRef = useRef<HTMLButtonElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen && mounted) {
      setTimeout(() => {
        const target = (type === "confirm" && cancelButtonRef.current) 
          ? cancelButtonRef.current 
          : confirmButtonRef.current;
        
        if (target) {
          target.focus();
          target.scrollIntoView({ block: "center", inline: "nearest", behavior: "smooth" });
        }
      }, 50);
    }
  }, [isOpen, type, mounted]);

  if (!isOpen || !mounted) return null;

  const positionClasses = {
    center: "items-center justify-center",
    top: "items-start justify-center pt-24 md:pt-32",
    bottom: "items-end justify-center pb-24 md:pb-32"
  };

  return createPortal(
    <div className={`fixed inset-0 z-[100] flex p-4 ${positionClasses[position]}`}>
      {/* Semi-transparent backdrop blur */}
      <div 
        className="absolute inset-0 bg-[#06060a]/80 backdrop-blur-md" 
        onClick={type === "alert" ? onConfirm : onCancel}
      />

      {/* Futuristic centered glass card popup */}
      <div className="relative bg-[#0f0f18] border border-white/10 shadow-2xl shadow-indigo-500/10 rounded-2xl p-6 w-full max-w-sm text-center space-y-4 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Animated icon indicator */}
        <div className="flex justify-center">
          <div className={`h-12 w-12 rounded-full flex items-center justify-center ${
            isError 
              ? "bg-rose-500/10 text-rose-400 border border-rose-500/20" 
              : type === "confirm" 
                ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20" 
                : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
          }`}>
            {isError ? (
              <AlertCircle className="h-6 w-6" />
            ) : type === "confirm" ? (
              <HelpCircle className="h-6 w-6" />
            ) : (
              <CheckCircle className="h-6 w-6" />
            )}
          </div>
        </div>

        {/* Text Details */}
        <div className="space-y-1.5">
          <h3 className="text-sm font-extrabold uppercase tracking-wider text-white leading-none">{title}</h3>
          <p className="text-xs text-slate-400 leading-relaxed pt-1">{message}</p>
        </div>

        {/* Responsive buttons row */}
        <div className="flex gap-2 justify-center pt-2">
          {type === "confirm" && onCancel && (
            <Button 
              ref={cancelButtonRef}
              type="button" 
              variant="outline" 
              className="text-xs h-9 rounded-xl border-white/5 bg-white/5 text-slate-300 hover:text-white px-4 shrink-0"
              onClick={onCancel}
            >
              {cancelText}
            </Button>
          )}
          <Button 
            ref={confirmButtonRef}
            type="button" 
            className={`text-xs h-9 rounded-xl px-5 font-bold uppercase tracking-wider ${
              isError 
                ? "bg-rose-600 hover:bg-rose-500 text-white" 
                : "bg-indigo-600 hover:bg-indigo-500 text-white"
            }`}
            onClick={onConfirm}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </div>,
    document.body
  );
}
