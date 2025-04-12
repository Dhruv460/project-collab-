// controllers/chatControllers.js (UPDATED)
import Chat from "../models/Chat.js";
import User from "../models/User.js";
import Message from "../models/Message.js";
import mongoose from "mongoose";

// --- accessChat function remains the same ---
export const accessChat = async (req, res) => {
  const { userId: targetUserId } = req.body;
  const loggedInUserId = req.userId;

  if (!targetUserId) {
    console.log("Target UserId param not sent with request");
    return res.sendStatus(400);
  }
  if (!mongoose.Types.ObjectId.isValid(targetUserId)) {
    return res.status(400).json({ message: "Invalid target user ID format" });
  }

  let isChat = await Chat.find({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: loggedInUserId } } },
      { users: { $elemMatch: { $eq: targetUserId } } },
    ],
  })
    .populate("users", "-password")
    .populate("latestMessage");

  isChat = await User.populate(isChat, {
    path: "latestMessage.sender",
    select: "username avatar email",
  });

  if (isChat.length > 0) {
    res.send(isChat[0]);
  } else {
    const chatData = {
      chatName: "sender",
      isGroupChat: false,
      users: [loggedInUserId, targetUserId],
    };
    try {
      const createdChat = await Chat.create(chatData);
      const fullChat = await Chat.findOne({ _id: createdChat._id }).populate(
        "users",
        "-password"
      );
      res.status(200).json(fullChat);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
};

// --- fetchChats function remains the same ---
export const fetchChats = async (req, res) => {
  const loggedInUserId = req.userId;
  try {
    let results = await Chat.find({
      users: { $elemMatch: { $eq: loggedInUserId } },
    })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 });

    results = await User.populate(results, {
      path: "latestMessage.sender",
      select: "username avatar email",
    });
    res.status(200).send(results);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// --- fetchMessages function remains the same ---
export const fetchMessages = async (req, res) => {
  const { chatId } = req.params;
  const loggedInUserId = req.userId;

  if (!mongoose.Types.ObjectId.isValid(chatId)) {
    return res.status(400).json({ message: "Invalid chat ID format" });
  }
  try {
    const chat = await Chat.findOne({
      _id: chatId,
      users: { $elemMatch: { $eq: loggedInUserId } },
    });
    if (!chat) {
      return res.status(403).json({ message: "User not part of this chat" });
    }
    const messages = await Message.find({ chat: chatId })
      .populate("sender", "username avatar email")
      .populate("chat");
    res.json(messages);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// --- sendMessage function UPDATED ---
/**
 * @desc    Send a new message & Emit via Socket.IO
 * @route   POST /api/messages
 * @access  Private
 */
export const sendMessage = async (req, res) => {
  const { content, chatId } = req.body;
  const loggedInUserId = req.userId;

  if (!content || !chatId) {
    console.log("Invalid data passed into request (content or chatId missing)");
    return res.sendStatus(400);
  }

  if (!mongoose.Types.ObjectId.isValid(chatId)) {
    return res.status(400).json({ message: "Invalid chat ID format" });
  }

  const newMessageData = {
    sender: loggedInUserId,
    content: content,
    chat: chatId,
  };

  try {
    // Verify sender is part of the chat
    const chatExists = await Chat.findOne({
      _id: chatId,
      users: { $elemMatch: { $eq: loggedInUserId } },
    });
    if (!chatExists) {
      return res
        .status(403)
        .json({ message: "User not part of this chat, cannot send message." });
    }

    // Create and populate the message
    let message = await Message.create(newMessageData);
    message = await message.populate("sender", "username avatar");
    message = await message.populate({
      path: "chat",
      populate: { path: "users", select: "username avatar email _id" }, // Removed socketId if not strictly needed here
    });

    // Update the chat's latestMessage
    await Chat.findByIdAndUpdate(chatId, {
      latestMessage: message._id,
      updatedAt: Date.now(),
    });

    // *** --- SOCKET.IO EMIT CHANGE --- ***
    // Emit the message ONCE to the room named after the chatId
    if (req.io) {
      // Ensure io object is available
      console.log(
        `Attempting to emit 'message received' to CHAT room: ${chatId}`
      );
      req.io.to(chatId).emit("message received", message);
      console.log(`Finished emitting 'message received' to room ${chatId}`);
    } else {
      console.error(
        "Socket.IO instance (req.io) not found in sendMessage controller!"
      );
    }
    // *** --- END SOCKET.IO EMIT CHANGE --- ***

    // Send the message back to the sender via HTTP
    res.json(message);
  } catch (error) {
    console.error("Error in sendMessage controller:", error); // Log the detailed error
    res
      .status(400)
      .json({ message: "Failed to send message: " + error.message });
  }
};
