"use client";

import { useMemo } from "react";
import type { Produto } from "../types";

export function useProdutosFiltrados(
  produtos: Produto[],
  termo: string
) {
  return useMemo(() => {
    const busca = termo.trim().toLowerCase();

    if (!busca) {
      return produtos;
    }

    return produtos.filter((produto) =>
      produto.nome.toLowerCase().includes(busca)
    );
  }, [produtos, termo]);
}
