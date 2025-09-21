import axios from 'axios';

const ordersAPI = {
  getAll: async () => {
    const response = await axios.get(`${process.env.REACT_APP_API_URL}/orders`);
    return response.data;
  },
  create: async (data) => {
    const response = await axios.post(`${process.env.REACT_APP_API_URL}/orders`, data);
    return response.data;
  },
  update: async (id, data) => {
    const response = await axios.put(`${process.env.REACT_APP_API_URL}/orders/${id}`, data);
    return response.data;
  },
  delete: async (id) => {
    await axios.delete(`${process.env.REACT_APP_API_URL}/orders/${id}`);
  },
};

export { ordersAPI };