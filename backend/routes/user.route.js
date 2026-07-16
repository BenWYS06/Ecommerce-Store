import express from "express";
import { getAdminUsers } from "../controllers/user.controller.js";
import { adminRoute, protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", protectRoute, adminRoute, getAdminUsers);

export default router;
