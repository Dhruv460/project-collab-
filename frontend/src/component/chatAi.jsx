import React, { useState, useEffect, useContext, useRef } from "react";
import axios from "axios";
import "../index.css";
import { AuthContext } from "../AuthContext";
import { ThemeContext } from "../ThemeContext";
import DOMPurify from "dompurify";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { tomorrow } from "react-syntax-highlighter/dist/esm/styles/prism";
import ReactMarkdown from "react-markdown";

const ChatAi = () => {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const userId = localStorage.getItem("userId");
  // const { username } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);
  const token = localStorage.getItem("token");
  const api_url = import.meta.env.VITE_API_URL;
  
  // Add ref for the chat messages container
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);

  // Function to scroll to bottom of chat messages only
  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  };

  // Automatically scroll down when chatHistory changes or loading state changes
  useEffect(() => {
    scrollToBottom();
  }, [chatHistory, loading]);

  useEffect(() => {
    const fetchChatHistory = async () => {
      try {
        const res = await axios.get(`${api_url}/api/chat-history/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setChatHistory(res.data);
        // Scroll to bottom after loading chat history
        setTimeout(scrollToBottom, 100);
      } catch (error) {
        console.error("Error fetching chat history:", error);
      }
    };

    fetchChatHistory();
  }, [userId, token, api_url]);

  const handlePromptChange = (e) => {
    setPrompt(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    
    setLoading(true);
    try {
      const res = await axios.post(
        `${api_url}/api/prompt`,
        { userId, prompt },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const newChat = { prompt, response: res.data };
      setChatHistory((prevHistory) => [...prevHistory, newChat]);
      setPrompt("");
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    
    // Optional: Show a "Copied!" message
    const copyButton = document.activeElement;
    if (copyButton && copyButton.classList.contains('copy-button')) {
      const originalText = copyButton.textContent;
      copyButton.textContent = 'Copied!';
      setTimeout(() => {
        copyButton.textContent = originalText;
      }, 2000);
    }
  };

  // Function to detect code blocks using regex
  const formatResponse = (response) => {
    if (!response) return null;

    // Replace code blocks with custom component
    const codeBlockRegex = /```([a-zA-Z0-9]*)\n([\s\S]*?)```/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = codeBlockRegex.exec(response)) !== null) {
      // Add text before code block
      if (match.index > lastIndex) {
        parts.push(
          <div key={`text-${lastIndex}`} className="text-content">
            <ReactMarkdown>{response.slice(lastIndex, match.index)}</ReactMarkdown>
          </div>
        );
      }

      // Add code block
      const language = match[1] || "javascript";
      const code = match[2];
      parts.push(
        <div key={`code-${match.index}`} className="code-block-container">
          <div className="code-block-header">
            <span className="code-language">{language}</span>
            <button 
              className="copy-button" 
              onClick={() => copyToClipboard(code)}
            >
              Copy
            </button>
          </div>
          <SyntaxHighlighter 
            language={language} 
            style={tomorrow}
            showLineNumbers={true}
            wrapLines={true}
          >
            {code}
          </SyntaxHighlighter>
        </div>
      );

      lastIndex = match.index + match[0].length;
    }

    // Add remaining text after last code block
    if (lastIndex < response.length) {
      parts.push(
        <div key={`text-${lastIndex}`} className="text-content">
          <ReactMarkdown>{response.slice(lastIndex)}</ReactMarkdown>
        </div>
      );
    }

    // If no code blocks were found, just render the whole response with ReactMarkdown
    if (parts.length === 0) {
      return <ReactMarkdown>{response}</ReactMarkdown>;
    }

    return <div className="formatted-response">{parts}</div>;
  };

  return (
    <div className={`chat-layout ${theme === "dark" ? "dark-mode" : "light-mode"}`}>
      <div className="chat-container">
        <div className="chat-sidebar">
          <h2>Chat History</h2>
          <ul>
            {chatHistory.map((chat, index) => (
              <li key={index}>
                <span>{`You: ${chat.prompt.slice(0, 20)}${chat.prompt.length > 20 ? '...' : ''}`}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="chat-main">
          <header className="chat-header">
            <h1>
              Chat with <b>A Friendly Chat Bot</b>
            </h1>
          </header>
          <div className="chat-messages-container">
            <div className="chat-messages" ref={messagesContainerRef}>
              {chatHistory.map((chat, index) => (
                <div key={index} className="chat-message-box">
                  <div className="chat-message user-message">
                    <div className="message-avatar">You</div>
                    <div className="message-content">
                      <div className="message-text">{chat.prompt}</div>
                    </div>
                  </div>
                  <div className="chat-message ai-message">
                    <div className="message-avatar">AI</div>
                    <div className="message-content">
                      <div className="message-text">
                        {formatResponse(chat.response)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {loading && (
                <div className="chat-message-box">
                  <div className="chat-message user-message">
                    <div className="message-avatar">You</div>
                    <div className="message-content">
                      <div className="message-text">{prompt}</div>
                    </div>
                  </div>
                  <div className="chat-message ai-message">
                    <div className="message-avatar">AI</div>
                    <div className="message-content">
                      <div className="typing-indicator">
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="chat-input-container">
            <form onSubmit={handleSubmit} className="chat-form">
              <textarea
                value={prompt}
                onChange={handlePromptChange}
                onKeyDown={handleKeyDown}
                placeholder="Enter your prompt here..."
                className="chat-input"
                rows="3"
              />
              <button type="submit" className="chat-button" disabled={loading}>
                {loading ? "Thinking..." : "Send"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatAi;