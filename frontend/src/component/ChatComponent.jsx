// ChatComponent.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import io from "socket.io-client";
const api_url = import.meta.env.VITE_API_URL;
const socket = io(api_url);

const Chat = () => {
  // const { projectId } = useParams(); // Extract projectId from URL
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState("");
  const projectId = localStorage.getItem("userId");
  console.log(`me1:${projectId}`);
  useEffect(() => {
    const fetchChat = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token || !projectId) {
          console.error("No token or projectId found");
          return;
        }
        console.log(`me:${projectId}`);
        const response = await axios.get(
          `${api_url}/api/projects/${projectId}/chat`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log(`response of chat is ${response.data}`);
        setMessages(response.data.messages);
      } catch (error) {
        console.error("Error fetching chat:", error);
      }
    };

    if (projectId) {
      fetchChat();
    }
  }, [projectId]); // Only re-run effect if projectId changes

  useEffect(() => {
    if (!projectId) {
      console.error("No projectId provided");
      return;
    }

    socket.on("message", (chat) => {
      if (chat.projectId === projectId) {
        setMessages(chat.messages);
      }
    });

    return () => {
      socket.off("message");
    };
  }, [projectId]);

  const handleSendMessage = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found in local storage");
      return;
    }
    try {
      await axios.post(
        `${api_url}/api/projects/${projectId}/chat`,
        { projectId, text: messageText },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessageText("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div>
      <div>
        {messages.map((message, index) => (
          <div key={index}>
            <p>
              <strong>{message.user.username}</strong>: {message.text}
            </p>
          </div>
        ))}
      </div>
      <input
        type="text"
        value={messageText}
        onChange={(e) => setMessageText(e.target.value)}
      />
      <button onClick={handleSendMessage}>Send</button>
    </div>
  );
};

export default Chat;
