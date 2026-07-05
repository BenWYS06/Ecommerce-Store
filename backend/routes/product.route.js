import express from "express";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getFeaturedProducts,
  getLatestProducts,
  getProductsById,
  getRelatedProducts,
  toggleFeaturedProduct,
  getSearchProducts,
} from "../controllers/product.controller.js";
import { adminRoute, protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", getAllProducts);
router.get("/featured", getFeaturedProducts);
router.get("/search", getSearchProducts);
router.get("/related/:id", getRelatedProducts);
router.get("/latest", getLatestProducts);
router.post("/", protectRoute, adminRoute, createProduct);
router.get("/:id", getProductsById);
router.patch("/:id", protectRoute, adminRoute, toggleFeaturedProduct);
router.delete("/:id", protectRoute, adminRoute, deleteProduct);

export default router;
