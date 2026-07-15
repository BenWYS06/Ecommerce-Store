import { Star } from "lucide-react";

export default function ReviewSummary({ rating = 0, numReviews = 0 }) {
  const roundedRating = Number(rating || 0).toFixed(1);
  const fullStars = Math.round(rating || 0);

  return (
    <div className="flex flex-col gap-3 border-b pb-6 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-3xl font-semibold text-gray-900">{roundedRating}</p>
        <p className="mt-1 text-sm text-gray-500">
          Based on {numReviews} {numReviews === 1 ? "review" : "reviews"}
        </p>
      </div>

      <div className="flex items-center gap-1">
        {Array.from({ length: 5 }).map((_, index) => (
          <Star
            key={index}
            size={18}
            className={
              index < fullStars
                ? "fill-black text-black"
                : "fill-gray-200 text-gray-200"
            }
          />
        ))}
      </div>
    </div>
  );
}
