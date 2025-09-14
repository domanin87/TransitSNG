import React, { useEffect, useRef } from 'react'
export default function ServiceCard({s,showContact}){
  const ref = useRef()
  useEffect(()=>{ setTimeout(()=> ref.current?.classList?.add('visible'), 60) },[])
  return (
    <article ref={ref} className='card'>
      <h3>{s.title}</h3>
      <div className='meta'>{s.route}</div>
      <div className='price'>{s.price} {s.currency}</div>
      <div className='meta'>{s.weight ? s.weight+' т' : ''}</div>
      <div style={{marginTop:10}}>{ showContact ? `Контакты: ${s.contact}` : 'Контакты скрыты — войдите' }</div>
      <div style={{marginTop:12,display:'flex',gap:8}}>
        <button className='btn' style={{background:'transparent',color:'var(--accent)',border:'1px solid var(--accent)'}}>Откликнуться</button>
        <button className='btn'>Подробнее</button>
      </div>
    </article>
  )
}
