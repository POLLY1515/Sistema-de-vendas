"use client";

import type { FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import type { ProdutoRequest } from "../types";

type ProdutoFormProps = {
  form: ProdutoRequest;
  editando: boolean;
  salvando: boolean;
  onChange: (campo: keyof ProdutoRequest, valor: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onCancelEdit: () => void;
};

export function ProdutoForm({
  form,
  editando,
  salvando,
  onChange,
  onSubmit,
  onCancelEdit,
}: ProdutoFormProps) {
  return (
    <Card>
      <div>
        <h2 className="text-lg font-semibold text-slate-900">
          {editando ? "Editar produto" : "Novo produto"}
        </h2>
        <p className="mt-1 text-xs text-slate-500">
          {editando
            ? "Altere os dados e salve as modificações."
            : "Preencha os dados para adicionar um produto ao catálogo."}
        </p>
      </div>

      <form onSubmit={onSubmit} className="mt-4 grid gap-4 md:grid-cols-3">
        <Input
          label="Nome"
          required
          maxLength={120}
          value={form.nome}
          onChange={(event) => onChange("nome", event.target.value)}
          placeholder="Ex.: Teclado mecânico"
        />

        <Input
          label="Preço"
          required
          type="number"
          min="0.01"
          step="0.01"
          value={form.preco}
          onChange={(event) => onChange("preco", event.target.value)}
        />

        <Input
          label="Estoque"
          required
          type="number"
          min="0"
          step="1"
          value={form.quantidadeEstoque}
          onChange={(event) =>
            onChange("quantidadeEstoque", event.target.value)
          }
        />

        <div className="flex flex-wrap gap-2 md:col-span-3">
          <Button type="submit" loading={salvando}>
            {editando ? "Atualizar produto" : "Cadastrar produto"}
          </Button>

          {editando && (
            <Button
              type="button"
              variant="secondary"
              onClick={onCancelEdit}
              disabled={salvando}
            >
              Cancelar edição
            </Button>
          )}
        </div>
      </form>
    </Card>
  );
}
