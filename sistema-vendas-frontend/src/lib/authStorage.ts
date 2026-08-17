const TOKEN_KEY = "sistema_vendas_token";

export function salvarToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function buscarToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function removerToken() {
  localStorage.removeItem(TOKEN_KEY);
}

export function usuarioEstaLogado() {
  const token = buscarToken();
  return token !== null && token.trim() !== "";
}