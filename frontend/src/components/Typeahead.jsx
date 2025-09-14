import React, { useEffect, useState } from 'react'
export default function Typeahead({value,onChange,placeholder}){
  const [list,setList] = useState([])
  const [show,setShow] = useState(false)
  const [filtered,setFiltered] = useState([])
  useEffect(()=>{ fetch('/cities.json').then(r=>r.json()).then(setList).catch(()=>setList([])) },[])
  useEffect(()=>{
    if(!value) return setFiltered([])
    const q = value.toLowerCase()
    setFiltered(list.filter(c=> c.toLowerCase().startsWith(q)).slice(0,8))
  },[value,list])
  return (
    <div style={{position:'relative',marginBottom:8}}>
      <input className="input" value={value} onChange={e=>{ onChange(e.target.value); setShow(true) }} placeholder={placeholder} onBlur={()=>setTimeout(()=>setShow(false),120)} />
      {show && filtered.length>0 && <div style={{position:'absolute',left:0,right:0,top:'100%',background:'var(--card)',borderRadius:8,marginTop:6,padding:6,boxShadow:'var(--shadow)'}}>{filtered.map(c=> <div key={c} style={{padding:'6px 8px',cursor:'pointer'}} onMouseDown={()=>{ onChange(c); setShow(false) }}>{c}</div>)}</div>}
    </div>
  )
}
