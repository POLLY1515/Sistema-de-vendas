"use client";

import { useMemo } from "react";
import type { CarrinhoItem } from "../types";

export function useCarrinhoResumo(
  itens: CarrinhoItem[]
) {
  return useMemo(() => {
    const quantidadeProdutos = itens.length;
    const quantidadeUnidades = itens.reduce(
      (total, item) => total + item.quantidade,
      0
    );
    const valorTotal = itens.reduce(
      (total, item) => total + item.subtotal,
      0
    );

    return {
      quantidadeProdutos,
      quantidadeUnidades,
      valorTotal,
    };
  }, [itens]);
}
