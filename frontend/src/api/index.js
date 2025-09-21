import axios from "axios";
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000",
  headers: {"Content-Type":"application/json"}
});
export const getServices = async () => { const res = await api.get("/services"); return res.data; };
export const getTariffs = async () => { const res = await api.get("/tariffs"); return res.data; };
export const getMessages = async () => { const res = await api.get("/api/messages"); return res.data; };
export default api;
