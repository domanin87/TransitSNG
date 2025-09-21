import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { usersAPI } from '../../index';

export default function Users({ userRole }) {
  const { t } = useTranslation();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [newUser, setNewUser] = useState({ name: '', email: '', phone: '', role: 'user', status: 'active' });

  const canEdit = userRole === 'superadmin';

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

  const addUser = async () => {
    if (!canEdit) return;
    try {
      const data = await usersAPI.create(newUser);
      setUsers([...users, data]);
      setNewUser({ name: '', email: '', phone: '', role: 'user', status: 'active' });
    } catch (err) {
      setError(err.message);
    }
  };

  const updateUser = async (id, updatedData) => {
    if (!canEdit) return;
    try {
      const data = await usersAPI.update(id, updatedData);
      setUsers(users.map((user) => (user.id === id ? data : user)));
      setEditingUser(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const deleteUser = async (id) => {
    if (!canEdit) return;
    try {
      await usersAPI.delete(id);
      setUsers(users.filter((user) => user.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div className="text-center">{t('loading')}</div>;
  if (error) return <div className="text-red-500">{t('error')}: {error}</div>;

  return (
    <div>
      <h2 className="text-2xl mb-4">{t('users')}</h2>
      {canEdit && (
        <div className="card mb-5">
          <h3 className="text-lg mb-2">{t('add_user')}</h3>
          <div className="grid gap-2">
            <input
              className="input"
              placeholder={t('name')}
              value={newUser.name}
              onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
            />
            <input
              className="input"
              placeholder={t('email')}
              value={newUser.email}
              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
            />
            <input
              className="input"
              placeholder={t('phone')}
              value={newUser.phone}
              onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
            />
            <select
              className="input"
              value={newUser.role}
              onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
            >
              <option value="user">{t('user')}</option>
              <option value="driver">{t('driver')}</option>
              <option value="admin">{t('admin')}</option>
              <option value="moderator">{t('moderator')}</option>
            </select>
            <button className="btn" onClick={addUser}>{t('add')}</button>
          </div>
        </div>
      )}
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left p-3">{t('id')}</th>
            <th className="text-left p-3">{t('name')}</th>
            <th className="text-left p-3">{t('email')}</th>
            <th className="text-left p-3">{t('phone')}</th>
            <th className="text-left p-3">{t('role')}</th>
            <th className="text-left p-3">{t('status')}</th>
            {canEdit && <th className="text-left p-3">{t('actions')}</th>}
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="border-b border-gray-200">
              <td className="p-3">{user.id}</td>
              <td className="p-3">
                {editingUser === user.id ? (
                  <input
                    className="input"
                    value={user.name}
                    onChange={(e) => updateUser(user.id, { ...user, name: e.target.value })}
                  />
                ) : (
                  user.name
                )}
              </td>
              <td className="p-3">
                {editingUser === user.id ? (
                  <input
                    className="input"
                    value={user.email}
                    onChange={(e) => updateUser(user.id, { ...user, email: e.target.value })}
                  />
                ) : (
                  user.email
                )}
              </td>
              <td className="p-3">
                {editingUser === user.id ? (
                  <input
                    className="input"
                    value={user.phone}
                    onChange={(e) => updateUser(user.id, { ...user, phone: e.target.value })}
                  />
                ) : (
                  user.phone
                )}
              </td>
              <td className="p-3">
                {editingUser === user.id ? (
                  <select
                    className="input"
                    value={user.role}
                    onChange={(e) => updateUser(user.id, { ...user, role: e.target.value })}
                  >
                    <option value="user">{t('user')}</option>
                    <option value="driver">{t('driver')}</option>
                    <option value="admin">{t('admin')}</option>
                    <option value="moderator">{t('moderator')}</option>
                  </select>
                ) : (
                  user.role
                )}
              </td>
              <td className="p-3">{user.status}</td>
              {canEdit && (
                <td className="p-3">
                  {editingUser === user.id ? (
                    <button className="btn small" onClick={() => setEditingUser(null)}>{t('save')}</button>
                  ) : (
                    <>
                      <button className="btn small mr-2" onClick={() => setEditingUser(user.id)}>{t('edit')}</button>
                      <button className="btn small red" onClick={() => deleteUser(user.id)}>{t('delete')}</button>
                    </>
                  )}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}