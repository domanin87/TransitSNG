import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { getMessages } from "../api";
const SOCKET_URL = process.env.REACT_APP_WS_URL || (process.env.REACT_APP_API_URL ? process.env.REACT_APP_API_URL.replace(/^http/, 'ws') : "ws://localhost:5000");
const socket = io(SOCKET_URL, { transports: ["websocket"] });
const ChatPage = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  useEffect(()=>{ const load = async ()=>{ try{ const d = await getMessages(); setMessages(Array.isArray(d)?d:[]);}catch(e){console.error(e);} }; load(); },[]);
  useEffect(()=>{ socket.on("chat_message", m=> setMessages(p=>[...p,m])); return ()=> socket.off("chat_message"); },[]);
  const send = (e)=>{ e.preventDefault(); if(input.trim()){ socket.emit("chat_message", input); setInput(""); } };
  return (<div><h2>Чат</h2><div>{messages.map((m,i)=>(<div key={i}>{typeof m==='string'?m:JSON.stringify(m)}</div>))}</div><form onSubmit={send}><input value={input} onChange={e=>setInput(e.target.value)}/><button type="submit">Отправить</button></form></div>);
};
export default ChatPage;
