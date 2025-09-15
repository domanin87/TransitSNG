import React, {useState} from 'react'
export default function Login(){
  const [email,setEmail]=useState(''), [pass,setPass]=useState('')
  const submit = ()=>{ 
    localStorage.setItem('token','demo'); 
    localStorage.setItem('userName', email); // Сохраняем email как имя пользователя
    alert('Вход demo'); 
    window.location='#/'; 
  }
  return (<div className='container'><h2>Вход</h2><div style={{maxWidth:420}} className='card'><input className='input' placeholder='Email' value={email} onChange={e=>setEmail(e.target.value)} /><input className='input' placeholder='Пароль' type='password' value={pass} onChange={e=>setPass(e.target.value)} /><div style={{textAlign:'right'}}><button className='btn' onClick={submit}>Войти</button></div></div></div>)
}