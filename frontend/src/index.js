import axios from 'axios';
import { ordersAPI } from './api/orders';
import { usersAPI } from './api/users';

const apiRequest = async (method, url, data = null) => {
  try {
    const response = await axios({
      method,
      url: `${process.env.REACT_APP_API_URL}${url}`,
      data,
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message);
  }
};

const authAPI = {
  login: async (credentials) => {
    const response = await axios.post(`${process.env.REACT_APP_API_URL}/auth/login`, credentials);
    return response.data;
  },
  register: async (userData) => {
    const response = await axios.post(`${process.env.REACT_APP_API_URL}/auth/register`, userData);
    return response.data;
  },
  logout: async () => {
    await axios.post(`${process.env.REACT_APP_API_URL}/auth/logout`);
  },
};

export { apiRequest, ordersAPI, usersAPI, authAPI };