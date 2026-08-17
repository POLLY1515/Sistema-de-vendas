import { memo } from "react";
import { Button } from "@/components/ui/Button";
import { DataTable } from "@/components/ui/DataTable";
import { EmptyState } from "@/components/ui/EmptyState";
import type { Cliente } from "../types";

type ClienteTableProps = {
  clientes: Cliente[];
  excluindoId: number | null;
  onEdit: (cliente: Cliente) => void;
  onDelete: (cliente: Cliente) => void;
};

function somenteNumeros(valor: string) {
  return valor.replace(/\D/g, "");
}

function formatarCpf(cpf: string) {
  const numeros =
    somenteNumeros(cpf).slice(0, 11);

  if (numeros.length !== 11) {
    return cpf;
  }

  return numeros.replace(
    /^(\d{3})(\d{3})(\d{3})(\d{2})$/,
    "$1.$2.$3-$4"
  );
}

function formatarTelefone(
  telefone?: string | null
) {
  if (!telefone) return "-";

  const numeros = somenteNumeros(telefone);

  if (numeros.length === 11) {
    return numeros.replace(
      /^(\d{2})(\d{5})(\d{4})$/,
      "($1) $2-$3"
    );
  }

  if (numeros.length === 10) {
    return numeros.replace(
      /^(\d{2})(\d{4})(\d{4})$/,
      "($1) $2-$3"
    );
  }

  return telefone;
}

export const ClienteTable = memo(
  function ClienteTable({
    clientes,
    excluindoId,
    onEdit,
    onDelete,
  }: ClienteTableProps) {
    if (clientes.length === 0) {
      return (
        <EmptyState
          title="Nenhum cliente encontrado"
          description="Cadastre um novo cliente ou ajuste a pesquisa."
        />
      );
    }

    return (
      <DataTable
        data={clientes}
        keyExtractor={(cliente) => cliente.id}
        columns={[
          {
            header: "ID",
            render: (cliente) => `#${cliente.id}`,
          },
          {
            header: "Nome",
            render: (cliente) => (
              <span className="font-medium text-slate-900">
                {cliente.nome}
              </span>
            ),
          },
          {
            header: "E-mail",
            render: (cliente) =>
              cliente.email,
          },
          {
            header: "CPF",
            render: (cliente) =>
              formatarCpf(cliente.cpf),
          },
          {
            header: "Telefone",
            render: (cliente) =>
              formatarTelefone(
                cliente.telefone
              ),
          },
          {
            header: "Ações",
            render: (cliente) => (
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="secondary"
                  onClick={() => onEdit(cliente)}
                  disabled={
                    excluindoId === cliente.id
                  }
                >
                  Editar
                </Button>

                <Button
                  variant="danger"
                  onClick={() => onDelete(cliente)}
                  loading={
                    excluindoId === cliente.id
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
