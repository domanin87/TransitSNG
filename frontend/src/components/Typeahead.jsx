import React, {useState,useEffect, useRef} from 'react'
export default function Typeahead({value,onChange,placeholder}){
  const [list,setList] = useState([])
  const [filtered,setFiltered] = useState([])
  const [open,setOpen] = useState(false)
  const ref = useRef()
  useEffect(()=>{ fetch('/cities.json').then(r=>r.json()).then(setList).catch(()=>setList([])) },[])
  useEffect(()=>{
    if(!value) return setFiltered([])
    const q = value.toLowerCase()
    setFiltered(list.filter(c=>c.toLowerCase().startsWith(q)).slice(0,10))
  },[value,list])
  return (
    <div style={{position:'relative'}} ref={ref}>
      <input className="input" value={value} onChange={e=>{onChange(e.target.value); setOpen(true)}} placeholder={placeholder} onBlur={()=>setTimeout(()=>setOpen(false),120)} />
      {open && filtered.length>0 && <div className="typeahead-list">{filtered.map(c=> <div key={c} style={{padding:8,cursor:'pointer'}} onMouseDown={()=>{onChange(c); setOpen(false)}}>{c}</div>)}</div>}
    </div>
  )
}
