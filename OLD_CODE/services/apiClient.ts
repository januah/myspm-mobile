import axios, { AxiosInstance, AxiosError } from "axios";
import { tokenStorage } from "./tokenStorage";
import { AuthResponse } from "../types/auth";

const API_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:3000/api";
const API_TIMEOUT = parseInt(
  process.env.EXPO_PUBLIC_API_TIMEOUT || "30000",
  10
);

class ApiClient {
  private client: AxiosInstance;
  private refreshPromise: Promise<string | null> | null = null;

  constructor() {
    this.client = axios.create({
      baseURL: API_URL,
      timeout: API_TIMEOUT,
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Request interceptor: Add token to headers
    this.client.interceptors.request.use(
      async (config) => {
        const token = await tokenStorage.getAccessToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor: Handle token refresh on 401
    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as any;

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            // Prevent multiple refresh requests
            if (!this.refreshPromise) {
              this.refreshPromise = this.performTokenRefresh();
            }

            await this.refreshPromise;
            this.refreshPromise = null;

            // Retry original request with new token
            const token = await tokenStorage.getAccessToken();
            if (token) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return this.client(originalRequest);
          } catch (refreshError) {
            this.refreshPromise = null;
            // Refresh failed, logout user
            await tokenStorage.clearTokens();
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );
  }

  private async performTokenRefresh(): Promise<string | null> {
    try {
      const refreshToken = await tokenStorage.getRefreshToken();
      if (!refreshToken) {
        throw new Error("No refresh token available");
      }

      const response = await axios.post<AuthResponse>(
        `${API_URL}/auth/refresh`,
        { refreshToken },
        {
          timeout: API_TIMEOUT,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const { accessToken, refreshToken: newRefreshToken } = response.data;
      await tokenStorage.setTokens(accessToken, newRefreshToken);
      return accessToken;
    } catch (error) {
      console.error("Token refresh failed:", error);
      throw error;
    }
  }

  public getClient(): AxiosInstance {
    return this.client;
  }

  public async request<T>(
    method: string,
    url: string,
    data?: any,
    config?: any
  ): Promise<T> {
    try {
      const response = await this.client.request<T>({
        method,
        url,
        data,
        ...config,
      });
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  private handleError(error: any): void {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const data = error.response?.data as any;

      console.error(`API Error [${status}]:`, data?.message || error.message);
    } else {
      console.error("API Error:", error);
    }
  }
}

export const apiClient = new ApiClient();
