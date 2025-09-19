import { apiClient } from "../lib/apiClient";
import type { LoginResponse, User } from "../types";

const TOKEN_KEY = "auth_token";

export const auth = {
  get token(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  },
  set token(v: string | null) {
    if (v) localStorage.setItem(TOKEN_KEY, v);
    else localStorage.removeItem(TOKEN_KEY);
  },

  async login(email: string, password: string): Promise<string> {
    const { token } = await apiClient<LoginResponse>("/login", {
      method: "POST",
      body: { email, password },
    });
    this.token = token;
    return token;
  },

  logout() {
    this.token = null;
  },

  async me(): Promise<User> {
    return apiClient<User>("/me", { token: this.token });
  },
};
