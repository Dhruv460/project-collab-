// src/context/ChatProvider.jsx (Modified for current AuthContext/Login)
import React, { createContext, useContext, useState, useEffect } from "react";
import { AuthContext } from "../AuthContext"; // Import your existing AuthContext

const ChatContext = createContext();

const ChatProvider = ({ children }) => {
  // Get userId and avatar from the existing AuthContext
  const { userId, userAvatar } = useContext(AuthContext);

  // Chat-specific state remains the same
  const [selectedChat, setSelectedChat] = useState(null);
  const [chats, setChats] = useState([]);
  const [notifications, setNotifications] = useState([]);

  // --- No longer need to load user info from localStorage here ---
  // AuthContext provides userId/userAvatar
  // Other components will read 'token'/'username' directly when needed

  useEffect(() => {
    // Effect to clear chat state if user logs out (userId becomes null)
    if (!userId) {
      console.log("ChatProvider: userId not found, clearing chat state.");
      setChats([]);
      setSelectedChat(null);
      setNotifications([]);
      // Add any socket disconnection logic here if socket is managed globally
    } else {
      console.log("ChatProvider: userId found:", userId);
      // You could potentially fetch initial chats here, but MyChats already does it.
    }
  }, [userId]); // Re-run when userId from AuthContext changes

  const contextValue = {
    selectedChat,
    setSelectedChat,
    chats,
    setChats,
    notifications,
    setNotifications,
    // Provide userId and userAvatar if needed by consuming components,
    // though they could also get it directly from AuthContext
    // userId,
    // userAvatar
  };

  return (
    <ChatContext.Provider value={contextValue}>{children}</ChatContext.Provider>
  );
};

// Custom hook to use the chat context remains the same
export const useChatState = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error("useChatState must be used within a ChatProvider");
  }
  return context;
};

export default ChatProvider;
