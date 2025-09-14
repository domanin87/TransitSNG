
import React, { useEffect, useState, useRef } from 'react'
import axios from 'axios'
import { io } from 'socket.io-client'
export default function Chat(){
  const API = window.APP_CONFIG?.API_URL || '/api/v1'
  const [msgs,setMsgs] = useState([])
  const [text,setText] = useState('')
  const socketRef = useRef(null)
  useEffect(()=>{
    axios.get(`${API}/chat/history`).then(r=>setMsgs(r.data)).catch(()=>{})
    const socket = io(API.replace('/api/v1',''), { transports: ['websocket'] })
    socketRef.current = socket
    socket.on('message', (m)=> setMsgs(prev=>[...prev, m]))
    return ()=> socket.disconnect()
  },[])
  const send = async ()=>{
    if(!text) return;
    await axios.post(`${API}/chat/send`, { text })
    setText('')
  }
  return (<div className="card"><h2>Чат</h2><div className="chat-list">{msgs.map(m=>(<div key={m.id||m.created_at}><b>{m.from_user_id||'User'}</b>: {m.text}</div>))}</div><div style={{marginTop:10}}><input value={text} onChange={e=>setText(e.target.value)} placeholder="Сообщение"/><button onClick={send}>Отправить</button></div></div>)
}
