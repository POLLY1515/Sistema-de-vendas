import { obterMensagemErro } from "@/lib/apiError";
import {
  atualizarProduto as atualizarProdutoBase,
  criarProduto as criarProdutoBase,
  excluirProduto as excluirProdutoBase,
  listarProdutos as listarProdutosBase,
} from "@/services/produtoService";
import type { ProdutoRequest } from "../types";

export async function buscarProdutos(
  pagina: number,
  tamanho: number,
  busca: string
) {
  try {
    return await listarProdutosBase(pagina, tamanho, busca);
  } catch (error) {
    throw new Error(
      obterMensagemErro(
        error,
        "Não foi possível carregar os produtos."
      )
    );
  }
}

export async function criarProduto(data: ProdutoRequest) {
  try {
    return await criarProdutoBase(data);
  } catch (error) {
    throw new Error(
      obterMensagemErro(
        error,
        "Não foi possível cadastrar o produto."
      )
    );
  }
}

export async function atualizarProduto(
  id: number,
  data: ProdutoRequest
) {
  try {
    return await atualizarProdutoBase(id, data);
  } catch (error) {
    throw new Error(
      obterMensagemErro(
        error,
        "Não foi possível atualizar o produto."
      )
    );
  }
}

export async function excluirProduto(id: number) {
  try {
    return await excluirProdutoBase(id);
  } catch (error) {
    throw new Error(
      obterMensagemErro(
        error,
        "Não foi possível excluir o produto."
      )
    );
  }
}
