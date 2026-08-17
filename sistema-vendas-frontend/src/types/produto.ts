export type Produto = {
  id: number;
  nome: string;
  preco: number;
  quantidadeEstoque: number;
};

export type ProdutoRequest = {
  nome: string;
  preco: number;
  quantidadeEstoque: number;
};

export type PageResponse<T> = {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
};

export type ApiResponse<T> = {
  sucesso: boolean;
  mensagem: string;
  dados: T;
};
