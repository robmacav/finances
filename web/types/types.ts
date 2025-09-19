export type User = {
  id: number;
  name: string;
  email: string;
};

export type LoginResponse = {
  token: string;
};

export type ApiError = {
  error?: string;
  message?: string;
};
