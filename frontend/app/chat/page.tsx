// pages/chat.js
import { useEffect, useState } from 'react';
import socket from '../lib/socket';

export default function Chat() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);

  // Load chat history on mount
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/api/chat`);
        const data = await res.json();
        setMessages(data);
      } catch (err) {
        console.error('Error fetching chat history:', err);
      }
    };

    fetchMessages();
  }, []);

  // Setup socket listener
  useEffect(() => {
    socket.on('receive_message', (message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => socket.off('receive_message');
  }, []);

  const sendMessage = () => {
    if (!input.trim()) return;

    const msg = {
      text: input,
      senderId: 'frontendUser123', // Replace this with real user ID if needed
    };

    socket.emit('send_message', msg);
    setInput('');
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Live Chat</h1>

      <div style={{
        border: '1px solid #ccc',
        borderRadius: '8px',
        padding: '1rem',
        maxHeight: '300px',
        overflowY: 'auto',
        marginBottom: '1rem'
      }}>
        {messages.map((m, i) => (
          <div key={i} style={{ marginBottom: '0.5rem' }}>
            <strong>{m.senderId || 'Unknown'}:</strong> {m.text}
          </div>
        ))}
      </div>

      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type your message"
        style={{ padding: '0.5rem', width: '300px', marginRight: '1rem' }}
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}
