import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './styles.css'
import './i18n'
createRoot(document.getElementById('root')).render(<React.StrictMode><App/></React.StrictMode>)

// Очистка старых сообщений при загрузке приложения
const clearOldMessages = () => {
  try {
    const stored = localStorage.getItem('chatMessages');
    if (stored) {
      const messages = JSON.parse(stored);
      const twoDaysAgo = Date.now() - (2 * 24 * 60 * 60 * 1000);
      const recentMessages = messages.filter(msg => msg.ts > twoDaysAgo);
      
      if (recentMessages.length !== messages.length) {
        localStorage.setItem('chatMessages', JSON.stringify(recentMessages));
      }
    }
  } catch (e) {
    console.error('Error clearing old messages:', e);
  }
}

// Вызывайте эту функцию при запуске приложения
clearOldMessages();
