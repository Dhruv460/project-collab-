// src/components/UserSearchDrawer.jsx
import React, { useState, useContext } from "react";
import {
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Box,
  Input,
  Button,
  Spinner,
  Text,
  Stack,
  useToast,
} from "@chakra-ui/react";
import { searchUsersApi, accessChatApi } from "../services/api"; // Import API functions
import UserListItem from "./userListItem"; // Create this component next
import { useChatState } from "../context/chatProvider";
import { AuthContext } from "../AuthContext.jsx"; // Needed for userId

const UserSearchDrawer = ({ isOpen, onClose }) => {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false); // Loading state for accessing chat

  const toast = useToast();
  const { setSelectedChat, chats, setChats } = useChatState();
  const { userId: loggedUserId } = useContext(AuthContext); // Get logged-in user ID

  // Handle search input change
  const handleSearch = async (e) => {
    e.preventDefault(); // Prevent form submission if wrapped in form
    if (!search.trim()) {
      toast({
        title: "Please enter something to search",
        status: "warning",
        duration: 2000,
      });
      setSearchResult([]);
      return;
    }

    // --- Read token from localStorage ---
    const token = localStorage.getItem("token");
    if (!token) {
      toast({
        title: "Authentication Error",
        description: "Token not found.",
        status: "error",
      });
      return;
    }

    setLoading(true);
    try {
      const { data } = await searchUsersApi(search, token);
      setSearchResult(data);
    } catch (error) {
      console.error("Search Error:", error);
      toast({
        title: "Error Searching Users",
        description: error.message,
        status: "error",
      });
      setSearchResult([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle clicking on a user to start/access chat
  const handleAccessChat = async (targetUserId) => {
    if (!targetUserId) return;

    console.log("Attempting to access chat with user:", targetUserId);

    // --- Read token from localStorage ---
    const token = localStorage.getItem("token");
    if (!token) {
      toast({
        title: "Authentication Error",
        description: "Token not found.",
        status: "error",
      });
      return;
    }

    setLoadingChat(true);
    try {
      // Call the backend API to create/access the chat
      const { data: accessedChat } = await accessChatApi(targetUserId, token);
      console.log("Accessed chat:", accessedChat);

      // Check if this chat is already in the user's chat list
      if (!chats.find((c) => c._id === accessedChat._id)) {
        // If not present, add it to the beginning of the list
        setChats([accessedChat, ...chats]);
      }

      // Set the newly accessed chat as the selected chat
      setSelectedChat(accessedChat);
      setLoadingChat(false);
      onClose(); // Close the drawer
      setSearch(""); // Clear search state
      setSearchResult([]);
    } catch (error) {
      console.error("Error accessing chat:", error);
      toast({
        title: "Error Accessing Chat",
        description: error.response?.data?.message || error.message,
        status: "error",
      });
      setLoadingChat(false);
    }
  };

  return (
    <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader borderBottomWidth="1px">Search Users</DrawerHeader>
        <DrawerBody>
          <Box display="flex" pb={2} gap={2}>
            <Input
              placeholder="Search by name or email..." // Adjust placeholder
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch(e)} // Optional: search on enter
            />
            <Button onClick={handleSearch} isLoading={loading}>
              Go
            </Button>
          </Box>

          {/* Display Search Results */}
          <Stack mt={4}>
            {loading ? (
              <Spinner size="md" alignSelf="center" />
            ) : searchResult.length > 0 ? (
              searchResult
                .filter((user) => user._id !== loggedUserId) // Don't show self in results
                .map((user) => (
                  <UserListItem
                    key={user._id}
                    user={user}
                    handleFunction={() => handleAccessChat(user._id)} // Pass handler
                  />
                ))
            ) : (
              search && <Text>No users found.</Text> // Show only if search was performed
            )}
            {/* Loading indicator when accessing chat */}
            {loadingChat && <Spinner size="md" alignSelf="center" mt={4} />}
          </Stack>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};

export default UserSearchDrawer;
