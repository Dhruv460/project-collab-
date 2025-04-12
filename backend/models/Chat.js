import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
  {
    chatName: { type: String, trim: true, default: "sender" }, // Default for 1-on-1, can be changed for groups
    isGroupChat: { type: Boolean, default: false },
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    latestMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },
    groupAdmin: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Relevant for group chats
  },
  { timestamps: true } // Adds createdAt and updatedAt automatically
);

const Chat = mongoose.model("Chat", chatSchema);
export default Chat;
