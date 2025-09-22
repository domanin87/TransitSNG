import React, {useEffect,useState} from 'react';
export default function ThemeToggle(){
  const [dark,setDark]=useState(localStorage.getItem('dark')==='1');
  useEffect(()=>{
    if(dark) document.documentElement.style.setProperty('--bg','#071128');
    else document.documentElement.style.setProperty('--bg','#0f172a');
    localStorage.setItem('dark', dark?'1':'0');
  },[dark]);
  return (<button onClick={()=>setDark(!dark)} style={{padding:'8px 12px',borderRadius:8}}>{dark?'Тёмная':'Светлая'}</button>);
}
