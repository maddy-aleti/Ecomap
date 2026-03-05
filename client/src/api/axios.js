import axios from "axios";

console.log("VITE_SERVER_URL:", import.meta.env.VITE_SERVER_URL);

const api = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URL,
});

// Attach token automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
