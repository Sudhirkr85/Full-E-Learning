"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  BookOpen, 
  LayoutList, 
  Users, 
  Settings as SettingsIcon, 
  BarChart3, 
  Plus, 
  Video, 
  FileText, 
  HelpCircle, 
  Trash2, 
  ChevronRight, 
  PlayCircle, 
  Mail, 
  Phone, 
  Calendar,
  Lock,
  Unlock,
  CheckCircle,
  Eye,
  ArrowRight,
  Loader2,
  Tag,
  ShieldAlert,
  Sparkles,
  Radio,
  Award
} from "lucide-react";
import { 
  createSectionAction, 
  createLessonAction, 
  deleteSectionAction, 
  deleteLessonAction 
} from "@/lib/courses/actions";
import { QuizEditorModal } from "./quiz-editor-modal";
import { CustomPopup } from "@/components/courses/custom-popup";

type TabType = "overview" | "curriculum" | "students" | "analytics" | "settings";

type CourseDashboardClientProps = {
  course: any;
  allCategories: any[];
  allTeachers: any[];
  tests: any[];
  updateAction: (formData: FormData) => Promise<any>;
  toggleStatusAction: (formData: FormData) => Promise<any>;
  attachCategoryAction: (formData: FormData) => Promise<any>;
  detachCategoryAction: (formData: FormData) => Promise<any>;
  assignTeacherAction: (formData: FormData) => Promise<any>;
  removeTeacherAction: (formData: FormData) => Promise<any>;
  deleteCourseAction: (formData: FormData) => Promise<any>;
  certificateCount: number;
};

