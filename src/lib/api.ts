import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

// ─── Axios instance ───────────────────────────────────────────────────────────
export const api = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// ─── Token helpers ────────────────────────────────────────────────────────────
export const tokenStorage = {
  getAccess: () =>
    typeof window !== "undefined" ? localStorage.getItem("rendi_access") : null,
  getRefresh: () =>
    typeof window !== "undefined" ? localStorage.getItem("rendi_refresh") : null,
  set: (access: string, refresh: string) => {
    localStorage.setItem("rendi_access", access);
    localStorage.setItem("rendi_refresh", refresh);
  },
  clear: () => {
    localStorage.removeItem("rendi_access");
    localStorage.removeItem("rendi_refresh");
  },
};

// ─── Request interceptor — attach Bearer token ────────────────────────────────
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = tokenStorage.getAccess();
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ─── Response interceptor — silent token refresh on 401 ──────────────────────
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: string) => void;
  reject: (err: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((p) => (error ? p.reject(error) : p.resolve(token!)));
  failedQueue = [];
};

api.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (error.response?.status === 401 && !originalRequest._retry) {
      const refresh = tokenStorage.getRefresh();
      if (!refresh) {
        tokenStorage.clear();
        window.location.href = "/auth/login";
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const { data } = await axios.post(`${BASE_URL}/api/auth/token/refresh/`, {
          refresh,
        });
        tokenStorage.set(data.access, refresh);
        api.defaults.headers.common.Authorization = `Bearer ${data.access}`;
        processQueue(null, data.access);
        originalRequest.headers.Authorization = `Bearer ${data.access}`;
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        tokenStorage.clear();
        window.location.href = "/auth/login";
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

// ─── API functions ─────────────────────────────────────────────────────────────

import type {
  LoginPayload,
  RegisterPayload,
  LoginResponse,
  User,
  ChangePasswordPayload,
  AssessmentInputs,
  AssessmentResponse,
  Assessment,
  AssessmentListItem,
} from "@/types";

// Auth
export const authApi = {
  register: (data: RegisterPayload) =>
    api.post<{ message: string; user: User }>("/api/auth/register/", data),

  login: (data: LoginPayload) =>
    api.post<LoginResponse>("/api/auth/login/", data),

  getProfile: () => api.get<User>("/api/auth/profile/"),

  updateProfile: (data: Partial<Pick<User, "first_name" | "last_name">>) =>
    api.patch<User>("/api/auth/profile/", data),

  changePassword: (data: ChangePasswordPayload) =>
    api.post<{ message: string }>("/api/auth/change-password/", data),
};

// Assessments
export const assessmentApi = {
  submit: (data: AssessmentInputs) =>
    api.post<AssessmentResponse>("/api/assessments/submit/", data),

  getLatest: () => api.get<AssessmentResponse>("/api/assessments/latest/"),

  getHistory: () => api.get<AssessmentListItem[]>("/api/assessments/history/"),

  getDetail: (id: number) =>
    api.get<Assessment>(`/api/assessments/${id}/`),
};
