"use client";

import { useState } from "react";
import { useCarrinhoResumo } from "./useCarrinhoResumo";
import type {
  CarrinhoItem,
  CriarPedidoRequest,
  ProdutoResumo,
} from "../types";

export function useNovoPedido() {
  const [clienteId, setClienteId] = useState("");
  const [produtoId, setProdutoId] = useState("");
  const [quantidade, setQuantidade] = useState("1");
  const [itens, setItens] = useState<CarrinhoItem[]>([]);

  const resumo = useCarrinhoResumo(itens);
  const total = resumo.valorTotal;

  function adicionarProduto(produto: ProdutoResumo) {
    const qtd = Number(quantidade);

    if (!Number.isInteger(qtd) || qtd <= 0) {
      throw new Error(
        "Informe uma quantidade inteira maior que zero."
      );
    }

    if (qtd > produto.quantidadeEstoque) {
      throw new Error(
        `Estoque insuficiente. Disponível: ${produto.quantidadeEstoque}.`
      );
    }

    const itemExistente = itens.find(
      (item) => item.produtoId === produto.id
    );

    if (itemExistente) {
      const novaQuantidade =
        itemExistente.quantidade + qtd;

      if (
        novaQuantidade > produto.quantidadeEstoque
      ) {
        throw new Error(
          `Quantidade total maior que o estoque disponível (${produto.quantidadeEstoque}).`
        );
      }

      setItens((atuais) =>
        atuais.map((item) =>
          item.produtoId === produto.id
            ? {
                ...item,
                quantidade: novaQuantidade,
                subtotal:
                  novaQuantidade * item.precoUnitario,
              }
            : item
        )
      );
    } else {
      setItens((atuais) => [
        ...atuais,
        {
          produtoId: produto.id,
          nomeProduto: produto.nome,
          precoUnitario: Number(produto.preco),
          quantidade: qtd,
          estoqueDisponivel:
            produto.quantidadeEstoque,
          subtotal: qtd * Number(produto.preco),
        },
      ]);
    }

    setProdutoId("");
    setQuantidade("1");
  }

  function removerProduto(
    produtoIdParaRemover: number
  ) {
    setItens((atuais) =>
      atuais.filter(
        (item) =>
          item.produtoId !== produtoIdParaRemover
      )
    );
  }

  function limparPedido() {
    setClienteId("");
    setProdutoId("");
    setQuantidade("1");
    setItens([]);
  }

  function montarRequest(): CriarPedidoRequest {
    if (!clienteId) {
      throw new Error("Selecione um cliente.");
    }

    if (itens.length === 0) {
      throw new Error(
        "Adicione pelo menos um produto."
      );
    }

    return {
      clienteId: Number(clienteId),
      itens: itens.map((item) => ({
        produtoId: item.produtoId,
        quantidade: item.quantidade,
      })),
    };
  }

  return {
    clienteId,
    setClienteId,
    produtoId,
    setProdutoId,
    quantidade,
    setQuantidade,
    itens,
    total,
    resumo,
    adicionarProduto,
    removerProduto,
    limparPedido,
    montarRequest,
  };
}
