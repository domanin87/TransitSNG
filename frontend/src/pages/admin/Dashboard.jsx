import React from 'react';

const Dashboard = () => {
return (
<div>
<h2>Дашборд</h2>
<div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 20 }}>
<div className="card">
<h3>Всего пользователей</h3>
<p style={{ fontSize: 24, fontWeight: 'bold', color: 'var(--accent)' }}>1,245</p>
</div>
<div className="card">
<h3>Новые заказы</h3>
<p style={{ fontSize: 24, fontWeight: 'bold', color: 'var(--accent)' }}>42</p>
</div>
<div className="card">
<h3>Ожидают проверки</h3>
<p style={{ fontSize: 24, fontWeight: 'bold', color: 'var(--accent)' }}>18</p>
</div>
<div className="card">
<h3>Общий доход</h3>
<p style={{ fontSize: 24, fontWeight: 'bold', color: 'var(--accent)' }}>1,203,500 ₸</p>
</div>
</div>
</div>
);
};

export default Dashboard;