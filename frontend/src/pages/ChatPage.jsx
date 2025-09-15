import React, {useEffect, useState, useRef} from 'react'
import { io } from 'socket.io-client'

export default function ChatPage(){
  const [messages, setMessages] = useState([])
  const [text, setText] = useState('')
  const [connected, setConnected] = useState(false)
  const [error, setError] = useState(null)
  const socketRef = useRef()

  // Получаем имя пользователя из localStorage или используем "Гость"
  const getUserName = () => {
    return localStorage.getItem('userName') || 'Гость';
  }

  // Загружаем историю сообщений из localStorage
  const loadMessageHistory = () => {
    try {
      const stored = localStorage.getItem('chatMessages');
      if (stored) {
        const messages = JSON.parse(stored);
        // Фильтруем сообщения старше 2 дней
        const twoDaysAgo = Date.now() - (2 * 24 * 60 * 60 * 1000);
        const recentMessages = messages.filter(msg => msg.ts > twoDaysAgo);
        
        if (recentMessages.length !== messages.length) {
          // Сохраняем отфильтрованный список
          localStorage.setItem('chatMessages', JSON.stringify(recentMessages));
        }
        
        return recentMessages;
      }
    } catch (e) {
      console.error('Error loading message history:', e);
    }
    return [];
  }

  // Сохраняем сообщения в localStorage
  const saveMessageHistory = (messages) => {
    try {
      localStorage.setItem('chatMessages', JSON.stringify(messages));
    } catch (e) {
      console.error('Error saving message history:', e);
    }
  }

  useEffect(() => {
    // Загружаем историю сообщений при монтировании компонента
    setMessages(loadMessageHistory());

    try {
      // Подключаемся к серверу WebSocket
      socketRef.current = io(process.env.REACT_APP_SOCKET_URL || 'https://cargosng-backend-v2.onrender.com', {
        transports: ['websocket'],
        timeout: 5000
      })
      
      socketRef.current.on('connect', () => {
        console.log('socket connected', socketRef.current.id)
        setConnected(true)
        setError(null)
      })
      
      socketRef.current.on('disconnect', () => {
        console.log('socket disconnected')
        setConnected(false)
      })
      
      socketRef.current.on('connect_error', (err) => {
        console.error('Connection error:', err)
        setError('Не удалось подключиться к серверу чата')
        setConnected(false)
      })
      
      socketRef.current.on('chat message', msg => {
        // Добавляем имя отправителя, если его нет
        if (!msg.sender) {
          msg.sender = getUserName();
        }
        
        // Добавляем timestamp, если его нет
        if (!msg.ts) {
          msg.ts = Date.now();
        }
        
        // Обновляем состояние и сохраняем в localStorage
        setMessages(prevMessages => {
          const newMessages = [...prevMessages, msg];
          saveMessageHistory(newMessages);
          return newMessages;
        });
      })
      
      return () => {
        if (socketRef.current) {
          socketRef.current.disconnect()
        }
      }
    } catch (err) {
      console.error('Socket initialization error:', err)
      setError('Ошибка инициализации чата')
    }
  }, [])
  
  const send = () => {
    if (!text) return
    
    try {
      const userName = getUserName();
      
      if (connected && socketRef.current) {
        // Отправляем на сервер, если подключены
        socketRef.current.emit('chat message', {
          text, 
          sender: userName,
          ts: Date.now()
        });
      } else {
        // Локальное сохранение, если сервер недоступен
        const newMessage = {
          text,
          sender: userName,
          ts: Date.now()
        };
        
        setMessages(prevMessages => {
          const newMessages = [...prevMessages, newMessage];
          saveMessageHistory(newMessages);
          return newMessages;
        });
      }
      
      setText('')
    } catch (err) {
      console.error('Send error:', err)
      setError('Ошибка отправки сообщения')
    }
  }

  return (
    <div className="container">
      <h2>Чат</h2>
      
      {error && (
        <div style={{color: 'red', padding: '10px', background: '#ffeeee', borderRadius: '5px', marginBottom: '10px'}}>
          {error}
        </div>
      )}
      
      {!connected && (
        <div style={{color: 'orange', padding: '10px', background: '#fff8e6', borderRadius: '5px', marginBottom: '10px'}}>
          Чат работает в автономном режиме. Сообщения сохранятся локально.
        </div>
      )}
      
      <div style={{border: '1px solid #e6eef6', padding: 12, borderRadius: 8, height: 360, overflow: 'auto'}}>
        {messages.length === 0 ? (
          <div style={{textAlign: 'center', padding: '20px', color: '#666'}}>
            Нет сообщений
          </div>
        ) : (
          messages.map((m, i) => (
            <div key={i} style={{marginBottom: 8}}>
              <b>{m.sender}:</b> {m.text}
              <span style={{fontSize: '0.8em', color: '#666', marginLeft: '8px'}}>
                {new Date(m.ts).toLocaleTimeString()}
              </span>
            </div>
          ))
        )}
      </div>
      
      <div style={{display: 'flex', gap: 8, marginTop: 8}}>
        <input 
          className="input" 
          value={text} 
          onChange={e => setText(e.target.value)} 
          placeholder="Введите сообщение..."
          onKeyPress={e => e.key === 'Enter' && send()}
        />
        <button className="btn" onClick={send} disabled={!text}>
          Отправить
        </button>
      </div>
    </div>
  )
}