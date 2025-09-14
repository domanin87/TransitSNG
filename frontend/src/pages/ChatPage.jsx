import React, {useEffect, useState, useRef} from 'react'
import { io } from 'socket.io-client'
export default function ChatPage(){
  const [messages,setMessages] = useState([])
  const [text,setText] = useState('')
  const socketRef = useRef()
  useEffect(()=>{
    // connect to backend socket endpoint - update URL to your backend
    socketRef.current = io(process.env.REACT_APP_SOCKET_URL || 'https://cargosng-backend-v2.onrender.com',{transports:['websocket']})
    socketRef.current.on('connect', ()=> console.log('socket connected', socketRef.current.id))
    socketRef.current.on('chat message', msg => setMessages(m=>[...m,msg]))
    return ()=> socketRef.current.disconnect()
  },[])
  const send = ()=>{
    if(!text) return
    socketRef.current.emit('chat message', {text,ts:Date.now()})
    setText('')
  }
  return (
    <div className="container">
      <h2>Чат</h2>
      <div style={{border:'1px solid #e6eef6',padding:12,borderRadius:8,height:360,overflow:'auto'}}>
        {messages.map((m,i)=><div key={i} style={{marginBottom:8}}><b>{m.sender||'user'}:</b> {m.text}</div>)}
      </div>
      <div style={{display:'flex',gap:8,marginTop:8}}>
        <input className="input" value={text} onChange={e=>setText(e.target.value)} />
        <button className="btn" onClick={send}>Отправить</button>
      </div>
    </div>
  )
}
