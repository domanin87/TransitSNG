import React, {useState, useEffect} from 'react';
import api from '../api';
import '../styles/home.css';
export default function Home(){
  const [dark, setDark] = useState(false);
  const [tariffs, setTariffs] = useState([]);
  const [news, setNews] = useState([]);
  const [vacancies, setVacancies] = useState([]);
  useEffect(()=>{ load(); },[]);
  async function load(){
    try{ const t = await api.get('/api/tariffs'); setTariffs(t.data || t); const n = await api.get('/api/news'); setNews(n.data || n); const v = await api.get('/api/vacancies'); setVacancies(v.data || v); }catch(e){ console.error(e); }
  }
  return (<div className={dark ? 'home dark' : 'home'}>
    <header style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
      <h1>TransitSNG</h1>
      <div><label>Темная тема<input type="checkbox" checked={dark} onChange={e=>setDark(e.target.checked)}/></label></div>
    </header>
    <section className="cards">
      {Array.from({length:8}).map((_,i)=>(<div key={i} className="card"> <h3>Card {i+1}</h3><p>Краткое описание карточки. Плавная тень и растягивание при ховере.</p></div>))}
    </section>
    <section className="news"><h2>Новости</h2>{news.slice(0,5).map(n=>(<div key={n.id} className="news-item">{n.title}</div>))}</section>
    <section className="vacancies"><h2>Вакансии</h2>{vacancies.slice(0,5).map(v=>(<div key={v.id} className="vac-item">{v.title}</div>))}</section>
  </div>);
}
