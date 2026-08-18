const TOKEN_KEY = "sistema_vendas_token";

function podeUsarStorage() {
  return typeof window !== "undefined";
}

export function salvarToken(token: string) {
  if (!podeUsarStorage()) return;
  window.localStorage.setItem(TOKEN_KEY, token);
}

export function buscarToken(): string | null {
  if (!podeUsarStorage()) return null;
  return window.localStorage.getItem(TOKEN_KEY);
}

export function removerToken() {
  if (!podeUsarStorage()) return;
  window.localStorage.removeItem(TOKEN_KEY);
}

export function usuarioEstaLogado() {
  const token = buscarToken();
  return token !== null && token.trim() !== "";
}
