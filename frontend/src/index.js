import axios from 'axios';
import { ordersAPI } from './api/orders';
import { usersAPI } from './api/users';
import { driversAPI } from './api/drivers';
import { tariffsAPI } from './api/tariffs';
import { paymentsAPI } from './api/payments';
import { customersAPI } from './api/customers';
import { dashboardAPI } from './api/dashboard';
import { profileAPI } from './api/profile';
import { settingsAPI } from './api/settings';
import { reportsAPI } from './api/reports';
import { verificationsAPI } from './api/verifications';

const apiRequest = async (method, url, data = null) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios({
      method,
      url: `${process.env.REACT_APP_API_URL}${url}`,
      data,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || error.message);
  }
};

const authAPI = {
  login: async (credentials) => {
    const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/login`, credentials);
    return response.data;
  },
  register: async (userData) => {
    const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/register`, userData);
    return response.data;
  },
  logout: async () => {
    await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/logout`);
  },
};

export { apiRequest, ordersAPI, usersAPI, authAPI, driversAPI, tariffsAPI, paymentsAPI, customersAPI, dashboardAPI, profileAPI, settingsAPI, reportsAPI, verificationsAPI };