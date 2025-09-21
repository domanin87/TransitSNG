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
            {canEdit && <th className="text-left p-3">{t('