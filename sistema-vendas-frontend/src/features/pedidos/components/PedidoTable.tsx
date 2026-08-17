import { Button } from "@/components/ui/Button";
import { DataTable } from "@/components/ui/DataTable";
import { EmptyState } from "@/components/ui/EmptyState";
import { formatarData, formatarMoeda } from "@/utils/formatters";
import type { PedidoLista } from "../types";

type Props = {
  pedidos: PedidoLista[];
  cancelandoId?: number | null;
  onVerDetalhes: (pedido: PedidoLista) => void;
  onCancelar: (pedido: PedidoLista) => void;
};

function statusClasse(status: string) {
  const classes: Record<string, string> = {
    ABERTO: "bg-amber-50 text-amber-700",
    FINALIZADO: "bg-emerald-50 text-emerald-700",
    CANCELADO: "bg-red-50 text-red-700",
  };

  return classes[status] ?? "bg-slate-100 text-slate-700";
}

export function PedidoTable({
  pedidos,
  cancelandoId = null,
  onVerDetalhes,
  onCancelar,
}: Props) {
  if (pedidos.length === 0) {
    return (
      <EmptyState
        title="Nenhum pedido encontrado"
        description="Crie uma venda ou altere os filtros da consulta."
      />
    );
  }

  return (
    <DataTable
      data={pedidos}
      keyExtractor={(pedido) => pedido.id}
      columns={[
        {
          header: "Código",
          render: (pedido) => `#${pedido.id}`,
        },
        {
          header: "Cliente",
          render: (pedido) => (
            <span className="font-medium text-slate-900">
              {pedido.clienteNome}
            </span>
          ),
        },
        {
          header: "Status",
          render: (pedido) => (
            <span
              className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${statusClasse(
                pedido.status
              )}`}
            >
              {pedido.status}
            </span>
          ),
        },
        {
          header: "Total",
          render: (pedido) => formatarMoeda(pedido.total),
        },
        {
          header: "Data",
          render: (pedido) => formatarData(pedido.dataCriacao),
        },
        {
          header: "Ações",
          render: (pedido) => (
            <div className="flex flex-wrap justify-end gap-2">
              <Button
                type="button"
                variant="secondary"
                onClick={() => onVerDetalhes(pedido)}
              >
                Detalhes
              </Button>

              {pedido.status !== "CANCELADO" && (
                <Button
                  type="button"
                  variant="danger"
                  loading={cancelandoId === pedido.id}
                  onClick={() => onCancelar(pedido)}
                >
                  Cancelar
                </Button>
              )}
            </div>
          ),
          className: "text-right",
        },
      ]}
    />
  );
}
