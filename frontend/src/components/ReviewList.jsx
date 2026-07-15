import ReviewCard from "./ReviewCard";

export default function ReviewList({ reviews, loading, currentUser }) {
  if (loading) {
    return <p className="text-sm text-gray-500">Loading reviews...</p>;
  }

  if (reviews.length === 0) {
    return <p className="text-sm text-gray-500">No reviews yet.</p>;
  }

  return (
    <div className="space-y-6">
      {reviews.map((review) => (
        <ReviewCard
          key={review._id}
          review={review}
          isOwner={currentUser?._id === review.user?._id}
        />
      ))}
    </div>
  );
}
