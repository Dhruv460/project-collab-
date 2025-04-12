// routes/messageRoutes.js
import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { sendMessage } from "../controllers/chatController.js"; // Re-use the controller logic

const router = express.Router();

router.route("/").post(protect, sendMessage);

export default router;
