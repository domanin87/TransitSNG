import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { paymentsAPI } from '../../index';

export default function Payments({ userRole }) {
  const { t } = useTranslation();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPayments, setSelectedPayments] = useState([]);
  const [editingPayment, setEditingPayment] = useState(null);
  const [newPayment, setNewPayment] = useState({ orderId: '', amount: '', status: 'pending', method: '' });

  const canEdit = ['superadmin', 'admin', 'moderator'].includes(userRole);

  useEffect(() => {
    loadPayments();
  }, []);

  const loadPayments = async () => {
    try {
      setLoading(true);
      const data = await paymentsAPI.getAll();
      setPayments(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addPayment = async () => {
    if (!canEdit) return;
    try {
      const data = await paymentsAPI.create(newPayment);
      setPayments([...payments, data]);
      setNewPayment({ orderId: '', amount: '', status: 'pending', method: '' });
    } catch (err) {
      setError(err.message);
    }
  };

  const updatePayment = async (id, updatedData) => {
    if (!canEdit) return;
    try {
      const data = await paymentsAPI.update(id, updatedData);
      setPayments(payments.map((payment) => (payment.id === id ? data : payment)));
      setEditingPayment(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const deletePayment = async (id) => {
    if (!canEdit) return;
    try {
      await paymentsAPI.delete(id);
      setPayments(payments.filter((payment) => payment.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div className="text-center">{t('loading')}</div>;
  if (error) return <div className="text-red-500">{t('error')}: {error}</div>;

  return (
    <div>
      <h2 className="text-2xl mb-4">{t('payments')}</h2>
      {canEdit && (
        <div className="card mb-5">
          <h3 className="text-lg mb-2">{t('add_payment')}</h3>
          <div className="grid gap-2">
            <input
              className="input"
              placeholder={t('order_id')}
              value={newPayment.orderId}
              onChange={(e) => setNewPayment({ ...newPayment, orderId: e.target.value })}
            />
            <input
              className="input"
              placeholder={t('amount')}
              type="number"
              value={newPayment.amount}
              onChange={(e) => setNewPayment({ ...newPayment, amount: e.target.value })}
            />
            <input
              className="input"
              placeholder={t('method')}
              value={newPayment.method}
              onChange={(e) => setNewPayment({ ...newPayment, method: e.target.value })}
            />
            <select
              className="input"
              value={newPayment.status}
              onChange={(e) => setNewPayment({ ...newPayment, status: e.target.value })}
            >
              <option value="pending">{t('pending')}</option>
              <option value="completed">{t('completed')}</option>
              <option value="failed">{t('failed')}</option>
            </select>
            <button className="btn" onClick={addPayment}>{t('add')}</button>
          </div>
        </div>
      )}
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left p-3">
              <input
                type="checkbox"
                onChange={(e) => setSelectedPayments(e.target.checked ? payments.map((p) => p.id) : [])}
                checked={selectedPayments.length === payments.length && payments.length > 0}
              />
            </th>
            <th className="text-left p-3">{t('id')}</th>
            <th className="text-left p-3">{t('order_id')}</th>
            <th className="text-left p-3">{t('amount')}</th>
            <th className="text-left p-3">{t('method')}</th>
            <th className="text-left p-3">{t('status')}</th>
            {canEdit && <th className="text-left p-3">{t('actions')}</th>}
          </tr>
        </thead>
        <tbody>
          {payments.map((payment) => (
            <tr key={payment.id} className="border-b border-gray-200">
              <td className="p-3">
                <input
                  type="checkbox"
                  checked={selectedPayments.includes(payment.id)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedPayments([...selectedPayments, payment.id]);
                    } else {
                      setSelectedPayments(selectedPayments.filter((id) => id !== payment.id));
                    }
                  }}
                />
              </td>
              <td className="p-3">{payment.id}</td>
              <td className="p-3">
                {editingPayment === payment.id ? (
                  <input
                    className="input"
                    value={payment.orderId}
                    onChange={(e) => updatePayment(payment.id, { ...payment, orderId: e.target.value })}
                  />
                ) : (
                  payment.orderId
                )}
              </td>
              <td className="p-3">
                {editingPayment === payment.id ? (
                  <input
                    className="input"
                    value={payment.amount}
                    type="number"
                    onChange={(e) => updatePayment(payment.id, { ...payment, amount: e.target.value })}
                  />
                ) : (
                  payment.amount
                )}
              </td>
              <td className="p-3">
                {editingPayment === payment.id ? (
                  <input
                    className="input"
                    value={payment.method}
                    onChange={(e) => updatePayment(payment.id, { ...payment, method: e.target.value })}
                  />
                ) : (
                  payment.method
                )}
              </td>
              <td className="p-3">
                {editingPayment === payment.id ? (
                  <select
                    className="input"
                    value={payment.status}
                    onChange={(e) => updatePayment(payment.id, { ...payment, status: e.target.value })}
                  >
                    <option value="pending">{t('pending')}</option>
                    <option value="completed">{t('completed')}</option>
                    <option value="failed">{t('failed')}</option>
                  </select>
                ) : (
                  payment.status
                )}
              </td>
              {canEdit && (
                <td className="p-3">
                  {editingPayment === payment.id ? (
                    <button className="btn small" onClick={() => setEditingPayment(null)}>{t('save')}</button>
                  ) : (
                    <>
                      <button className="btn small mr-2" onClick={() => setEditingPayment(payment.id)}>{t('edit')}</button>
                      <button className="btn small red" onClick={() => deletePayment(payment.id)}>{t('delete')}</button>
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