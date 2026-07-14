import { useEffect } from "react";
import { useReviewStore } from "@/stores/useReviewStore";
import { useUserStore } from "@/stores/useUserStore";
import ReviewForm from "./ReviewForm";
import ReviewList from "./ReviewList";
import ReviewSummary from "./ReviewSummary";

export default function ProductReviews({ product }) {
  const { reviews, loading, fetchReviews } = useReviewStore();
  const { user } = useUserStore();

  useEffect(() => {
    fetchReviews(product._id);
  }, [fetchReviews, product._id]);

  const userReview = user
    ? reviews.find((review) => review.user?._id === user._id)
    : null;

  return (
    <div className="space-y-8">
      <ReviewSummary
        rating={product.rating}
        numReviews={product.numReviews}
      />

      {user && !userReview && <ReviewForm productId={product._id} />}

      {!user && (
        <p className="text-sm text-gray-500">Login to write a review.</p>
      )}

      <ReviewList reviews={reviews} loading={loading} currentUser={user} />
    </div>
  );
}
