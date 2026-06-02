"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Star, MessageSquarePlus, Loader2, Sparkles, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

interface ReviewWithUser {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: Date;
  user: {
    name: string | null;
  };
}

interface CourseReviewsClientProps {
  courseId: string;
  initialReviews: ReviewWithUser[];
  avgRating: number | null;
  isLoggedIn: boolean;
  isEnrolled: boolean;
  hasReviewed: boolean;
  totalReviewsCount: number;
  initialUserReview?: { rating: number; comment: string | null } | null;
}

export function CourseReviewsClient({
  courseId,
  initialReviews,
  avgRating,
  isLoggedIn,
  isEnrolled,
  hasReviewed,
  totalReviewsCount,
  initialUserReview,
}: CourseReviewsClientProps) {
  const router = useRouter();
  const [reviews, setReviews] = useState<ReviewWithUser[]>(initialReviews);
  const [totalCount, setTotalCount] = useState(totalReviewsCount);
  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(initialUserReview?.rating ?? 5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [comment, setComment] = useState(initialUserReview?.comment ?? "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userReviewed, setUserReviewed] = useState(hasReviewed);
  const [isEditing, setIsEditing] = useState(false);

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const searchParams = new URLSearchParams(window.location.search);
      const urlRating = searchParams.get("rating");
      if (urlRating && isLoggedIn && isEnrolled && !userReviewed) {
        const parsedRating = parseInt(urlRating, 10);
        if (parsedRating >= 1 && parsedRating <= 5) {
          setRating(parsedRating);
          setShowForm(true);
          // Smooth scroll to the course review form
          setTimeout(() => {
            const formElement = document.getElementById("course-review-submission-card");
            if (formElement) {
              formElement.scrollIntoView({ behavior: "smooth", block: "center" });
            }
          }, 150);
        }
      }
    }
  }, [isLoggedIn, isEnrolled, userReviewed]);

  const formatDate = (dateInput: Date | string) => {
    const d = new Date(dateInput);
    return d.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating < 1 || rating > 5) {
      toast.error("Please select a rating between 1 and 5 stars.");
      return;
    }

    setIsSubmitting(true);
    try {
      const method = userReviewed ? "PUT" : "POST";
      const res = await fetch("/api/courses/reviews", {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId, rating, comment }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to save review.");
      }

      if (userReviewed) {
        toast.success("Thank you! Your course review has been updated.");
        // Replace existing review in the local state list
        setReviews((prev) =>
          prev.map((r) => (r.user?.name === data.review.user?.name ? data.review : r))
        );
      } else {
        toast.success("Thank you for your feedback! Course review published.");
        setReviews([data.review, ...reviews]);
        setTotalCount((prev) => prev + 1);
        setUserReviewed(true);
      }
      setShowForm(false);
      setIsEditing(false);
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || "Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (reviews.length === 0 && !isLoggedIn) {
    return null; // Hide completely if no reviews and not logged in
  }

  const currentAvgRating = reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : avgRating || 0;

  return (
    <div className="mt-10 bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8 backdrop-blur-md relative overflow-hidden shadow-2xl">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-violet-500/5 opacity-40 pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8 pb-6 border-b border-white/10 relative z-10">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2.5">
            <Sparkles className="h-5 w-5 text-indigo-400 drop-shadow-[0_0_8px_rgba(129,140,248,0.5)]" />
            Student Reviews & Feedback
          </h2>
          {reviews.length > 0 && (
            <div className="flex items-center gap-3 mt-2">
              <div className="flex items-center gap-1 bg-yellow-500/10 border border-yellow-500/20 px-2 py-0.5 rounded-lg text-yellow-400">
                <span className="text-xs font-bold">★</span>
                <span className="text-xs font-extrabold">{currentAvgRating.toFixed(1)}</span>
              </div>
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    className={
                      star <= Math.round(currentAvgRating)
                        ? "text-yellow-400 text-sm"
                        : "text-slate-700 text-sm"
                    }
                  >
                    ★
                  </span>
                ))}
              </div>
              <span className="text-slate-400 text-xs font-medium">
                ({totalCount} {totalCount === 1 ? "review" : "reviews"})
              </span>
            </div>
          )}
        </div>

        {/* Write / Edit Review Button */}
        {isLoggedIn && isEnrolled && !showForm && (
          userReviewed ? (
            <Button
              onClick={() => {
                setShowForm(true);
                setIsEditing(true);
              }}
              variant="outline"
              className="bg-indigo-600/10 border-indigo-500/30 text-indigo-300 hover:bg-indigo-600 hover:text-white rounded-xl h-11 text-xs px-5 font-bold uppercase tracking-wider transition-all duration-200 animate-pulse"
            >
              <MessageSquarePlus className="mr-2 h-4 w-4" />
              Edit Your Review
            </Button>
          ) : (
            <Button
              onClick={() => {
                setShowForm(true);
                setIsEditing(false);
              }}
              variant="outline"
              className="bg-indigo-600/10 border-indigo-500/30 text-indigo-300 hover:bg-indigo-600 hover:text-white rounded-xl h-11 text-xs px-5 font-bold uppercase tracking-wider transition-all duration-200"
            >
              <MessageSquarePlus className="mr-2 h-4 w-4" />
              Write a Review
            </Button>
          )
        )}
      </div>

      {/* Review Submission Form */}
      {showForm && (
        <Card id="course-review-submission-card" className="bg-[#090d20]/80 border border-indigo-500/20 rounded-2xl mb-8 overflow-hidden relative z-10 shadow-[0_0_30px_rgba(99,102,241,0.05)]">
          <CardContent className="p-5 sm:p-6 space-y-5">
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-indigo-400 shadow-[0_0_8px_#818cf8]" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Share Your Learning Experience</h3>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Star Selector */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Rate this Course
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(null)}
                      className="focus:outline-none transition-all duration-150 hover:scale-125"
                    >
                      <Star
                        className={`h-7 w-7 ${
                          star <= (hoverRating ?? rating)
                            ? "fill-yellow-400 text-yellow-400 drop-shadow-[0_0_6px_rgba(250,204,21,0.4)]"
                            : "text-slate-600"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Comment Input */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Detailed Feedback
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Tell future students about the course structure, curriculum depth, value of hands-on code examples, etc. (Max 500 chars)"
                  maxLength={500}
                  rows={4}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200 placeholder-slate-500 outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 transition-all duration-200 leading-relaxed"
                />
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-2">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setShowForm(false)}
                  className="rounded-xl text-slate-400 hover:text-white hover:bg-white/5 h-11 text-xs px-5 font-bold uppercase tracking-wider"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl h-11 text-xs px-6 font-bold uppercase tracking-wider shadow-[0_0_20px_rgba(99,102,241,0.2)] hover:shadow-[0_0_25px_rgba(99,102,241,0.3)] transition-all duration-200"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Publishing...
                    </>
                  ) : (
                    "Publish Review"
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Review list */}
      <div className="relative z-10">
        {reviews.length > 0 ? (
          <div className="space-y-6">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="bg-white/[0.02] border border-white/5 rounded-2xl p-5 hover:border-white/10 hover:bg-white/[0.04] transition-all duration-300"
              >
                <div className="flex items-center justify-between gap-4 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                      <User className="h-4 w-4" />
                    </div>
                    <div>
                      <span className="text-sm font-bold text-slate-200 block">
                        {review.user?.name || "Verified Learner"}
                      </span>
                      <span className="text-[10px] text-slate-500 font-semibold block mt-0.5">
                        {formatDate(review.createdAt)}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 bg-yellow-500/5 border border-yellow-500/10 px-2.5 py-1 rounded-lg">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span
                        key={star}
                        className={
                          star <= review.rating ? "text-yellow-400 text-xs" : "text-slate-700 text-xs"
                        }
                      >
                        ★
                      </span>
                    ))}
                  </div>
                </div>
                {review.comment ? (
                  <p className="text-sm text-slate-300 leading-relaxed font-medium pl-1">
                    {review.comment}
                  </p>
                ) : (
                  <p className="text-xs text-slate-500 italic pl-1">
                    Rated course {review.rating} out of 5 stars with no written feedback.
                  </p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="py-12 text-center flex flex-col items-center justify-center border border-dashed border-white/10 rounded-2xl bg-white/[0.01] p-6">
            <div className="h-12 w-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 mb-3 shadow-[0_0_15px_rgba(255,255,255,0.02)]">
              <MessageSquarePlus className="h-6 w-6 text-indigo-400" />
            </div>
            <p className="text-slate-300 font-bold mb-1 text-sm tracking-wide">No feedback published yet</p>
            <p className="text-xs text-slate-500 max-w-sm leading-relaxed">
              Be the first to share your learning experience and help other learners master this topic!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
