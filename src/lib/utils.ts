import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getYoutubeEmbedUrl(url: string | null | undefined): string {
  if (!url) return "";
  
  const trimmed = url.trim();

  // If it's already an embed URL, return it
  if (trimmed.includes("youtube.com/embed/")) {
    if (trimmed.startsWith("//")) {
      return `https:${trimmed}`;
    }
    return trimmed;
  }

  // Regex patterns to capture YouTube video ID from watch URLs, short URLs, etc.
  const watchRegExp = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const match = trimmed.match(watchRegExp);
  
  if (match && match[1]) {
    return `https://www.youtube.com/embed/${match[1]}`;
  }

  // Fallback: If it's an 11 character string, assume it is a raw video ID
  if (trimmed.length === 11 && /^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return `https://www.youtube.com/embed/${trimmed}`;
  }

  return trimmed;
}

export function getYoutubeVideoId(url: string | null | undefined): string | null {
  if (!url) return null;
  const trimmed = url.trim();
  
  const watchRegExp = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const match = trimmed.match(watchRegExp);
  
  if (match && match[1]) {
    return match[1];
  }
  
  if (trimmed.length === 11 && /^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return trimmed;
  }
  
  return null;
}