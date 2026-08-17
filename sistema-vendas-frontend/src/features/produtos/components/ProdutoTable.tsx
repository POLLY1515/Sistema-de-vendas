import { memo } from "react";
import { Button } from "@/components/ui/Button";
import { DataTable } from "@/components/ui/DataTable";
import { EmptyState } from "@/components/ui/EmptyState";
import { formatarMoeda } from "@/utils/formatters";
import type { Produto } from "../types";

type ProdutoTableProps = {
  produtos: Produto[];
  excluindoId: number | null;
  onEdit: (produto: Produto) => void;
  onDelete: (produto: Produto) => void;
};

function estoqueBadge(quantidade: number) {
  const classe =
    quantidade === 0
      ? "bg-red-50 text-red-700"
      : quantidade <= 5
        ? "bg-amber-50 text-amber-700"
        : "bg-emerald-50 text-emerald-700";

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${classe}`}
    >
      {quantidade}
    </span>
  );
}

export const ProdutoTable = memo(
  function ProdutoTable({
    produtos,
    excluindoId,
    onEdit,
    onDelete,
  }: ProdutoTableProps) {
    if (produtos.length === 0) {
      return (
        <EmptyState
          title="Nenhum produto encontrado"
          description="Cadastre um novo produto ou ajuste a pesquisa."
        />
      );
    }

    return (
      <DataTable
        data={produtos}
        keyExtractor={(produto) => produto.id}
        columns={[
          {
            header: "ID",
            render: (produto) => `#${produto.id}`,
          },
          {
            header: "Nome",
            render: (produto) => (
              <span className="font-medium text-slate-900">
                {produto.nome}
              </span>
            ),
          },
          {
            header: "Preço",
            render: (produto) =>
              formatarMoeda(produto.preco),
          },
          {
            header: "Estoque",
            render: (produto) =>
              estoqueBadge(
                produto.quantidadeEstoque
              ),
          },
          {
            header: "Ações",
            render: (produto) => (
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="secondary"
                  onClick={() => onEdit(produto)}
                  disabled={
                    excluindoId === produto.id
                  }
                >
                  Editar
                </Button>

                <Button
                  variant="danger"
                  onClick={() => onDelete(produto)}
                  loading={
                    excluindoId === produto.id
                  }
                >
                  Excluir
                </Button>
              </div>
            ),
          },
        ]}
      />
    );
  }
);
