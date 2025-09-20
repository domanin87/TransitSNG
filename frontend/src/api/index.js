const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

// Общая функция для API запросов
async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = localStorage.getItem('token');
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  const config = {
    ...options,
    headers,
  };
  
  if (options.body) {
    config.body = JSON.stringify(options.body);
  }
  
  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}

// API для пользователей
export const usersAPI = {
  getAll: () => apiRequest('/users'),
  getById: (id) => apiRequest(`/users/${id}`),
  create: (userData) => apiRequest('/users', { method: 'POST', body: userData }),
  update: (id, userData) => apiRequest(`/users/${id}`, { method: 'PUT', body: userData }),
  delete: (id) => apiRequest(`/users/${id}`, { method: 'DELETE' }),
};

// API для водителей
export const driversAPI = {
  getAll: () => apiRequest('/drivers'),
  getById: (id) => apiRequest(`/drivers/${id}`),
  create: (driverData) => apiRequest('/drivers', { method: 'POST', body: driverData }),
  update: (id, driverData) => apiRequest(`/drivers/${id}`, { method: 'PUT', body: driverData }),
  delete: (id) => apiRequest(`/drivers/${id}`, { method: 'DELETE' }),
  verify: (id) => apiRequest(`/drivers/${id}/verify`, { method: 'POST' }),
  reject: (id) => apiRequest(`/drivers/${id}/reject`, { method: 'POST' }),
};

// API для заказов
export const ordersAPI = {
  getAll: () => apiRequest('/orders'),
  getById: (id) => apiRequest(`/orders/${id}`),
  create: (orderData) => apiRequest('/orders', { method: 'POST', body: orderData }),
  update: (id, orderData) => apiRequest(`/orders/${id}`, { method: 'PUT', body: orderData }),
  delete: (id) => apiRequest(`/orders/${id}`, { method: 'DELETE' }),
};

// API для платежей
export const paymentsAPI = {
  getAll: () => apiRequest('/payments'),
  getById: (id) => apiRequest(`/payments/${id}`),
  create: (paymentData) => apiRequest('/payments', { method: 'POST', body: paymentData }),
  update: (id, paymentData) => apiRequest(`/payments/${id}`, { method: 'PUT', body: paymentData }),
  delete: (id) => apiRequest(`/payments/${id}`, { method: 'DELETE' }),
};

// API для тарифов
export const tariffsAPI = {
  getAll: () => apiRequest('/tariffs'),
  getById: (id) => apiRequest(`/tariffs/${id}`),
  create: (tariffData) => apiRequest('/tariffs', { method: 'POST', body: tariffData }),
  update: (id, tariffData) => apiRequest(`/tariffs/${id}`, { method: 'PUT', body: tariffData }),
  delete: (id) => apiRequest(`/tariffs/${id}`, { method: 'DELETE' }),
};

// API для верификаций
export const verificationsAPI = {
  getAll: () => apiRequest('/verifications'),
  getById: (id) => apiRequest(`/verifications/${id}`),
  approve: (id) => apiRequest(`/verifications/${id}/approve`, { method: 'POST' }),
  reject: (id) => apiRequest(`/verifications/${id}/reject`, { method: 'POST' }),
};

// API для отчетов
export const reportsAPI = {
  generate: (startDate, endDate) => apiRequest(`/reports?startDate=${startDate}&endDate=${endDate}`),
  export: (format) => apiRequest(`/reports/export?format=${format}`),
};

// API для аутентификации
export const authAPI = {
  login: (credentials) => apiRequest('/auth/login', { method: 'POST', body: credentials }),
  register: (userData) => apiRequest('/auth/register', { method: 'POST', body: userData }),
  logout: () => apiRequest('/auth/logout', { method: 'POST' }),
  refresh: () => apiRequest('/auth/refresh'),
};

// API для настроек
export const settingsAPI = {
  get: () => apiRequest('/settings'),
  update: (settingsData) => apiRequest('/settings', { method: 'PUT', body: settingsData }),
};