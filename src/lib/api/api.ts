import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";

/**
 * Load environment variables
 */
const APP_MODE = process.env.APP_MODE || "development";
const BASE_URL = process.env.BACKEND_API_URL || "http://127.0.0.1:4005/api";

/**
 * Create a single Axios instance
 */
const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000, // 10 seconds
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

/**
 * Optional: Automatically attach token (if stored in localStorage)
 */
api.interceptors.request.use(
  (config) => {
      const token = localStorage.getItem("auth_token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Response interceptor for logging or error handling
 */
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    if (APP_MODE === "development") {
      console.error("API Error:", error);
    }
    return Promise.reject(error);
  }
);

/**
 * Define a reusable, typed API helper
 */
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export const ApiService = {
   teenpattiBetGame: async <T>(payload: { amount: number; roomId: string }): Promise<ApiResponse<T>> => {
    const response = await api.post<T>("EndPoint Here", payload);
    return { success: true, data: response.data };
  },

};

export default ApiService;
