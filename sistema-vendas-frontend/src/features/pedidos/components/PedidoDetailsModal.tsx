import { Button } from "@/components/ui/Button";
import { formatarMoeda } from "@/utils/formatters";
import type { PedidoDetalhes } from "../types";

type Props = {
  pedido: PedidoDetalhes | null;
  loading?: boolean;
  onClose: () => void;
};

function formatarDataHora(dataIso: string) {
  if (!dataIso) return "-";

  const data = new Date(dataIso);

  return Number.isNaN(data.getTime())
    ? dataIso
    : data.toLocaleString("pt-BR");
}

export function PedidoDetailsModal({
  pedido,
  loading = false,
  onClose,
}: Props) {
  if (!pedido) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
      <div
        role="dialog"
        aria-modal="true"
        className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl"
      >
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Pedido #{pedido.id}
            </h2>
            <p className="text-sm text-slate-500">
              Cliente: {pedido.clienteNome}
              {pedido.clienteEmail
                ? ` - ${pedido.clienteEmail}`
                : ""}
            </p>
          </div>

          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={loading}
          >
            Fechar
          </Button>
        </div>

        <div className="mb-5 grid gap-3 md:grid-cols-3">
          <div className="rounded-xl bg-slate-50 p-3">
            <p className="text-xs text-slate-500">Status</p>
            <p className="font-semibold">{pedido.status}</p>
          </div>

          <div className="rounded-xl bg-slate-50 p-3">
            <p className="text-xs text-slate-500">Total</p>
            <p className="font-semibold">
              {formatarMoeda(pedido.total)}
            </p>
          </div>

          <div className="rounded-xl bg-slate-50 p-3">
            <p className="text-xs text-slate-500">Data</p>
            <p className="font-semibold">
              {formatarDataHora(pedido.dataCriacao)}
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="border-b text-left text-slate-500">
              <tr>
                <th className="py-2">Produto</th>
                <th className="py-2">Qtd.</th>
                <th className="py-2">Unitário</th>
                <th className="py-2">Subtotal</th>
              </tr>
            </thead>

            <tbody>
              {pedido.itens.map((item, indice) => (
                <tr
                  key={`${item.produtoId}-${indice}`}
                  className="border-b"
                >
                  <td className="py-3">{item.produtoNome}</td>
                  <td className="py-3">{item.quantidade}</td>
                  <td className="py-3">
                    {formatarMoeda(item.precoUnitario)}
                  </td>
                  <td className="py-3">
                    {formatarMoeda(item.subtotal)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {pedido.itens.length === 0 && (
            <p className="py-6 text-center text-sm text-slate-500">
              O backend não retornou itens para este pedido.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
