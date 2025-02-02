import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Chat.css';

const WEBHOOK_URL = 'http://localhost:5678/webhook-test/eccfcc42-de8c-4986-98e4-2694664379d9';

function Chat() {
  const [messages, setMessages] = useState([{ text: "Hello! How can I help you today?", isBot: true }]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // 🔗 Format webhook response
  const formatResponse = (data) =>
    data?.[0]?.output?.results?.urls?.length
      ? data[0].output.results.urls.map(url => `🔗 ${url}`).join('\n')
      : "No results found.";

  // 🚀 Send message to webhook
  const sendToWebhook = async (message) => {
    try {
      const controller = new AbortController();
      setTimeout(() => controller.abort(), 10000); // Timeout in 10s

      const res = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, timestamp: new Date().toISOString() }),
        signal: controller.signal,
      });

      if (!res.ok) throw new Error('Request failed');
      const data = await res.json();
      return formatResponse(data);
    } catch (err) {
      return err.name === 'AbortError' ? '⏱️ Request timed out.' : '⚠️ Error occurred. Try again later.';
    }
  };

  // 📩 Handle sending message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = { text: inputMessage, isBot: false };
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    const botResponse = await sendToWebhook(inputMessage);
    setMessages(prev => [...prev, { text: botResponse, isBot: true }]);
    setIsLoading(false);
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