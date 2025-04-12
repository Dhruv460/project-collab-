// src/components/ChatBox.jsx (Complete - Modified for current AuthContext/Login)
import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../AuthContext"; // Import your existing AuthContext
import { useChatState } from "../context/chatProvider"; // Import your ChatProvider context hook
import {
  Box,
  Text,
  IconButton,
  Spinner,
  FormControl,
  Input,
  useToast,
  Avatar, // Added for header
} from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons"; // Example Icon for back button
import ScrollableChat from "./scrollableChat"; // Ensure path is correct
import { fetchMessagesApi, sendMessageApi } from "../services/api"; // Ensure path is correct
import io from "socket.io-client";
import { Slottable } from "@radix-ui/react-slot";

// Helper function to get the other user's info in a 1-on-1 chat (Needed for header)
const getSenderFull = (loggedUserId, users) => {
  if (!loggedUserId || !users || users.length < 2) return null;
  return users.find((user) => user._id !== loggedUserId);
};
const api_url = import.meta.env.VITE_API_URL;
const ENDPOINT = api_url; // Your backend Socket.IO endpoint
console.log(ENDPOINT);
let socket, selectedChatCompare; // Keep these outside component to persist across renders if needed, or manage socket statefully

const ChatBox = (
  {
    /* Potentially receive fetchAgain prop if needed from parent */
  }
) => {
  // Get userId and avatar from the existing AuthContext
  const { userId: loggedUserId } = useContext(AuthContext); // Rename to avoid conflict if needed
  // Get chat state management from ChatProvider context
  const {
    selectedChat,
    setSelectedChat,
    notifications,
    setNotifications,
    chats,
    setChats,
  } = useChatState();

  // Component state
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false); // Is the current user typing?
  const [isTyping, setIsTyping] = useState(false); // Is the other user typing?
  const toast = useToast();

  // --- Read token and username directly from localStorage ---
  // These are read on every render, which is fine, but ensure they are set correctly on login
  const token = localStorage.getItem("token");
  const loggedUsername = localStorage.getItem("username");

  // --- Effect for Socket Connection Setup ---
  useEffect(() => {
    // Connect only if we have a userId from context
    if (!loggedUserId) {
      if (socket) {
        console.log("ChatBox Effect: Disconnecting socket (no loggedUserId)");
        socket.disconnect();
      }
      setSocketConnected(false);
      return; // Stop if no user ID
    }

    // Establish connection
    socket = io(ENDPOINT);
    console.log(api_url);
    // Emit setup event with necessary user details read from context/localStorage
    // Backend 'setup' listener should expect this structure
    socket.emit("setup", { _id: loggedUserId, username: loggedUsername });
    console.log("ChatBox Effect: Emitted socket setup for user:", loggedUserId);

    socket.on("connected", () => {
      console.log("ChatBox Effect: Socket connected event received");
      setSocketConnected(true);
    });

    // Listeners for typing indicators
    socket.on("typing", (room) => {
      // Only show typing if it's for the currently selected chat
      if (selectedChatCompare && room === selectedChatCompare._id) {
        setIsTyping(true);
      }
    });
    socket.on("stop typing", (room) => {
      if (selectedChatCompare && room === selectedChatCompare._id) {
        setIsTyping(false);
      }
    });

    // Clean up on component unmount or when loggedUserId/loggedUsername changes
    return () => {
      console.log("ChatBox.jsx Cleanup: Disconnecting socket");
      if (socket) socket.disconnect();
      setSocketConnected(false);
      setIsTyping(false); // Reset typing indicator on disconnect/user change
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loggedUserId, loggedUsername]); // Reconnect if user ID or username changes

  // --- Effect for Fetching Messages ---
  const fetchChatMessages = async () => {
    if (!selectedChat) {
      setMessages([]); // Clear messages if no chat selected
      return;
    }

    // Check for token before fetching
    if (!token) {
      console.error("Fetch Messages: Token not found in localStorage.");
      toast({
        title: "Authentication Error",
        description: "Token not found. Please log in.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      // Consider redirecting to login or showing appropriate UI
      return;
    }

    console.log(`Workspaceing messages for chat: ${selectedChat._id}`);
    setLoading(true);
    setIsTyping(false); // Reset typing indicator when fetching

    try {
      // Pass token read from localStorage to API call
      const { data } = await fetchMessagesApi(selectedChat._id, token);
      setMessages(data);
      console.log("Messages fetched successfully.");

      // Join the specific chat room via socket after fetching messages
      if (socket) {
        socket.emit("join chat", selectedChat._id);
        console.log(`Emitted 'join chat' for room: ${selectedChat._id}`);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
      toast({
        title: "Error Occurred!",
        description: `Failed to load messages: ${error.response?.data?.message || error.message}`,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      // Handle specific errors like 401/403 if needed
      if (
        error.response &&
        (error.response.status === 401 || error.response.status === 403)
      ) {
        toast({
          title: "Unauthorized",
          description: "Please log in again.",
          status: "error",
        });
        // Potentially trigger logout or redirect
      }
    } finally {
      setLoading(false);
    }
  };

  // Re-fetch messages when selectedChat changes
  useEffect(() => {
    fetchChatMessages();
    // Update compare variable used in socket listener
    selectedChatCompare = selectedChat;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedChat, token]); // Also depend on token in case it changes (e.g., refresh token logic not shown)

  // --- Effect for Listening for New Messages ---
  useEffect(() => {
    if (!socket) return; // Don't attach listener if socket isn't ready

    const messageListener = (newMessageReceived) => {
      console.log("Message received from socket:", newMessageReceived);

      // Check if the message is for the currently selected chat
      // Use selectedChatCompare because state updates might be async
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessageReceived.chat._id
      ) {
        // --- Notification Logic ---
        // Check if notification for this message doesn't already exist
        if (!notifications.some((n) => n._id === newMessageReceived._id)) {
          setNotifications([newMessageReceived, ...notifications]);
          // Optional: Update the parent component/chat list about new message if needed
          // setFetchAgain(!fetchAgain); // If using fetchAgain pattern
          setChats((prevChats) =>
            prevChats
              .map((chat) =>
                chat._id === newMessageReceived.chat._id
                  ? { ...chat, latestMessage: newMessageReceived } // Update latest message
                  : chat
              )
              .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
          ); // Re-sort chat list
        }
      } else {
        // Add message to the currently viewed chat window
        setMessages((prevMessages) => [...prevMessages, newMessageReceived]);
      }
    };

    socket.on("message received", messageListener);

    // Clean up the listener when component unmounts or dependencies change
    return () => {
      console.log(
        "ChatBox Effect Cleanup: Removing 'message received' listener"
      );
      socket.off("message received", messageListener);
    };
    // Ensure dependencies are correct to avoid stale closures
  }, [
    socket,
    selectedChatCompare,
    notifications,
    setNotifications,
    setChats /*, fetchAgain, setFetchAgain */,
  ]);

  // --- Send Message Handler ---
  const sendMessage = async (event) => {
    // Trigger on Enter key press or potential button click (if added)
    if (
      (event.key === "Enter" || event.type === "click") &&
      newMessage.trim()
    ) {
      // Check for token before sending
      if (!token) {
        console.error("Send Message: Token not found in localStorage.");
        toast({
          title: "Authentication Error",
          description: "Cannot send message. Token not found.",
          status: "error",
          duration: 3000,
        });
        return;
      }

      if (!socket) {
        console.error("Send Message: Socket not connected.");
        toast({
          title: "Connection Error",
          description: "Cannot send message. Not connected.",
          status: "error",
          duration: 3000,
        });
        return;
      }

      // Emit stop typing event first
      socket.emit("stop typing", selectedChat._id);
      setTyping(false); // Update local typing state

      const messageContent = newMessage;
      setNewMessage(""); // Clear input field immediately

      try {
        // Pass token read from localStorage to API call
        const { data: sentMessage } = await sendMessageApi(
          messageContent,
          selectedChat._id,
          token
        );
        console.log("Message sent via API successfully:", sentMessage);

        // --- Let the socket 'message received' event handle adding the message to state ---
        // This avoids potential duplicates if emission/listener are fast.
        // setMessages([...messages, sentMessage]); // **REMOVED** - Rely on socket emission from backend
      } catch (error) {
        console.error("Error sending message:", error);
        toast({
          title: "Error Sending Message",
          description: `Failed to send message: ${error.response?.data?.message || error.message}`,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        // Restore message in input field if sending failed
        setNewMessage(messageContent);
        // Handle specific errors like 401/403 if needed
        if (
          error.response &&
          (error.response.status === 401 || error.response.status === 403)
        ) {
          toast({
            title: "Unauthorized",
            description: "Please log in again.",
            status: "error",
          });
          // Potentially trigger logout or redirect
        }
      }
    }
  };

  // --- Typing Handler ---
  const typingHandler = (e) => {
    setNewMessage(e.target.value);

    if (!socketConnected || !selectedChat) return; // Only emit if connected and in a chat

    // Emit 'typing' event if not already typing
    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
      console.log("Emitted typing event for room:", selectedChat._id);
    }

    // Debounce 'stop typing' event
    const lastTypingTime = new Date().getTime();
    const timerLength = 3000; // 3 seconds of inactivity

    setTimeout(() => {
      const timeNow = new Date().getTime();
      const timeDiff = timeNow - lastTypingTime;
      // Check if still typing and timer has expired
      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
        console.log("Emitted stop typing event for room:", selectedChat._id);
      }
    }, timerLength);
  };

  // Conditional rendering if no chat is selected
  if (!selectedChat) {
    return (
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        h="100%"
        w="100%"
      >
        <Text fontSize="3xl" pb={3} fontFamily="Work sans" color="gray.500">
          Select a user to start chatting
        </Text>
      </Box>
    );
  }

  // Get the other user's details for the header
  const otherUser = !selectedChat.isGroupChat
    ? getSenderFull(loggedUserId, selectedChat.users)
    : null;

  // Main Chat Box UI
  return (
    <Box
      display={{ base: selectedChat ? "flex" : "none", md: "flex" }} // Responsive show/hide
      alignItems="center"
      flexDir="column"
      p={3}
      bg="gray.50" // Background color for the chat box area
      w={{ base: "100%", md: "68%" }} // Adjust width as needed
      borderRadius="lg"
      borderWidth="1px"
      borderColor="gray.200" // Subtle border
    >
      {/* Header Section */}
      <Text
        fontSize={{ base: "2xl", md: "3xl" }} // Responsive font size
        pb={3}
        px={2}
        w="100%"
        fontFamily="Work sans"
        display="flex"
        justifyContent={{ base: "space-between" }} // Space out items in header
        alignItems="center"
        borderBottomWidth="1px" // Separator line
        borderColor="gray.200"
        mb={3} // Margin below header
      >
        {/* Back Button (Mobile Only) */}
        <IconButton
          display={{ base: "flex", md: "none" }} // Show only on mobile
          icon={<ArrowBackIcon />}
          onClick={() => setSelectedChat(null)} // Action to go back to chat list
          aria-label="Back to chats"
          variant="ghost" // Less prominent button style
        />
        {/* Chat Title (Username or Group Name) */}
        <Box display="flex" alignItems="center">
          {/* Optional: Add Avatar */}
          {otherUser && (
            <Avatar
              size="sm"
              name={otherUser.username}
              src={otherUser.avatar}
              mr={2}
            />
          )}
          <Text fontWeight="semibold">
            {
              !selectedChat.isGroupChat
                ? otherUser?.username || "Unknown User" // Display other user's name
                : selectedChat.chatName // Display group chat name
            }
          </Text>
        </Box>
        {/* Placeholder for potential Profile/Group Info Button */}
        <Box w="40px"></Box>{" "}
        {/* Spacer to balance header if back button is hidden */}
      </Text>

      {/* Message Display Area */}
      <Box
        display="flex"
        flexDir="column"
        justifyContent="flex-end" // Messages align to bottom
        p={3}
        bg="white" // Background for message list
        w="100%"
        h="100%" // Take full height
        borderRadius="lg"
        borderWidth="1px"
        borderColor="gray.200"
        overflowY="hidden" // Hide main scrollbar, handled by ScrollableChat
        position="relative" // Needed for absolute positioning of typing indicator? (optional)
      >
        {loading ? (
          // Loading Spinner
          <Spinner
            size="xl"
            w={20}
            h={20}
            alignSelf="center"
            margin="auto"
            color="blue.500"
          />
        ) : (
          // Scrollable Chat Messages
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              overflowY: "scroll",
              height: "calc(100% - 40px)" /* Adjust based on input height */,
            }}
          >
            {/* Pass loggedUserId for message styling */}
            <ScrollableChat messages={messages} loggedUserId={loggedUserId} />
          </div>
        )}

        {/* Typing Indicator */}
        {
          isTyping ? (
            <Text fontSize="sm" color="gray.500" pl={4} pt={1} pb={1}>
              Typing...
            </Text>
          ) : (
            <Box h="24px"></Box>
          ) /* Placeholder to prevent layout jump */
        }

        {/* Message Input Form */}
        <FormControl
          onKeyDown={sendMessage}
          isRequired
          mt={3}
          position="sticky"
          bottom="0"
          bg="white"
          pt={2}
        >
          <Input
            variant="filled"
            bg="gray.100" // Input background
            placeholder="Enter a message.."
            value={newMessage}
            onChange={typingHandler}
            autoComplete="off" // Prevent browser suggestions if desired
            borderRadius="xl" // Rounded corners for input
          />
          {/* Optional: Add a Send Button here */}
          {/* <IconButton icon={<SendIcon />} onClick={sendMessage} /> */}
        </FormControl>
      </Box>
    </Box>
  );
};

export default ChatBox;
