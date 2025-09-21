// frontend/src/pages/SearchPage.js
import React, {useState, useEffect} from 'react';
import MainCards from '../components/MainCards';
import NewsBlock from '../components/NewsBlock';
import VacanciesBlock from '../components/VacanciesBlock';

export default function SearchPage(){
  const [results,setResults]=useState([]);
  const [from,setFrom]=useState('');
  const [to,setTo]=useState('');
  async function doSearch(){
    const res = await fetch(`/cargos/search?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`);
    const j = await res.json();
    setResults(j.cargos || j.cargos || j);
  }
  return (
    <div>
      <h1>Search cargos / transport</h1>
      <div>
        <input placeholder="From" value={from} onChange={e=>setFrom(e.target.value)} />
        <input placeholder="To" value={to} onChange={e=>setTo(e.target.value)} />
        <button onClick={doSearch}>Search</button>
      </div>
      <div>
        {results.map(r=>(
          <div key={r.id} className="cargo-card">
            <h3>{r.fromCity} — {r.toCity} {r.weight}т</h3>
            <p>{r.description}</p>
            <p>Price: {r.price}</p>
          </div>
        ))}
      </div>
      <MainCards />
      <NewsBlock />
      <VacanciesBlock />
    </div>
  );
}
