"use client";

import { useState, useRef, useTransition } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { createCourseAction } from "@/lib/courses/actions";
import {
  Upload,
  Trash2,
  BookOpen,
  IndianRupee,
  Search,
  ChevronDown,
  Check,
  Loader2,
  ArrowLeft,
  Sparkles
} from "lucide-react";
import Link from "next/link";

type Category = {
  id: string;
  name: string;
};

type CourseCreateFormProps = {
  categories: Category[];
  backUrl: string;
};

export function CourseCreateForm({ categories, backUrl }: CourseCreateFormProps) {
  const [isPending, startTransition] = useTransition();

  // Banner Upload states
  const [bannerUrl, setBannerUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Searchable Category states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);

  const filteredCategories = categories.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleBannerChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Client-side validations
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
        body: formData,
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

  const handleRemoveBanner = () => {
    setBannerUrl(null);
    setUploadError(null);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header back-link */}
      <div>
        <Link href={backUrl} className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition duration-200 mb-4">
          <ArrowLeft className="h-3 w-3" /> Back to Courses
        </Link>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 rounded-full bg-indigo-950/60 border border-indigo-500/30 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-indigo-300">
            Course Creation Desk
          </span>
        </div>
        <h1 className="mt-4 font-display text-3xl font-semibold tracking-tight text-white flex items-center gap-2">
          Create Course <Sparkles className="h-5 w-5 text-indigo-400 animate-pulse" />
        </h1>
        <p className="mt-2 text-sm text-slate-400 leading-relaxed">
          Initialize a new course catalog shell. You can add section curriculum outlines, lesson contents, and downloadable resources after creation.
        </p>
      </div>

      <Card className="bg-[#090d20]/60 border-white/5 backdrop-blur-xl relative overflow-hidden">
        {/* Glow decoration */}
        <div className="absolute right-0 top-0 -z-10 h-32 w-32 rounded-full bg-indigo-500/5 blur-2xl"></div>
        
        <CardHeader>
          <CardTitle className="text-white text-lg flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-indigo-400" />
            Course Details & Metadata
          </CardTitle>
          <CardDescription className="text-slate-400">
            Configure the default identity, level, category, and pricing parameters for your new course shell.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              const form = e.currentTarget;
              const formData = new FormData(form);

              // Append values from state
              if (selectedCategory) {
                formData.set("categoryId", selectedCategory.id);
              }
              if (bannerUrl) {
                formData.set("coverImageUrl", bannerUrl);
              }

              startTransition(async () => {
                await createCourseAction(formData);
              });
            }} 
            className="space-y-6"
          >
            {/* Title & Subtitle */}
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300">Course Title</label>
                <Input 
                  name="title" 
                  placeholder="e.g. Master React & Next.js" 
                  className="bg-white/5 border-white/10 text-white placeholder-slate-500 focus-visible:ring-indigo-500" 
                  required 
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300">Short Subtitle</label>
                <Input 
                  name="subtitle" 
                  placeholder="e.g. From beginner to production ready" 
                  className="bg-white/5 border-white/10 text-white placeholder-slate-500 focus-visible:ring-indigo-500" 
                />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300">Course Description</label>
              <textarea 
                name="description" 
                rows={6} 
                placeholder="Write a comprehensive overview of what students will master..." 
                className="min-h-32 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none ring-offset-background placeholder:text-slate-500 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" 
                required 
              />
            </div>

            {/* Category, Language, Level, Price */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {/* Category search dropdown */}
              <div className="space-y-2 relative">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300">Category</label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
                    className="flex h-11 w-full items-center justify-between rounded-xl border border-white/10 bg-[#0a0f24] px-4 py-2 text-xs text-slate-200 outline-none hover:bg-white/[0.02]"
                  >
                    <span>{selectedCategory ? selectedCategory.name : "Select Category..."}</span>
                    <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
                  </button>

                  {isCategoryDropdownOpen && (
                    <div className="absolute top-[48px] left-0 z-50 w-full rounded-xl border border-white/10 bg-[#0b0f20] p-2 shadow-xl backdrop-blur-xl animate-fade-in max-h-56 overflow-y-auto">
                      <div className="relative mb-2">
                        <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
                        <input
                          type="text"
                          placeholder="Search category..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="h-8 w-full rounded-lg bg-white/5 pl-8 pr-3 text-xs text-white placeholder-slate-500 border border-white/5 outline-none focus:border-indigo-500/50"
                        />
                      </div>

                      {filteredCategories.length === 0 ? (
                        <p className="py-2 text-center text-slate-500 text-[11px]">No categories found.</p>
                      ) : (
                        <div className="space-y-1">
                          {filteredCategories.map((c) => (
                            <button
                              key={c.id}
                              type="button"
                              onClick={() => {
                                setSelectedCategory(c);
                                setIsCategoryDropdownOpen(false);
                                setSearchQuery("");
                              }}
                              className="flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-[11px] text-slate-300 hover:bg-indigo-600 hover:text-white transition duration-200"
                            >
                              <span>{c.name}</span>
                              {selectedCategory?.id === c.id && <Check className="h-3.5 w-3.5 text-indigo-400" />}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
                {/* Hidden input to ensure form submission includes categoryId */}
                <input type="hidden" name="categoryId" value={selectedCategory?.id || ""} />
              </div>

              {/* Language / Tech Stack */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300">Language / Tech Stack</label>
                <Input
                  name="language"
                  placeholder="e.g. Hindi, React, Python"
                  defaultValue="Hindi"
                  className="bg-white/5 border-white/10 text-white placeholder-slate-500 focus-visible:ring-indigo-500 h-11 text-xs"
                />
              </div>

              {/* Level select */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300">Level</label>
                <select
                  name="level"
                  defaultValue="BEGINNER"
                  className="h-11 w-full rounded-xl border border-white/10 bg-[#0b0f1e] px-4 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="BEGINNER">Beginner</option>
                  <option value="INTERMEDIATE">Intermediate</option>
                  <option value="ADVANCED">Advanced</option>
                  <option value="ALL_LEVELS">All levels</option>
                </select>
              </div>

              {/* Pricing (INR Only) */}
              <div className="space-y-2 col-span-2">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1">
                      Course Price (<IndianRupee className="h-3 w-3" />)
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-3.5 text-xs text-slate-400 font-bold">₹</span>
                      <Input
                        name="priceInRupees"
                        type="number"
                        min="0"
                        step="1"
                        placeholder="e.g. 499"
                        className="pl-7 bg-white/5 border-white/10 text-white placeholder-slate-500 focus-visible:ring-indigo-500 h-11 text-xs"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1">
                      Original Price (<IndianRupee className="h-3 w-3" />)
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-3.5 text-xs text-slate-400 font-bold">₹</span>
                      <Input
                        name="originalPriceInRupees"
                        type="number"
                        min="0"
                        step="1"
                        placeholder="e.g. 999"
                        className="pl-7 bg-white/5 border-white/10 text-white placeholder-slate-500 focus-visible:ring-indigo-500 h-11 text-xs"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Banner Drag-and-Drop / Upload Section */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300">Course Banner</label>
              
              {bannerUrl ? (
                <div className="relative rounded-2xl overflow-hidden border border-white/10 aspect-[3/1] max-h-56 group">
                  <img 
                    src={bannerUrl} 
                    alt="Course banner preview" 
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
                    <Button 
                      type="button" 
                      onClick={handleRemoveBanner}
                      variant="destructive"
                      className="rounded-xl text-xs gap-1.5"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Remove Image
                    </Button>
                  </div>
                </div>
              ) : (
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-white/10 rounded-2xl bg-white/[0.01] hover:bg-white/[0.03] hover:border-indigo-500/40 p-8 flex flex-col items-center justify-center cursor-pointer transition duration-300 group min-h-40"
                >
                  <input 
                    type="file" 
                    ref={fileInputRef}
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    onChange={handleBannerChange}
                    className="hidden"
                  />
                  
                  {isUploading ? (
                    <div className="flex flex-col items-center gap-3">
                      <Loader2 className="h-8 w-8 text-indigo-400 animate-spin" />
                      <span className="text-xs font-bold text-slate-300 uppercase tracking-widest animate-pulse">Uploading Banner...</span>
                    </div>
                  ) : (
                    <>
                      <div className="h-10 w-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-3 group-hover:scale-110 transition duration-300">
                        <Upload className="h-5 w-5 text-indigo-400" />
                      </div>
                      <p className="text-xs font-semibold text-slate-200">Click to upload course banner</p>
                      <p className="text-[10px] text-slate-500 mt-1">Accepts JPEG, PNG, WebP, GIF up to 5 MB</p>
                    </>
                  )}
                </div>
              )}
              {uploadError && (
                <p className="text-xs font-semibold text-rose-400 mt-1">{uploadError}</p>
              )}
            </div>

            <Button 
              type="submit" 
              disabled={isPending || isUploading}
              className="w-full h-12 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl border border-white/10 shadow-[0_0_15px_rgba(99,102,241,0.2)] disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creating Course Shell...
                </>
              ) : (
                "Create Course"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
