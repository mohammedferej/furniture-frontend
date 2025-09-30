"use client";

import { ACCESS_TOKEN } from "@/constants";
import { AuthService } from "@/lib/AuthService";
import { User } from "@/types";
import Cookies from "js-cookie";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  hasPermission: (perm: string) => boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // 🔹 Load user on mount if token exists
  useEffect(() => {
    const init = async () => {
      const token = Cookies.get(ACCESS_TOKEN);
      if (token) {
        try {
          console.log("[AuthProvider] Token found, fetching user profile...");
          const userData = await AuthService.getUserProfile();
          console.log("[AuthProvider] User profile loaded:", userData);
          setUser(userData);
        } catch (err) {
          console.error(
            "[AuthProvider] Failed to fetch profile, logging out",
            err
          );
          await AuthService.logout();
        }
      }
      setLoading(false);
    };
    init();
  }, []);

  // 🔹 Login
  const login = async (username: string, password: string) => {
    console.log("[AuthProvider] Logging in:", username);
    await AuthService.login(username, password);
    const userData = await AuthService.getUserProfile();
    console.log("[AuthProvider] User profile after login:", userData);
    setUser(userData);
  };

  // 🔹 Logout
  const logout = async () => {
    console.log("[AuthProvider] Logging out...");
    await AuthService.logout();
    setUser(null);
  };

  // 🔹 Permission check
  const hasPermission = (perm: string) => {
    if (!user) return false;
    return user.permissions?.includes(perm) || false;
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, logout, hasPermission }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// 🔹 Hook for consuming AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
