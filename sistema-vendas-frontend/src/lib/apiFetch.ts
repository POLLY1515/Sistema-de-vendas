import { buscarToken } from "@/lib/authStorage";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

type ApiFetchOptions = RequestInit & {
  usarToken?: boolean;
};

type ApiErrorPayload = {
  mensagem?: string;
  erro?: string;
};

export async function apiFetch<T>(
  endpoint: string,
  options: ApiFetchOptions = {}
): Promise<T> {
  if (!API_URL) {
    throw new Error("NEXT_PUBLIC_API_URL nao esta configurada.");
  }

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

  const texto = response.status === 204 ? "" : await response.text();
  let dados: unknown = undefined;

  if (texto) {
    try {
      dados = JSON.parse(texto);
    } catch {
      dados = texto;
    }
  }

  if (!response.ok) {
    const payload =
      dados && typeof dados === "object"
        ? (dados as ApiErrorPayload)
        : null;

    const mensagem =
      payload?.mensagem ||
      payload?.erro ||
      `Erro ${response.status} ao comunicar com a API.`;

    throw new Error(mensagem);
  }

  return dados as T;
}
