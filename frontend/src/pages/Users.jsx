import React, { useState, useEffect } from 'react'

export default function Users() {
  const [users, setUsers] = useState([])
  const [canEdit] = useState(true) // Пример значения, замените на реальную логику

  // Загрузка пользователей (заглушка)
  useEffect(() => {
    // Здесь должен быть запрос к API
    const mockUsers = [
      { id: 1, name: 'Иван Иванов', email: 'ivan@example.com', phone: '+77771234567', role: 'customer', status: 'active', createdAt: '2023-01-01' },
      { id: 2, name: 'Петр Петров', email: 'petr@example.com', phone: '+77777654321', role: 'driver', status: 'pending', createdAt: '2023-01-02' }
    ]
    setUsers(mockUsers)
  }, [])

  return (
    <div>
      <h2>Управление пользователями</h2>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f5f5f5' }}>
              <th style={{ textAlign: 'left', padding: '12px' }}>Имя</th>
              <th style={{ textAlign: 'left', padding: '12px' }}>Контакты</th>
              <th style={{ textAlign: 'left', padding: '12px' }}>Роль</th>
              <th style={{ textAlign: 'left', padding: '12px' }}>Статус</th>
              <th style={{ textAlign: 'left', padding: '12px' }}>Дата регистрации</th>
              {canEdit && <th style={{ textAlign: 'left', padding: '12px' }}>Действия</th>}
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '12px' }}>{user.name}</td>
                <td style={{ padding: '12px' }}>
                  <div>{user.email}</div>
                  <div>{user.phone}</div>
                </td>
                <td style={{ padding: '12px' }}>{user.role === 'customer' ? 'Заказчик' : 'Водитель'}</td>
                <td style={{ padding: '12px' }}>{user.status === 'active' ? 'Активен' : 'На рассмотрении'}</td>
                <td style={{ padding: '12px' }}>{user.createdAt}</td>
                {canEdit && (
                  <td style={{ padding: '12px' }}>
                    <button className="btn small">Редактировать</button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}