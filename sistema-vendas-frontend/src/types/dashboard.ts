export type StatusResumo = {
  status: string;
  quantidade: number;
  valorTotal: number;
};

export type UltimaVenda = {
  id: number;
  clienteNome: string;
  total: number;
  status: string;
  dataCriacao: string;
};

export type DashboardResumo = {
  faturamentoTotal: number;
  totalPedidos: number;
  ticketMedio: number;
  pedidosEmAberto: number;
  vendasHoje: number;
  resumoPorStatus: StatusResumo[];
  ultimasVendas: UltimaVenda[];
};
