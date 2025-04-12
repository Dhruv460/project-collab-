import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    content: { type: String, trim: true },
    chat: { type: mongoose.Schema.Types.ObjectId, ref: "Chat" },
    readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Track who read the message (optional enhancement)
  },
  { timestamps: true } // Adds createdAt and updatedAt automatically
);

const Message = mongoose.model("Message", messageSchema);
export default Message;
