import { ACCESS_TOKEN, REFRESH_TOKEN } from "@/constants";
import axios from "axios";
import Cookies from "js-cookie";

const API_BASE_URL = "http://localhost:8000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// Attach token automatically
api.interceptors.request.use((config) => {
  const token = Cookies.get(ACCESS_TOKEN);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Refresh token on 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = Cookies.get(REFRESH_TOKEN);
      if (refreshToken) {
        try {
          const { data } = await axios.post(
            `${API_BASE_URL}/auth/token/refresh/`,
            { refresh: refreshToken }
          );
          Cookies.set(ACCESS_TOKEN, data.access, {
            expires: 1,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Lax",
          });
          originalRequest.headers.Authorization = `Bearer ${data.access}`;
          return api(originalRequest);
        } catch {
          Cookies.remove(ACCESS_TOKEN);
          Cookies.remove(REFRESH_TOKEN);
          window.location.href = "/login";
        }
      }
    }

    return Promise.reject(error);
  }
);

export default api;
