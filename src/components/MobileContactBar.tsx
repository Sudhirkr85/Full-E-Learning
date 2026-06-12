"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";

export function MobileContactBar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  // Show only on the home page
  if (pathname !== "/") {
    return null;
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end md:hidden gap-3 select-none">
      
      {/* Expanded Menu Actions */}
      {isOpen && (
        <div className="flex flex-col items-end gap-2 animate-fade-in">
          {/* Call Option */}
          <a
            href="tel:+919110113671"
            className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-blue-600 text-white font-bold text-xs shadow-lg transform active:scale-95 transition-all duration-200"
            aria-label="Call Sagar Coaching Centre"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z"/>
            </svg>
            <span>कॉल करें</span>
          </a>

          {/* WhatsApp Option */}
          <a
            href="https://wa.me/919110113671"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-emerald-600 text-white font-bold text-xs shadow-lg transform active:scale-95 transition-all duration-200"
            aria-label="WhatsApp Sagar Coaching Centre"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
              <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.118 1.528 5.856L.057 23.428a.75.75 0 00.915.915l5.57-1.471A11.943 11.943 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.907 0-3.699-.497-5.254-1.367l-.372-.214-3.862 1.02 1.02-3.742-.228-.383A9.953 9.953 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
            </svg>
            <span>WhatsApp</span>
          </a>
        </div>
      )}

      {/* Main Pulse Animated Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`relative h-14 w-14 rounded-full flex items-center justify-center text-white shadow-2xl transition-all duration-300 transform active:scale-90 ${
          isOpen ? "bg-slate-800 rotate-135" : "bg-gradient-to-tr from-violet-600 to-indigo-600 hover:scale-105"
        }`}
        aria-label="Toggle contact menu"
      >
        {/* Animated Glow Rings when closed */}
        {!isOpen && (
          <>
            <span className="absolute inset-0 rounded-full bg-indigo-500/40 animate-ping opacity-75" />
            <span className="absolute -inset-1 rounded-full border border-indigo-500/30 animate-pulse" />
          </>
        )}
        
        {/* Message Icon or Close Icon */}
        {isOpen ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        )}
      </button>

    </div>
  );
}
