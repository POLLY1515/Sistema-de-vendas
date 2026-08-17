import { apiFetch } from "@/lib/apiFetch";
import { listarPedidos } from "@/services/pedidoService";
import type { DashboardResumo, StatusResumo } from "@/types/dashboard";
import type { ApiResponse, PedidoResumo } from "@/types/pedido";

type ResumoBackend = {
  quantidadePedidos?: number;
  totalVendido?: number;
  totalPedidos?: number;
  faturamentoTotal?: number;
};

function possuiDados<T>(valor: unknown): valor is ApiResponse<T> {
  return typeof valor === "object" && valor !== null && "dados" in valor;
}

function extrairDados<T>(valor: T | ApiResponse<T>): T {
  return possuiDados<T>(valor) ? valor.dados : valor;
}

function somarPedidos(pedidos: PedidoResumo[]) {
  return pedidos.reduce((total, pedido) => total + Number(pedido.total ?? 0), 0);
}

function agruparPorStatus(pedidos: PedidoResumo[]): StatusResumo[] {
  const mapa = new Map<string, StatusResumo>();

  for (const pedido of pedidos) {
    const status = pedido.status || "ABERTO";
    const atual = mapa.get(status) ?? {
      status,
      quantidade: 0,
      valorTotal: 0,
    };

    atual.quantidade += 1;
    atual.valorTotal += Number(pedido.total ?? 0);
    mapa.set(status, atual);
  }

  return Array.from(mapa.values()).sort((a, b) =>
    a.status.localeCompare(b.status, "pt-BR")
  );
}

function ehHoje(dataIso: string) {
  if (!dataIso) return false;
  const data = new Date(dataIso);
  if (Number.isNaN(data.getTime())) return false;

  const hoje = new Date();
  return (
    data.getFullYear() === hoje.getFullYear() &&
    data.getMonth() === hoje.getMonth() &&
    data.getDate() === hoje.getDate()
  );
}

async function buscarResumoFinanceiro(): Promise<ResumoBackend | null> {
  try {
    const resposta = await apiFetch<ResumoBackend | ApiResponse<ResumoBackend>>(
      "/pedidos/resumo"
    );
    return extrairDados(resposta);
  } catch {
    // Alguns estágios do backend ainda não possuem /pedidos/resumo.
    // Nesse caso, o dashboard calcula os números usando a listagem de pedidos.
    return null;
  }
}

export const dashboardService = {
  async buscarResumo(): Promise<DashboardResumo> {
    const [pagina, resumoFinanceiro] = await Promise.all([
      listarPedidos({ page: 0, size: 1000 }),
      buscarResumoFinanceiro(),
    ]);

    const pedidos = [...pagina.content].sort((a, b) => {
      const dataA = new Date(a.dataCriacao).getTime();
      const dataB = new Date(b.dataCriacao).getTime();
      return (Number.isNaN(dataB) ? 0 : dataB) - (Number.isNaN(dataA) ? 0 : dataA);
    });

    const pedidosNaoCancelados = pedidos.filter(
      (pedido) => pedido.status !== "CANCELADO"
    );

    const faturamentoCalculado = somarPedidos(pedidosNaoCancelados);
    const quantidadeFinanceira =
      resumoFinanceiro?.quantidadePedidos ?? resumoFinanceiro?.totalPedidos;
    const faturamentoFinanceiro =
      resumoFinanceiro?.totalVendido ?? resumoFinanceiro?.faturamentoTotal;

    const faturamentoTotal = Number(
      faturamentoFinanceiro ?? faturamentoCalculado
    );
    const totalPedidos = pagina.totalElements || pedidos.length;
    const baseTicket = quantidadeFinanceira ?? pedidosNaoCancelados.length;
    const ticketMedio = baseTicket > 0 ? faturamentoTotal / baseTicket : 0;

    return {
      faturamentoTotal,
      totalPedidos,
      ticketMedio,
      pedidosEmAberto: pedidos.filter((pedido) => pedido.status === "ABERTO").length,
      vendasHoje: pedidos.filter((pedido) => ehHoje(pedido.dataCriacao)).length,
      resumoPorStatus: agruparPorStatus(pedidos),
      ultimasVendas: pedidos.slice(0, 5).map((pedido) => ({
        id: pedido.id,
        clienteNome: pedido.clienteNome,
        total: pedido.total,
        status: pedido.status,
        dataCriacao: pedido.dataCriacao,
      })),
    };
  },
};
