import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ordersAPI } from '../../index';
import Typeahead from '../../components/Typeahead';

export default function Orders({ userRole }) {
  const { t } = useTranslation();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [editingOrder, setEditingOrder] = useState(null);
  const [newOrder, setNewOrder] = useState({ fromCity: '', toCity: '', cargoType: '', weight: '', price: '', status: 'pending' });

  const canEdit = ['superadmin', 'admin', 'moderator'].includes(userRole);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const data = await ordersAPI.getAll();
      setOrders(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addOrder = async () => {
    if (!canEdit) return;
    try {
      const data = await ordersAPI.create(newOrder);
      setOrders([...orders, data]);
      setNewOrder({ fromCity: '', toCity: '', cargoType: '', weight: '', price: '', status: 'pending' });
    } catch (err) {
      setError(err.message);
    }
  };

  const updateOrder = async (id, updatedData) => {
    if (!canEdit) return;
    try {
      const data = await ordersAPI.update(id, updatedData);
      setOrders(orders.map((order) => (order.id === id ? data : order)));
      setEditingOrder(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const deleteOrder = async (id) => {
    if (!canEdit) return;
    try {
      await ordersAPI.delete(id);
      setOrders(orders.filter((order) => order.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  const archiveSelectedOrders = async () => {
    if (!canEdit) return;
    try {
      await Promise.all(selectedOrders.map((id) => ordersAPI.update(id, { ...orders.find((o) => o.id === id), status: 'archived' })));
      setSelectedOrders([]);
      loadOrders();
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div className="text-center">{t('loading')}</div>;
  if (error) return <div className="text-red-500">{t('error')}: {error}</div>;

  return (
    <div>
      <h2 className="text-2xl mb-4">{t('orders')}</h2>
      {canEdit && (
        <div className="card mb-5">
          <h3 className="text-lg mb-2">{t('add_order')}</h3>
          <div className="grid gap-2">
            <Typeahead
              className="input"
              placeholder={t('from')}
              value={newOrder.fromCity}
              onChange={(val) => setNewOrder({ ...newOrder, fromCity: val })}
            />
            <Typeahead
              className="input"
              placeholder={t('to')}
              value={newOrder.toCity}
              onChange={(val) => setNewOrder({ ...newOrder, toCity: val })}
            />
            <input
              className="input"
              placeholder={t('cargo_type')}
              value={newOrder.cargoType}
              onChange={(e) => setNewOrder({ ...newOrder, cargoType: e.target.value })}
            />
            <input
              className="input"
              placeholder={t('weight')}
              type="number"
              value={newOrder.weight}
              onChange={(e) => setNewOrder({ ...newOrder, weight: e.target.value })}
            />
            <input
              className="input"
              placeholder={t('price')}
              type="number"
              value={newOrder.price}
              onChange={(e) => setNewOrder({ ...newOrder, price: e.target.value })}
            />
            <button className="btn" onClick={addOrder}>{t('add')}</button>
          </div>
        </div>
      )}
      {canEdit && selectedOrders.length > 0 && (
        <div className="mb-4">
          <button className="btn red" onClick={archiveSelectedOrders}>{t('archive_selected')}</button>
        </div>
      )}
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left p-3">
              <input
                type="checkbox"
                onChange={(e) => setSelectedOrders(e.target.checked ? orders.map((o) => o.id) : [])}
                checked={selectedOrders.length === orders.length && orders.length > 0}
              />
            </th>
            <th className="text-left p-3">{t('id')}</th>
            <th className="text-left p-3">{t('from')}</th>
            <th className="text-left p-3">{t('to')}</th>
            <th className="text-left p-3">{t('cargo_type')}</th>
            <th className="text-left p-3">{t('weight')}</th>
            <th className="text-left p-3">{t('price')}</th>
            <th className="text-left p-3">{t('status')}</th>
            {canEdit && <th className="text-left p-3">{t('actions')}</th>}
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id} className="border-b border-gray-200">
              <td className="p-3">
                <input
                  type="checkbox"
                  checked={selectedOrders.includes(order.id)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedOrders([...selectedOrders, order.id]);
                    } else {
                      setSelectedOrders(selectedOrders.filter((id) => id !== order.id));
                    }
                  }}
                />
              </td>
              <td className="p-3">{order.id}</td>
              <td className="p-3">
                {editingOrder === order.id ? (
                  <Typeahead
                    className="input"
                    value={order.from_city}
                    onChange={(val) => updateOrder(order.id, { ...order, from_city: val })}
                  />
                ) : (
                  order.from_city
                )}
              </td>
              <td className="p-3">
                {editingOrder === order.id ? (
                  <Typeahead
                    className="input"
                    value={order.to_city}
                    onChange={(val) => updateOrder(order.id, { ...order, to_city: val })}
                  />
                ) : (
                  order.to_city
                )}
              </td>
              <td className="p-3">
                {editingOrder === order.id ? (
                  <input
                    className="input"
                    value={order.cargo_type}
                    onChange={(e) => updateOrder(order.id, { ...order, cargo_type: e.target.value })}
                  />
                ) : (
                  order.cargo_type
                )}
              </td>
              <td className="p-3">
                {editingOrder === order.id ? (
                  <input
                    className="input"
                    value={order.weight}
                    type="number"
                    onChange={(e) => updateOrder(order.id, { ...order, weight: e.target.value })}
                  />
                ) : (
                  order.weight
                )}
              </td>
              <td className="p-3">
                {editingOrder === order.id ? (
                  <input
                    className="input"
                    value={order.price}
                    type="number"
                    onChange={(e) => updateOrder(order.id, { ...order, price: e.target.value })}
                  />
                ) : (
                  order.price
                )}
              </td>
              <td className="p-3">{order.status}</td>
              {canEdit && (
                <td className="p-3">
                  {editingOrder === order.id ? (
                    <button className="btn small" onClick={() => setEditingOrder(null)}>{t('save')}</button>
                  ) : (
                    <>
                      <button className="btn small mr-2" onClick={() => setEditingOrder(order.id)}>{t('edit')}</button>
                      <button className="btn small red" onClick={() => deleteOrder(order.id)}>{t('delete')}</button>
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