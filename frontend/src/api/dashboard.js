import axios from 'axios';

const dashboardAPI = {
  getStats: async () => {
    const response = await axios.get(`${process.env.REACT_APP_API_URL}/dashboard/stats`);
    return response.data;
  },
};

export { dashboardAPI };