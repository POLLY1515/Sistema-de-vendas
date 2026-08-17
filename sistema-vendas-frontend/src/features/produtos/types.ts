import type { ProdutoRequest } from "@/types/produto";

export type {
  ApiResponse,
  PageResponse,
  Produto,
  ProdutoRequest,
} from "@/types/produto";

export const produtoInicial: ProdutoRequest = {
  nome: "",
  preco: 0,
  quantidadeEstoque: 0,
};
