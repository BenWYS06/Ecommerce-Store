import { useState } from "react";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useReviewStore } from "@/stores/useReviewStore";

export default function ReviewForm({ productId }) {
  const { createReview, loading } = useReviewStore();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    const success = await createReview({
      productId,
      rating,
      comment,
      images: [],
    });

    if (success) {
      setRating(0);
      setComment("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="border-b pb-8">
      <p className="mb-3 text-sm font-medium text-gray-900">Write a review</p>

      <div className="flex gap-1">
        {Array.from({ length: 5 }).map((_, index) => {
          const value = index + 1;

          return (
            <button
              key={value}
              type="button"
              onClick={() => setRating(value)}
              className="transition hover:scale-105"
            >
              <Star
                size={20}
                className={
                  value <= rating
                    ? "fill-black text-black"
                    : "fill-gray-200 text-gray-200"
                }
              />
            </button>
          );
        })}
      </div>

      <textarea
        value={comment}
        onChange={(event) => setComment(event.target.value)}
        rows={4}
        placeholder="Share your thoughts about this product"
        className="mt-4 w-full resize-none border px-4 py-3 text-sm outline-none placeholder:text-gray-400 focus:border-black"
      />

      <div className="mt-4 border border-dashed px-4 py-5 text-sm text-gray-400">
        Image upload placeholder
      </div>

      <Button
        type="submit"
        disabled={loading || !rating || !comment.trim()}
        className="mt-5 h-11 rounded-none bg-black px-8 text-xs uppercase text-white hover:bg-gray-800 disabled:bg-gray-300"
      >
        Submit Review
      </Button>
    </form>
  );
}
