import { apiFetch } from "@/lib/apiFetch";
import { removerToken, salvarToken } from "@/lib/authStorage";
import type {
  LoginRequest,
  LoginResponse,
  UsuarioLogado,
} from "@/types/auth";

export async function fazerLogin(
  dados: LoginRequest
): Promise<LoginResponse> {
  const resposta = await apiFetch<LoginResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(dados),
    usarToken: false,
  });

  salvarToken(resposta.token);

  return resposta;
}

export async function buscarUsuarioLogado(): Promise<UsuarioLogado> {
  return apiFetch<UsuarioLogado>("/auth/me");
}

export function fazerLogout() {
  removerToken();
}