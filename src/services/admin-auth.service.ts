import { apiClient } from "./api.client";

interface AdminLoginResponse {
  token: string;
  expiresIn: number;
}

const ADMIN_TOKEN_KEY = "perfumes_admin_token";

export const loginAdmin = (username: string, password: string) =>
  apiClient.post<AdminLoginResponse>("/admin/login", {
    username,
    password,
  });

export const getAdminToken = () => {
  try {
    return localStorage.getItem(ADMIN_TOKEN_KEY);
  } catch {
    return null;
  }
};

export const saveAdminToken = (token: string) => {
  try {
    localStorage.setItem(ADMIN_TOKEN_KEY, token);
  } catch {
    // Ignore storage errors in private mode.
  }
};

export const clearAdminToken = () => {
  try {
    localStorage.removeItem(ADMIN_TOKEN_KEY);
  } catch {
    // Ignore storage errors in private mode.
  }
};
