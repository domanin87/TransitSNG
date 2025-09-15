import React, { useEffect, useRef } from 'react'
import './card.css'

export default function ServiceCard({s,logged}){
  const ref = useRef()
  useEffect(()=>{ setTimeout(()=> ref.current?.classList?.add('visible'), 50) },[])
  const stars = (()=>{
    const r = Math.round(s.rating*2)/2
    const full = Math.floor(r)
    const half = r - full >= 0.5
    const arr = []
    for(let i=0;i<full;i++) arr.push('full')
    if(half) arr.push('half')
    while(arr.length<5) arr.push('empty')
    return arr
  })()
  return (
    <article ref={ref} className={'card ' + (s.dark? 'card-dark':'')}>
      <div style={{display:'flex',gap:12}}>
        <img src={s.img} alt={s.title} style={{width:160,height:100,objectFit:'cover',borderRadius:8}} />
        <div style={{flex:1}}>
          <h3 style={{margin:0}}>{s.title}</h3>
          <div className="meta">{s.route}</div>
          <div style={{display:'flex',alignItems:'center',gap:8,marginTop:6}}>
            <div style={{display:'flex',gap:2}}>
              {stars.map((t,i)=> <Star key={i} type={t} />)}
            </div>
            <div className="meta"> {s.rating.toFixed(1)}</div>
          </div>
          <div className="price">{s.price} {s.currency}</div>
          <div style={{marginTop:10}}>{ logged ? <div style={{color:'#0b1220'}}>Контакты: {s.contact}</div> : <div style={{color:'var(--muted)'}}>Контакты скрыты — войдите</div> }</div>
        </div>
      </div>
    </article>
  )
}

function Star({type}){
  if(type==='full') return <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" style={{color:'#f59e0b'}}><path d="M12 .587l3.668 7.431L23 9.748l-5.5 5.356L18.335 24 12 19.897 5.665 24l1.835-8.896L1 9.748l7.332-1.73L12 .587z"/></svg>
  if(type==='half') return <svg width="18" height="18" viewBox="0 0 24 24" style={{color:'#f59e0b'}}><defs><linearGradient id="g"><stop offset="50%" stopColor="#f59e0b"/><stop offset="50%" stopColor="transparent"/></linearGradient></defs><path d="M12 .587l3.668 7.431L23 9.748l-5.5 5.356L18.335 24 12 19.897 5.665 24l1.835-8.896L1 9.748l7.332-1.73L12 .587z" fill="url(#g)"/></svg>
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" style={{color:'#cbd5e1'}}><path d="M12 .587l3.668 7.431L23 9.748l-5.5 5.356L18.335 24 12 19.897 5.665 24l1.835-8.896L1 9.748l7.332-1.73L12 .587z"/></svg>
}
