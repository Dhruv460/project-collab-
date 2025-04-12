import express from "express";
import userRoutes from "./userRoutes.js";
import projectRoutes from "./projectRoutes.js";
import notificationsRoutes from "./notificationsRoutes.js";
import run from "../gemini-api.js";
import runn from "../friend_bot.js";
import ChatHistory from "../models/ChatHistory.js";
import chatRoutes from "./chatRoutes.js"; // Import chat routes
import messageRoutes from "./MessageRoutes.js";
const apiRouter = express.Router();

apiRouter.use("/users", userRoutes);
apiRouter.use("/projects", projectRoutes);
apiRouter.use("/notifications", notificationsRoutes);
apiRouter.use("/chats", chatRoutes); // Mount chat routes
apiRouter.use("/messages", messageRoutes);
apiRouter.post("/prompt-post", async (req, res) => {
  try {
    const { prompt } = req.body;
    const response = await run(prompt);
    res.json(response);
  } catch (error) {
    console.log(error);
  }
});
apiRouter.post("/prompt", async (req, res) => {
  try {
    const { userId, prompt } = req.body;

    const chatHistory = await ChatHistory.findOne({ userId });
    const previousChats = chatHistory
      ? chatHistory.chats
          .map((chat) => ({
            role: "user",
            text: chat.prompt,
          }))
          .concat(
            chatHistory.chats.map((chat) => ({
              role: "model",
              text: chat.response,
            }))
          )
      : [];

    const response = await runn(prompt, previousChats);

    if (chatHistory) {
      chatHistory.chats.push({ prompt, response });
      await chatHistory.save();
    } else {
      const newChatHistory = new ChatHistory({
        userId,
        chats: [{ prompt, response }],
      });
      await newChatHistory.save();
    }

    res.json(response);
  } catch (error) {
    console.log(error);
    res.status(500).send("An error occurred while generating the response.");
  }
});

apiRouter.get("/chat-history/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const chatHistory = await ChatHistory.findOne({ userId });

    if (chatHistory) {
      res.json(chatHistory.chats);
    } else {
      res.json([]);
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("An error occurred while fetching chat history.");
  }
});

export default apiRouter;
