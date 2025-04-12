// src/components/MyChats.jsx (Complete and Updated)
import React, { useState, useEffect, useContext } from "react";
// Import your existing AuthContext
import { AuthContext } from "../AuthContext"; // Ensure this path is correct
// Import ChatProvider context hook
import { useChatState } from "../context/chatProvider"; // Ensure this path is correct
// Import API function
import { fetchChatsApi } from "../services/api"; // Ensure this path is correct
// Import Chakra UI components
import {
  Box,
  Stack,
  Text,
  useToast,
  Avatar,
  IconButton, // Import IconButton
  useDisclosure, // Import useDisclosure hook
  Spinner, // Import Spinner for loading state
} from "@chakra-ui/react";
// Import Icon for the button
import { AddIcon } from "@chakra-ui/icons";
// Import the drawer component (assuming you created it as UserSearchDrawer.jsx)
import UserSearchDrawer from "./userSearchDrawer"; // Ensure this path is correct

// Helper function to get the other user in a 1-on-1 chat
const getOtherUser = (chatUsers, loggedUserId) => {
  if (!loggedUserId || !chatUsers || chatUsers.length < 2) return null;
  return chatUsers.find((user) => user._id !== loggedUserId);
};

// Added fetchAgain prop - useful if ChatBox needs to trigger a refresh here
const MyChats = ({ fetchAgain }) => {
  // Get userId and avatar from the existing AuthContext
  const { userId: loggedUserId } = useContext(AuthContext); // Removed userAvatar if not used here
  const { selectedChat, setSelectedChat, chats, setChats } = useChatState();
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  // Get username directly from localStorage if needed for display/logic
  const loggedUsername = localStorage.getItem("username");

  // Disclosure hook for controlling the UserSearchDrawer
  const { isOpen, onOpen, onClose } = useDisclosure();

  console.log(
    "MyChats Render: userId:",
    loggedUserId,
    "username:",
    loggedUsername
  );

  // Function to fetch user's chats
  const fetchUserChats = async () => {
    if (!loggedUserId) {
      console.log(
        "MyChats fetchUserChats: No loggedUserId found in AuthContext."
      );
      setChats([]); // Clear chats if no user
      return;
    }
    setLoading(true);
    // --- Read token DIRECTLY from localStorage ---
    const token = localStorage.getItem("token");

    if (!token) {
      console.log("MyChats fetchUserChats: Token not found in localStorage.");
      // Don't toast here repeatedly, maybe handle globally or on action failure
      // toast({ title: "Authentication error", description: "Token not found.", status: "error" });
      setLoading(false);
      setChats([]); // Clear chats if no token
      return; // Stop if no token
    }

    console.log("MyChats fetchUserChats: Proceeding with token found.");

    try {
      const { data } = await fetchChatsApi(token);
      console.log("Fetched chats:", data);
      setChats(data);
    } catch (error) {
      console.error("Error fetching chats:", error);
      toast({
        title: "Error Occurred!",
        description: `Failed to load chats: ${error.response?.data?.message || error.message}`,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
      // Handle specific errors e.g., 401 Unauthorized
      if (error.response && error.response.status === 401) {
        toast({
          title: "Session may be invalid",
          description: "Please log in again if needed.",
          status: "warning",
        });
        // Potentially trigger logout via context if available/needed
      }
    } finally {
      setLoading(false);
    }
  };

  // Fetch chats when component mounts or when loggedUserId/fetchAgain changes
  useEffect(() => {
    fetchUserChats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loggedUserId, fetchAgain]); // Added fetchAgain dependency

  return (
    // Main container Box for MyChats section
    <Box
      // Conditional display based on whether a chat is selected (for mobile view)
      display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDir="column"
      alignItems="center"
      p={3}
      bg="white" // Background color
      w={{ base: "100%", md: "31%" }} // Responsive width
      borderRadius="lg"
      borderWidth="1px"
      borderColor="gray.200"
    >
      {/* Header Section */}
      <Box
        pb={3}
        px={3}
        fontSize={{ base: "xl", md: "2xl" }} // Responsive font size
        fontFamily="Work sans"
        display="flex"
        w="100%"
        justifyContent="space-between" // Space between title and button
        alignItems="center"
        borderBottomWidth="1px" // Separator line
        borderColor="gray.200"
        mb={3} // Margin below header
      >
        <Text fontWeight="bold">My Chats</Text>
        {/* --- Button to open the User Search Drawer --- */}
        <IconButton
          aria-label="Start new chat"
          icon={<AddIcon />}
          size="sm"
          isRound={true}
          onClick={onOpen} // Trigger drawer open
          variant="ghost" // Less prominent style
          colorScheme="blue"
        />
      </Box>

      {/* Chat List Area */}
      <Box
        display="flex"
        flexDir="column"
        p={3}
        bg="gray.50" // Slightly different background for the list area
        w="100%"
        flexGrow={1} // Allow this box to grow and fill height
        borderRadius="lg"
        overflowY="auto" // Enable scrolling for the list
      >
        {loading ? (
          // Loading indicator while fetching chats
          <Spinner size="md" alignSelf="center" mt={5} color="blue.500" />
        ) : chats && chats.length > 0 ? (
          // Stack component for vertical list layout
          <Stack spacing={3}>
            {" "}
            {/* Added spacing between chat items */}
            {chats.map((chat) => {
              // Get the other user details for display
              const otherUser = !chat.isGroupChat
                ? getOtherUser(chat.users, loggedUserId)
                : null;
              // Determine if the current chat is selected
              const isSelected = selectedChat && selectedChat._id === chat._id;

              return (
                // Individual chat item Box
                <Box
                  onClick={() => setSelectedChat(chat)} // Set selected chat on click
                  cursor="pointer"
                  bg={isSelected ? "blue.500" : "gray.200"} // Highlight selected chat
                  color={isSelected ? "white" : "black"} // Adjust text color for selected chat
                  px={3}
                  py={2}
                  borderRadius="lg"
                  key={chat._id}
                  display="flex"
                  alignItems="center"
                  transition="background-color 0.2s ease-in-out" // Smooth transition on hover/select
                  _hover={{
                    // Subtle hover effect
                    bg: isSelected ? "blue.600" : "gray.300",
                  }}
                >
                  {/* Display Avatar */}
                  <Avatar
                    mr={3} // Increased margin
                    size="sm"
                    cursor="pointer"
                    name={
                      !chat.isGroupChat ? otherUser?.username : chat.chatName // Use optional chaining
                    }
                    src={!chat.isGroupChat ? otherUser?.avatar : ""} // Use optional chaining
                    // Add fallback icon if needed
                  />
                  {/* Display Username and Latest Message */}
                  <Box flexGrow={1} isTruncated>
                    {" "}
                    {/* Allow text to truncate */}
                    <Text fontWeight="medium" isTruncated>
                      {" "}
                      {/* Truncate long names */}
                      {!chat.isGroupChat
                        ? otherUser?.username || "Unknown User" // Use optional chaining
                        : chat.chatName}
                    </Text>
                    {/* Display latest message preview */}
                    {chat.latestMessage ? ( // Check if latestMessage exists
                      <Text
                        fontSize="xs"
                        isTruncated
                        color={isSelected ? "gray.200" : "gray.600"}
                      >
                        <b>
                          {/* Check if sender exists before accessing username */}
                          {chat.latestMessage.sender?._id === loggedUserId
                            ? "You"
                            : chat.latestMessage.sender?.username || ""}
                          :{" "}
                        </b>
                        {/* Ensure content exists before accessing */}
                        {chat.latestMessage.content || ""}
                      </Text>
                    ) : (
                      <Text
                        fontSize="xs"
                        color={isSelected ? "gray.300" : "gray.500"}
                      >
                        No messages yet.
                      </Text>
                    )}
                  </Box>
                </Box>
              );
            })}
          </Stack>
        ) : (
          // Message shown when no chats are found
          <Text textAlign="center" mt={5} color="gray.500">
            No chats found. Start a conversation!
          </Text>
        )}
      </Box>

      {/* --- Render the UserSearchDrawer component --- */}
      {/* It controls its own visibility based on the isOpen prop */}
      <UserSearchDrawer isOpen={isOpen} onClose={onClose} />
    </Box>
  );
};

export default MyChats;
