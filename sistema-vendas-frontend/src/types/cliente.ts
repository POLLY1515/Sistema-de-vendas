export type Cliente = {
  id: number;
  nome: string;
  email: string;
  cpf: string;
  telefone?: string | null;
  criadoEm?: string;
};

export type ClienteRequest = {
  nome: string;
  email: string;
  cpf: string;
  telefone: string;
};

export type ClientePage = {
  content: Cliente[];
  totalPages: number;
  totalElements: number;
  number: number;
  size: number;
};

export type ApiResponse<T> = {
  sucesso: boolean;
  mensagem: string;
  dados: T;
};
