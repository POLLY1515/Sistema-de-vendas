export type UsuarioLogado = {
  id: number;
  nome: string;
  email: string;
  perfil: "ADMIN" | "VENDEDOR";
};

export type LoginRequest = {
  email: string;
  senha: string;
};

export type LoginResponse = {
  token: string;
  usuario: UsuarioLogado;
};