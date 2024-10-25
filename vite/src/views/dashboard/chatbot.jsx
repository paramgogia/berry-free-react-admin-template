// Chatbot.jsx

import { padding } from "@mui/system";
import React, { useState } from "react";

const Chatbot = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { role: "system", content: "You are now chatting with Llama!" },
  ]);
  const [loading, setLoading] = useState(false);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    const userMessage = { role: "user", content: input };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInput("");
    setLoading(true);

    // Simulating a bot reply
    setTimeout(() => {
      const botReply = "Llama says: " + "Hello! How can I help you today?";
      setMessages((prevMessages) => [
        ...prevMessages,
        { role: "assistant", content: botReply },
      ]);
      setLoading(false);
    }, 1000);
  };

  return (
    <div style={styles.chatContainer}>
      <h2 style={styles.header}>Llama Chatbot</h2>
      <div style={styles.chatBox}>
        {messages.map((msg, index) => (
          <div
            key={index}
            style={
              msg.role === "user"
                ? styles.userMessage
                : styles.assistantMessage
            }
          >
            <strong>{msg.role === "user" ? "You" : "Llama"}:</strong> {msg.content}
          </div>
        ))}
        {loading && <p style={styles.loading}>Llama is typing...</p>}
      </div>
      <div style={styles.inputContainer}>
        <form className="flex flex-1 gap-2">
          <input
            preventDefault
            type="text"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            style={styles.input}
          />
          <button onClick={handleSendMessage} style={styles.button}>
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

// Inline styling with an enhanced contrasting color palette
const styles = {
  chatContainer: {
    maxWidth: "500px",
    margin: "0 auto",
    padding: "1rem",
    background: "#4a148c", // deep purple background
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    color: "#ffffff", // white text for contrast
  },
  header: {
    color: "#ffeb3b", // bright yellow for the header
    marginBottom: "1rem",
  },
  chatBox: {
    maxHeight: "300px",
    overflowY: "auto",
    marginBottom: "1rem",
    padding: "1rem",
    backgroundColor: "#6a1b9a", // darker purple for chat area
    borderRadius: "8px",
    boxShadow: "inset 0 4px 8px rgba(0, 0, 0, 0.05)",
  },
  userMessage: {
    textAlign: "right",
    margin: "0.5rem 0",
    padding: "0.5rem",
    backgroundColor: "#00bcd4", // vibrant teal for user messages
    borderRadius: "8px",
    color: "#fff", // white text
  },
  assistantMessage: {
    textAlign: "left",
    margin: "0.5rem 0",
    padding: "0.5rem",
    backgroundColor: "#ff7043", // soft orange for assistant messages
    borderRadius: "8px",
    color: "#fff", // white text
  },
  loading: {
    fontStyle: "italic",
    color: "#e0e0e0", // light gray for loading message
  },
  inputContainer: {
    display: "flex",
    gap: "0.5rem",
    padding:"0.5rem"
  },
  input: {
    flexGrow: 1,
    padding: "0.5rem",
    borderRadius: "4px",
    border: "1px solid #ccc",
    backgroundColor: "#ffffff", // white background for input
    color: "#000", // black text for input
  },
  button: {
    padding: "0.5rem 1rem",
    backgroundColor: "#ffeb3b", // bright yellow for button
    color: "#000", // dark text for button
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
};

export default Chatbot;
