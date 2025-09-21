import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { io } from 'socket.io-client';
import { apiRequest } from '../index';

export default function ChatPage({ user }) {
  const { t } = useTranslation();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Инициализация Socket.IO
    const socketUrl = process.env.REACT_APP_API_URL || 'https://transitsng.onrender.com';
    const newSocket = io(socketUrl, {
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 5,
      auth: { token: localStorage.getItem('token') },
    });
    setSocket(newSocket);

    // Загрузка сообщений
    const loadMessages = async () => {
      try {
        setLoading(true);
        const data = await apiRequest('GET', '/api/messages');
        setMessages(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadMessages();

    // Обработчики Socket.IO
    newSocket.on('connect_error', (err) => {
      setError(`Ошибка подключения Socket.IO: ${err.message}`);
    });

    newSocket.on('message', (message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const sendMessage = async () => {
    if (!newMessage.trim() || !user) return;
    try {
      const messageData = { userId: user.id, content: newMessage, timestamp: new Date().toISOString() };
      await apiRequest('POST', '/api/messages', messageData);
      socket.emit('message', messageData);
      setNewMessage('');
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div className="text-center">{t('loading')}</div>;
  if (error) return <div className="text-red-500">{t('error')}: {error}</div>;

  return (
    <div className="flex flex-col h-screen">
      <h2 className="text-2xl mb-4">{t('chat')}</h2>
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((msg, index) => (
          <div key={index} className={`mb-2 ${msg.userId === user.id ? 'text-right' : 'text-left'}`}>
            <span className="font-bold">{msg.userId === user.id ? t('you') : msg.userId}: </span>
            {msg.content}
            <span className="text-xs text-gray-500 ml-2">{new Date(msg.timestamp).toLocaleTimeString()}</span>
          </div>
        ))}
      </div>
      <div className="p-4 border-t">
        <input
          className="input w-full"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder={t('type_message')}
        />
        <button className="btn mt-2" onClick={sendMessage}>{t('send')}</button>
      </div>
    </div>
  );
}