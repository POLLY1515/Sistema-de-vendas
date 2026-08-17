import { apiFetch } from "@/lib/apiFetch";
import type {
  ApiResponse,
  PageResponse,
  PedidoCriado,
  PedidoDetalhe,
  PedidoFiltro,
  PedidoRequest,
  PedidoResponseBackend,
  PedidoResumo,
} from "@/types/pedido";

type PaginaBackend<T> = {
  conteudo?: T[];
  paginaAtual?: number;
  tamanhoPagina?: number;
  totalElementos?: number;
  totalPaginas?: number;
  content?: T[];
  number?: number;
  size?: number;
  totalElements?: number;
  totalPages?: number;
};

function possuiDados<T>(valor: unknown): valor is ApiResponse<T> {
  return typeof valor === "object" && valor !== null && "dados" in valor;
}

function extrairDados<T>(valor: T | ApiResponse<T>): T {
  return possuiDados<T>(valor) ? valor.dados : valor;
}

function ehPagina<T>(valor: unknown): valor is PaginaBackend<T> {
  return (
    typeof valor === "object" &&
    valor !== null &&
    ("content" in valor || "conteudo" in valor)
  );
}

function normalizarResumo(pedido: PedidoResponseBackend): PedidoResumo {
  return {
    id: pedido.id,
    clienteNome: pedido.nomeCliente ?? pedido.clienteNome ?? "Cliente",
    total: Number(pedido.valorTotal ?? pedido.total ?? 0),
    status: pedido.status ?? "ABERTO",
    dataCriacao: pedido.dataCriacao ?? pedido.dataPedido ?? "",
  };
}

function normalizarDetalhe(pedido: PedidoResponseBackend): PedidoDetalhe {
  return {
    id: pedido.id,
    clienteNome: pedido.nomeCliente ?? pedido.clienteNome ?? "Cliente",
    clienteEmail: pedido.clienteEmail,
    total: Number(pedido.valorTotal ?? pedido.total ?? 0),
    status: pedido.status ?? "ABERTO",
    dataCriacao: pedido.dataCriacao ?? pedido.dataPedido ?? "",
    itens: (pedido.itens ?? []).map((item, indice) => ({
      produtoId: item.produtoId ?? indice + 1,
      produtoNome: item.nomeProduto ?? item.produtoNome ?? `Produto ${indice + 1}`,
      quantidade: Number(item.quantidade ?? 0),
      precoUnitario: Number(item.precoUnitario ?? 0),
      subtotal: Number(item.subtotal ?? 0),
    })),
  };
}

function dataDoPedido(valor: string) {
  if (!valor) return null;
  const data = new Date(valor);
  return Number.isNaN(data.getTime()) ? null : data;
}

function filtrarPedidos(pedidos: PedidoResumo[], filtros: PedidoFiltro) {
  const cliente = filtros.cliente?.trim().toLocaleLowerCase("pt-BR") ?? "";
  const inicio = filtros.dataInicio
    ? new Date(`${filtros.dataInicio}T00:00:00`)
    : null;
  const fim = filtros.dataFim
    ? new Date(`${filtros.dataFim}T23:59:59.999`)
    : null;

  return pedidos.filter((pedido) => {
    if (filtros.status && pedido.status !== filtros.status) return false;

    if (
      cliente &&
      !pedido.clienteNome.toLocaleLowerCase("pt-BR").includes(cliente)
    ) {
      return false;
    }

    if (inicio || fim) {
      const data = dataDoPedido(pedido.dataCriacao);
      if (!data) return false;
      if (inicio && data < inicio) return false;
      if (fim && data > fim) return false;
    }

    return true;
  });
}

function montarQueryString(filtros: PedidoFiltro) {
  const page = filtros.page ?? 0;
  const size = filtros.size ?? 10;
  const params = new URLSearchParams();

  // Mantemos os dois formatos para funcionar com as diferentes etapas do backend do curso.
  params.set("page", String(page));
  params.set("size", String(size));
  params.set("pagina", String(page));
  params.set("tamanho", String(size));
  params.set("sort", "dataCriacao,desc");

  if (filtros.status) params.set("status", filtros.status);
  if (filtros.cliente?.trim()) params.set("cliente", filtros.cliente.trim());
  if (filtros.dataInicio) params.set("dataInicio", filtros.dataInicio);
  if (filtros.dataFim) params.set("dataFim", filtros.dataFim);

  return params.toString();
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

export async function listarPedidos(
  filtros: PedidoFiltro = {}
): Promise<PageResponse<PedidoResumo>> {
  const page = filtros.page ?? 0;
  const size = filtros.size ?? 10;
  const query = montarQueryString(filtros);

  const resposta = await apiFetch<
    | PedidoResponseBackend[]
    | PaginaBackend<PedidoResponseBackend>
    | ApiResponse<PedidoResponseBackend[]>
    | ApiResponse<PaginaBackend<PedidoResponseBackend>>
  >(`/pedidos?${query}`);

  const dados = extrairDados(resposta);

  if (Array.isArray(dados)) {
    const normalizados = dados.map(normalizarResumo);
    const filtrados = filtrarPedidos(normalizados, filtros).sort((a, b) => {
      const dataA = dataDoPedido(a.dataCriacao)?.getTime() ?? 0;
      const dataB = dataDoPedido(b.dataCriacao)?.getTime() ?? 0;
      return dataB - dataA;
    });
    const inicio = page * size;

    return {
      content: filtrados.slice(inicio, inicio + size),
      totalElements: filtrados.length,
      totalPages: Math.ceil(filtrados.length / size),
      number: page,
      size,
    };
  }

  if (ehPagina<PedidoResponseBackend>(dados)) {
    const content = (dados.content ?? dados.conteudo ?? []).map(normalizarResumo);

    return {
      content,
      totalElements: dados.totalElements ?? dados.totalElementos ?? content.length,
      totalPages: dados.totalPages ?? dados.totalPaginas ?? (content.length ? 1 : 0),
      number: dados.number ?? dados.paginaAtual ?? page,
      size: dados.size ?? dados.tamanhoPagina ?? size,
    };
  }

  return {
    content: [],
    totalElements: 0,
    totalPages: 0,
    number: page,
    size,
  };
}

export async function buscarPedidoPorId(id: number): Promise<PedidoDetalhe> {
  const resposta = await apiFetch<
    PedidoResponseBackend | ApiResponse<PedidoResponseBackend>
  >(`/pedidos/${id}`);

  return normalizarDetalhe(extrairDados(resposta));
}
