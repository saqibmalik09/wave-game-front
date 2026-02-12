import axios, { AxiosInstance, AxiosResponse } from "axios";
import type {
  LoginDto,
  RegisterDto,
  LoginResponse,
  RegisterResponse,
  User,
  CreateRoleDto,
  CreatePermissionDto,
  Role,
  Permission,
} from "../types/auth.types";

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

const APP_MODE = process.env.APP_MODE || "development";
const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL;

const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor with token refresh
let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = localStorage.getItem("refreshToken");

      if (!refreshToken) {
        if (typeof window !== 'undefined') {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          window.location.href = "/login";
        }
        return Promise.reject(error);
      }

      try {
        const response = await axios.post(`${BASE_URL}/auth/refresh-token`, {
          refreshToken,
        });

        const { accessToken, refreshToken: newRefreshToken } = response.data;

        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", newRefreshToken);

        api.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;

        processQueue(null, accessToken);
        isRefreshing = false;

        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        isRefreshing = false;

        if (typeof window !== 'undefined') {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          window.location.href = "/login";
        }

        return Promise.reject(refreshError);
      }
    }

    if (APP_MODE === "development") {
      console.error("API Error:", error);
    }

    return Promise.reject(error);
  }
);

// Authentication API
export const AuthAPI = {
  login: async (email: string, password: string): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>("/auth/login", { email, password });
    return response.data;
  },

  register: async (data: RegisterDto): Promise<RegisterResponse> => {
    const response = await api.post<RegisterResponse>("/auth/register", data);
    return response.data;
  },

  refreshToken: async (refreshToken: string): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>("/auth/refresh-token", { refreshToken });
    return response.data;
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await api.get<User>("/auth/me");
    return response.data;
  },

  logoutAllUsers: async (): Promise<{ message: string }> => {
    const response = await api.post<{ message: string }>("/auth/logout-all-users/maintenance");
    return response.data;
  },
};

// Roles API
export const RolesAPI = {
  getAllRoles: async (): Promise<Role[]> => {
    const response = await api.get<Role[]>("/roles");
    return response.data;
  },

  getRoleById: async (id: number): Promise<Role> => {
    const response = await api.get<Role>(`/roles/${id}`);
    return response.data;
  },

  createRole: async (data: CreateRoleDto): Promise<Role> => {
    const response = await api.post<Role>("/roles", data);
    return response.data;
  },

  assignPermissions: async (roleId: number, permissionIds: number[]): Promise<Role> => {
    const response = await api.post<Role>(`/roles/${roleId}/permissions`, { permissionIds });
    return response.data;
  },

  assignRolesToUser: async (userId: number, roleIds: number[]): Promise<Role[]> => {
    const response = await api.post<Role[]>(`/roles/users/${userId}/roles`, { roleIds });
    return response.data;
  },
};

// Permissions API
export const PermissionsAPI = {
  getAllPermissions: async (): Promise<Permission[]> => {
    const response = await api.get<Permission[]>("/permissions");
    return response.data;
  },

  createPermission: async (data: CreatePermissionDto): Promise<Permission> => {
    const response = await api.post<Permission>("/permissions", data);
    return response.data;
  },
};

// Existing API Service
export const ApiService = {
  tenantConfigByAppKey: async (appKey: string): Promise<TenantConfigResponse> => {
    const response = await api.get<TenantConfigResponse>(`/admin/tenantdatabyappkey/${appKey}`);
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

export default api;