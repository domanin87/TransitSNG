import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import io from 'socket.io-client';
import { apiRequest } from '../index';

const socket = io('http://localhost:3001');

export default function ChatPage() {
  const { t } = useTranslation();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));

  useEffect(() => {
    const loadMessages = async () => {
      try {
        const data = await apiRequest('/messages');
        setMessages(data);
      } catch (err) {
        console.error(err);
      }
    };
    loadMessages();

    socket.on('chat message', (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => socket.off('chat message');
  }, []);

  const sendMessage = async () => {
    if (!newMessage.trim() || !user) return;
    const message = { userId: user.id, username: user.name, content: newMessage, timestamp: new Date().toISOString() };
    try {
      await apiRequest('/messages', { method: 'POST', body: message });
      socket.emit('chat message', message);
      setNewMessage('');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container">
      <h2 className="text-2xl mb-4">{t('chat')}</h2>
      <div className="card">
        <div className="h-96 overflow-auto mb-4">
          {messages.map((msg, index) => (
            <div key={index} className="p-2 border-b">
              <span className="font-bold">{msg.username}: </span>
              <span>{msg.content}</span>
              <span className="text-xs text-muted ml-2">{new Date(msg.timestamp).toLocaleTimeString()}</span>
            </div>
          ))}
        </div>
        {user ? (
          <div className="flex gap-2">
            <input
              className="input flex-1"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder={t('type_message')}
            />
            <button className="btn" onClick={sendMessage}>{t('send')}</button>
          </div>
        ) : (
          <p>{t('login_to_chat')}</p>
        )}
      </div>
    </div>
  );
}