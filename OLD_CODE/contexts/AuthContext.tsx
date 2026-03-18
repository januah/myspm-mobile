import React, { createContext, ReactNode } from "react";
import { AuthContextType, User } from "../types/auth";

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = React.useState<User | null>(null);
  const [token, setToken] = React.useState<string | null>(null);
  const [refreshToken, setRefreshToken] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  // Initialize auth state on mount
  React.useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      const { tokenStorage } = await import("../services/tokenStorage");
      const { authService } = await import("../services/authService");

      const accessToken = await tokenStorage.getAccessToken();
      const refToken = await tokenStorage.getRefreshToken();

      if (accessToken) {
        setToken(accessToken);
        setRefreshToken(refToken);

        // Verify token is still valid
        const { valid, user: userData } = await authService.verifyToken();
        if (valid && userData) {
          setUser(userData);
        } else {
          // Token is invalid, clear storage
          await tokenStorage.clearTokens();
          setToken(null);
          setRefreshToken(null);
        }
      }
    } catch (error) {
      console.error("Error initializing auth:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { authService } = await import("../services/authService");
      const response = await authService.login(email, password);

      setUser(response.user);
      setToken(response.accessToken);
      if (response.refreshToken) {
        setRefreshToken(response.refreshToken);
      }
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithOAuth = async (
    provider: "google" | "apple",
    code: string
  ) => {
    setIsLoading(true);
    try {
      const { authService } = await import("../services/authService");
      const response = await authService.loginWithOAuth(provider, code);

      setUser(response.user);
      setToken(response.accessToken);
      if (response.refreshToken) {
        setRefreshToken(response.refreshToken);
      }
    } catch (error) {
      console.error("OAuth login error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      const { authService } = await import("../services/authService");
      await authService.logout();

      setUser(null);
      setToken(null);
      setRefreshToken(null);
    } catch (error) {
      console.error("Logout error:", error);
      // Still clear local state even if API call fails
      setUser(null);
      setToken(null);
      setRefreshToken(null);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const refreshAccessToken = async () => {
    try {
      const { authService } = await import("../services/authService");
      const response = await authService.refreshToken();

      setToken(response.accessToken);
      if (response.refreshToken) {
        setRefreshToken(response.refreshToken);
      }
    } catch (error) {
      console.error("Token refresh error:", error);
      // Clear auth on refresh failure
      setUser(null);
      setToken(null);
      setRefreshToken(null);
      throw error;
    }
  };

  const updateUser = (newUser: User) => {
    setUser(newUser);
  };

  const value: AuthContextType = {
    user,
    token,
    refreshToken,
    isLoading,
    isAuthenticated: token !== null && user !== null,
    login,
    loginWithOAuth,
    logout,
    refreshAccessToken,
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
};
