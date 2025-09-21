import axios from 'axios';

const settingsAPI = {
  getSettings: async () => {
    const response = await axios.get(`${process.env.REACT_APP_API_URL}/settings`);
    return response.data;
  },
  updateSettings: async (data) => {
    const response = await axios.put(`${process.env.REACT_APP_API_URL}/settings`, data);
    return response.data;
  },
};

export { settingsAPI };