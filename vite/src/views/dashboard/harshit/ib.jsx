import React, { useState } from 'react';

function IB() {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState('');

  // Simple bot response function
  const getBotResponse = (message) => {
    const lowerMessage = message.toLowerCase();
  
    if (lowerMessage.includes("hello")) {
      return 'Hello! I am here to give information on your inventory. (You may ask "What are the products with rating 4.5?")';
    } 
    else if (lowerMessage.includes("what is the quantity of products in hair care")) {
      return "68";
    } 
    else if (lowerMessage.includes("tell me about nivia products")) {
      return `Nivea offers a wide range of products in the beauty and hygiene category, with a total of 64 products in their lineup. These products have an average rating of 4.2 out of 5 stars, indicating high customer satisfaction.
  
  The top-rated products from Nivea include the Sensitive Cooling Shaving Gel with a perfect 5-star rating, followed closely by the Whitening Talc Touch Deodorant and the Creme Care Soap for Hands and Body, both with a 4.7-star rating.
  
  Nivea's product range covers a variety of categories, including soaps, body lotions, deodorants, face washes, and lip balms. They offer products suitable for different skin types, including sensitive skin, dry skin, and oily skin.
  
  Some popular products from Nivea include the Soft Aloe Moisturising Cream, the Whitening Smooth Skin Women Deodorant, and the Milk Delights Face Wash with Turmeric for Acne Prone Skin.
  
  Overall, Nivea's products are known for their high quality and effectiveness, making them a popular choice among consumers.`;
    } 
    else {
      return "Sorry, I didn't quite understand that.";
    }
  };

  // Handle user input submission
  const handleSend = () => {
    if (userInput.trim() !== '') {
      const newMessages = [...messages, { text: userInput, sender: 'user' }];
      setMessages(newMessages);

      const botMessage = getBotResponse(userInput);
      setTimeout(() => {
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: botMessage, sender: 'bot' },
        ]);
      }, 1000); // Delay for bot response

      setUserInput(''); // Clear input field
    }
  };

  // Handle input on enter key
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSend();
  };

  return (
    <div style={styles.chatContainer}>
      <div style={styles.chatArea}>
        {messages.map((msg, index) => (
          <div
            key={index}
            style={{
              ...styles.message,
              alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
              backgroundColor: msg.sender === 'user' ? '#daf8e3' : '#f0f0f0',
            }}
          >
            {msg.text}
          </div>
        ))}
      </div>
      <div style={styles.inputArea}>
        <input
          style={styles.input}
          type="text"
          placeholder="Enter Queries wrt Inventory here."
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button style={styles.sendButton} onClick={handleSend}>Send</button>
      </div>
    </div>
  );
}

// Basic styling for the chat components
const styles = {
  chatContainer: {
    width: '400px',
    height: '600px',
    border: '1px solid #ccc',
    borderRadius: '8px',
    display: 'flex',
    flexDirection: 'column',
  },
  chatArea: {
    flex: 1,
    padding: '10px',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  message: {
    padding: '10px',
    borderRadius: '8px',
    maxWidth: '80%',
  },
  inputArea: {
    display: 'flex',
    padding: '10px',
    borderTop: '1px solid #ccc',
  },
  input: {
    flex: 1,
    padding: '10px',
    borderRadius: '8px',
    border: '1px solid #ccc',
    outline: 'none',
  },
  sendButton: {
    marginLeft: '10px',
    padding: '10px',
    borderRadius: '8px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    cursor: 'pointer',
  },
};

export default IB;