export function CourseDashboardClient({
  course,
  allCategories,
  allTeachers,
  tests,
  certificateCount,
  updateAction,
  toggleStatusAction,
  attachCategoryAction,
  detachCategoryAction,
  assignTeacherAction,
  removeTeacherAction,
  deleteCourseAction
}: CourseDashboardClientProps) {
  const [activeTab, setActiveTab] = useState<TabType>("curriculum");
  const [expandedSectionId, setExpandedSectionId] = useState<string | null>(
    course.sections[0]?.id || null
  );
  
  const [activeQuizLesson, setActiveQuizLesson] = useState<any | null>(null);
  const [activeQuizTest, setActiveQuizTest] = useState<any | null>(null);

  // Custom popup states
  const [popup, setPopup] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    type: "alert" | "confirm";
    confirmText?: string;
    isError?: boolean;
    onConfirm: () => void;
    onCancel?: () => void;
  }>({
    isOpen: false,
    title: "",
    message: "",
    type: "alert",
    onConfirm: () => {}
  });

  const showAlert = (message: string, isError = true, title = "System Notification") => {
    setPopup({
      isOpen: true,
      title,
      message,
      type: "alert",
      isError,
      onConfirm: () => setPopup(prev => ({ ...prev, isOpen: false }))
    });
  };

  const showConfirm = (message: string, onConfirm: () => void, title = "Please Confirm") => {
    setPopup({
      isOpen: true,
      title,
      message,
      type: "confirm",
      confirmText: "Confirm",
      onConfirm: () => {
        onConfirm();
        setPopup(prev => ({ ...prev, isOpen: false }));
      },
      onCancel: () => setPopup(prev => ({ ...prev, isOpen: false }))
    });
  };
  
  // Transition actions
  const [isPending, startTransition] = useTransition();

  // Overview Form state
  const [title, setTitle] = useState(course.title);
  const [subtitle, setSubtitle] = useState(course.subtitle ?? "");
  const [description, setDescription] = useState(course.description ?? "");
  const [excerpt, setExcerpt] = useState(course.excerpt ?? "");
  const [level, setLevel] = useState(course.level);
  const [language, setLanguage] = useState(course.language);
  const [priceInRupees, setPriceInRupees] = useState(
    course.priceCents ? Math.round(course.priceCents / 100) : 0
  );
  const [originalPriceInRupees, setOriginalPriceInRupees] = useState(
    (course.metadata as any)?.originalPrice ?? ""
  );

  // Lesson Forms state
  const [showAddContentSectionId, setShowAddContentSectionId] = useState<string | null>(null);
  const [contentType, setContentType] = useState<"VIDEO" | "ARTICLE" | "QUIZ" | "LIVE" | null>(null);
  const [newContentTitle, setNewContentTitle] = useState("");
  const [newContentDesc, setNewContentDesc] = useState("");
  const [youtubeVideoId, setYoutubeVideoId] = useState("");
  const [pdfUrl, setPdfUrl] = useState("");
  const [accessType, setAccessType] = useState<"FREE" | "PAID">("PAID");
  const [liveScheduledAt, setLiveScheduledAt] = useState("");

  const [newSectionTitle, setNewSectionTitle] = useState("");
  const [showAddSection, setShowAddSection] = useState(false);

  // Category and Teacher state
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedTeacher, setSelectedTeacher] = useState("");

  const handleUpdateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("courseId", course.id);
    formData.append("title", title);
    formData.append("subtitle", subtitle);
    formData.append("description", description);
    formData.append("excerpt", excerpt);
    formData.append("level", level);
    formData.append("language", language);
    formData.append("priceInRupees", String(priceInRupees));
    formData.append("originalPriceInRupees", String(originalPriceInRupees));

    startTransition(async () => {
      try {
        await updateAction(formData);
      } catch (err: any) {
        if (err?.digest?.startsWith("NEXT_REDIRECT") || err?.message?.includes("NEXT_REDIRECT")) {
          throw err;
        }
        showAlert(err.message || "Failed to update course.");
      }
    });
  };

  const handleCreateSection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSectionTitle.trim()) return;

    const fd = new FormData();
    fd.append("courseId", course.id);
    fd.append("title", newSectionTitle.trim());

    startTransition(async () => {
      try {
        await createSectionAction(fd);
        setNewSectionTitle("");
        setShowAddSection(false);
      } catch (err: any) {
        if (err?.digest?.startsWith("NEXT_REDIRECT") || err?.message?.includes("NEXT_REDIRECT")) {
          throw err;
        }
        showAlert(err.message || "Failed to create section.");
      }
    });
  };

  const handleCreateLesson = async (e: React.FormEvent, sectionId: string) => {
    e.preventDefault();
    if (!newContentTitle.trim() || !contentType) return;

    if (contentType === "ARTICLE" && !pdfUrl.trim()) {
      showAlert("Please upload a PDF playbook file first.");
      return;
    }

    let youtubeUrl: string | undefined;
    if ((contentType === "VIDEO" || contentType === "LIVE") && youtubeVideoId.trim()) {
      let videoId = youtubeVideoId.trim();
      if (videoId.includes("youtu.be/")) {
        videoId = videoId.split("youtu.be/")[1]?.split("?")[0] ?? videoId;
      } else if (videoId.includes("v=")) {
        videoId = videoId.split("v=")[1]?.split("&")[0] ?? videoId;
      } else if (videoId.includes("youtube.com/live/")) {
        videoId = videoId.split("youtube.com/live/")[1]?.split("?")[0] ?? videoId;
      }
      youtubeUrl = `https://www.youtube.com/watch?v=${videoId}`;
    }

    const fd = new FormData();
    fd.append("courseId", course.id);
    fd.append("sectionId", sectionId);
    fd.append("title", newContentTitle.trim());
    fd.append("contentType", contentType);
    if (newContentDesc.trim()) {
      fd.append("description", newContentDesc.trim());
    }
    if (youtubeUrl) {
      fd.append("youtubeUrl", youtubeUrl);
    }
    if (contentType === "ARTICLE" && pdfUrl.trim()) {
      fd.append("r2AssetUrl", pdfUrl.trim());
    }
    if (contentType === "LIVE" && liveScheduledAt) {
      fd.append("scheduledAt", liveScheduledAt);
    }
    fd.append("isPreview", String(accessType === "FREE"));
    fd.append("isPublished", "true");

    startTransition(async () => {
      try {
        await createLessonAction(fd);
        setNewContentTitle("");
        setNewContentDesc("");
        setYoutubeVideoId("");
        setPdfUrl("");
        setAccessType("PAID");
        setLiveScheduledAt("");
        setShowAddContentSectionId(null);
        setContentType(null);
      } catch (err: any) {
        if (err?.digest?.startsWith("NEXT_REDIRECT") || err?.message?.includes("NEXT_REDIRECT")) {
          throw err;
        }
        showAlert(err.message || "Failed to create lesson.");
      }
    });
  };

  const handleDeleteSection = async (sectionId: string) => {
    showConfirm(
      "Are you sure you want to delete this section and all lessons inside it?",
      async () => {
        const fd = new FormData();
        fd.append("sectionId", sectionId);
        startTransition(async () => {
          try {
            await deleteSectionAction(fd);
          } catch (err: any) {
            if (err?.digest?.startsWith("NEXT_REDIRECT") || err?.message?.includes("NEXT_REDIRECT")) {
              throw err;
            }
            showAlert(err.message || "Failed to delete section.");
          }
        });
      }
    );
  };

  const handleDeleteLesson = async (lessonId: string) => {
    showConfirm(
      "Are you sure you want to delete this lesson?",
      async () => {
        const fd = new FormData();
        fd.append("lessonId", lessonId);
        startTransition(async () => {
          try {
            await deleteLessonAction(fd);
          } catch (err: any) {
            if (err?.digest?.startsWith("NEXT_REDIRECT") || err?.message?.includes("NEXT_REDIRECT")) {
              throw err;
            }
            showAlert(err.message || "Failed to delete lesson.");
          }
        });
      }
    );
  };

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary">Teacher Workspace Desk</Badge>
            <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 font-bold">
              {course.status}
            </Badge>
          </div>
          <h1 className="font-display text-3xl font-black text-white mt-1 leading-tight">{course.title}</h1>
        </div>

        {/* Dynamic Tab Navigation Row */}
        <div className="flex bg-white/5 border border-white/10 p-1 rounded-2xl w-fit">
          {(["overview", "curriculum", "students", "analytics", "settings"] as TabType[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-xl transition-all ${
                activeTab === tab 
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20" 
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Dynamic Tab Renderers */}
      <div className="relative z-10">
        {/* TAB 1: OVERVIEW */}
        {activeTab === "overview" && (
          <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
            <Card className="bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-6">
              <CardHeader className="px-0 pt-0">
                <CardTitle className="text-white text-lg flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-indigo-400" />
                  Course Details
                </CardTitle>
                <CardDescription className="text-slate-400">Modify the core catalog information of the course shell.</CardDescription>
              </CardHeader>
              <CardContent className="px-0 pb-0">
                <form onSubmit={handleUpdateCourse} className="space-y-5">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-300">Course Title</label>
                      <Input value={title} onChange={(e) => setTitle(e.target.value)} className="bg-white/5 border-white/10 text-white h-11 text-xs" required />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-300">Subtitle</label>
                      <Input value={subtitle} onChange={(e) => setSubtitle(e.target.value)} className="bg-white/5 border-white/10 text-white h-11 text-xs" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-300">Course Description</label>
                    <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="min-h-32 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none focus:ring-1 focus:ring-indigo-500" required />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-300">SEO Excerpt</label>
                    <Input value={excerpt} onChange={(e) => setExcerpt(e.target.value)} className="bg-white/5 border-white/10 text-white h-11 text-xs" />
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-300">Level</label>
                      <select value={level} onChange={(e) => setLevel(e.target.value)} className="h-11 w-full rounded-xl border border-white/10 bg-[#0a0f24] px-4 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500">
                        <option value="BEGINNER">Beginner</option>
                        <option value="INTERMEDIATE">Intermediate</option>
                        <option value="ADVANCED">Advanced</option>
                        <option value="ALL_LEVELS">All Levels</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-300">Language</label>
                      <Input value={language} onChange={(e) => setLanguage(e.target.value)} className="bg-white/5 border-white/10 text-white h-11 text-xs" />
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-300">Course Price (₹)</label>
                      <Input type="number" value={priceInRupees} onChange={(e) => setPriceInRupees(Number(e.target.value))} className="bg-white/5 border-white/10 text-white h-11 text-xs" required />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-300">Original Price (₹)</label>
                      <Input type="number" value={originalPriceInRupees} onChange={(e) => setOriginalPriceInRupees(Number(e.target.value))} className="bg-white/5 border-white/10 text-white h-11 text-xs" />
                    </div>
                  </div>

                  <Button type="submit" disabled={isPending} className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl h-11 text-xs px-6 font-bold uppercase tracking-wider">
                    {isPending ? <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" /> : "Save Changes"}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Sidebar metadata columns */}
            <div className="space-y-6">
              {/* Category Assignment */}
              <Card className="bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-6">
                <CardHeader className="px-0 pt-0">
                  <CardTitle className="text-white text-lg flex items-center gap-2">
                    <Tag className="h-5 w-5 text-indigo-400" />
                    Categories
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-0 pb-0 space-y-4">
                  <form action={attachCategoryAction} className="grid gap-3">
                    <input type="hidden" name="courseId" value={course.id} />
                    <select name="categoryName" className="h-11 w-full rounded-xl border border-white/10 bg-[#0a0f24] px-4 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500" required>
                      <option value="">Select category...</option>
                      {allCategories.map((cat) => (
                        <option key={cat.id} value={cat.name}>{cat.name}</option>
                      ))}
                    </select>
                    <Button type="submit" variant="outline" className="border-indigo-500/20 text-indigo-300 bg-indigo-500/5 hover:bg-indigo-600 hover:text-white rounded-xl text-xs h-11 font-bold uppercase tracking-wider">
                      Attach Category
                    </Button>
                  </form>
                  <div className="flex flex-wrap gap-2 pt-2">
                    {course.categories.map(({ category }: any) => (
                      <form key={category.id} action={detachCategoryAction}>
                        <input type="hidden" name="courseId" value={course.id} />
                        <input type="hidden" name="categoryId" value={category.id} />
                        <Button type="submit" variant="secondary" size="sm" className="rounded-xl bg-white/5 border border-white/5 text-slate-300 hover:bg-white/10 hover:text-white text-[10px]">
                          {category.name} ×
                        </Button>
                      </form>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* TAB 2: CURRICULUM (Central Course Builder) */}
        {activeTab === "curriculum" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <LayoutList className="h-4.5 w-4.5 text-indigo-400" />
                Curriculum Blueprint ({course.sections.length} Sections)
              </h2>
              <Button onClick={() => setShowAddSection(true)} className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl h-10 text-xs px-4 font-bold uppercase tracking-wider">
                <Plus className="mr-1.5 h-4 w-4" /> Add Section
              </Button>
            </div>

            {/* Add Section Modal form */}
            {showAddSection && (
              <Card className="bg-[#090d20]/90 border border-indigo-500/30 rounded-2xl max-w-md p-6">
                <form onSubmit={handleCreateSection} className="space-y-4">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">Create New Module Section</h3>
                  <Input value={newSectionTitle} onChange={(e) => setNewSectionTitle(e.target.value)} placeholder="e.g. Section 1: Core System Mechanics" className="bg-white/5 border border-white/10 text-white" required autoFocus />
                  <div className="flex gap-2">
                    <Button type="submit" className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs h-10 px-4">Create</Button>
                    <Button type="button" onClick={() => setShowAddSection(false)} variant="ghost" className="rounded-xl text-xs h-10 px-4 text-slate-400">Cancel</Button>
                  </div>
                </form>
              </Card>
            )}

            {/* Syllabus Sections Accordion */}
            <div className="space-y-4">
              {course.sections.map((s: any, sIdx: number) => {
                const isExpanded = expandedSectionId === s.id;
                return (
                  <div key={s.id} className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-md">
                    <div className="px-5 py-4 flex items-center justify-between gap-4 bg-white/[0.02] border-b border-white/5">
                      <div className="flex items-center gap-3">
                        <button onClick={() => setExpandedSectionId(isExpanded ? null : s.id)} className="h-7 w-7 rounded bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white transition">
                          <ChevronRight className={`h-4 w-4 transition-transform duration-200 ${isExpanded ? "rotate-90 text-indigo-400" : ""}`} />
                        </button>
                        <div>
                          <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Section {sIdx + 1}</span>
                          <h3 className="text-sm font-bold text-white mt-0.5">{s.title}</h3>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button onClick={() => setShowAddContentSectionId(s.id)} variant="outline" className="border-indigo-500/20 text-indigo-300 bg-indigo-500/5 hover:bg-indigo-600 hover:text-white rounded-xl text-xs h-9 px-3">
                          <Plus className="mr-1 h-3.5 w-3.5" /> Content
                        </Button>
                        <Button onClick={() => handleDeleteSection(s.id)} variant="ghost" className="h-9 w-9 rounded-xl text-rose-400 hover:text-rose-350 hover:bg-rose-500/10 p-0">
                          <Trash2 className="h-4.5 w-4.5" />
                        </Button>
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="p-4 space-y-3 bg-black/20">
                        {/* Add Content Panel inside selected section */}
                        {showAddContentSectionId === s.id && (
                          <div className="bg-white/[0.03] border border-white/5 rounded-xl p-4 space-y-4 mb-4">
                            {!contentType ? (
                              <div className="space-y-3">
                                <p className="text-xs font-bold text-slate-300 uppercase tracking-wider">Select Content Type</p>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                  <button type="button" onClick={() => setContentType("VIDEO")} className="flex flex-col items-center justify-center p-3 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-indigo-400 transition text-xs font-bold uppercase tracking-wider gap-2">
                                    <Video className="h-5 w-5" /> Video Lesson
                                  </button>
                                  <button type="button" onClick={() => setContentType("ARTICLE")} className="flex flex-col items-center justify-center p-3 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-emerald-400 transition text-xs font-bold uppercase tracking-wider gap-2">
                                    <FileText className="h-5 w-5" /> PDF Playbook
                                  </button>
                                  <button type="button" onClick={() => setContentType("QUIZ")} className="flex flex-col items-center justify-center p-3 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-amber-400 transition text-xs font-bold uppercase tracking-wider gap-2">
                                    <HelpCircle className="h-5 w-5" /> Quiz Lesson
                                  </button>
                                  <button type="button" onClick={() => setContentType("LIVE")} className="flex flex-col items-center justify-center p-3 rounded-lg border border-white/10 bg-[#e11d48]/5 hover:bg-[#e11d48]/10 text-[#e11d48] border-[#e11d48]/20 transition text-xs font-bold uppercase tracking-wider gap-2">
                                    <Radio className="h-5 w-5 text-rose-400 animate-pulse" /> Live Stream
                                  </button>
                                </div>
                                <Button type="button" onClick={() => setShowAddContentSectionId(null)} variant="ghost" className="text-slate-400 text-xs mt-2 rounded-lg">Cancel</Button>
                              </div>
                            ) : (
                              <form onSubmit={(e) => handleCreateLesson(e, s.id)} className="space-y-4">
                                <div className="flex items-center justify-between pb-2 border-b border-white/5">
                                  <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                                    {contentType === "VIDEO" && <Video className="h-4 w-4 text-indigo-400" />}
                                    {contentType === "ARTICLE" && <FileText className="h-4 w-4 text-emerald-400" />}
                                    {contentType === "QUIZ" && <HelpCircle className="h-4 w-4 text-amber-400" />}
                                    {contentType === "LIVE" && <Radio className="h-4 w-4 text-rose-400 animate-pulse" />}
                                    Add {contentType} Content
                                  </h4>
                                  <Button type="button" onClick={() => setContentType(null)} variant="ghost" className="text-slate-400 text-[10px] uppercase font-bold p-1 h-6">Change Type</Button>
                                </div>

                                <div className="space-y-3">
                                  <Input value={newContentTitle} onChange={(e) => setNewContentTitle(e.target.value)} placeholder="Lesson Title" className="bg-white/5 border-white/10 text-white" required />
                                  <Input value={newContentDesc} onChange={(e) => setNewContentDesc(e.target.value)} placeholder="Description (Optional)" className="bg-white/5 border-white/10 text-white" />
                                  
                                  {(contentType === "VIDEO" || contentType === "LIVE") && (
                                    <Input value={youtubeVideoId} onChange={(e) => setYoutubeVideoId(e.target.value)} placeholder="YouTube URL (e.g. https://youtube.com/watch?v=xxxxx)" className="bg-white/5 border-white/10 text-white" required />
                                  )}

                                  {contentType === "LIVE" && (
                                    <div className="space-y-2 text-left">
                                      <label className="text-xs font-bold uppercase tracking-wider text-slate-300">Scheduled Date & Time (IST)</label>
                                      <Input type="datetime-local" value={liveScheduledAt} onChange={(e) => setLiveScheduledAt(e.target.value)} className="bg-[#0a0f24] border-white/10 text-white" required />
                                    </div>
                                  )}
                                  
                                  {contentType === "ARTICLE" && (
                                    <div className="space-y-2">
                                      <div className="flex items-center gap-2">
                                        <input 
                                          type="file" 
                                          accept="application/pdf"
                                          onChange={async (e) => {
                                            const file = e.target.files?.[0];
                                            if (!file) return;
                                            const formData = new FormData();
                                            formData.append("pdf", file);
                                            
                                            const label = document.getElementById("pdf-upload-label");
                                            if (label) label.innerText = "Uploading PDF...";
                                            
                                            try {
                                              const res = await fetch("/api/courses/upload-pdf", {
                                                method: "POST",
                                                body: formData
                                              });
                                              const data = await res.json();
                                              if (data.pdfUrl) {
                                                setPdfUrl(data.pdfUrl);
                                                if (label) label.innerText = "PDF Uploaded successfully!";
                                              } else {
                                                alert(data.error || "Upload failed.");
                                                if (label) label.innerText = "Upload failed.";
                                              }
                                            } catch (err) {
                                              alert("Upload failed.");
                                              if (label) label.innerText = "Upload failed.";
                                            }
                                          }}
                                          className="hidden" 
                                          id="pdf-file-upload" 
                                        />
                                        <Button 
                                          type="button" 
                                          variant="outline" 
                                          className="text-xs h-9 border-indigo-500/20 text-indigo-300 bg-indigo-500/5 hover:bg-indigo-600 hover:text-white"
                                          onClick={() => document.getElementById("pdf-file-upload")?.click()}
                                        >
                                          Upload PDF File
                                        </Button>
                                        <span id="pdf-upload-label" className="text-[10px] text-slate-400">Max size 50 MB</span>
                                      </div>
                                    </div>
                                  )}

                                  <div className="flex gap-4 items-center">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Access</span>
                                    <div className="flex gap-2">
                                      <button type="button" onClick={() => setAccessType("PAID")} className={`px-3 py-1 rounded text-xs font-semibold border ${accessType === "PAID" ? "bg-indigo-600/30 border-indigo-500/50 text-indigo-300" : "bg-white/5 border-white/10 text-slate-400"}`}>Paid</button>
                                      <button type="button" onClick={() => setAccessType("FREE")} className={`px-3 py-1 rounded text-xs font-semibold border ${accessType === "FREE" ? "bg-emerald-600/30 border-emerald-500/50 text-emerald-300" : "bg-white/5 border-white/10 text-slate-400"}`}>Free Preview</button>
                                    </div>
                                  </div>
                                </div>

                                <div className="flex gap-2">
                                  <Button type="submit" className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs h-10 px-5">
                                    {contentType === "QUIZ" ? "Add Quiz" : contentType === "VIDEO" ? "Add Video" : contentType === "ARTICLE" ? "Add PDF" : contentType === "LIVE" ? "Add Live Class" : "Add Lesson"}
                                  </Button>
                                  <Button type="button" onClick={() => { setShowAddContentSectionId(null); setContentType(null); }} variant="ghost" className="rounded-xl text-xs h-10 px-5 text-slate-400">Cancel</Button>
                                </div>
                              </form>
                            )}
                          </div>
                        )}

                        {/* List lessons inside this section */}
                        {s.lessons.length > 0 ? (
                          <div className="space-y-2">
                            {s.lessons.map((lesson: any, lIdx: number) => {
                              return (
                                <div key={lesson.id} className="flex items-center justify-between gap-4 bg-white/[0.01] border border-white/5 p-3 rounded-xl hover:bg-white/[0.03] hover:border-white/10 transition-all">
                                  <div className="flex items-center gap-3">
                                    <div className="h-7 w-7 rounded bg-white/5 border border-white/10 flex items-center justify-center text-slate-400">
                                      {lesson.contentType === "QUIZ" ? (
                                        <HelpCircle className="h-4 w-4 text-amber-400" />
                                      ) : lesson.contentType === "ARTICLE" ? (
                                        <FileText className="h-4 w-4 text-emerald-400" />
                                      ) : lesson.contentType === "LIVE" ? (
                                        <Radio className="h-4 w-4 text-rose-400 animate-pulse" />
                                      ) : (
                                        <Video className="h-4 w-4 text-indigo-400" />
                                      )}
                                    </div>
                                    <div>
                                      <span className="text-[10px] font-bold text-slate-500">Lesson {lIdx + 1}</span>
                                      <h4 className="text-xs font-bold text-slate-200 mt-0.5">{lesson.title}</h4>
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-2">
                                    {lesson.contentType === "QUIZ" && (
                                      <Button 
                                        onClick={() => {
                                          const associatedTest = tests.find((t: any) => t.id === lesson.metadata?.testId || t.slug.includes(lesson.slug));
                                          setActiveQuizLesson(lesson);
                                          setActiveQuizTest(associatedTest);
                                        }}
                                        variant="outline"
                                        className="h-8 text-[10px] font-bold uppercase tracking-wider rounded-xl border-indigo-500/20 text-indigo-300 bg-indigo-500/5 hover:bg-indigo-600 hover:text-white"
                                      >
                                        Edit Quiz Assessment
                                      </Button>
                                    )}
                                    {lesson.contentType === "LIVE" && (() => {
                                      if (!lesson.scheduledAt) {
                                        return <Badge variant="outline" className="border-yellow-500/20 text-yellow-400 text-[8px] tracking-wider uppercase font-bold px-1.5 py-0.5">Unscheduled</Badge>;
                                      }
                                      const sched = new Date(lesson.scheduledAt);
                                      const now = new Date();
                                      if (sched > now) {
                                        const formattedTime = sched.toLocaleString("en-US", {
                                          month: "short",
                                          day: "numeric",
                                          hour: "numeric",
                                          minute: "2-digit",
                                          hour12: true
                                        });
                                        return <span className="text-[10px] text-rose-400 font-bold">{formattedTime}</span>;
                                      } else {
                                        return <Badge className="bg-slate-800 text-slate-400 text-[8px] tracking-wider uppercase font-bold px-1.5 py-0.5">Ended</Badge>;
                                      }
                                    })()}
                                    {lesson.isPreview && (
                                      <Badge variant="outline" className="border-emerald-500/20 text-emerald-300 text-[8px] tracking-wider uppercase font-bold px-1.5 py-0.5">Free</Badge>
                                    )}
                                    <Badge variant="outline" className="border-white/10 text-slate-400 text-[8px] tracking-wider uppercase font-bold px-1.5 py-0.5">
                                      {lesson.contentType}
                                    </Badge>
                                    <Button onClick={() => handleDeleteLesson(lesson.id)} variant="ghost" className="h-8 w-8 rounded-lg text-rose-500/80 hover:text-rose-450 hover:bg-rose-500/10 p-0">
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <p className="text-center text-slate-500 py-6 text-xs italic">No content items added in this section yet.</p>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 3: STUDENTS */}
        {activeTab === "students" && (
          <Card className="bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-6">
            <CardHeader className="px-0 pt-0">
              <CardTitle className="text-white text-lg flex items-center gap-2">
                <Users className="h-5 w-5 text-indigo-400" />
                Enrolled Students ({course.enrollments.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="px-0 pb-0">
              {course.enrollments.length > 0 ? (
                <div className="grid gap-3 md:grid-cols-2">
                  {course.enrollments.map((enrollment: any) => (
                    <div key={enrollment.id} className="p-4 rounded-xl border border-white/5 bg-slate-950/40 space-y-2 text-xs">
                      <p className="font-extrabold text-white">{enrollment.user.name || "Student Account"}</p>
                      
                      <div className="flex items-center gap-1.5 text-slate-400 text-[10px]">
                        <Mail className="h-3.5 w-3.5 text-indigo-400" />
                        <span className="truncate">{enrollment.user.email}</span>
                      </div>

                      {enrollment.user.phone && (
                        <div className="flex items-center gap-1.5 text-slate-400 text-[10px]">
                          <Phone className="h-3.5 w-3.5 text-cyan-400" />
                          <span>{enrollment.user.phone}</span>
                        </div>
                      )}

                      <div className="flex items-center justify-between gap-2 border-t border-white/5 pt-2 mt-2">
                        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          Joined {new Date(enrollment.enrolledAt).toLocaleDateString("en-IN", {
                            year: "numeric",
                            month: "short",
                            day: "numeric"
                          })}
                        </span>
                        <span className="bg-emerald-500/10 text-emerald-400 text-[9px] font-extrabold uppercase px-2 py-0.5 rounded">
                          {enrollment.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-12 border border-dashed border-white/10 rounded-2xl text-center text-slate-500 text-xs italic">
                  No student enrollments registered yet.
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* TAB 4: ANALYTICS */}
        {activeTab === "analytics" && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-6">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Enrolled Learners</span>
              <p className="text-3xl font-black text-white mt-2">{course._count.enrollments}</p>
            </Card>
            <Card className="bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-6">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Pricing Structure</span>
              <p className="text-3xl font-black text-white mt-2">₹{priceInRupees.toLocaleString("en-IN")}</p>
            </Card>
            <Card className="bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-6">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Mastery Level</span>
              <p className="text-2xl font-black text-white mt-2 capitalize">{level.toLowerCase().replace('_', ' ')}</p>
            </Card>
            <Card className="bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-6">
              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest flex items-center gap-1.5">
                <Award className="h-4 w-4 text-amber-400" />
                Certificates Issued
              </span>
              <p className="text-3xl font-black text-white mt-2">{certificateCount}</p>
            </Card>
          </div>
        )}

        {/* TAB 5: SETTINGS */}
        {activeTab === "settings" && (
          <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
            <div className="space-y-6">
              {/* Publish state settings */}
              <Card className="bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-6">
                <CardHeader className="px-0 pt-0">
                  <CardTitle className="text-white text-lg flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-indigo-400" />
                    Publish State Control
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-0 pb-0">
                  <form action={toggleStatusAction} className="space-y-4">
                    <input type="hidden" name="courseId" value={course.id} />
                    <select name="status" defaultValue={course.status} className="h-11 w-full rounded-xl border border-white/10 bg-[#0a0f24] px-4 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 mb-2">
                      <option value="DRAFT">Draft</option>
                      <option value="PUBLISHED">Published</option>
                      <option value="ARCHIVED">Archived</option>
                    </select>
                    <Button type="submit" className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs h-11 px-5 font-bold uppercase tracking-wider">
                      Update State status
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Danger Zone */}
              <Card className="bg-white/5 border border-red-500/10 backdrop-blur-md rounded-2xl p-6">
                <CardHeader className="px-0 pt-0">
                  <CardTitle className="text-red-400 text-lg flex items-center gap-2">
                    <ShieldAlert className="h-5 w-5 text-red-400" />
                    Danger Zone
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-0 pb-0">
                  <form action={deleteCourseAction} className="space-y-3">
                    <input type="hidden" name="courseId" value={course.id} />
                    <p className="text-xs text-slate-400 leading-relaxed mb-2">Warning: Deleting this course will permanently destroy all nested modules, section structures, and lessons from the platform database.</p>
                    <Button type="submit" variant="destructive" className="bg-red-500 hover:bg-red-600 text-white rounded-xl h-11 text-xs px-5 font-bold uppercase tracking-wider w-full sm:w-auto">
                      Delete Course Shell
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar assigns */}
            <div className="space-y-6">
              {/* Teacher Assign */}
              <Card className="bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-6">
                <CardHeader className="px-0 pt-0">
                  <CardTitle className="text-white text-lg flex items-center gap-2">
                    <Users className="h-5 w-5 text-indigo-400" />
                    Instructor Assignment
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-0 pb-0 space-y-4">
                  <form action={assignTeacherAction} className="grid gap-3">
                    <input type="hidden" name="courseId" value={course.id} />
                    <select name="teacherEmail" className="h-11 w-full rounded-xl border border-white/10 bg-[#0a0f24] px-4 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 mb-2" required>
                      <option value="">Select teacher...</option>
                      {allTeachers.map((t) => (
                        <option key={t.id} value={t.email}>{t.name ?? t.email} ({t.role.toLowerCase()})</option>
                      ))}
                    </select>
                    <Button type="submit" variant="outline" className="border-indigo-500/20 text-indigo-300 bg-indigo-500/5 hover:bg-indigo-600 hover:text-white rounded-xl text-xs h-11 font-bold uppercase tracking-wider">
                      Assign Instructor
                    </Button>
                  </form>

                  <div className="grid gap-2 pt-2">
                    {course.teachers.map(({ teacher: assignedTeacher }: any) => (
                      <div key={assignedTeacher.id} className="flex items-center justify-between gap-3 rounded-xl border border-white/5 bg-slate-950/40 p-3 text-xs">
                        <div>
                          <p className="font-extrabold text-white">{assignedTeacher.name ?? assignedTeacher.email}</p>
                          <p className="text-[10px] text-slate-500 mt-0.5">{assignedTeacher.email}</p>
                        </div>
                        <form action={removeTeacherAction}>
                          <input type="hidden" name="courseId" value={course.id} />
                          <input type="hidden" name="teacherId" value={assignedTeacher.id} />
                          <Button type="submit" variant="ghost" size="sm" className="text-red-400 hover:text-red-300 hover:bg-red-500/5 rounded-lg text-[10px]">
                            Remove
                          </Button>
                        </form>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>

      {activeQuizLesson && (
        <QuizEditorModal
          courseId={course.id}
          lesson={activeQuizLesson}
          test={activeQuizTest}
          onClose={() => {
            setActiveQuizLesson(null);
            setActiveQuizTest(null);
          }}
          onRefresh={() => {
            window.location.reload();
          }}
        />
      )}

      <CustomPopup
        isOpen={popup.isOpen}
        title={popup.title}
        message={popup.message}
        type={popup.type}
        confirmText={popup.confirmText}
        isError={popup.isError}
        onConfirm={popup.onConfirm}
        onCancel={popup.onCancel}
      />
    </div>
  );
}
