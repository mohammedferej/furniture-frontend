// lib/services/auth.ts
import { ACCESS_TOKEN, REFRESH_TOKEN } from "@/constants";
import Cookies from "js-cookie";
import api from "./api";

// export const AuthService = {
//   login: async (username: string, password: string): Promise<LoginResponse> => {
//     const res = await api.post<LoginResponse>("/auth/token/", {
//       username,
//       password,
//     });
//     const { access, refresh, user } = res.data;

//     const cookieOptions = {
//       expires: 1,
//       secure: process.env.NODE_ENV === "production",
//     };
//     Cookies.set(ACCESS_TOKEN, access, cookieOptions);
//     Cookies.set(REFRESH_TOKEN, refresh, { ...cookieOptions, expires: 7 });

//     return res.data;
//   },

//   logout: async () => {
//     const refresh = Cookies.get(REFRESH_TOKEN);
//     if (refresh) await api.post("/auth/logout/", { refresh_token: refresh });
//     Cookies.remove(ACCESS_TOKEN);
//     Cookies.remove(REFRESH_TOKEN);
//   },

//   getUserProfile: async (): Promise<User | null> => {
//     try {
//       const res = await api.get<User>("/auth/profile/");
//       return res.data;
//     } catch {
//       return null;
//     }
//   },

//   register: async (data: RegisterData): Promise<RegisterResponse> => {
//     const res = await api.post<RegisterResponse>("/auth/register/", data);
//     return res.data;
//   },

//   // ✅ Permission helpers
//   hasPermission: (user: User | null, permission: string): boolean => {
//     if (!user?.groups) return false;
//     return user.groups.some((g) => g.permissions.includes(permission));
//   },

//   hasGroup: (user: User | null, groupName: string): boolean => {
//     if (!user?.groups) return false;
//     return user.groups.some((g) => g.name === groupName);
//   },
// };

export const AuthService = {
  login: async (username: string, password: string) => {
    const res = await api.post("/auth/token/", { username, password });
    const { access, refresh } = res.data;
    Cookies.set(ACCESS_TOKEN, access, {
      expires: 1,
      secure: process.env.NODE_ENV === "production",
    });
    Cookies.set(REFRESH_TOKEN, refresh, {
      expires: 7,
      secure: process.env.NODE_ENV === "production",
    });
    return res.data;
  },

  logout: async () => {
    try {
      await api.post("/auth/logout/", {
        refresh_token: Cookies.get(REFRESH_TOKEN),
      });
    } finally {
      Cookies.remove(ACCESS_TOKEN);
      Cookies.remove(REFRESH_TOKEN);
    }
  },

  getUserProfile: async () => {
    const res = await api.get("/auth/profile/");
    return res.data;
  },

  register: async (data: any) => {
    const res = await api.post("/auth/register/", data);
    return res.data;
  },
};
