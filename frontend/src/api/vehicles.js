import axios from 'axios';

const vehiclesAPI = {
  getAll: async () => {
    const response = await axios.get(`${process.env.REACT_APP_API_URL}/vehicles`);
    return response.data;
  },
  getById: async (id) => {
    const response = await axios.get(`${process.env.REACT_APP_API_URL}/vehicles/${id}`);
    return response.data;
  },
  create: async (data) => {
    const response = await axios.post(`${process.env.REACT_APP_API_URL}/vehicles`, data);
    return response.data;
  },
  update: async (id, data) => {
    const response = await axios.put(`${process.env.REACT_APP_API_URL}/vehicles/${id}`, data);
    return response.data;
  },
  delete: async (id) => {
    await axios.delete(`${process.env.REACT_APP_API_URL}/vehicles/${id}`);
  },
};

export { vehiclesAPI };