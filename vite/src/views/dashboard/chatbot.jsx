// Chatbot.jsx

import React, { useState } from "react";
import Groq from "groq-sdk";
const groqApiKey = "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";

  // Initialize Groq SDK with the API key
  const groq = new Groq({ apiKey: groqApiKey,dangerouslyAllowBrowser: true });


const Chatbot = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { role: "system", content: "You are now chatting with Llama!" },
  ]);
  const [loading, setLoading] = useState(false);

  // Function to handle user input and call the model
  const handleSendMessage = async () => {
    if (!input.trim()) return;
    const userMessage = { role: "user", content: input };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInput("");
    setLoading(true);

    try {
      // Call the Llama model using Groq API
      const response = await groq.chat.completions.create({
        messages: [...messages, userMessage],
        model: "llama3-8b-8192",
      });

      const botReply = response.choices[0]?.message?.content || "No response";
      setMessages((prevMessages) => [
        ...prevMessages,
        { role: "assistant", content: botReply },
      ]);
    } catch (error) {
      console.error("Error getting chat completion:", error);
      setMessages((prevMessages) => [
        ...prevMessages,
        { role: "assistant", content: "Error getting response. Try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.chatContainer}>
      <h2>Llama Chatbot</h2>
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
        <input
          type="text"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          style={styles.input}
        />
        <button onClick={handleSendMessage} style={styles.button}>
          Send
        </button>
      </div>
    </div>
  );
};

// Inline styling for simplicity
const styles = {
  chatContainer: {
    maxWidth: "500px",
    margin: "0 auto",
    padding: "1rem",
    background: "#f7f7f7",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  },
  chatBox: {
    maxHeight: "300px",
    overflowY: "auto",
    marginBottom: "1rem",
    padding: "1rem",
    backgroundColor: "#ffffff",
    borderRadius: "8px",
    boxShadow: "inset 0 4px 8px rgba(0, 0, 0, 0.05)",
  },
  userMessage: {
    textAlign: "right",
    margin: "0.5rem 0",
    padding: "0.5rem",
    backgroundColor: "#d1e7ff",
    borderRadius: "8px",
  },
  assistantMessage: {
    textAlign: "left",
    margin: "0.5rem 0",
    padding: "0.5rem",
    backgroundColor: "#e9e9e9",
    borderRadius: "8px",
  },
  loading: {
    fontStyle: "italic",
    color: "#888",
  },
  inputContainer: {
    display: "flex",
    gap: "0.5rem",
  },
  input: {
    flexGrow: 1,
    padding: "0.5rem",
    borderRadius: "4px",
    border: "1px solid #ccc",
  },
  button: {
    padding: "0.5rem 1rem",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
};

export default Chatbot;
