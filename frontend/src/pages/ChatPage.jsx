// frontend/src/pages/ChatPage.jsx
import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { getMessages } from "../api";

const socket = io("wss://transitsng-backend.onrender.com", {
  transports: ["websocket"],
});

const ChatPage = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  // Загружаем старые сообщения
  useEffect(() => {
    const loadMessages = async () => {
      try {
        const data = await getMessages();
        setMessages(data);
      } catch (err) {
        console.error("Ошибка загрузки сообщений:", err);
      }
    };
    loadMessages();
  }, []);

  // Получаем новые сообщения по сокету
  useEffect(() => {
    socket.on("chat_message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });
    return () => {
      socket.off("chat_message");
    };
  }, []);

  // Отправка сообщений
  const sendMessage = (e) => {
    e.preventDefault();
    if (input.trim() !== "") {
      socket.emit("chat_message", input);
      setInput("");
    }
  };

  return (
    <div className="chat-container">
      <h2>Чат</h2>
      <div className="chat-box">
        {messages.map((msg, i) => (
          <div key={i} className="chat-msg">
            {msg}
          </div>
        ))}
      </div>
      <form onSubmit={sendMessage}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Введите сообщение..."
        />
        <button type="submit">Отправить</button>
      </form>
    </div>
  );
};

export default ChatPage;
