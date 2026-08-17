import type { ReactNode } from "react";
import { Card } from "@/components/ui/Card";
import { formatarMoeda } from "@/utils/formatters";

type Props = {
  total: number;
  quantidadeItens: number;
  children: ReactNode;
};

export function PedidoResumo({
  total,
  quantidadeItens,
  children,
}: Props) {
  return (
    <Card>
      <div className="space-y-5">
        <div>
          <p className="text-sm text-slate-500">Itens no carrinho</p>
          <p className="text-2xl font-bold text-slate-900">
            {quantidadeItens}
          </p>
        </div>

        <div>
          <p className="text-sm text-slate-500">Total da venda</p>
          <p className="text-3xl font-bold text-emerald-600">
            {formatarMoeda(total)}
          </p>
        </div>

        {children}
      </div>
    </Card>
  );
}
