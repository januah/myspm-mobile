import { apiClient } from "./apiClient";
import { tokenStorage } from "./tokenStorage";
import {
  AuthResponse,
  LoginRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  OAuthCallbackRequest,
} from "../types/auth";

export const authService = {
  async login(email: string, password: string): Promise<AuthResponse> {
    const request: LoginRequest = { email, password };
    const response = await apiClient.request<AuthResponse>(
      "POST",
      "/auth/login",
      request
    );

    // Store tokens
    await tokenStorage.setTokens(
      response.accessToken,
      response.refreshToken
    );

    return response;
  },

  async logout(): Promise<void> {
    try {
      const refreshToken = await tokenStorage.getRefreshToken();
      if (refreshToken) {
        await apiClient.request("POST", "/auth/logout", { refreshToken });
      }
    } catch (error) {
      console.error("Logout API call failed:", error);
    } finally {
      // Always clear tokens locally, even if API call fails
      await tokenStorage.clearTokens();
    }
  },

  async refreshToken(): Promise<AuthResponse> {
    const refreshToken = await tokenStorage.getRefreshToken();
    if (!refreshToken) {
      throw new Error("No refresh token available");
    }

    const response = await apiClient.request<AuthResponse>(
      "POST",
      "/auth/refresh",
      { refreshToken }
    );

    await tokenStorage.setTokens(
      response.accessToken,
      response.refreshToken
    );

    return response;
  },

  async verifyToken(): Promise<{ valid: boolean; user?: any }> {
    try {
      const response = await apiClient.request<any>(
        "GET",
        "/auth/verify"
      );
      return { valid: true, user: response };
    } catch (error) {
      return { valid: false };
    }
  },

  async forgotPassword(email: string): Promise<{ message: string }> {
    const request: ForgotPasswordRequest = { email };
    return await apiClient.request<{ message: string }>(
      "POST",
      "/auth/forgot-password",
      request
    );
  },

  async resetPassword(
    token: string,
    newPassword: string,
    confirmPassword: string
  ): Promise<{ success: boolean }> {
    const request: ResetPasswordRequest = {
      token,
      newPassword,
      confirmPassword,
    };
    return await apiClient.request<{ success: boolean }>(
      "POST",
      "/auth/reset-password",
      request
    );
  },

  async loginWithOAuth(
    provider: "google" | "apple",
    code: string,
    codeVerifier?: string
  ): Promise<AuthResponse> {
    const request: OAuthCallbackRequest = {
      provider,
      code,
      codeVerifier,
    };
    const response = await apiClient.request<AuthResponse>(
      "POST",
      `/auth/oauth/${provider}/callback`,
      request
    );

    // Store tokens
    await tokenStorage.setTokens(
      response.accessToken,
      response.refreshToken
    );

    return response;
  },

  async getOAuthAuthorizeUrl(
    provider: "google" | "apple"
  ): Promise<{ url: string }> {
    return await apiClient.request<{ url: string }>(
      "GET",
      `/auth/oauth/${provider}/authorize`
    );
  },
};
