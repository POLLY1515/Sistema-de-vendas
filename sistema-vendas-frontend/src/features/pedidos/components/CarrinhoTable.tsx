import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { formatarMoeda } from "@/utils/formatters";
import type { CarrinhoItem } from "../types";

type Props = {
  itens: CarrinhoItem[];
  onRemover: (produtoId: number) => void;
};

export function CarrinhoTable({ itens, onRemover }: Props) {
  if (itens.length === 0) {
    return (
      <EmptyState
        title="Carrinho vazio"
        description="Selecione um produto e clique em Adicionar."
      />
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="border-b text-left text-slate-500">
            <th className="py-2">Produto</th>
            <th className="py-2">Qtd.</th>
            <th className="py-2">Unitário</th>
            <th className="py-2">Subtotal</th>
            <th className="py-2 text-right">Ações</th>
          </tr>
        </thead>

        <tbody>
          {itens.map((item) => (
            <tr key={item.produtoId} className="border-b">
              <td className="py-3 font-medium text-slate-900">
                {item.nomeProduto}
              </td>
              <td className="py-3">{item.quantidade}</td>
              <td className="py-3">
                {formatarMoeda(item.precoUnitario)}
              </td>
              <td className="py-3 font-medium">
                {formatarMoeda(item.subtotal)}
              </td>
              <td className="py-3 text-right">
                <Button
                  type="button"
                  variant="danger"
                  onClick={() => onRemover(item.produtoId)}
                >
                  Remover
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
