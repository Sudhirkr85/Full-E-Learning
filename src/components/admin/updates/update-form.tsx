"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  UpdateLink,
  ImportantDate,
  FAQItem,
  SourceItem,
  UpdatePostData,
  UpdateLinkKind,
} from "@/lib/updates/types";
import { UpdateType, UpdateStatus } from "@prisma/client";
import { Plus, Trash2, ArrowLeft, Loader2, Save } from "lucide-react";

interface UpdateFormProps {
  initialData?: UpdatePostData;
  isEditing?: boolean;
}

export function UpdateForm({ initialData, isEditing = false }: UpdateFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState(initialData?.title || "");
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(isEditing);
  const [summary, setSummary] = useState(initialData?.summary || "");
  const [body, setBody] = useState(initialData?.body || "");
  const [type, setType] = useState<UpdateType>(initialData?.type || "NEWS");
  const [exam, setExam] = useState(initialData?.exam || "NMMS");
  const [state, setState] = useState(initialData?.state || "");
  const [status, setStatus] = useState<UpdateStatus>(initialData?.status || "DRAFT");
  const [showAds, setShowAds] = useState(initialData?.showAds !== false);
  const [seoTitle, setSeoTitle] = useState(initialData?.seoTitle || "");
  const [seoDescription, setSeoDescription] = useState(initialData?.seoDescription || "");

  // Repeatable rows
  const [links, setLinks] = useState<UpdateLink[]>(initialData?.links || []);
  const [importantDates, setImportantDates] = useState<ImportantDate[]>(
    initialData?.importantDates || []
  );
  const [faqs, setFaqs] = useState<FAQItem[]>(initialData?.faqs || []);
  const [sources, setSources] = useState<SourceItem[]>(initialData?.sources || []);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTitle(val);
    if (!slugManuallyEdited && !isEditing) {
      const generated = val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      setSlug(generated);
    }
  };

  // Links management
  const addLink = () => {
    if (links.length >= 20) return;
    setLinks([...links, { label: "", url: "https://", kind: "official" }]);
  };
  const updateLink = (index: number, field: keyof UpdateLink, value: string) => {
    const updated = [...links];
    updated[index] = { ...updated[index], [field]: value };
    setLinks(updated);
  };
  const removeLink = (index: number) => {
    setLinks(links.filter((_, i) => i !== index));
  };

  // Dates management
  const addDate = () => {
    if (importantDates.length >= 20) return;
    setImportantDates([...importantDates, { label: "", value: "" }]);
  };
  const updateDate = (index: number, field: keyof ImportantDate, value: string) => {
    const updated = [...importantDates];
    updated[index] = { ...updated[index], [field]: value };
    setImportantDates(updated);
  };
  const removeDate = (index: number) => {
    setImportantDates(importantDates.filter((_, i) => i !== index));
  };

  // FAQs management
  const addFaq = () => {
    if (faqs.length >= 20) return;
    setFaqs([...faqs, { question: "", answer: "" }]);
  };
  const updateFaq = (index: number, field: keyof FAQItem, value: string) => {
    const updated = [...faqs];
    updated[index] = { ...updated[index], [field]: value };
    setFaqs(updated);
  };
  const removeFaq = (index: number) => {
    setFaqs(faqs.filter((_, i) => i !== index));
  };

  // Sources management
  const addSource = () => {
    if (sources.length >= 20) return;
    setSources([...sources, { label: "", url: "https://" }]);
  };
  const updateSource = (index: number, field: keyof SourceItem, value: string) => {
    const updated = [...sources];
    updated[index] = { ...updated[index], [field]: value };
    setSources(updated);
  };
  const removeSource = (index: number) => {
    setSources(sources.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const payload = {
        title,
        slug,
        summary,
        body,
        type,
        exam,
        state: state.trim() || null,
        status,
        showAds,
        seoTitle: seoTitle.trim() || null,
        seoDescription: seoDescription.trim() || null,
        links: links.filter((l) => l.label.trim() && l.url.trim()),
        importantDates: importantDates.filter((d) => d.label.trim() && d.value.trim()),
        faqs: faqs.filter((f) => f.question.trim() && f.answer.trim()),
        sources: sources.filter((s) => s.label.trim() && s.url.trim()),
      };

      const url = isEditing
        ? `/api/admin/updates/${initialData?.id}`
        : `/api/admin/updates`;
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to save update");
      }

      router.push("/admin/updates");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "An error occurred");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl pb-16">
      <div className="flex items-center justify-between">
        <Link
          href="/admin/updates"
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Updates</span>
        </Link>
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg hover:bg-indigo-500 disabled:opacity-50"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          <span>{isEditing ? "Update Post" : "Create Post"}</span>
        </button>
      </div>

      {error && (
        <div className="rounded-xl border border-red-500/30 bg-red-950/40 p-4 text-sm text-red-300">
          ⚠️ {error}
        </div>
      )}

      {/* Main Details Card */}
      <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-6 space-y-5">
        <h3 className="text-base font-bold text-white border-b border-white/10 pb-3">
          1. Basic Information
        </h3>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">
            Title *
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={handleTitleChange}
            placeholder="e.g. UP NMMS Admit Card 2026-27 (परीक्षा 1 नवंबर 2026): डाउनलोड लिंक और स्टेप्स"
            className="w-full rounded-xl border border-white/10 bg-slate-950 px-3.5 py-2.5 text-sm text-white focus:border-indigo-500 focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Slug (URL Identifier) *
            </label>
            <input
              type="text"
              required
              value={slug}
              onChange={(e) => {
                setSlug(e.target.value.toLowerCase());
                setSlugManuallyEdited(true);
              }}
              placeholder="e.g. up-nmms-admit-card-2026-27"
              className="w-full rounded-xl border border-white/10 bg-slate-950 px-3.5 py-2.5 text-sm text-white focus:border-indigo-500 focus:outline-none"
            />
            <p className="mt-1 text-[11px] text-slate-400">
              Only lowercase letters, numbers, and hyphens.
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Update Type *
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as UpdateType)}
              className="w-full rounded-xl border border-white/10 bg-slate-950 px-3.5 py-2.5 text-sm text-white focus:border-indigo-500 focus:outline-none"
            >
              <option value="ADMIT_CARD">ADMIT_CARD (एडमिट कार्ड)</option>
              <option value="APPLY">APPLY (आवेदन / फॉर्म)</option>
              <option value="RESULT">RESULT (परिणाम / मेरिट लिस्ट)</option>
              <option value="ANSWER_KEY">ANSWER_KEY (उत्तर कुंजी)</option>
              <option value="SYLLABUS">SYLLABUS (पाठ्यक्रम / पैटर्न)</option>
              <option value="GUIDE">GUIDE (मार्गदर्शिका / गाइड)</option>
              <option value="NEWS">NEWS (ताज़ा खबर / नोटिस)</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Exam Name *
            </label>
            <input
              type="text"
              required
              value={exam}
              onChange={(e) => setExam(e.target.value)}
              placeholder="e.g. NMMS"
              className="w-full rounded-xl border border-white/10 bg-slate-950 px-3.5 py-2.5 text-sm text-white focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              State (Optional)
            </label>
            <input
              type="text"
              value={state}
              onChange={(e) => setState(e.target.value)}
              placeholder="e.g. Uttar Pradesh, Bihar, All India"
              className="w-full rounded-xl border border-white/10 bg-slate-950 px-3.5 py-2.5 text-sm text-white focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Status *
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as UpdateStatus)}
              className="w-full rounded-xl border border-white/10 bg-slate-950 px-3.5 py-2.5 text-sm text-white focus:border-indigo-500 focus:outline-none"
            >
              <option value="DRAFT">DRAFT (ड्राफ्ट - अप्रकाशित)</option>
              <option value="PUBLISHED">PUBLISHED (प्रकाशित)</option>
              <option value="EXPIRED">EXPIRED (एक्सपायर्ड - पुराना अपडेट)</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">
            Summary / Excerpt (Short description for card & meta) *
          </label>
          <textarea
            required
            rows={2}
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            placeholder="e.g. उत्तर प्रदेश NMMS 2026-27 परीक्षा का एडमिट कार्ड जारी कर दिया गया है। छात्र अपना प्रवेश पत्र डाउनलोड कर सकते हैं।"
            className="w-full rounded-xl border border-white/10 bg-slate-950 px-3.5 py-2 text-sm text-white focus:border-indigo-500 focus:outline-none"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-xs font-semibold text-slate-300">
              Article Body *
            </label>
            <span className="text-[11px] text-slate-400">
              Supports: <code>## Heading</code>, <code>- Bullet</code>, <code>**Bold**</code>
            </span>
          </div>
          <textarea
            required
            rows={12}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="## मुख्य जानकारी&#10;परीक्षा 1 नवंबर 2026 को आयोजित होगी।&#10;&#10;## आवश्यक निर्देश&#10;- समय से 30 मिनट पहले पहुंचें&#10;- एडमिट कार्ड की प्रिंट प्रति लाएं"
            className="w-full font-mono rounded-xl border border-white/10 bg-slate-950 px-3.5 py-2.5 text-sm text-slate-200 focus:border-indigo-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 pt-2">
          <input
            type="checkbox"
            id="showAdsCheck"
            checked={showAds}
            onChange={(e) => setShowAds(e.target.checked)}
            className="h-4 w-4 rounded border-white/20 bg-slate-950 text-indigo-600 focus:ring-indigo-500"
          />
          <label htmlFor="showAdsCheck" className="text-xs text-slate-300 cursor-pointer">
            Show in-article policy-compliant AdSlots on this page (Active only when approved)
          </label>
        </div>
      </div>

      {/* Official Links Card */}
      <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div>
            <h3 className="text-base font-bold text-white">2. Official Links</h3>
            <p className="text-xs text-slate-400">
              High-visibility action buttons (max 20). URLs must start with https://
            </p>
          </div>
          <button
            type="button"
            onClick={addLink}
            disabled={links.length >= 20}
            className="inline-flex items-center gap-1 rounded-lg border border-white/15 bg-white/5 px-2.5 py-1 text-xs font-semibold text-slate-200 hover:bg-white/10 disabled:opacity-40"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add Link</span>
          </button>
        </div>

        {links.length === 0 ? (
          <p className="text-xs text-slate-500 italic">No links added yet.</p>
        ) : (
          <div className="space-y-3">
            {links.map((link, idx) => (
              <div
                key={idx}
                className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-center rounded-xl bg-slate-950/60 border border-white/5 p-3"
              >
                <div className="sm:col-span-4">
                  <input
                    type="text"
                    required
                    placeholder="Label (e.g. Official Portal)"
                    value={link.label}
                    onChange={(e) => updateLink(idx, "label", e.target.value)}
                    className="w-full rounded-lg border border-white/10 bg-slate-950 px-2.5 py-1.5 text-xs text-white"
                  />
                </div>
                <div className="sm:col-span-5">
                  <input
                    type="text"
                    required
                    placeholder="https://..."
                    value={link.url}
                    onChange={(e) => updateLink(idx, "url", e.target.value)}
                    className="w-full rounded-lg border border-white/10 bg-slate-950 px-2.5 py-1.5 text-xs text-white"
                  />
                </div>
                <div className="sm:col-span-2">
                  <select
                    value={link.kind}
                    onChange={(e) =>
                      updateLink(idx, "kind", e.target.value as UpdateLinkKind)
                    }
                    className="w-full rounded-lg border border-white/10 bg-slate-950 px-2 py-1.5 text-xs text-white"
                  >
                    <option value="official">official</option>
                    <option value="apply">apply</option>
                    <option value="download">download</option>
                    <option value="notification">notification</option>
                    <option value="other">other</option>
                  </select>
                </div>
                <div className="sm:col-span-1 flex justify-end">
                  <button
                    type="button"
                    onClick={() => removeLink(idx)}
                    className="p-1 text-red-400 hover:text-red-300"
                    title="Remove link"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Important Dates Card */}
      <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div>
            <h3 className="text-base font-bold text-white">3. Important Dates</h3>
            <p className="text-xs text-slate-400">
              Exam schedule, release dates, deadlines (max 20).
            </p>
          </div>
          <button
            type="button"
            onClick={addDate}
            disabled={importantDates.length >= 20}
            className="inline-flex items-center gap-1 rounded-lg border border-white/15 bg-white/5 px-2.5 py-1 text-xs font-semibold text-slate-200 hover:bg-white/10 disabled:opacity-40"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add Date</span>
          </button>
        </div>

        {importantDates.length === 0 ? (
          <p className="text-xs text-slate-500 italic">No dates added yet.</p>
        ) : (
          <div className="space-y-3">
            {importantDates.map((item, idx) => (
              <div
                key={idx}
                className="grid grid-cols-1 sm:grid-cols-11 gap-2 items-center rounded-xl bg-slate-950/60 border border-white/5 p-3"
              >
                <div className="sm:col-span-5">
                  <input
                    type="text"
                    required
                    placeholder="Event / Label (e.g. परीक्षा तिथि)"
                    value={item.label}
                    onChange={(e) => updateDate(idx, "label", e.target.value)}
                    className="w-full rounded-lg border border-white/10 bg-slate-950 px-2.5 py-1.5 text-xs text-white"
                  />
                </div>
                <div className="sm:col-span-5">
                  <input
                    type="text"
                    required
                    placeholder="Date / Value (e.g. 1 नवंबर 2026)"
                    value={item.value}
                    onChange={(e) => updateDate(idx, "value", e.target.value)}
                    className="w-full rounded-lg border border-white/10 bg-slate-950 px-2.5 py-1.5 text-xs text-white"
                  />
                </div>
                <div className="sm:col-span-1 flex justify-end">
                  <button
                    type="button"
                    onClick={() => removeDate(idx)}
                    className="p-1 text-red-400 hover:text-red-300"
                    title="Remove date"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* FAQs Card */}
      <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div>
            <h3 className="text-base font-bold text-white">4. Frequently Asked Questions</h3>
            <p className="text-xs text-slate-400">
              Clear Q&A for students and FAQPage schema (max 20).
            </p>
          </div>
          <button
            type="button"
            onClick={addFaq}
            disabled={faqs.length >= 20}
            className="inline-flex items-center gap-1 rounded-lg border border-white/15 bg-white/5 px-2.5 py-1 text-xs font-semibold text-slate-200 hover:bg-white/10 disabled:opacity-40"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add FAQ</span>
          </button>
        </div>

        {faqs.length === 0 ? (
          <p className="text-xs text-slate-500 italic">No FAQs added yet.</p>
        ) : (
          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="space-y-2 rounded-xl bg-slate-950/60 border border-white/5 p-4"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-indigo-400">
                    Question #{idx + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeFaq(idx)}
                    className="p-1 text-red-400 hover:text-red-300"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <input
                  type="text"
                  required
                  placeholder="Question text"
                  value={faq.question}
                  onChange={(e) => updateFaq(idx, "question", e.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-slate-950 px-3 py-1.5 text-xs text-white"
                />
                <textarea
                  required
                  rows={2}
                  placeholder="Answer text"
                  value={faq.answer}
                  onChange={(e) => updateFaq(idx, "answer", e.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-slate-950 px-3 py-1.5 text-xs text-slate-200"
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Sources Card */}
      <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div>
            <h3 className="text-base font-bold text-white">5. Official Sources & References</h3>
            <p className="text-xs text-slate-400">
              Citations and source portal URLs (max 20).
            </p>
          </div>
          <button
            type="button"
            onClick={addSource}
            disabled={sources.length >= 20}
            className="inline-flex items-center gap-1 rounded-lg border border-white/15 bg-white/5 px-2.5 py-1 text-xs font-semibold text-slate-200 hover:bg-white/10 disabled:opacity-40"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add Source</span>
          </button>
        </div>

        {sources.length === 0 ? (
          <p className="text-xs text-slate-500 italic">No sources added yet.</p>
        ) : (
          <div className="space-y-3">
            {sources.map((src, idx) => (
              <div
                key={idx}
                className="grid grid-cols-1 sm:grid-cols-11 gap-2 items-center rounded-xl bg-slate-950/60 border border-white/5 p-3"
              >
                <div className="sm:col-span-5">
                  <input
                    type="text"
                    required
                    placeholder="Source Label (e.g. Careers360 / entdata.co.in)"
                    value={src.label}
                    onChange={(e) => updateSource(idx, "label", e.target.value)}
                    className="w-full rounded-lg border border-white/10 bg-slate-950 px-2.5 py-1.5 text-xs text-white"
                  />
                </div>
                <div className="sm:col-span-5">
                  <input
                    type="text"
                    required
                    placeholder="https://..."
                    value={src.url}
                    onChange={(e) => updateSource(idx, "url", e.target.value)}
                    className="w-full rounded-lg border border-white/10 bg-slate-950 px-2.5 py-1.5 text-xs text-white"
                  />
                </div>
                <div className="sm:col-span-1 flex justify-end">
                  <button
                    type="button"
                    onClick={() => removeSource(idx)}
                    className="p-1 text-red-400 hover:text-red-300"
                    title="Remove source"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* SEO Card */}
      <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-6 space-y-4">
        <h3 className="text-base font-bold text-white border-b border-white/10 pb-3">
          6. SEO Overrides (Optional)
        </h3>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">
            SEO Title (falls back to Title if empty)
          </label>
          <input
            type="text"
            value={seoTitle}
            onChange={(e) => setSeoTitle(e.target.value)}
            placeholder="Custom title tag for search engines"
            className="w-full rounded-xl border border-white/10 bg-slate-950 px-3.5 py-2 text-sm text-white focus:border-indigo-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">
            SEO Description (falls back to Summary if empty)
          </label>
          <textarea
            rows={2}
            value={seoDescription}
            onChange={(e) => setSeoDescription(e.target.value)}
            placeholder="Custom meta description for search engines"
            className="w-full rounded-xl border border-white/10 bg-slate-950 px-3.5 py-2 text-sm text-white focus:border-indigo-500 focus:outline-none"
          />
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 pt-4">
        <Link
          href="/admin/updates"
          className="rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm font-semibold text-slate-300 hover:bg-white/10"
        >
          Cancel
        </Link>
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg hover:bg-indigo-500 disabled:opacity-50"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          <span>{isEditing ? "Save Changes" : "Create Update Post"}</span>
        </button>
      </div>
    </form>
  );
}
