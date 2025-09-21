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
      documentUrl: '/documents/license_101.jpg',
      documentNumber: 'AB1234567'
    },
    {
      id: 2,
      userId: 102,
      userName: 'Мария Иванова',
      type: 'vehicle_registration',
      status: 'pending',
      submittedDate: '2023-10-16',
      documentUrl: '/documents/registration_102.jpg',
      documentNumber: '1234567890'
    },
    {
      id: 3,
      userId: 103,
      userName: 'Дмитрий Соколов',
      type: 'driver_license',
      status: 'approved',
      submittedDate: '2023-10-10',
      documentUrl: '/documents/license_103.jpg',
      documentNumber: 'CD9876543'
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

  const getDocumentType = (type) => {
    switch(type) {
      case 'driver_license': return 'Водительские права';
      case 'vehicle_registration': return 'Регистрация ТС';
      case 'passport': return 'Паспорт';
      default: return 'Неизвестный тип';
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'approved': return '#4ade80';
      case 'pending': return '#fbbf24';
      case 'rejected': return '#f87171';
      default: return '#6b7280';
    }
  };

  const getStatusText = (status) => {
    switch(status) {
      case 'approved': return 'Подтверждено';
      case 'pending': return 'Ожидание';
      case 'rejected': return 'Отклонено';
      default: return 'Неизвестно';
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h2>Верификации</h2>
        <div style={{ display: 'flex', gap: '10px' }}>
          <select className="input" style={{ width: '200px' }}>
            <option value="all">Все типы</option>
            <option value="driver_license">Водительские права</option>
            <option value="vehicle_registration">Регистрация ТС</option>
            <option value="passport">Паспорт</option>
          </select>
          <select className="input" style={{ width: '200px' }}>
            <option value="all">Все статусы</option>
            <option value="pending">Ожидающие</option>
            <option value="approved">Подтвержденные</option>
            <option value="rejected">Отклоненные</option>
          </select>
        </div>
      </div>

      <div className="card">
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #e6eef6' }}>
              <th style={{ textAlign: 'left', padding: '12px' }}>ID</th>
              <th style={{ textAlign: 'left', padding: '12px' }}>Пользователь</th>
              <th style={{ textAlign: 'left', padding: '12px' }}>Тип документа</th>
              <th style={{ textAlign: 'left', padding: '12px' }}>Номер документа</th>
              <th style={{ textAlign: 'left', padding: '12px' }}>Статус</th>
              <th style={{ textAlign: 'left', padding: '12px' }}>Дата подачи</th>
              <th style={{ textAlign: 'left', padding: '12px' }}>Документ</th>
              {canVerify && <th style={{ textAlign: 'left', padding: '12px' }}>Действия</th>}
            </tr>
          </thead>
          <tbody>
            {verifications.map(verification => (
              <tr key={verification.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                <td style={{ padding: '12px' }}>#{verification.id}</td>
                <td style={{ padding: '12px' }}>{verification.userName}</td>
                <td style={{ padding: '12px' }}>{getDocumentType(verification.type)}</td>
                <td style={{ padding: '12px' }}>{verification.documentNumber}</td>
                <td style={{ padding: '12px' }}>
                  <span style={{ 
                    padding: '4px 8px', 
                    borderRadius: '4px', 
                    fontSize: '12px',
                    background: getStatusColor(verification.status),
                    color: 'white'
                  }}>
                    {getStatusText(verification.status)}
                  </span>
                </td>
                <td style={{ padding: '12px' }}>{verification.submittedDate}</td>
                <td style={{ padding: '12px' }}>
                  <a 
                    href={verification.documentUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{ color: 'var(--accent)', textDecoration: 'none' }}
                  >
                    Просмотреть
                  </a>
                </td>
                {canVerify && verification.status === 'pending' && (
                  <td style={{ padding: '12px' }}>
                    <button 
                      style={{ marginRight: '8px', padding: '6px 12px', background: '#4ade80', color: 'white', border: 'none', borderRadius: '4px', fontSize: '12px' }}
                      onClick={() => approveVerification(verification.id)}
                    >
                      Одобрить
                    </button>
                    <button 
                      style={{ padding: '6px 12px', background: '#f87171', color: 'white', border: 'none', borderRadius: '4px', fontSize: '12px' }}
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