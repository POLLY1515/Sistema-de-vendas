"use client";

import { useMemo } from "react";
import type { DashboardResumo } from "@/types/dashboard";
import {
  formatarMoeda,
  formatarQuantidade,
} from "@/utils/formatters";

export function useDashboardStats(
  resumo: DashboardResumo | null
) {
  return useMemo(() => {
    if (!resumo) {
      return {
        cards: [],
        vendasHoje: 0,
        resumoPorStatus: [],
        ultimasVendas: [],
      };
    }

    return {
      cards: [
        {
          titulo: "Faturamento total",
          valor: formatarMoeda(
            resumo.faturamentoTotal
          ),
          descricao:
            "Valor consolidado das vendas consideradas no resumo.",
        },
        {
          titulo: "Total de pedidos",
          valor: formatarQuantidade(
            resumo.totalPedidos
          ),
          descricao:
            "Quantidade de pedidos registrados no sistema.",
        },
        {
          titulo: "Ticket médio",
          valor: formatarMoeda(resumo.ticketMedio),
          descricao:
            "Valor médio das vendas consideradas.",
        },
        {
          titulo: "Pedidos em aberto",
          valor: formatarQuantidade(
            resumo.pedidosEmAberto
          ),
          descricao:
            "Pedidos que ainda precisam de acompanhamento.",
        },
      ],
      vendasHoje: resumo.vendasHoje,
      resumoPorStatus: resumo.resumoPorStatus,
      ultimasVendas: resumo.ultimasVendas,
    };
  }, [resumo]);
}
