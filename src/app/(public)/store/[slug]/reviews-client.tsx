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

interface ReviewsClientProps {
  productId: string;
  initialReviews: ReviewWithUser[];
  avgRating: number | null;
  isLoggedIn: boolean;
  hasPurchased: boolean;
  hasReviewed: boolean;
}

export function ReviewsClient({
  productId,
  initialReviews,
  avgRating,
  isLoggedIn,
  hasPurchased,
  hasReviewed,
}: ReviewsClientProps) {
  const router = useRouter();
  const [reviews, setReviews] = useState<ReviewWithUser[]>(initialReviews);
  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userReviewed, setUserReviewed] = useState(hasReviewed);

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
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, rating, comment }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to submit review.");
      }

      toast.success("Thank you for your feedback! Review published.");
      setReviews([data.review, ...reviews]);
      setUserReviewed(true);
      setShowForm(false);
      setComment("");
      setRating(5);
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

  // Calculate dynamic average rating based on local state (just in case they add one)
  const currentAvgRating = reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : avgRating || 0;

  return (
    <div className="mt-8 bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-6 backdrop-blur-md">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-yellow-400" />
            Customer Reviews
          </h2>
          {reviews.length > 0 && (
            <div className="flex items-center gap-2 mt-1">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    className={
                      star <= Math.round(currentAvgRating)
                        ? "text-yellow-400 text-sm"
                        : "text-slate-600 text-sm"
                    }
                  >
                    ★
                  </span>
                ))}
              </div>
              <span className="text-white font-semibold text-sm">
                {currentAvgRating.toFixed(1)}
              </span>
              <span className="text-slate-400 text-xs">
                ({reviews.length} {reviews.length === 1 ? "review" : "reviews"})
              </span>
            </div>
          )}
        </div>

        {/* Write a Review Button */}
        {isLoggedIn && hasPurchased && !userReviewed && !showForm && (
          <Button
            onClick={() => setShowForm(true)}
            variant="outline"
            className="border-white/10 text-slate-300 hover:bg-white/10 hover:text-white rounded-xl h-11 text-xs px-4"
          >
            <MessageSquarePlus className="mr-1.5 h-4 w-4" />
            Write a Review
          </Button>
        )}
      </div>

      {/* Review Submission Form */}
      {showForm && (
        <Card className="bg-white/5 border border-white/10 rounded-xl mb-6 overflow-hidden">
          <CardContent className="p-4 sm:p-5 space-y-4">
            <h3 className="text-sm font-semibold text-white">Share Your Feedback</h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Star Selector */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Your Rating
                </label>
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(null)}
                      className="focus:outline-none transition-transform hover:scale-110"
                    >
                      <Star
                        className={`h-7 w-7 ${
                          star <= (hoverRating ?? rating)
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-slate-500"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Comment Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Comment
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="What did you like or dislike about this product? (Max 500 characters)"
                  maxLength={500}
                  rows={3}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-slate-500 outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setShowForm(false)}
                  className="rounded-xl text-slate-400 hover:text-white hover:bg-white/5 h-11 text-xs px-4"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl h-11 text-xs px-6 font-semibold"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                      Submitting...
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
      {reviews.length > 0 ? (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="border-t border-white/5 pt-4 first:border-0 first:pt-0"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-semibold text-white flex items-center gap-1.5">
                  <span className="h-6 w-6 rounded-full bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20 text-indigo-400 text-[10px]">
                    <User className="h-3 w-3" />
                  </span>
                  {review.user?.name || "Verified Buyer"}
                </span>
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      className={
                        star <= review.rating ? "text-yellow-400 text-xs" : "text-slate-600 text-xs"
                      }
                    >
                      ★
                    </span>
                  ))}
                </div>
              </div>
              {review.comment && (
                <p className="text-sm text-slate-300 leading-relaxed pl-7">
                  {review.comment}
                </p>
              )}
              <p className="text-[10px] text-slate-500 mt-1 pl-7">
                {formatDate(review.createdAt)}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-6 text-center text-slate-500 text-sm">
          No reviews yet. Be the first to leave feedback!
        </div>
      )}
    </div>
  );
}
