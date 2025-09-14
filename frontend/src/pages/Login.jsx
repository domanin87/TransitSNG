import React, { useState } from 'react'
export default function Login(){ 
  const [email,setEmail] = useState('')
  const [pass,setPass] = useState('')
  const submit = ()=>{ localStorage.setItem('token','demo-token'); alert('Вход выполнен (demo)'); window.location='/'; }
  return (
    <div className='container' style={{maxWidth:420}}>
      <h2>Войти</h2>
      <div className='search-card'>
        <input className='input' placeholder='Email' value={email} onChange={e=>setEmail(e.target.value)} />
        <input className='input' placeholder='Пароль' type='password' value={pass} onChange={e=>setPass(e.target.value)} />
        <div style={{textAlign:'right'}}><button className='btn' onClick={submit}>Войти</button></div>
      </div>
    </div>
  )
}
