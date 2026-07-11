import express from "express";
import { subscribeNewsletter } from "../controllers/newsletter.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/subscribe", protectRoute, subscribeNewsletter);

export default router;
