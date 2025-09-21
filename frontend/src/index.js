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

export { apiRequest, ordersAPI, usersAPI };