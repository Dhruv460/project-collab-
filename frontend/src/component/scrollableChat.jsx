// src/components/ScrollableChat.jsx (Complete with Avatar/Timestamp details)
import React from "react";
import ScrollToBottom from "react-scroll-to-bottom";
import { Avatar, Tooltip, Box, Text } from "@chakra-ui/react";

// Helper functions (assuming these are correct as provided)
const isSameSender = (messages, m, i, userId) => {
  return (
    i < messages.length - 1 &&
    (messages[i + 1].sender._id !== m.sender._id ||
      messages[i + 1].sender._id === undefined) &&
    messages[i].sender._id !== userId
  );
};

const isLastMessage = (messages, i, userId) => {
  return (
    i === messages.length - 1 &&
    messages[messages.length - 1].sender._id !== userId &&
    messages[messages.length - 1].sender._id
  );
};

const isSameSenderMargin = (messages, m, i, userId) => {
  if (
    i < messages.length - 1 &&
    messages[i + 1].sender._id === m.sender._id &&
    messages[i].sender._id !== userId
  )
    return 33;
  else if (
    (i < messages.length - 1 &&
      messages[i + 1].sender._id !== m.sender._id &&
      messages[i].sender._id !== userId) ||
    (i === messages.length - 1 && messages[i].sender._id !== userId)
  )
    return 0;
  else return "auto";
};

const isSameUser = (messages, m, i) => {
  return i > 0 && messages[i - 1].sender._id === m.sender._id;
};

const ScrollableChat = ({ messages, loggedUserId }) => {
  if (!loggedUserId) {
    console.warn("ScrollableChat: loggedUserId prop is missing!");
    return null; // Don't render if we don't know who the user is
  }

  return (
    <ScrollToBottom
      className="messages-container" // Ensure you have CSS for this if needed, or rely on ScrollToBottom's default behavior
      style={{ paddingRight: "5px", height: "100%", width: "100%" }} // Added width
    >
      {messages &&
        messages.map(
          (m, i) =>
            // Ensure message and sender exist before trying to render
            m &&
            m.sender && (
              <div style={{ display: "flex" }} key={m._id || i}>
                {" "}
                {/* Added fallback key */}
                {/* Render Avatar Conditionally */}
                {(isSameSender(messages, m, i, loggedUserId) ||
                  isLastMessage(messages, i, loggedUserId)) && (
                  <Tooltip
                    label={m.sender.username || "Unknown User"} // Add fallback for username
                    placement="bottom-start"
                    hasArrow
                  >
                    {/* --- Fill in Avatar props --- */}
                    <Avatar
                      mt="7px"
                      mr={1}
                      size="sm"
                      cursor="pointer"
                      name={m.sender.username || "Unknown User"} // Use sender's username for name prop
                      src={m.sender.avatar} // Use sender's avatar URL for src prop
                    />
                  </Tooltip>
                )}
                {/* Message Bubble */}
                <span
                  style={{
                    backgroundColor: `${m.sender._id === loggedUserId ? "#BEE3F8" : "#B9F5D0"}`,
                    borderRadius: "20px",
                    padding: "5px 15px",
                    maxWidth: "75%",
                    marginLeft: isSameSenderMargin(
                      messages,
                      m,
                      i,
                      loggedUserId
                    ),
                    marginTop: isSameUser(messages, m, i) ? 3 : 10,
                  }}
                >
                  {m.content}
                  {/* --- Fill in Timestamp --- */}
                  <Text fontSize="xs" color="gray.500" textAlign="right" mt={1}>
                    {/* Format timestamp from message createdAt */}
                    {m.createdAt
                      ? new Date(m.createdAt).toLocaleTimeString([], {
                          hour: "numeric", // Use 'numeric' or '2-digit'
                          minute: "2-digit",
                          // hour12: true // Optional: use 12-hour format
                        })
                      : ""}
                  </Text>
                </span>
              </div>
            )
        )}
    </ScrollToBottom>
  );
};

export default ScrollableChat;
