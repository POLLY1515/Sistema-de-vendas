import {
  buscarPedidoPorId,
  listarPedidos,
} from "@/services/pedidoService";
import type { PedidoResumo } from "@/types/pedido";
import type {
  FiltrosRelatorioVendas,
  VendaRelatorio,
} from "@/types/relatorio";

const TAMANHO_PAGINA = 50;
const LIMITE_PAGINAS = 100;

function dataValida(valor: string) {
  if (!valor) return null;
  const data = new Date(valor);
  return Number.isNaN(data.getTime()) ? null : data;
}

function aplicarFiltros(
  pedidos: PedidoResumo[],
  filtros: FiltrosRelatorioVendas
) {
  const inicio = filtros.dataInicio
    ? new Date(`${filtros.dataInicio}T00:00:00`)
    : null;
  const fim = filtros.dataFim
    ? new Date(`${filtros.dataFim}T23:59:59.999`)
    : null;

  return pedidos.filter((pedido) => {
    if (filtros.status && pedido.status !== filtros.status) {
      return false;
    }

    if (inicio || fim) {
      const data = dataValida(pedido.dataCriacao);
      if (!data) return false;
      if (inicio && data < inicio) return false;
      if (fim && data > fim) return false;
    }

    return true;
  });
}

async function buscarTodosPedidos() {
  const primeiraPagina = await listarPedidos({
    page: 0,
    size: TAMANHO_PAGINA,
  });

  const totalPaginas = Math.min(
    Math.max(primeiraPagina.totalPages, 1),
    LIMITE_PAGINAS
  );

  if (totalPaginas <= 1) {
    return primeiraPagina.content;
  }

  const paginasRestantes = await Promise.all(
    Array.from({ length: totalPaginas - 1 }, (_, indice) =>
      listarPedidos({
        page: indice + 1,
        size: TAMANHO_PAGINA,
      })
    )
  );

  const todos = [
    ...primeiraPagina.content,
    ...paginasRestantes.flatMap((pagina) => pagina.content),
  ];

  const unicos = new Map<number, PedidoResumo>();
  for (const pedido of todos) {
    unicos.set(pedido.id, pedido);
  }

  return Array.from(unicos.values());
}

async function quantidadeDeItens(id: number) {
  try {
    const detalhe = await buscarPedidoPorId(id);
    return detalhe.itens.reduce(
      (total, item) => total + Number(item.quantidade ?? 0),
      0
    );
  } catch {
    // O relatorio continua utilizavel mesmo se o backend nao devolver detalhes.
    return 0;
  }
}

export const relatorioService = {
  async buscarVendas(
    filtros: FiltrosRelatorioVendas
  ): Promise<VendaRelatorio[]> {
    const pedidos = aplicarFiltros(await buscarTodosPedidos(), filtros).sort(
      (a, b) => {
        const dataA = dataValida(a.dataCriacao)?.getTime() ?? 0;
        const dataB = dataValida(b.dataCriacao)?.getTime() ?? 0;
        return dataB - dataA;
      }
    );

    return Promise.all(
      pedidos.map(async (pedido) => ({
        id: pedido.id,
        clienteNome: pedido.clienteNome,
        status: pedido.status,
        total: Number(pedido.total ?? 0),
        dataCriacao: pedido.dataCriacao,
        quantidadeItens: await quantidadeDeItens(pedido.id),
      }))
    );
  },
};
