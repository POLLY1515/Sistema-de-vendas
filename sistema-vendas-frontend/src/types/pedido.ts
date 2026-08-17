export type ItemCarrinho = {
  produtoId: number;
  nomeProduto: string;
  precoUnitario: number;
  quantidade: number;
  estoqueDisponivel: number;
};

export type PedidoItemRequest = {
  produtoId: number;
  quantidade: number;
};

export type PedidoRequest = {
  clienteId: number;
  itens: PedidoItemRequest[];
};

export type ItemPedidoBackend = {
  produtoId?: number;
  nomeProduto?: string;
  produtoNome?: string;
  quantidade: number;
  precoUnitario: number;
  subtotal: number;
};

export type PedidoResponseBackend = {
  id: number;
  clienteId?: number;
  nomeCliente?: string;
  clienteNome?: string;
  clienteEmail?: string;
  dataCriacao?: string;
  dataPedido?: string;
  status?: string;
  valorTotal?: number;
  total?: number;
  itens?: ItemPedidoBackend[];
};

export type PedidoCriado = {
  id: number;
  nomeCliente: string;
  total: number;
  status: string;
  dataCriacao?: string;
};

export type PedidoFiltro = {
  status?: string;
  cliente?: string;
  dataInicio?: string;
  dataFim?: string;
  page?: number;
  size?: number;
};

export type PedidoResumo = {
  id: number;
  clienteNome: string;
  total: number;
  status: string;
  dataCriacao: string;
};

export type ItemPedidoDetalhe = {
  produtoId: number;
  produtoNome: string;
  quantidade: number;
  precoUnitario: number;
  subtotal: number;
};

export type PedidoDetalhe = {
  id: number;
  clienteNome: string;
  clienteEmail?: string;
  total: number;
  status: string;
  dataCriacao: string;
  itens: ItemPedidoDetalhe[];
};

export type PageResponse<T> = {
  content: T[];
  totalPages: number;
  totalElements: number;
  number: number;
  size: number;
};

export type ApiResponse<T> = {
  sucesso: boolean;
  mensagem: string;
  dados: T;
};
