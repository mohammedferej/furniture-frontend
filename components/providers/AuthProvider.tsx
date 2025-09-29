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
  logout: () => void;
  hasPermission: (perm: string) => boolean; // ✅ add this
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const token = Cookies.get(ACCESS_TOKEN);
      if (token) {
        try {
          const userData = await AuthService.getUserProfile();
          setUser(userData);
        } catch {
          AuthService.logout();
        }
      }
      setLoading(false);
    };
    init();
  }, []);

  const login = async (username: string, password: string) => {
    await AuthService.login(username, password);
    const userData = await AuthService.getUserProfile();
    setUser(userData);
  };

  const logout = async () => {
    await AuthService.logout();
    setUser(null);
  };
  // ✅ Permission check
  const hasPermission = (perm: string) => {
    if (!user) return false;
    return user.permissions?.includes(perm) || false;
  };
  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
