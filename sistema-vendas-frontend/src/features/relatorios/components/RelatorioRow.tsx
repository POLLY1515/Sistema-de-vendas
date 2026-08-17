import { memo } from "react";
import type { VendaRelatorio } from "@/types/relatorio";
import {
  formatarData,
  formatarMoeda,
} from "@/utils/formatters";

type RelatorioRowProps = {
  venda: VendaRelatorio;
};

function statusClasse(status: string) {
  const classes: Record<string, string> = {
    ABERTO:
      "bg-amber-100 text-amber-800",
    FINALIZADO:
      "bg-emerald-100 text-emerald-800",
    CANCELADO:
      "bg-red-100 text-red-800",
  };

  return (
    classes[status] ??
    "bg-slate-100 text-slate-700"
  );
}

export const RelatorioRow = memo(
  function RelatorioRow({
    venda,
  }: RelatorioRowProps) {
    return (
      <tr className="border-b last:border-0">
        <td className="px-3 py-3">
          #{venda.id}
        </td>
        <td className="px-3 py-3">
          {venda.clienteNome}
        </td>
        <td className="px-3 py-3">
          <span
            className={`rounded-full px-2 py-1 text-xs font-semibold ${statusClasse(
              venda.status
            )}`}
          >
            {venda.status}
          </span>
        </td>
        <td className="px-3 py-3">
          {formatarData(venda.dataCriacao)}
        </td>
        <td className="px-3 py-3">
          {venda.quantidadeItens}
        </td>
        <td className="px-3 py-3 text-right font-semibold">
          {formatarMoeda(venda.total)}
        </td>
      </tr>
    );
  }
);
