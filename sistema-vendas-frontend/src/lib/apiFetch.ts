import { buscarToken } from "@/lib/authStorage";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

type ApiFetchOptions = RequestInit & {
  usarToken?: boolean;
};

export async function apiFetch<T>(
  endpoint: string,
  options: ApiFetchOptions = {}
): Promise<T> {
  const { usarToken = true, headers, ...rest } = options;

  const token = buscarToken();

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...rest,
    headers: {
      "Content-Type": "application/json",
      ...(usarToken && token
        ? { Authorization: `Bearer ${token}` }
        : {}),
      ...headers,
    },
  });

  if (!response.ok) {
    throw new Error("Erro ao comunicar com a API.");
  }

  return response.json() as Promise<T>;
}