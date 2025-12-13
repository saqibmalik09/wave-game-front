import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
export interface TenantConfig {
  activeGames: string;
  tanantName: string;
  tenantAppKey: string;
  tenantProductionDomain: string;
  tenantTestingDomain: string;
  tenantPassword: string;
}

export interface TenantConfigResponse {
  success: boolean;
  message: string;
  data: TenantConfig;
}
/**
 * Load environment variables
 */
const APP_MODE = process.env.APP_MODE || "development";
const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL;
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
  export const ApiService = {
 tenantConfigByAppKey: async (appKey: string): Promise<TenantConfigResponse> => {
    const response = await api.get<TenantConfigResponse>(
      `/admin/tenantdatabyappkey/${appKey}`
    );
    return response.data;
  },
  gameUserInfo: async <T>(payload: { token: string; tenantDomainURL: string }): Promise<T> => {
    const url = `${payload.tenantDomainURL}/wave/game/userInfo`; 
    
    const response = await axios.get<T>(url, {
      headers: {
        Authorization: `Bearer ${payload.token}`,
      },
    });
    return response.data;
  },
};
export default ApiService;