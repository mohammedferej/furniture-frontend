// lib/AuthService.ts
import { ACCESS_TOKEN, REFRESH_TOKEN } from "@/constants";
import { RegisterData, User } from "@/types";
import Cookies from "js-cookie";
import { apiRequest } from "./api";

const baseURL = "auth";

export const AuthService = {
  login: async (username: string, password: string) => {
    const data = await apiRequest<{
      access: string;
      refresh: string;
      user: User;
    }>(`${baseURL}/token/`, { method: "POST", json: { username, password } });

    Cookies.set(ACCESS_TOKEN, data.access, {
      expires: 1,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Lax",
    });
    Cookies.set(REFRESH_TOKEN, data.refresh, {
      expires: 7,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Lax",
    });

    return data;
  },

  // In AuthService.ts
  logout: async () => {
    try {
      await apiRequest("auth/logout/", {
        method: "POST",
        json: { refresh_token: Cookies.get("refresh_token") },
      });
    } catch (err) {
      console.warn(
        "[AuthService] Logout failed, forcing client-side cleanup:",
        err
      );
    } finally {
      // ✅ Always clear tokens client-side
      Cookies.remove("access_token");
      Cookies.remove("refresh_token");
    }
  },

  getUserProfile: async (): Promise<User> => {
    try {
      const data = await apiRequest<User>(`${baseURL}/profile/`);

      // Flatten group permissions into main permissions array if needed
      const groupPermissions =
        data.groups?.flatMap((group) => group.permissions) || [];
      const userPermissions = data.permissions || [];

      return {
        ...data,
        permissions: Array.from(
          new Set([...userPermissions, ...groupPermissions])
        ),
      };
    } catch (error) {
      console.error("[AuthService] getUserProfile:", error);
      throw error;
    }
  },

  register: async (data: RegisterData) => {
    return await apiRequest(`${baseURL}/register/`, {
      method: "POST",
      json: data,
    });
  },

  getUsers: async (): Promise<User[]> => {
    return await apiRequest<User[]>(`${baseURL}/users/`);
  },

  getUsersPaginated: async (page = 1, search = "") => {
    return await apiRequest<{
      count: number;
      next: string | null;
      previous: string | null;
      results: User[];
    }>(`${baseURL}/users/`, { searchParams: { page, search } });
  },

  getUserById: async (userId: string) => {
    return await apiRequest<User>(`${baseURL}/users/${userId}/`);
  },

  updateUser: async (userId: string, userData: Partial<User>) => {
    console.log("userId : ", userId);
    return await apiRequest<User>(`users/${userId}/`, {
      method: "PATCH",
      json: userData,
    });
  },

  updateUserWithFormData: async (data: FormData) => {
    return await apiRequest<User>(`/profile/update/`, {
      method: "PUT",
      body: data, // Ky automatically handles FormData headers
    });
  },

  deleteUser: async (userId: string) => {
    return await apiRequest<{ message: string }>(`users/${userId}/`, {
      method: "DELETE",
    });
  },

  blockUser: async (userId: string) => {
    return await apiRequest<User>(`users/${userId}/block/`, {
      method: "PATCH",
      json: { blocked: true },
    });
  },

  unblockUser: async (userId: string) => {
    return await apiRequest<{ message: string }>(`users/${userId}/unblock/`, {
      method: "PATCH",
    });
  },
};
