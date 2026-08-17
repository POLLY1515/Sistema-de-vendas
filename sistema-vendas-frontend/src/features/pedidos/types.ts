import type {
  PageResponse,
  PedidoDetalhe,
  PedidoRequest,
  PedidoResumo,
} from "@/types/pedido";

export type StatusPedido = "ABERTO" | "FINALIZADO" | "CANCELADO";

export type ClienteResumo = {
  id: number;
  nome: string;
  cpf?: string;
  email?: string;
};

export type ProdutoResumo = {
  id: number;
  nome: string;
  preco: number;
  quantidadeEstoque: number;
};

export type CarrinhoItem = {
  produtoId: number;
  nomeProduto: string;
  precoUnitario: number;
  quantidade: number;
  estoqueDisponivel: number;
  subtotal: number;
};

export type CriarPedidoRequest = PedidoRequest;
export type PedidoLista = PedidoResumo;
export type PedidoDetalhes = PedidoDetalhe;
export type PedidoPage = PageResponse<PedidoResumo>;

export type PedidoFiltros = {
  status: string;
  cliente: string;
  dataInicio: string;
  dataFim: string;
};
