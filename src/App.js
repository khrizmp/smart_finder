import { useState } from 'react';
import './App.css';

function App() {
  const [messages, setMessages] = useState([
    { text: "Hello! How can I help you today?", isBot: true }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const sendToWebhook = async (message) => {
    try {
      console.log('Sending request to webhook...');
      const response = await fetch('https://n8n-automation.lnc-live.com/webhook-test/eccfcc42-de8c-4986-98e4-2694664379d9', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          message: message,
          timestamp: new Date().toISOString(),
        }),
      });

      console.log('Webhook response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Webhook error response:', errorText);
        throw new Error(`Webhook request failed with status ${response.status}`);
      }

      const data = await response.json();
      console.log('Webhook response data:', data);
      return data;
    } catch (error) {
      console.error('Detailed error when sending message to webhook:', error);
      if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
        return { error: 'Could not connect to the server. Please check if the webhook server is running.' };
      }
      return { error: `Error: ${error.message}` };
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading) return;

    setIsLoading(true);

    // Add user message
    const newMessages = [...messages, { text: inputMessage, isBot: false }];
    setMessages(newMessages);
    
    // Send to webhook
    const webhookResponse = await sendToWebhook(inputMessage);
    
    // Clear input regardless of webhook response
    setInputMessage('');

    // Add response message
    setTimeout(() => {
      setMessages(prev => [...prev, {
        text: webhookResponse?.response || 
              webhookResponse?.error || 
              "An unexpected error occurred. Please try again.",
        isBot: true,
        isError: !!webhookResponse?.error
      }]);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="App">
      <div className="chat-container">
        <div className="chat-header">
          <h1>Smart Finder Chat</h1>
        </div>
        
        <div className="messages-container">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`message ${message.isBot ? 'bot' : 'user'} ${message.isError ? 'error' : ''}`}
            >
              {message.text}
            </div>
          ))}
          {isLoading && (
            <div className="message bot loading">
              <span className="loading-dots">...</span>
            </div>
          )}
        </div>

        <form onSubmit={handleSendMessage} className="input-container">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Type your message here..."
            disabled={isLoading}
          />
          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Sending...' : 'Send'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default App;
