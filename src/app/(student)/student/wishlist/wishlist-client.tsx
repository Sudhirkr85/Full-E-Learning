"use client";

import React from "react";
import Link from "next/link";
import { Heart, HeartOff, ArrowRight, Package } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { WishlistButton } from "@/components/wishlist-button";
import { ProductWishlistButton } from "@/components/product-wishlist-button";
import { cn } from "@/lib/utils";

interface WishlistCourse {
  id: string;
  title: string;
  slug: string;
  coverImageUrl: string | null;
  price: number;
  originalPrice: number | null;
  teacherName: string;
  categoryName: string;
}

interface WishlistProduct {
  id: string;
  title: string;
  slug: string;
  coverImageUrl: string | null;
  price: number;
  originalPrice: number | null;
  productType: string;
  shortDescription: string;
}

interface WishlistClientProps {
  courses: WishlistCourse[];
  products: WishlistProduct[];
  userId: string;
}

export function WishlistClient({ courses: initialCourses, products: initialProducts, userId }: WishlistClientProps) {
  const [courses, setCourses] = React.useState<WishlistCourse[]>(initialCourses);
  const [productsList, setProductsList] = React.useState<WishlistProduct[]>(initialProducts);
  const [activeTab, setActiveTab] = React.useState<"courses" | "products">("courses");

  // Sync state if initial props change
  React.useEffect(() => {
    setCourses(initialCourses);
  }, [initialCourses]);

  React.useEffect(() => {
    setProductsList(initialProducts);
  }, [initialProducts]);

  return (
    <div className="space-y-8 text-left">
      {/* Page Header */}
      <div className="relative overflow-hidden rounded-2xl border border-white/5 bg-gradient-to-br from-[#0e081c] to-[#04040a] p-6 shadow-2xl">
        <div className="absolute right-0 top-0 -z-10 h-32 w-32 rounded-full bg-rose-500/10 blur-2xl"></div>
        <div className="absolute left-0 bottom-0 -z-10 h-32 w-32 rounded-full bg-indigo-500/5 blur-2xl"></div>

        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-rose-500/10 flex items-center justify-center text-rose-400 shrink-0">
            <Heart className="h-6 w-6 text-rose-500" />
          </div>
          <div>
            <h1 className="font-display text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              My Wishlist
            </h1>
            <p className="text-xs md:text-sm text-slate-400 mt-1">
              Save your paths, designs, and tools for future study.
            </p>
          </div>
        </div>
      </div>

      {/* Tabs Row */}
      <div className="flex gap-2 border-b border-white/10 pb-3">
        <button
          type="button"
          onClick={() => setActiveTab("courses")}
          className={cn(
            "px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider border transition-all duration-300",
            activeTab === "courses"
              ? "bg-indigo-600 border-indigo-500 text-white shadow-md shadow-indigo-600/10"
              : "bg-white/5 border-white/10 text-slate-400 hover:text-white"
          )}
        >
          Courses ({courses.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("products")}
          className={cn(
            "px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider border transition-all duration-300",
            activeTab === "products"
              ? "bg-indigo-600 border-indigo-500 text-white shadow-md shadow-indigo-600/10"
              : "bg-white/5 border-white/10 text-slate-400 hover:text-white"
          )}
        >
          Store Products ({productsList.length})
        </button>
      </div>

      {activeTab === "courses" ? (
        courses.length === 0 ? (
          /* Empty State for Courses */
          <div className="flex flex-col items-center justify-center py-16 px-4 border border-dashed border-white/10 rounded-2xl bg-white/[0.01] text-center space-y-6">
            <div className="relative">
              <div className="absolute inset-0 h-16 w-16 rounded-full bg-rose-500/10 blur-lg -translate-x-1 -translate-y-1"></div>
              <div className="h-16 w-16 rounded-full border border-white/10 bg-[#0c0816] flex items-center justify-center relative">
                <HeartOff className="h-7 w-7 text-slate-500" />
              </div>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-white">Your course wishlist is empty</h3>
              <p className="text-sm text-slate-400 max-w-sm">
                Browse our premium learning catalog to find courses that will fast-track your tech career outcomes.
              </p>
            </div>

            <Button asChild className="bg-gradient-to-r from-indigo-600 to-cyan-600 text-white font-semibold hover:from-indigo-500 hover:to-cyan-500 rounded-xl px-6 py-5 shadow-lg shadow-indigo-600/15">
              <Link href="/courses">
                Browse Courses
              </Link>
            </Button>
          </div>
        ) : (
          /* Courses Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => {
              const hasDiscount = course.originalPrice !== null && course.originalPrice > course.price && course.price > 0;
              const discountPercent = hasDiscount && course.originalPrice ? Math.round(((course.originalPrice - course.price) / course.originalPrice) * 100) : 0;

              return (
                <div
                  key={course.id}
                  className="group relative overflow-hidden rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md hover:border-white/20 transition-all duration-300 flex flex-col justify-between"
                >
                  <div className="relative h-44 w-full overflow-hidden shrink-0">
                    {course.coverImageUrl ? (
                      <img
                        src={course.coverImageUrl}
                        alt={course.title}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-103"
                      />
                    ) : (
                      <div className="h-full w-full bg-gradient-to-br from-indigo-950 to-slate-900" />
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-transparent pointer-events-none" />

                    <span className="absolute top-3 left-3 rounded-full bg-black/60 border border-white/10 px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-cyan-300">
                      {course.categoryName}
                    </span>

                    <div className="absolute top-3 right-3 z-10">
                      <WishlistButton
                        courseId={course.id}
                        initialWishlisted={true}
                        isLoggedIn={true}
                        size="sm"
                      />
                    </div>
                  </div>

                  <div className="p-4 flex flex-col flex-1 justify-between gap-4">
                    <div className="space-y-1.5 text-left">
                      <h3 className="line-clamp-2 text-sm font-extrabold text-white tracking-tight">
                        {course.title}
                      </h3>
                      <p className="text-xs text-slate-400 font-medium">
                        Instructor: {course.teacherName}
                      </p>
                    </div>

                    <div className="space-y-4">
                      <div className="text-left">
                        {course.price === 0 ? (
                          <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 text-[9px] font-bold uppercase tracking-wider">
                            Free
                          </Badge>
                        ) : hasDiscount && course.originalPrice ? (
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-white">₹{course.price.toLocaleString("en-IN")}</span>
                            <span className="line-through text-slate-500 text-xs">₹{course.originalPrice.toLocaleString("en-IN")}</span>
                            <span className="rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 text-[9px] font-bold text-emerald-300 uppercase tracking-wide">
                              {discountPercent}% OFF
                            </span>
                          </div>
                        ) : (
                          <span className="text-sm font-bold text-white">₹{course.price.toLocaleString("en-IN")}</span>
                        )}
                      </div>

                      <Button asChild className="w-full bg-gradient-to-r from-indigo-600 to-cyan-600 text-white font-bold text-xs uppercase tracking-wider rounded-xl py-5 group shadow-md shadow-indigo-600/10">
                        <Link href={`/courses/${course.slug}`} className="flex items-center justify-center gap-1">
                          Enroll Now
                          <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )
      ) : (
        productsList.length === 0 ? (
          /* Empty State for Products */
          <div className="flex flex-col items-center justify-center py-16 px-4 border border-dashed border-white/10 rounded-2xl bg-white/[0.01] text-center space-y-6">
            <div className="relative">
              <div className="absolute inset-0 h-16 w-16 rounded-full bg-rose-500/10 blur-lg -translate-x-1 -translate-y-1"></div>
              <div className="h-16 w-16 rounded-full border border-white/10 bg-[#0c0816] flex items-center justify-center relative">
                <HeartOff className="h-7 w-7 text-slate-500" />
              </div>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-white">Your product wishlist is empty</h3>
              <p className="text-sm text-slate-400 max-w-sm">
                Explore our store catalog to find system design playbooks, Tailwind kits, and educational vouchers.
              </p>
            </div>

            <Button asChild className="bg-gradient-to-r from-indigo-600 to-cyan-600 text-white font-semibold hover:from-indigo-500 hover:to-cyan-500 rounded-xl px-6 py-5 shadow-lg shadow-indigo-600/15">
              <Link href="/store">
                Browse Store
              </Link>
            </Button>
          </div>
        ) : (
          /* Products Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {productsList.map((product) => {
              const hasDiscount = product.originalPrice !== null && product.originalPrice > product.price && product.price > 0;
              const discountPercent = hasDiscount && product.originalPrice ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;

              return (
                <div
                  key={product.id}
                  className="group relative overflow-hidden rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md hover:border-white/20 transition-all duration-300 flex flex-col justify-between"
                >
                  <div className="relative h-44 w-full overflow-hidden shrink-0">
                    {product.coverImageUrl ? (
                      <img
                        src={product.coverImageUrl}
                        alt={product.title}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-103"
                      />
                    ) : (
                      <div className="h-full w-full bg-gradient-to-br from-indigo-950 to-slate-900 flex items-center justify-center">
                        <Package className="h-10 w-10 text-slate-500" />
                      </div>
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-transparent pointer-events-none" />

                    <span className="absolute top-3 left-3 rounded-full bg-black/60 border border-white/10 px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-amber-300">
                      {product.productType.replace("_", " ")}
                    </span>

                    <div className="absolute top-3 right-3 z-10">
                      <ProductWishlistButton
                        productId={product.id}
                        initialWishlisted={true}
                        isLoggedIn={true}
                        size="sm"
                      />
                    </div>
                  </div>

                  <div className="p-4 flex flex-col flex-1 justify-between gap-4">
                    <div className="space-y-1.5 text-left">
                      <h3 className="line-clamp-2 text-sm font-extrabold text-white tracking-tight">
                        {product.title}
                      </h3>
                      <p className="text-xs text-slate-400 font-medium line-clamp-2">
                        {product.shortDescription || "Unlock premium architecture designs and tools."}
                      </p>
                    </div>

                    <div className="space-y-4">
                      <div className="text-left">
                        {product.price === 0 ? (
                          <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 text-[9px] font-bold uppercase tracking-wider">
                            Free
                          </Badge>
                        ) : hasDiscount && product.originalPrice ? (
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-white">₹{product.price.toLocaleString("en-IN")}</span>
                            <span className="line-through text-slate-500 text-xs">₹{product.originalPrice.toLocaleString("en-IN")}</span>
                            <span className="rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 text-[9px] font-bold text-emerald-300 uppercase tracking-wide">
                              {discountPercent}% OFF
                            </span>
                          </div>
                        ) : (
                          <span className="text-sm font-bold text-white">₹{product.price.toLocaleString("en-IN")}</span>
                        )}
                      </div>

                      <Button asChild className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl py-5 group shadow-md shadow-amber-600/10">
                        <Link href={`/store/${product.slug}`} className="flex items-center justify-center gap-1">
                          View Details
                          <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )
      )}
    </div>
  );
}
