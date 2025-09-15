import React, { useState } from 'react';

const Verifications = ({ userRole }) => {
const [verifications, setVerifications] = useState([
{
id: 1,
userId: 101,
userName: 'Алексей Петров',
type: 'driver_license',
status: 'pending',
submittedDate: '2023-10-15',
documentUrl: '/documents/license_101.jpg'
},
{
id: 2,
userId: 102,
userName: 'Мария Иванова',
type: 'vehicle_registration',
status: 'pending',
submittedDate: '2023-10-16',
documentUrl: '/documents/registration_102.jpg'
},
]);

const canVerify = ['superadmin', 'admin', 'moderator'].includes(userRole);

const approveVerification = (id) => {
setVerifications(verifications.map(verification =>
verification.id === id ? { ...verification, status: 'approved' } : verification
));
};

const rejectVerification = (id) => {
setVerifications(verifications.map(verification =>
verification.id === id ? { ...verification, status: 'rejected' } : verification
));
};

return (
<div>
<h2>Верификации</h2>
<div className="card">
<table style={{ width: '100%', borderCollapse: 'collapse' }}>
<thead>
<tr style={{ borderBottom: '1px solid #e6eef6' }}>
<th style={{ textAlign: 'left', padding: '12px' }}>ID</th>
<th style={{ textAlign: 'left', padding: '12px' }}>Пользователь</th>
<th style={{ textAlign: 'left', padding: '12px' }}>Тип документа</th>
<th style={{ textAlign: 'left', padding: '12px' }}>Статус</th>
<th style={{ textAlign: 'left', padding: '12px' }}>Дата подачи</th>
<th style={{ textAlign: 'left', padding: '12px' }}>Документ</th>
{canVerify && <th style={{ textAlign: 'left', padding: '12px' }}>Действия</th>}
</tr>
</thead>
<tbody>
{verifications.map(verification => (
<tr key={verification.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
<td style={{ padding: '12px' }}>{verification.id}</td>
<td style={{ padding: '12px' }}>{verification.userName}</td>
<td style={{ padding: '12px' }}>
{verification.type === 'driver_license' && 'Водительские права'}
{verification.type === 'vehicle_registration' && 'Регистрация ТС'}
</td>
<td style={{ padding: '12px' }}>{verification.status}</td>
<td style={{ padding: '12px' }}>{verification.submittedDate}</td>
<td style={{ padding: '12px' }}>
<a href={verification.documentUrl} target="_blank" rel="noopener noreferrer">
Просмотреть
</a>
</td>
{canVerify && verification.status === 'pending' && (
<td style={{ padding: '12px' }}>
<button
style={{ marginRight: '8px', padding: '6px 12px', background: '#4ade80', color: 'white', border: 'none', borderRadius: '4px' }}
onClick={() => approveVerification(verification.id)}
>
Одобрить
</button>
<button
style={{ padding: '6px 12px', background: '#f87171', color: 'white', border: 'none', borderRadius: '4px' }}
onClick={() => rejectVerification(verification.id)}
>
Отклонить
</button>
</td>
)}
</tr>
))}
</tbody>
</table>
</div>
</div>
);
};

export default Verifications;