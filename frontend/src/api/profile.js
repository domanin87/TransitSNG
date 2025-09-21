import axios from 'axios';

const profileAPI = {
  getProfile: async () => {
    const response = await axios.get(`${process.env.REACT_APP_API_URL}/profile`);
    return response.data;
  },
  updateProfile: async (data) => {
    const response = await axios.put(`${process.env.REACT_APP_API_URL}/profile`, data);
    return response.data;
  },
};

export { profileAPI };