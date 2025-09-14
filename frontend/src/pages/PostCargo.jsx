import React, {useState} from 'react'
export default function PostCargo(){
  const [title,setTitle]=useState(''), [from,setFrom]=useState(''), [to,setTo]=useState(''), [price,setPrice]=useState('')
  const submit = ()=>{ alert('Заказ создан (demo)'); window.location='#/'; }
  return (<div className='container'><h2>Разместить груз</h2><div className='card' style={{maxWidth:720}}><input className='input' placeholder='Название груза' value={title} onChange={e=>setTitle(e.target.value)} /><div style={{display:'flex',gap:8}}><input className='input' placeholder='Откуда' value={from} onChange={e=>setFrom(e.target.value)} /><input className='input' placeholder='Куда' value={to} onChange={e=>setTo(e.target.value)} /></div><input className='input' placeholder='Цена' value={price} onChange={e=>setPrice(e.target.value)} /><div style={{textAlign:'right'}}><button className='btn' onClick={submit}>Опубликовать</button></div></div></div>)
}
