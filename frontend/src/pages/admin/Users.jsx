import React, { useState, useEffect } from 'react';
import { usersAPI } from '../../api';

const Users = ({ userRole }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const canEdit = ['superadmin', 'admin'].includes(userRole);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await usersAPI.getAll();
      setUsers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const changeRole = async (id, newRole) => {
    if (!canEdit) return;
    try {
      await usersAPI.update(id, { role: newRole });
      setUsers(users.map(user => user.id === id ? { ...user, role: newRole } : user));
    } catch (err) {
      setError(err.message);
    }
  };

  const changeStatus = async (id, newStatus) => {
    if (!canEdit) return;
    try {
      await usersAPI.update(id, { status: newStatus });
      setUsers(users.map(user => user.id === id ? { ...user, status: newStatus } : user));
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div>Загрузка...</div>;
  if (error) return <div>Ошибка: {error}</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h2>Пользователи</h2>
        {canEdit && (
          <button className="btn">Добавить пользователя</button>
        )}
      </div>

      <div className="card">
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #e6eef6' }}>
              <th style={{ textAlign: 'left', padding: '12px' }}>ID</th>
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
              <tr key={user.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                <td style={{ padding: '12px' }}>{user.id}</td>
                <td style={{ padding: '12px' }}>{user.name}</td>
                <td style={{ padding: '12px' }}>
                  <div>{user.email}</div>
                  <div>{user.phone}</div>
                </td>
                <td style={{ padding: '12px' }}>
                  {canEdit ? (
                    <select 
                      value={user.role} 
                      onChange={(e) => changeRole(user.id, e.target.value)}
                      style={{ padding: '6px', borderRadius: '4px' }}
                    >
                      <option value="user">Пользователь</option>
                      <option value="driver">Водитель</option>
                      <option value="moderator">Модератор</option>
                      {userRole === 'superadmin' && <option value="admin">Администратор</option>}
                      {userRole === 'superadmin' && <option value="superadmin">Суперадмин</option>}
                    </select>
                  ) : (
                    user.role
                  )}
                </td>
                <td style={{ padding: '12px' }}>
                  {canEdit ? (
                    <select 
                      value={user.status} 
                      onChange={(e) => changeStatus(user.id, e.target.value)}
                      style={{ padding: '6px', borderRadius: '4px' }}
                    >
                      <option value="pending">Ожидание</option>
                      <option value="active">Активный</option>
                      <option value="blocked">Заблокирован</option>
                    </select>
                  ) : (
                    user.status
                  )}
                </td>
                <td style={{ padding: '12px' }}>{user.regDate}</td>
                {canEdit && (
                  <td style={{ padding: '12px' }}>
                    <button style={{ marginRight: '8px', padding: '6px 12px', background: '#f0f0f0', border: 'none', borderRadius: '4px' }}>
                      Редактировать
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

export default Users;