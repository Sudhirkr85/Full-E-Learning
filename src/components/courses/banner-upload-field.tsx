"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload, Loader2, Trash2 } from "lucide-react";

type BannerUploadFieldProps = {
  initialImageUrl: string | null;
  courseTitle: string;
};

export function BannerUploadField({ initialImageUrl, courseTitle }: BannerUploadFieldProps) {
  const [bannerUrl, setBannerUrl] = useState<string | null>(initialImageUrl);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleBannerChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      setUploadError("Only JPEG, PNG, WebP, and GIF images are allowed.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setUploadError("Maximum file size is 5 MB.");
      return;
    }

    setIsUploading(true);
    setUploadError(null);

    try {
      const formData = new FormData();
      formData.append("banner", file);

      const res = await fetch("/api/courses/upload-banner", {
        method: "POST",
        body: formData
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to upload banner.");
      }

      const data = await res.json();
      setBannerUrl(data.imageUrl);
    } catch (err: any) {
      setUploadError(err.message || "Something went wrong uploading banner.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-2">
      <label className="text-xs font-bold uppercase tracking-wider text-slate-300">Course Banner</label>
      <input type="hidden" name="coverImageUrl" value={bannerUrl ?? ""} />

      {bannerUrl ? (
        <div className="relative overflow-hidden rounded-xl border border-white/10 bg-white/5 group">
          <img src={bannerUrl} alt={`${courseTitle} banner`} className="h-40 w-full object-cover transition-transform duration-300 group-hover:scale-105" />
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <Button type="button" variant="destructive" size="sm" className="rounded-xl" onClick={() => setBannerUrl(null)}>
              <Trash2 className="mr-1 h-3.5 w-3.5" />
              Remove
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex h-40 items-center justify-center rounded-xl border border-dashed border-white/15 bg-white/[0.02] text-xs text-slate-500">
          No banner uploaded yet.
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        onChange={handleBannerChange}
        className="hidden"
      />
      <Button
        type="button"
        variant="outline"
        onClick={() => fileInputRef.current?.click()}
        disabled={isUploading}
        className="w-full rounded-xl text-indigo-400 hover:text-white border-indigo-500/20 bg-indigo-500/5 hover:bg-indigo-500/10"
      >
        {isUploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
        {isUploading ? "Uploading..." : "Change thumbnail"}
      </Button>
      <p className="text-[10px] text-slate-500">JPEG, PNG, WebP, GIF up to 5 MB.</p>
      {uploadError ? <p className="text-xs font-semibold text-rose-400">{uploadError}</p> : null}
    </div>
  );
}
