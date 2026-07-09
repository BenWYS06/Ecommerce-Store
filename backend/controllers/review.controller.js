import Order from "../models/order.model.js";
import Product from "../models/product.model.js";
import Review from "../models/review.model.js";

const recalculateProductRating = async (productId) => {
  const reviews = await Review.find({ product: productId });

  const numReviews = reviews.length;
  const rating =
    numReviews === 0
      ? 0
      : reviews.reduce((total, review) => total + review.rating, 0) /
        numReviews;

  const product = await Product.findByIdAndUpdate(
    productId,
    {
      rating: Number(rating.toFixed(1)),
      numReviews,
    },
    { new: true }, // if don't have it will return old product
  );

  return product;
};

const checkVerifiedPurchase = async (userId, productId) => {
  const order = await Order.findOne({
    user: userId,
    paymentStatus: "Paid",
    "products.product": productId,
  });

  return Boolean(order);
};

export const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;

    const reviews = await Review.find({ product: productId })
      .select("rating comment images isVerifiedPurchase createdAt user")
      .populate("user", "name avatar")
      .sort({ createdAt: -1 });

    res.status(200).json(reviews);
  } catch (error) {
    console.log("Error in getProductReviews controller", error.message);
    res.status(500).json({ message: "Failed to fetch reviews" });
  }
};

export const createReview = async (req, res) => {
  try {
    const { productId, rating, comment, images = [] } = req.body;

    if (!productId) {
      return res.status(400).json({ message: "Product is required" });
    }

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Rating is required" });
    }

    if (!comment?.trim()) {
      return res.status(400).json({ message: "Comment is required" });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const existingReview = await Review.findOne({
      user: req.user._id,
      product: productId,
    });

    if (existingReview) {
      return res
        .status(400)
        .json({ message: "You already reviewed this product" });
    }

    const isVerifiedPurchase = await checkVerifiedPurchase(
      req.user._id,
      productId,
    );

    const review = await Review.create({
      user: req.user._id,
      product: productId,
      rating: Number(rating),
      comment,
      images,
      isVerifiedPurchase,
    });

    const updatedProduct = await recalculateProductRating(productId);

    res.status(201).json({
      review,
      rating: updatedProduct.rating,
      numReviews: updatedProduct.numReviews,
      message: "Review created successfully",
    });
  } catch (error) {
    console.log("Error in createReview controller", error.message);
    res.status(500).json({ message: "Failed to create review" });
  }
};

export const updateReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { rating, comment } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Rating is required" });
    }

    if (!comment?.trim()) {
      return res.status(400).json({ message: "Comment is required" });
    }

    const review = await Review.findById(reviewId);

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    if (review.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "You can only edit your review" });
    }

    review.rating = Number(rating);
    review.comment = comment;

    await review.save();

    const updatedProduct = await recalculateProductRating(review.product);

    res.status(200).json({
      review,
      rating: updatedProduct.rating,
      numReviews: updatedProduct.numReviews,
      message: "Review updated successfully",
    });
  } catch (error) {
    console.log("Error in updateReview controller", error.message);
    res.status(500).json({ message: "Failed to update review" });
  }
};

export const deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;

    const review = await Review.findById(reviewId);

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    if (review.user.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "You can only delete your review" });
    }

    const productId = review.product;

    await review.deleteOne();

    const updatedProduct = await recalculateProductRating(productId);

    res.status(200).json({
      rating: updatedProduct.rating,
      numReviews: updatedProduct.numReviews,
      message: "Review deleted successfully",
    });
  } catch (error) {
    console.log("Error in deleteReview controller", error.message);
    res.status(500).json({ message: "Failed to delete review" });
  }
};
