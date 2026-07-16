import express from "express";
import { adminRoute, protectRoute } from "../middleware/auth.middleware.js";
import {
  getDashboardAnalytics,
  normalizeAnalyticsRange,
} from "../controllers/analytics.controller.js";

const router = express.Router();

router.get("/", protectRoute, adminRoute, async (req, res) => {
  try {
    const range = normalizeAnalyticsRange(req.query.range);
    const dashboardData = await getDashboardAnalytics(range);

    res.status(200).json(dashboardData);
  } catch (error) {
    console.log("Error in analytics route", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

export default router;
