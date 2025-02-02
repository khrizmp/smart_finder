import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Chat.css';

const WEBHOOK_URL = 'https://n8n-automation.lnc-live.com/webhook/89f3d809-3565-4ea5-b242-8bfe2538dd0f';
const TIMEOUT_DURATION = 300000; // 5 minutes

function Chat() {
  const [messages, setMessages] = useState([{ text: "Hello! How can I help you today?", isBot: true }]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // 🔗 Format webhook response
  const formatResponse = (data) => {
    console.log('Raw webhook response:', JSON.stringify(data, null, 2));
    
    // Handle direct output format
    if (data?.output) {
      console.log('Found direct text output:', data.output);
      return data.output;
    }
    
    // Handle array format with URLs (keeping backward compatibility)
    if (data?.[0]?.output?.results?.urls?.length) {
      const urls = data[0].output.results.urls;
      console.log('Found URLs:', urls);
      return urls.map(url => `🔗 ${url}`).join('\n');
    }
    
    // Handle array format with text output (keeping backward compatibility)
    if (data?.[0]?.output) {
      console.log('Found array text output:', data[0].output);
      return data[0].output;
    }
    
    console.log('No valid response format found');
    return "No results found.";
  };

  // 🚀 Send message to webhook
  const sendToWebhook = async (message) => {
    console.log('Sending message to webhook:', message);
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        console.log('Request timed out after', TIMEOUT_DURATION/1000, 'seconds');
        controller.abort();
      }, TIMEOUT_DURATION);

      console.log('Making request to:', WEBHOOK_URL);
      const res = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message, 
          timestamp: new Date().toISOString() 
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      console.log('Response status:', res.status);

      if (!res.ok) {
        console.error('Request failed with status:', res.status);
        throw new Error('Request failed');
      }

      const data = await res.json();
      console.log('Webhook response received:', JSON.stringify(data, null, 2));
      const formattedResponse = formatResponse(data);
      console.log('Formatted response:', formattedResponse);
      return formattedResponse;
    } catch (err) {
      console.error('Webhook error:', {
        name: err.name,
        message: err.message,
        stack: err.stack
      });
      return err.name === 'AbortError' 
        ? '⏱️ Request timed out (5 minutes). Please try again.' 
        : '⚠️ Error occurred. Try again later.';
    }
  };

  // 📩 Handle sending message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading) return;

    console.log('Processing new message:', inputMessage);
    const userMessage = { text: inputMessage, isBot: false };
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const botResponse = await sendToWebhook(inputMessage);
      console.log('Bot response received:', botResponse);
      setMessages(prev => [...prev, { text: botResponse, isBot: true }]);
    } catch (error) {
      console.error('Error handling message:', error);
      setMessages(prev => [...prev, { 
        text: "An error occurred while processing your message.", 
        isBot: true,
        isError: true
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  // 💬 Render message content
  const Message = ({ text, isBot }) => (
    <div className={`message ${isBot ? 'bot' : 'user'}`}>
      {text.split('\n').map((line, i) =>
        line.startsWith('🔗') ? (
          <a key={i} href={line.slice(2)} target="_blank" rel="noopener noreferrer" className="url-link">
            {line}
          </a>
        ) : (
          <div key={i}>{line}</div>
        )
      )}
    </div>
  );

  return (
    <div className="App">
      <div className="chat-container">
        <header className="chat-header">
          <h1>Smart Finder Chat</h1>
          <button onClick={() => { localStorage.removeItem('token'); navigate('/login'); }} className="logout-button">
            Logout
          </button>
        </header>

        <div className="messages-container">
          {messages.map((msg, index) => (
            <Message key={index} {...msg} />
          ))}
          {isLoading && <div className="message bot">⏳ Loading...</div>}
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

export default Chat;