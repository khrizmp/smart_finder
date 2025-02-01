import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';

function Chat() {
  const [messages, setMessages] = useState([{ text: "Hello! How can I help you today?", isBot: true }]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const WEBHOOK_URL = 'http://localhost:5678/webhook-test/eccfcc42-de8c-4986-98e4-2694664379d9';

  const formatResponse = (data) => {
    if (data?.[0]?.output?.results?.urls?.length) {
      return data[0].output.results.urls.map(url => `🔗 ${url}`).join('\n');
    }
    return "No results found.";
  };

  const sendToWebhook = async (message) => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ message, timestamp: new Date().toISOString() }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      if (!response.ok) throw new Error(`Request failed: ${response.status}`);

      const data = await response.json();
      return { response: formatResponse(data), rawData: data };
    } catch (error) {
      return { error: error.name === 'AbortError' ? 'Request timed out.' : 'We are experiencing issues. Please try again later.' };
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading) return;

    setIsLoading(true);
    setMessages(prev => [...prev, { text: inputMessage, isBot: false }]);

    const webhookResponse = await sendToWebhook(inputMessage);
    setInputMessage('');
    setTimeout(() => {
      setMessages(prev => [...prev, { text: webhookResponse.response || webhookResponse.error || "Unexpected error.", isBot: true }]);
      setIsLoading(false);
    }, 1000);
  };

  const MessageContent = ({ message }) => (
    <div className="message-text">
      {message.text.split('\n').map((line, i) => (
        <div key={i}>
          {line.startsWith('🔗') ? <a href={line.slice(2)} target="_blank" rel="noopener noreferrer" className="url-link">{line}</a> : line}
        </div>
      ))}
    </div>
  );

  return (
    <div className="App">
      <div className="chat-container">
        <div className="chat-header">
          <h1>Smart Finder Chat</h1>
          <button onClick={() => { localStorage.removeItem('token'); navigate('/login'); }} className="logout-button">Logout</button>
        </div>

        <div className="messages-container">
          {messages.map((message, index) => (
            <div key={index} className={`message ${message.isBot ? 'bot' : 'user'}`}>
              <MessageContent message={message} />
            </div>
          ))}
          {isLoading && <div className="message bot loading"><span className="loading-dots">...</span></div>}
        </div>

        <form onSubmit={handleSendMessage} className="input-container">
          <input type="text" value={inputMessage} onChange={(e) => setInputMessage(e.target.value)} placeholder="Type your message here..." disabled={isLoading} />
          <button type="submit" disabled={isLoading}>{isLoading ? 'Sending...' : 'Send'}</button>
        </form>
      </div>
    </div>
  );
}

export default Chat;
