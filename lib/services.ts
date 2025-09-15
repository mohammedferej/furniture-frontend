import { ACCESS_TOKEN, REFRESH_TOKEN } from "@/constants";
import Cookies from "js-cookie";
import api from "./api";

const baseURL = "/auth";

// service.tsx
export const AuthService = {
  register: async (userData: RegisterData) => {
    try {
      console.log(userData);
      const res = await api.post<RegisterResponse>(
        `${baseURL}/register/`,
        userData
      );
      console.log(res);
      return res.data;
    } catch (error) {
      console.log("Error in AuthService.register:", error);
      // 🔥 Re-throw the error so it can be caught in the component
      throw error;
    }
  },

  login: async (username: string, password: string) => {
    try {
      const res = await api.post<LoginResponse>(`${baseURL}/login/`, {
        username,
        password,
      });
      if (res.status === 200) {
        const { access, refresh } = res.data;

        const cookieOptions = {
          expires: 1,
          secure: process.env.NODE_ENV === "production",
        };
        Cookies.set(ACCESS_TOKEN, access, cookieOptions);
        Cookies.set(REFRESH_TOKEN, refresh, {
          ...cookieOptions,
          expires: 7, // Refresh token expires in 7 days
        });
        return res.data;
      }
    } catch (error) {
      console.log("Error in AuthService.login: ", error);
    }
  },
  verifyEmail: async (token: string) => {
    try {
      const res = await api.get(`${baseURL}/verify-email/${token}/`);
      if (res.status === 200) {
        const { access, refresh } = res.data;

        // Set new tokens in cookies
        const cookieOptions = {
          expires: 1,
          secure: process.env.NODE_ENV === "production",
        };
        Cookies.set(ACCESS_TOKEN, access, cookieOptions);
        Cookies.set(REFRESH_TOKEN, refresh, {
          ...cookieOptions,
          expires: 7, // Refresh token expires in 7 days
        });

        return res.data;
      }
    } catch (error) {
      console.log("Error in AuthService.sendVerificationEmail:", error);
      return {
        error:
          error instanceof Error
            ? error.message
            : "An error occurred while verifying email",
      };
    }
  },
  resendVerificationEmail: async (email: string) => {
    try {
      const res = await api.post<{ message: string }>(
        `${baseURL}/resend-verification-email/`,
        {
          email,
        }
      );
      if (res.status === 200) {
        return res.data;
      }
    } catch (error) {
      console.log("Error in AuthService.resendVerificationEmail:", error);
    }
  },
  getUserProfile: async () => {
    try {
      const res = await api.get<User>(`${baseURL}/profile/`);
      return res.data;
    } catch (error) {
      console.log("Error in AuthService.getUserProfile:", error);
    }
  },
  logout: async () => {
    try {
      const res = await api.post<{ message: string }>(`${baseURL}/logout/`, {
        refresh_token: Cookies.get(REFRESH_TOKEN),
      });
      Cookies.remove(ACCESS_TOKEN);
      Cookies.remove(REFRESH_TOKEN);
      return res.data;
    } catch (error) {
      console.log("Error in AuthService.logout:", error);
      //Remove the access token and refresh token regardless
      Cookies.remove(ACCESS_TOKEN);
      Cookies.remove(REFRESH_TOKEN);
    }
  },
  // 👇 Add this to your AuthService
  getUsers: async () => {
    try {
      const res = await api.get<User[]>(`${baseURL}/users/`);
      return res.data;
    } catch (error) {
      console.log("Error in AuthService.getUsers:", error);
      throw error;
    }
  },
  // in lib/services/index.ts or AuthService
  getUsersPaginated: async (page: number = 1, search: string = "") => {
    const res = await api.get(`/auth/users/`, {
      params: { page, search },
    });
    console.log("Test ...", search, res.data);
    return res.data; // { count, next, previous, results }
  },

  updateUser: async (userId: string, userData: Partial<User>) => {
    try {
      const res = await api.put<User>(`/api/users/update/${userId}/`, userData);
      return res.data;
    } catch (error) {
      console.error("Error updating user:", error);
      throw error;
    }
  },

  updateUserWithFormData: async (data: FormData) => {
    console.log(data);
    try {
      const res = await api.put("/profile/update/", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return res.data;
    } catch (error) {
      console.error("Error updating user with image:", error);
      throw error;
    }
  },
  deleteUser: async (userId: string) => {
    return await api.delete(`/api/users/delete/${userId}/`);
  },

  blockUser: async (userId: string) => {
    return await api.patch(`/users/${userId}/block/`, { blocked: true });
  },

  getUserById: async (userId: string) => {
    console.log(userId);
    const res = await api.get(`/users/${userId}/`);
    return res.data;
  },
};
