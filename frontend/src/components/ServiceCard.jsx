import React from 'react'
export default function ServiceCard({s,logged}){
  return (
    <article className={'card ' + (s.dark? 'card-dark':'')}>
      <h3>{s.title}</h3>
      <div className="meta">{s.route}</div>
      <div className="price">{s.price} {s.currency}</div>
      <div className="meta">{s.weight ? s.weight+' т' : ''}</div>
      <div style={{marginTop:12}}>
        {logged ? <div style={{color:'#0b1220'}}>Контакты: {s.contact}</div> : <div style={{color:'#6b7280'}}>Контакты скрыты — войдите</div>}
      </div>
    </article>
  )
}
