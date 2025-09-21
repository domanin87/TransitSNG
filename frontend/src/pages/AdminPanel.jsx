import React, {useEffect, useState} from 'react';
import api from '../api';
export default function AdminPanel(){
  const [users,setUsers] = useState([]);
  const [orders,setOrders] = useState([]);
  const [payments,setPayments] = useState([]);
  useEffect(()=>{ load(); },[]);
  async function load(){
    try{
      const u = await api.get('/api/admin/users'); setUsers(u.data || u);
      const o = await api.get('/api/admin/orders'); setOrders(o.data || o);
      const p = await api.get('/api/admin/payments'); setPayments(p.data || p);
    }catch(e){ console.error(e); }
  }
  async function updateUser(id, patch){
    await api.put(`/api/admin/users/${id}`, patch); load();
  }
  async function archiveOrder(id){ await api.post(`/api/admin/orders/${id}/archive`); load(); }
  async function sumPayments(selected){ const res = await api.post('/api/admin/payments/sum',{ids: selected}); alert('Total: '+res.data.total); }
  return (<div style={{padding:20}}>
    <h2>Админ панель</h2>
    <section><h3>Пользователи</h3>{users.map(u=>(<div key={u.id} style={{boxShadow:'0 2px 8px rgba(0,0,0,0.1)',padding:10,margin:6}}>
      <b>{u.name}</b> ({u.email}) - role: {u.role} - admin: {u.is_admin ? 'yes':'no'}
      <div><button onClick={()=>updateUser(u.id,{is_admin: !u.is_admin})}>Toggle Admin</button></div>
    </div>))}</section>
    <section><h3>Заказы</h3>{orders.map(o=>(<div key={o.id} style={{padding:8, margin:6, border:'1px solid #eee'}}>
      #{o.id} - status: {o.status} - archived: {o.archived ? 'yes':'no'}
      <div><button onClick={()=>archiveOrder(o.id)}>Archive</button></div>
    </div>))}</section>
    <section><h3>Платежи</h3>{payments.map(p=>(<div key={p.id}><input type="checkbox" data-id={p.id}/> {p.amount} {p.currency}</div>))}
    <div><button onClick={()=>{ const sel = Array.from(document.querySelectorAll('input[type=checkbox]:checked')).map(ch=>parseInt(ch.dataset.id)); sumPayments(sel); }}>Sum selected</button></div></section>
  </div>);
}
