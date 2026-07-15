import { useState } from "react";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useReviewStore } from "@/stores/useReviewStore";

export default function ReviewCard({ review, isOwner }) {
  const { updateReview, deleteReview, loading } = useReviewStore();
  const [isEditing, setIsEditing] = useState(false);
  const [rating, setRating] = useState(review.rating);
  const [comment, setComment] = useState(review.comment);

  const handleUpdate = async () => {
    const success = await updateReview(review._id, { rating, comment });

    if (success) {
      setIsEditing(false);
    }
  };

  return (
    <article className="border-b pb-6 last:border-b-0">
      <div className="flex items-start justify-between gap-4">
        <div className="flex gap-4">
          {review.user?.avatar?.url ? (
            <img
              src={review.user.avatar.url}
              alt={review.user?.name || "User"}
              className="h-11 w-11 rounded-full bg-gray-100 object-cover"
            />
          ) : (
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gray-100 text-sm font-medium text-gray-700">
              {review.user?.name?.charAt(0) || "U"}
            </div>
          )}

          <div>
            <div className="flex flex-wrap items-center gap-3">
              <p className="font-medium text-gray-900">{review.user?.name}</p>

              {review.isVerifiedPurchase && (
                <span className="border px-2 py-0.5 text-xs text-gray-600">
                  Verified Purchase
                </span>
              )}
            </div>

            <p className="mt-1 text-xs text-gray-400">
              {new Date(review.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        {isOwner && (
          <div className="flex gap-3 text-xs">
            <button
              type="button"
              onClick={() => setIsEditing((value) => !value)}
              className="text-gray-600 hover:text-black"
            >
              {isEditing ? "Cancel" : "Edit"}
            </button>

            <button
              type="button"
              onClick={() => deleteReview(review._id)}
              className="text-gray-600 hover:text-black"
            >
              Delete
            </button>
          </div>
        )}
      </div>

      {isEditing ? (
        <div className="mt-4 space-y-4">
          <div className="flex gap-1">
            {Array.from({ length: 5 }).map((_, index) => {
              const value = index + 1;

              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => setRating(value)}
                >
                  <Star
                    size={18}
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
            className="w-full resize-none border px-4 py-3 text-sm outline-none focus:border-black"
          />

          <Button
            type="button"
            disabled={loading}
            onClick={handleUpdate}
            className="h-10 rounded-none bg-black px-6 text-xs uppercase text-white hover:bg-gray-800"
          >
            Save
          </Button>
        </div>
      ) : (
        <>
          <div className="mt-4 flex gap-1">
            {Array.from({ length: 5 }).map((_, index) => (
              <Star
                key={index}
                size={16}
                className={
                  index < review.rating
                    ? "fill-black text-black"
                    : "fill-gray-200 text-gray-200"
                }
              />
            ))}
          </div>

          <p className="mt-3 text-sm leading-6 text-gray-600">
            {review.comment}
          </p>

          {review.images?.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-3">
              {review.images.map((image) => (
                <img
                  key={image}
                  src={image}
                  alt="Review"
                  className="h-20 w-20 border object-cover"
                />
              ))}
            </div>
          )}
        </>
      )}
    </article>
  );
}
