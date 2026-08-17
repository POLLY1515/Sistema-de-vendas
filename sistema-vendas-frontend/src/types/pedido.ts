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

export type PedidoResponseBackend = {
  id: number;
  clienteId?: number;
  nomeCliente?: string;
  clienteNome?: string;
  dataCriacao?: string;
  dataPedido?: string;
  status?: string;
  valorTotal?: number;
  total?: number;
};

export type PedidoCriado = {
  id: number;
  nomeCliente: string;
  total: number;
  status: string;
  dataCriacao?: string;
};

export type ApiResponse<T> = {
  sucesso: boolean;
  mensagem: string;
  dados: T;
};
