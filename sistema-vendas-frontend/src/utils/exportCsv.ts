import type { VendaRelatorio } from "@/types/relatorio";

function escaparCsv(valor: string | number): string {
  const texto = String(valor ?? "");
  return `"${texto.replace(/"/g, '""')}"`;
}

function formatarDataCsv(dataIso: string): string {
  if (!dataIso) return "";
  const data = new Date(dataIso);
  if (Number.isNaN(data.getTime())) return dataIso;
  return data.toLocaleDateString("pt-BR");
}

function formatarMoedaCsv(valor: number): string {
  return Number(valor ?? 0).toFixed(2).replace(".", ",");
}

export function exportarVendasParaCsv(vendas: VendaRelatorio[]): void {
  const cabecalho = ["ID", "Cliente", "Status", "Data", "Itens", "Total"];
  const linhas = vendas.map((venda) => [
    venda.id,
    venda.clienteNome,
    venda.status,
    formatarDataCsv(venda.dataCriacao),
    venda.quantidadeItens,
    formatarMoedaCsv(venda.total),
  ]);

  const conteudo = [cabecalho, ...linhas]
    .map((linha) => linha.map(escaparCsv).join(";"))
    .join("\r\n");

  // BOM UTF-8 ajuda o Excel no Windows a reconhecer acentos corretamente.
  const blob = new Blob(["\uFEFF", conteudo], {
    type: "text/csv;charset=utf-8;",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = `relatorio-vendas-${new Date()
    .toISOString()
    .slice(0, 10)}.csv`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
