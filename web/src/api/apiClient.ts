import type { ApiError } from "../types";

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export type ApiOptions = {
  method?: HttpMethod;
  body?: unknown;
  token?: string | null;
  signal?: AbortSignal;
  // headers extras se precisar
  headers?: Record<string, string>;
};

/**
 * Faz fetch tipado e tenta parsear JSON em T (ou vazio).
 * Lança Error com a mensagem vinda da API quando status não-2xx.
 */
export async function apiClient<T = unknown>(
  path: string,
  { method = "GET", body, token, signal, headers }: ApiOptions = {}
): Promise<T> {
  const url = `${import.meta.env.VITE_API_URL}${path}`;

  const res = await fetch(url, {
    method,
    signal,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  // tenta parsear json (pode não ter corpo)
  const text = await res.text();
  const data = text ? (JSON.parse(text) as unknown) : ({} as unknown);

  if (!res.ok) {
    const err = (data as ApiError)?.error || (data as ApiError)?.message || `HTTP ${res.status}`;
    throw new Error(err);
  }

  return data as T;
}
