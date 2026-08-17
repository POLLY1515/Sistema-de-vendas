import { apiFetch } from "@/lib/apiFetch";
import {
  buscarPedidoPorId as buscarPedidoPorIdBase,
  criarPedido as criarPedidoBase,
  listarPedidos as listarPedidosBase,
} from "@/services/pedidoService";
import type {
  CriarPedidoRequest,
  PedidoDetalhes,
  PedidoFiltros,
  PedidoPage,
} from "../types";

export async function criarPedido(data: CriarPedidoRequest) {
  return criarPedidoBase(data);
}

export async function buscarPedidos(params: {
  page: number;
  filtros: PedidoFiltros;
}): Promise<PedidoPage> {
  return listarPedidosBase({
    page: params.page,
    size: 10,
    status: params.filtros.status,
    cliente: params.filtros.cliente,
    dataInicio: params.filtros.dataInicio,
    dataFim: params.filtros.dataFim,
  });
}

export async function buscarPedidoPorId(
  id: number
): Promise<PedidoDetalhes> {
  return buscarPedidoPorIdBase(id);
}

export async function cancelarPedido(id: number): Promise<void> {
  await apiFetch<unknown>(`/pedidos/${id}/cancelar`, {
    method: "PATCH",
  });
}
