// src/services/api.js (Corrected URLs)
import axios from "axios";

const API_URL = "http://localhost:3000/api"; // Your backend URL

const getAuthConfig = (token) => ({
  headers: {
    // Ensure token is not null or undefined before creating header
    ...(token && { Authorization: `Bearer ${token}` }),
  },
});

// User Search
export const searchUsersApi = (query, token) =>
  axios.get(`${API_URL}/users/search?query=${query}`, getAuthConfig(token)); // Fixed URL

// Chat Access/Creation
export const accessChatApi = (userId, token) =>
  axios.post(`${API_URL}/chats`, { userId }, getAuthConfig(token));

// Fetch User's Chats
export const fetchChatsApi = (token) =>
  axios.get(`${API_URL}/chats`, getAuthConfig(token));

// Fetch Messages for a Chat
export const fetchMessagesApi = (chatId, token) =>
  axios.get(`${API_URL}/chats/${chatId}/messages`, getAuthConfig(token)); // Fixed URL

// Send Message
export const sendMessageApi = (content, chatId, token) =>
  axios.post(`${API_URL}/messages`, { content, chatId }, getAuthConfig(token));

// Add other API calls (login, register, profile update) here if desired
