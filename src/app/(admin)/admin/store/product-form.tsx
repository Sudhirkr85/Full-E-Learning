"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Loader2, ArrowLeft, Image as ImageIcon, Upload, Trash2 } from "lucide-react";
import Link from "next/link";
import { ProductType, ProductStatus } from "@prisma/client";
import { createProductAction, updateProductAction } from "./actions";

type ProductFormProps = {
  initialProduct?: any;
  courses: { id: string; title: string }[];
  digitalProducts: { id: string; title: string }[];
};

export function ProductForm({ initialProduct, courses, digitalProducts }: ProductFormProps) {
  const router = useRouter();
  const isEdit = !!initialProduct;

  // Form states
  const [title, setTitle] = useState(initialProduct?.title || "");
  const [productType, setProductType] = useState<ProductType>(
    initialProduct?.productType === "PHYSICAL" ? "PHYSICAL" : "DIGITAL_RESOURCE"
  );
  const [shortDescription, setShortDescription] = useState(initialProduct?.shortDescription || "");
  const [fullDescription, setFullDescription] = useState(initialProduct?.fullDescription || "");
  const [coverImageUrl, setCoverImageUrl] = useState(initialProduct?.coverImageUrl || "");
  const [priceInRupees, setPriceInRupees] = useState<number | "">(
    initialProduct?.priceCents ? Math.round(initialProduct.priceCents / 100) : ""
  );
  const [status, setStatus] = useState<ProductStatus>(initialProduct?.status || "DRAFT");

  // Conditional states
  const [assetUrl, setAssetUrl] = useState(initialProduct?.assetUrl || "");
  const [stockQuantity, setStockQuantity] = useState<number>(initialProduct?.stockQuantity ?? 10);
  const [shippingRequired, setShippingRequired] = useState<boolean>(initialProduct?.shippingRequired ?? false);
  const [dispatchNotes, setDispatchNotes] = useState(initialProduct?.dispatchNotes || "");

  // Upload/Submit states
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isUploadingPdf, setIsUploadingPdf] = useState(false);
  const [pdfUploadError, setPdfUploadError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const pdfFileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
        throw new Error(data.error || "Failed to upload image.");
      }

      const data = await res.json();
      setCoverImageUrl(data.imageUrl);
    } catch (err: any) {
      setUploadError(err.message || "Something went wrong uploading image.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handlePdfChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      setPdfUploadError("Only PDF documents are allowed.");
      return;
    }

    if (file.size > 50 * 1024 * 1024) {
      setPdfUploadError("Maximum file size is 50 MB.");
      return;
    }

    setIsUploadingPdf(true);
    setPdfUploadError(null);

    try {
      const formData = new FormData();
      formData.append("pdf", file);

      const res = await fetch("/api/courses/upload-pdf", {
        method: "POST",
        body: formData
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to upload PDF.");
      }

      const data = await res.json();
      setAssetUrl(data.pdfUrl);
    } catch (err: any) {
      setPdfUploadError(err.message || "Something went wrong uploading PDF.");
    } finally {
      setIsUploadingPdf(false);
      if (pdfFileInputRef.current) pdfFileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("Product name is required.");
      return;
    }
    if (priceInRupees === "" || priceInRupees === undefined || priceInRupees < 0) {
      setError("Price is required and must be a valid positive number.");
      return;
    }
    if (productType === "DIGITAL_RESOURCE" && !assetUrl) {
      setError("Please upload the PDF book file.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const payload = {
      title,
      productType,
      shortDescription: shortDescription || undefined,
      fullDescription: fullDescription || undefined,
      coverImageUrl: coverImageUrl || undefined,
      priceInRupees: Number(priceInRupees),
      status,
      assetUrl: productType === "DIGITAL_RESOURCE" ? assetUrl : undefined,
      stockQuantity: productType === "PHYSICAL" ? stockQuantity : undefined,
      shippingRequired: productType === "PHYSICAL" ? shippingRequired : undefined,
      dispatchNotes: productType === "PHYSICAL" ? dispatchNotes : undefined,
    };

    try {
      let res;
      if (isEdit) {
        res = await updateProductAction(initialProduct.id, payload);
      } else {
        res = await createProductAction(payload);
      }

      if (res.error) {
        setError(res.error);
      } else {
        router.push("/admin/store");
        router.refresh();
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto py-6">
      {/* Back link */}
      <div>
        <Link
          href="/admin/store"
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition duration-200 mb-4"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Store Catalog
        </Link>
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="font-display text-3xl font-semibold tracking-tight text-white">
              {isEdit ? `Edit Product: ${initialProduct.title}` : "Add New Store Product"}
            </h1>
            <p className="text-sm text-slate-400">
              Provision in-app readable PDF books or physical products.
            </p>
          </div>
          <Badge variant="secondary" className="bg-indigo-500/10 text-indigo-300 border-indigo-500/20">
            Store Management
          </Badge>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-6 md:grid-cols-[1fr_280px] items-start">
          {/* Main fields card */}
          <div className="space-y-6">
          <Card className="bg-[#090d20]/60 border-white/5 backdrop-blur-xl relative overflow-hidden">
            <div className="absolute right-0 top-0 -z-10 h-32 w-32 rounded-full bg-indigo-500/5 blur-2xl"></div>
            <CardHeader>
              <CardTitle className="text-white text-base flex items-center gap-2">
                <Sparkles className="h-4.5 w-4.5 text-indigo-400" />
                Product Details
              </CardTitle>
              <CardDescription className="text-slate-400">
                Core descriptive information about this store catalog entry.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {error && (
                <div className="p-3.5 text-xs font-semibold text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-xl">
                  {error}
                </div>
              )}

              {/* Product Name */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Product Name <span className="text-rose-400">*</span>
                </label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. System Design Playbook"
                  className="bg-white/5 border-white/10 text-white placeholder-slate-500 focus-visible:ring-indigo-500 h-11 text-xs"
                  required
                />
              </div>

              {/* Product Type & Price Row */}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                    Product Type <span className="text-rose-400">*</span>
                  </label>
                  <select
                    value={productType}
                    onChange={(e) => setProductType(e.target.value as ProductType)}
                    className="h-11 w-full rounded-xl border border-white/10 bg-[#0a0f24] px-4 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="DIGITAL_RESOURCE">PDF Book</option>
                    <option value="PHYSICAL">Physical Product</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                    Price (₹) <span className="text-rose-400">*</span>
                  </label>
                  <Input
                    type="number"
                    min="0"
                    step="1"
                    value={priceInRupees}
                    onChange={(e) => setPriceInRupees(e.target.value === "" ? "" : Number(e.target.value))}
                    placeholder="e.g. 499"
                    className="bg-white/5 border-white/10 text-white placeholder-slate-500 focus-visible:ring-indigo-500 h-11 text-xs"
                    required
                  />
                </div>
              </div>

              {/* Short Description */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Short Description
                </label>
                <Input
                  value={shortDescription}
                  onChange={(e) => setShortDescription(e.target.value)}
                  placeholder="A concise, single-sentence catalog snippet"
                  maxLength={150}
                  className="bg-white/5 border-white/10 text-white placeholder-slate-500 focus-visible:ring-indigo-500 h-11 text-xs"
                />
              </div>

              {/* Full Description */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Full Description
                </label>
                <textarea
                  value={fullDescription}
                  onChange={(e) => setFullDescription(e.target.value)}
                  placeholder="Describe your product value proposition in comprehensive detail..."
                  rows={5}
                  className="min-h-32 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-xs text-white outline-none ring-offset-background placeholder:text-slate-500 focus-visible:ring-2 focus-visible:ring-ring"
                />
              </div>

              {/* CONDITIONAL FIELDS */}

              {/* PDF BOOK (DIGITAL_RESOURCE) */}
              {productType === "DIGITAL_RESOURCE" && (
                <div className="p-4 bg-white/[0.02] border border-white/5 rounded-xl space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-300">
                    PDF Document File <span className="text-rose-400">*</span>
                  </h3>

                  <input type="hidden" name="assetUrl" value={assetUrl} />

                  {assetUrl ? (
                    <div className="p-3 bg-indigo-500/5 border border-indigo-500/20 rounded-xl flex items-center justify-between gap-4">
                      <div className="truncate">
                        <p className="text-xs font-semibold text-white truncate">PDF Book Uploaded</p>
                        <p className="text-[10px] text-indigo-300 truncate max-w-md">{assetUrl}</p>
                      </div>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="rounded-xl shrink-0"
                        onClick={() => setAssetUrl("")}
                      >
                        <Trash2 className="mr-1 h-3.5 w-3.5" />
                        Remove
                      </Button>
                    </div>
                  ) : (
                    <div className="flex h-32 flex-col items-center justify-center rounded-xl border border-dashed border-white/10 bg-white/[0.01] text-slate-500">
                      <ImageIcon className="h-6 w-6 mb-1 text-slate-600" />
                      <span className="text-[10px]">No PDF book uploaded yet</span>
                    </div>
                  )}

                  <input
                    ref={pdfFileInputRef}
                    type="file"
                    accept="application/pdf"
                    onChange={handlePdfChange}
                    className="hidden"
                  />

                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => pdfFileInputRef.current?.click()}
                    disabled={isUploadingPdf}
                    className="w-full rounded-xl text-indigo-400 hover:text-white border-indigo-500/20 bg-indigo-500/5 hover:bg-indigo-500/10 h-10 text-xs"
                  >
                    {isUploadingPdf ? <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" /> : <Upload className="mr-2 h-3.5 w-3.5" />}
                    {isUploadingPdf ? "Uploading..." : "Upload PDF Book"}
                  </Button>
                  <p className="text-[9px] text-slate-500 text-center">PDF up to 50 MB.</p>
                  {pdfUploadError ? <p className="text-[10px] font-semibold text-rose-400 text-center">{pdfUploadError}</p> : null}
                </div>
              )}

              {/* PHYSICAL */}
              {productType === "PHYSICAL" && (
                <div className="p-4 bg-white/[0.02] border border-white/5 rounded-xl space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-300">
                    Physical Stock Configuration
                  </h3>
                  
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-slate-300">Stock Quantity</label>
                      <Input
                        type="number"
                        min="0"
                        value={stockQuantity}
                        onChange={(e) => setStockQuantity(Number(e.target.value))}
                        placeholder="100"
                        className="bg-white/5 border-white/10 text-white focus-visible:ring-indigo-500 h-11 text-xs"
                      />
                    </div>

                    <div className="flex items-center gap-2 pt-8">
                      <input
                        type="checkbox"
                        id="shippingRequired"
                        checked={shippingRequired}
                        onChange={(e) => setShippingRequired(e.target.checked)}
                        className="h-4 w-4 rounded border-white/10 bg-white/5 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-0"
                      />
                      <label htmlFor="shippingRequired" className="text-xs font-semibold text-slate-300">
                        Shipping Address Required
                      </label>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-300">Dispatch / Logistics Notes</label>
                    <textarea
                      value={dispatchNotes}
                      onChange={(e) => setDispatchNotes(e.target.value)}
                      placeholder="e.g. Dispatched weekly via BlueDart. Standard delivery is 5-7 business days."
                      rows={2}
                      className="min-h-16 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-xs text-white outline-none placeholder:text-slate-500 focus-visible:ring-2 focus-visible:ring-indigo-500"
                    />
                  </div>
                </div>
              )}

            </CardContent>
          </Card>
        </div>

        {/* Sidebar Image Uploader card */}
        <div className="space-y-6">
          <Card className="bg-[#090d20]/60 border-white/5 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-white text-xs font-bold uppercase tracking-wider">
                Product Image
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <input type="hidden" name="coverImageUrl" value={coverImageUrl} />

              {coverImageUrl ? (
                <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-white/10 bg-white/5 group">
                  <img
                    src={coverImageUrl}
                    alt="Product preview"
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="rounded-xl"
                      onClick={() => setCoverImageUrl("")}
                    >
                      <Trash2 className="mr-1 h-3.5 w-3.5" />
                      Remove
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex aspect-video w-full flex-col items-center justify-center rounded-xl border border-dashed border-white/10 bg-white/[0.01] text-slate-500">
                  <ImageIcon className="h-6 w-6 mb-1 text-slate-600" />
                  <span className="text-[10px]">No image uploaded</span>
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                onChange={handleImageChange}
                className="hidden"
              />
              
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="w-full rounded-xl text-indigo-400 hover:text-white border-indigo-500/20 bg-indigo-500/5 hover:bg-indigo-500/10 h-10 text-xs"
              >
                {isUploading ? <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" /> : <Upload className="mr-2 h-3.5 w-3.5" />}
                {isUploading ? "Uploading..." : "Upload Image"}
              </Button>
              <p className="text-[9px] text-slate-500 text-center">JPEG, PNG, WebP up to 5 MB.</p>
              {uploadError ? <p className="text-[10px] font-semibold text-rose-400 text-center">{uploadError}</p> : null}
            </CardContent>
          </Card>
        </div>
      </div>
        
      {/* Status and Action Buttons at the very bottom */}
      <Card className="bg-[#090d20]/60 border-white/5 backdrop-blur-xl p-5 rounded-2xl shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Status:
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as ProductStatus)}
              className="h-10 rounded-xl border border-white/10 bg-[#0a0f24] px-4 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="DRAFT">Draft</option>
              <option value="PUBLISHED">Published / Active</option>
              <option value="ARCHIVED">Archived</option>
            </select>
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl border border-white/10 shadow-[0_0_15px_rgba(99,102,241,0.25)] h-11 px-8 min-w-[160px]"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : isEdit ? (
              "Save Product"
            ) : (
              "Create Product"
            )}
          </Button>
        </div>
      </Card>
      </form>
    </div>
  );
}
