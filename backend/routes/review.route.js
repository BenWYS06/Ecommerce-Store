import express from "express";
import {
  createReview,
  deleteReview,
  getProductReviews,
  updateReview,
} from "../controllers/review.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/:productId", getProductReviews);
router.post("/", protectRoute, createReview);
router.put("/:reviewId", protectRoute, updateReview);
router.delete("/:reviewId", protectRoute, deleteReview);

export default router;
