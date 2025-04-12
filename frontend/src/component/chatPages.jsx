// src/components/ChatPage.jsx (Corrected for your current setup)
import React, { useState, useContext } from "react"; // Added useContext, removed useEffect if not needed here
// Import your original AuthContext and the ChatProvider context hook
import { AuthContext } from "../AuthContext";
import { useChatState } from "../context/chatProvider"; // Still needed if MyChats/ChatBox use it indirectly
import MyChats from "./MyChats"; // Ensure path is correct
import ChatBox from "./ChatBox"; // Ensure path is correct
import { Box } from "@chakra-ui/react";

const ChatPage = () => {
  // Get authentication status (userId) from your original AuthContext
  const { userId } = useContext(AuthContext);

  // Optional: State for triggering refetch in children components
  const [fetchAgain, setFetchAgain] = useState(false);

  console.log("ChatPage Render: userId from AuthContext:", userId); // Log to verify

  return (
    <div style={{ width: "100%" }}>
      {/* Header might go here, ensure it also uses AuthContext if needed */}
      <Box
        display="flex"
        justifyContent="space-between"
        w="100%"
        h="91.5vh" // Consider making height more dynamic or using calc()
        p="10px"
        gap="10px" // Add gap between MyChats and ChatBox
      >
        {/* Conditionally render based on userId from AuthContext */}
        {userId ? (
          <>
            {/* Pass fetchAgain state down if MyChats needs it */}
            <MyChats fetchAgain={fetchAgain} />
            {/* Pass fetchAgain state and setter down if ChatBox needs them */}
            <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
          </>
        ) : (
          // Optional: Show a message or redirect if not logged in
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            w="100%"
          >
            <Text>Please log in to view chats.</Text>
          </Box>
        )}
      </Box>
    </div>
  );
};

export default ChatPage;
