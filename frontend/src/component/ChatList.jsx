import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ChatList = ({ userId }) => {
  const [chats, setChats] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/chats/${userId}`);
        const chatData = response.data;
        setChats(chatData);
      } catch (error) {
        console.error(`Error fetching chats for user ${userId}:`, error.response?.data || error.message);
      }
    };
    fetchChats();
  }, [userId]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    setIsSending(true);
    try {
      const response = await axios.post(`http://localhost:3000/api/chats/${userId}`, { message: newMessage });
      const newChat = response.data;
      setChats([...chats, newChat]);
      setNewMessage('');
      setIsSending(false);
    } catch (error) {
      console.error(`Error sending message to user ${userId}:`, error.response?.data || error.message);
      setIsSending(false);
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-8 space-y-4">
      <h2 className="text-2xl font-bold mb-4">Chat</h2>
      <ul className="space-y-4">
        {chats.map((chat, index) => (
          <li key={index} className="flex justify-between">
            <span className="text-gray-800">{chat.message}</span>
            <span className="text-gray-600">{chat.createdAt}</span>
          </li>
        ))}
      </ul>
      <form onSubmit={handleSendMessage}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="w-full p-2 pl-10 text-sm text-gray-700"
        />
        <button
          type="submit"
          disabled={isSending}
          className="bg-blue-600 text-white px-6 py-3 rounded-full hover:bg-blue-700 transition"
        >
          {isSending? 'Sending...' : 'Send'}
        </button>
      </form>
    </div>
  );
};

export default ChatList;