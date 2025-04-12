// src/components/UserListItem.jsx
import React from "react";
import { Avatar, Box, Text } from "@chakra-ui/react";

const UserListItem = ({ user, handleFunction }) => {
  if (!user) {
    return null; // Don't render if user is null
  }

  return (
    <Box
      onClick={handleFunction} // Trigger chat access on click
      cursor="pointer"
      bg="gray.100" // Hover effect background
      _hover={{
        background: "blue.500",
        color: "white",
      }}
      w="100%"
      display="flex"
      alignItems="center"
      color="black"
      px={3}
      py={2}
      mb={2}
      borderRadius="lg"
    >
      <Avatar
        mr={2}
        size="sm"
        cursor="pointer"
        name={user.username}
        src={user.avatar} // Assumes avatar URL is provided
      />
      <Box>
        <Text>{user.username}</Text>
        <Text fontSize="xs">
          <b>Email: </b>
          {user.email}
        </Text>
      </Box>
    </Box>
  );
};

export default UserListItem;
