import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { customersAPI } from '../../index';

export default function Customers({ userRole }) {
  const { t } = useTranslation();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCustomers, setSelectedCustomers] = useState([]);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [newCustomer, setNewCustomer] = useState({ name: '', email: '', phone: '', company: '' });

  const canEdit = ['superadmin', 'admin', 'moderator'].includes(userRole);

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    try {
      setLoading(true);
      const data = await customersAPI.getAll();
      setCustomers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addCustomer = async () => {
    if (!canEdit) return;
    try {
      const data = await customersAPI.create(newCustomer);
      setCustomers([...customers, data]);
      setNewCustomer({ name: '', email: '', phone: '', company: '' });
    } catch (err) {
      setError(err.message);
    }
  };

  const updateCustomer = async (id, updatedData) => {
    if (!canEdit) return;
    try {
      const data = await customersAPI.update(id, updatedData);
      setCustomers(customers.map((customer) => (customer.id === id ? data : customer)));
      setEditingCustomer(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const deleteCustomer = async (id) => {
    if (!canEdit) return;
    try {
      await customersAPI.delete(id);
      setCustomers(customers.filter((customer) => customer.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div className="text-center">{t('loading')}</div>;
  if (error) return <div className="text-red-500">{t('error')}: {error}</div>;

  return (
    <div>
      <h2 className="text-2xl mb-4">{t('customers')}</h2>
      {canEdit && (
        <div className="card mb-5">
          <h3 className="text-lg mb-2">{t('add_customer')}</h3>
          <div className="grid gap-2">
            <input
              className="input"
              placeholder={t('name')}
              value={newCustomer.name}
              onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
            />
            <input
              className="input"
              placeholder={t('email')}
              type="email"
              value={newCustomer.email}
              onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
            />
            <input
              className="input"
              placeholder={t('phone')}
              value={newCustomer.phone}
              onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
            />
            <input
              className="input"
              placeholder={t('company')}
              value={newCustomer.company}
              onChange={(e) => setNewCustomer({ ...newCustomer, company: e.target.value })}
            />
            <button className="btn" onClick={addCustomer}>{t('add')}</button>
          </div>
        </div>
      )}
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left p-3">
              <input
                type="checkbox"
                onChange={(e) => setSelectedCustomers(e.target.checked ? customers.map((c) => c.id) : [])}
                checked={selectedCustomers.length === customers.length && customers.length > 0}
              />
            </th>
            <th className="text-left p-3">{t('id')}</th>
            <th className="text-left p-3">{t('name')}</th>
            <th className="text-left p-3">{t('email')}</th>
            <th className="text-left p-3">{t('phone')}</th>
            <th className="text-left p-3">{t('company')}</th>
            {canEdit && <th className="text-left p-3">{t('actions')}</th>}
          </tr>
        </thead>
        <tbody>
          {customers.map((customer) => (
            <tr key={customer.id} className="border-b border-gray-200">
              <td className="p-3">
                <input
                  type="checkbox"
                  checked={selectedCustomers.includes(customer.id)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedCustomers([...selectedCustomers, customer.id]);
                    } else {
                      setSelectedCustomers(selectedCustomers.filter((id) => id !== customer.id));
                    }
                  }}
                />
              </td>
              <td className="p-3">{customer.id}</td>
              <td className="p-3">
                {editingCustomer === customer.id ? (
                  <input
                    className="input"
                    value={customer.name}
                    onChange={(e) => updateCustomer(customer.id, { ...customer, name: e.target.value })}
                  />
                ) : (
                  customer.name
                )}
              </td>
              <td className="p-3">
                {editingCustomer === customer.id ? (
                  <input
                    className="input"
                    value={customer.email}
                    type="email"
                    onChange={(e) => updateCustomer(customer.id, { ...customer, email: e.target.value })}
                  />
                ) : (
                  customer.email
                )}
              </td>
              <td className="p-3">
                {editingCustomer === customer.id ? (
                  <input
                    className="input"
                    value={customer.phone}
                    onChange={(e) => updateCustomer(customer.id, { ...customer, phone: e.target.value })}
                  />
                ) : (
                  customer.phone
                )}
              </td>
              <td className="p-3">
                {editingCustomer === customer.id ? (
                  <input
                    className="input"
                    value={customer.company}
                    onChange={(e) => updateCustomer(customer.id, { ...customer, company: e.target.value })}
                  />
                ) : (
                  customer.company
                )}
              </td>
              {canEdit && (
                <td className="p-3">
                  {editingCustomer === customer.id ? (
                    <button className="btn small" onClick={() => setEditingCustomer(null)}>{t('save')}</button>
                  ) : (
                    <>
                      <button className="btn small mr-2" onClick={() => setEditingCustomer(customer.id)}>{t('edit')}</button>
                      <button className="btn small red" onClick={() => deleteCustomer(customer.id)}>{t('delete')}</button>
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