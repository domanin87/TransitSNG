import axios from 'axios';

const reportsAPI = {
  getOrderReports: async (params) => {
    const response = await axios.get(`${process.env.REACT_APP_API_URL}/reports/orders`, { params });
    return response.data;
  },
  getPaymentReports: async (params) => {
    const response = await axios.get(`${process.env.REACT_APP_API_URL}/reports/payments`, { params });
    return response.data;
  },
  getCustomerReports: async (params) => {
    const response = await axios.get(`${process.env.REACT_APP_API_URL}/reports/customers`, { params });
    return response.data;
  },
};

export { reportsAPI };