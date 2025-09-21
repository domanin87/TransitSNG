import axios from 'axios';

const verificationsAPI = {
  getAll: async () => {
    const response = await axios.get(`${process.env.REACT_APP_API_URL}/verifications`);
    return response.data;
  },
  getById: async (id) => {
    const response = await axios.get(`${process.env.REACT_APP_API_URL}/verifications/${id}`);
    return response.data;
  },
  approve: async (id, data) => {
    const response = await axios.put(`${process.env.REACT_APP_API_URL}/verifications/${id}/approve`, data);
    return response.data;
  },
  reject: async (id, data) => {
    const response = await axios.put(`${process.env.REACT_APP_API_URL}/verifications/${id}/reject`, data);
    return response.data;
  },
  delete: async (id) => {
    await axios.delete(`${process.env.REACT_APP_API_URL}/verifications/${id}`);
  },
};

export { verificationsAPI };