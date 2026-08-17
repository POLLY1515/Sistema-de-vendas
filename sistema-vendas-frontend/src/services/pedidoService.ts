import { apiFetch } from "@/lib/apiFetch";
import type {
  ApiResponse,
  PedidoCriado,
  PedidoRequest,
  PedidoResponseBackend,
} from "@/types/pedido";

function possuiDados<T>(valor: unknown): valor is ApiResponse<T> {
  return typeof valor === "object" && valor !== null && "dados" in valor;
}

function extrairDados<T>(valor: T | ApiResponse<T>): T {
  return possuiDados<T>(valor) ? valor.dados : valor;
}

export async function criarPedido(
  pedido: PedidoRequest
): Promise<PedidoCriado> {
  const resposta = await apiFetch<
    PedidoResponseBackend | ApiResponse<PedidoResponseBackend>
  >("/pedidos", {
    method: "POST",
    body: JSON.stringify(pedido),
  });

  const dados = extrairDados(resposta);

  return {
    id: dados.id,
    nomeCliente: dados.nomeCliente ?? dados.clienteNome ?? "Cliente",
    total: Number(dados.valorTotal ?? dados.total ?? 0),
    status: dados.status ?? "ABERTO",
    dataCriacao: dados.dataCriacao ?? dados.dataPedido,
  };
}
