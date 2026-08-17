export type StatusPedidoRelatorio =
  | "ABERTO"
  | "FINALIZADO"
  | "CANCELADO";

export type FiltrosRelatorioVendas = {
  dataInicio: string;
  dataFim: string;
  status: "" | StatusPedidoRelatorio;
};

export type VendaRelatorio = {
  id: number;
  clienteNome: string;
  status: string;
  total: number;
  dataCriacao: string;
  quantidadeItens: number;
};

export type ResumoRelatorioVendas = {
  quantidadeVendas: number;
  faturamentoTotal: number;
  ticketMedio: number;
};
