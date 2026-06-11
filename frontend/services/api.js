import axios from "axios";

const environmentUrl = import.meta.env.VITE_API_URL?.trim();

const API_BASE_URL =
  environmentUrl ||
  "https://pulseapi-production-181e.up.railway.app/api";

console.log("Vite mode:", import.meta.env.MODE);
console.log("PulseAPI backend URL:", API_BASE_URL);

const API = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

API.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error(
      "API request failed:",
      error.response?.status,
      error.response?.data || error.message
    );

    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }

    return Promise.reject(error);
  }
);

export default API;