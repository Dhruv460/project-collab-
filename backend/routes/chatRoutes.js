// routes/chatRoutes.js
import express from "express";
import { protect } from "../middleware/authMiddleware.js"; // Assuming you have this
import { accessChat, fetchChats, fetchMessages } from "../controllers/chatController.js"; // sendMessage is handled by messageRoutes

const router = express.Router();

// Route to get all chats for the logged-in user OR create/access a 1-on-1 chat
router.route("/").post(protect, accessChat).get(protect, fetchChats);

// Route to get all messages for a specific chat
router.route("/:chatId/messages").get(protect, fetchMessages);

// Note: Group chat routes (create, rename, add/remove members) would be added here if needed

export default router;
