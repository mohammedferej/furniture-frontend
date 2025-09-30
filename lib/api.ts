import { ACCESS_TOKEN } from "@/constants";
import Cookies from "js-cookie";
import ky from "ky";

const API_BASE_URL = "http://localhost:8000/api/";

const api = ky.create({
  prefixUrl: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
  retry: 0,
});

export const apiRequest = async <T>(
  path: string,
  options?: Parameters<typeof api.get>[1]
): Promise<T> => {
  try {
    const accessToken = Cookies.get(ACCESS_TOKEN);
    const headers: Record<string, string> = {};
    if (accessToken) headers["Authorization"] = `Bearer ${accessToken}`;

    return await api(path, { ...options, headers }).json<T>();
  } catch (err: any) {
    // Let the caller handle toast
    throw err;
  }
};
