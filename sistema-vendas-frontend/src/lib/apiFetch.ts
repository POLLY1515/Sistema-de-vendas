import { env } from "@/config/env";
import { dispararSessaoExpirada } from "@/lib/authEvents";
import {
  buscarToken,
  removerToken,
} from "@/lib/authStorage";


type ApiFetchOptions = RequestInit & {
  usarToken?: boolean;
};

type ApiErrorPayload = {
  mensagem?: string;
  message?: string;
  erro?: string;
};

export class ApiHttpError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiHttpError";
    this.status = status;
  }
}

function extrairMensagem(
  dados: unknown,
  fallback: string
) {
  if (typeof dados === "string" && dados.trim()) {
    return dados;
  }

  if (dados && typeof dados === "object") {
    const payload = dados as ApiErrorPayload;

    return (
      payload.mensagem ||
      payload.message ||
      payload.erro ||
      fallback
    );
  }

  return fallback;
}

export async function apiFetch<T>(
  endpoint: string,
  options: ApiFetchOptions = {}
): Promise<T> {

  const {
    usarToken = true,
    headers,
    ...rest
  } = options;

  const token = buscarToken();

  let response: Response;

  try {
    response = await fetch(
      `${env.apiUrl}${endpoint}`,
      {
        ...rest,
        headers: {
          "Content-Type": "application/json",
          ...(usarToken && token
            ? {
                Authorization: `Bearer ${token}`,
              }
            : {}),
          ...headers,
        },
      }
    );
  } catch {
    throw new Error(
      "Nao foi possivel conectar com a API. Verifique sua conexao e tente novamente."
    );
  }

  const texto =
    response.status === 204
      ? ""
      : await response.text();

  let dados: unknown = undefined;

  if (texto) {
    try {
      dados = JSON.parse(texto);
    } catch {
      dados = texto;
    }
  }

  if (!response.ok) {
    if (
      response.status === 401 &&
      usarToken &&
      token
    ) {
      removerToken();
      dispararSessaoExpirada();

      throw new ApiHttpError(
        401,
        "Sua sessao expirou. Entre novamente para continuar."
      );
    }

    if (response.status === 403) {
      throw new ApiHttpError(
        403,
        "Voce nao tem permissao para realizar esta acao."
      );
    }

    const mensagem = extrairMensagem(
      dados,
      `Erro ${response.status} ao comunicar com a API.`
    );

    throw new ApiHttpError(
      response.status,
      mensagem
    );
  }

  return dados as T;
}

