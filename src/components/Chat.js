import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';

function Chat() {
  const [messages, setMessages] = useState([
    { text: "Hello! How can I help you today?", isBot: true }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const WEBHOOK_URL = 'http://localhost:5678/webhook-test/eccfcc42-de8c-4986-98e4-2694664379d9';

  const formatResponse = (data) => {
    if (Array.isArray(data) && data.length > 0 && data[0].output?.results?.urls) {
      const urls = data[0].output.results.urls;
      if (urls.length === 0) {
        return "No results found.";
      }
      return urls.map(url => (
        `🔗 ${url}`
      )).join('\n');
    }
    return "Sorry, I couldn't process the response format.";
  };

  const sendToWebhook = async (message) => {
    try {
      console.log('Sending request to webhook:', WEBHOOK_URL);
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          message: message,
          timestamp: new Date().toISOString(),
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);
      console.log('Webhook response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Webhook error response:', errorText);
        throw new Error(`Webhook request failed with status ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      console.log('Webhook response data:', data);
      return {
        response: formatResponse(data),
        rawData: data
      };
    } catch (error) {
      console.error('Detailed error when sending message to webhook:', error);
      
      if (error.name === 'AbortError') {
        return { error: 'Request timed out. The server took too long to respond.' };
      }
      
      if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
        return { 
          error: 'Could not connect to the server. Please check if the webhook server is running at ' + WEBHOOK_URL 
        };
      }

      return { 
        error: `Error: ${error.message}. Please ensure the webhook server is running and accessible.` 
      };
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading) return;

    setIsLoading(true);

    // Add user message
    const newMessages = [...messages, { text: inputMessage, isBot: false }];
    setMessages(newMessages);
    
    try {
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
          isError: !!webhookResponse?.error,
          rawData: webhookResponse?.rawData
        }]);
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error in handleSendMessage:', error);
      setMessages(prev => [...prev, {
        text: "An error occurred while sending your message. Please try again.",
        isBot: true,
        isError: true
      }]);
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const MessageContent = ({ message }) => {
    if (!message.isBot) {
      return <div className="message-text">{message.text}</div>;
    }

    return (
      <div className="message-text">
        {message.text.split('\n').map((line, i) => (
          <div key={i}>
            {line.startsWith('🔗') ? (
              <a 
                href={line.substring(2).trim()} 
                target="_blank" 
                rel="noopener noreferrer"
                className="url-link"
              >
                {line}
              </a>
            ) : (
              line
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="App">
      <div className="chat-container">
        <div className="chat-header">
          <h1>Smart Finder Chat</h1>
          <button onClick={handleLogout} className="logout-button">
            Logout
          </button>
        </div>
        
        <div className="messages-container">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`message ${message.isBot ? 'bot' : 'user'} ${message.isError ? 'error' : ''}`}
            >
              <MessageContent message={message} />
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

export default Chat; 