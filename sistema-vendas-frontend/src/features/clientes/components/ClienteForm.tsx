"use client";

import type { FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import type { ClienteRequest } from "../types";

type ClienteFormProps = {
  form: ClienteRequest;
  editando: boolean;
  salvando: boolean;
  onChange: (campo: keyof ClienteRequest, valor: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onCancelEdit: () => void;
};

export function ClienteForm({
  form,
  editando,
  salvando,
  onChange,
  onSubmit,
  onCancelEdit,
}: ClienteFormProps) {
  return (
    <Card>
      <div>
        <h2 className="text-lg font-semibold text-slate-900">
          {editando ? "Editar cliente" : "Novo cliente"}
        </h2>
        <p className="mt-1 text-xs text-slate-500">
          {editando
            ? "Altere os dados e salve as modificações."
            : "Preencha os dados para adicionar um cliente."}
        </p>
      </div>

      <form onSubmit={onSubmit} className="mt-4 grid gap-4 md:grid-cols-2">
        <Input
          label="Nome"
          required
          maxLength={120}
          value={form.nome}
          onChange={(event) => onChange("nome", event.target.value)}
          placeholder="Ex.: Maria da Silva"
        />

        <Input
          label="E-mail"
          required
          type="email"
          maxLength={150}
          value={form.email}
          onChange={(event) => onChange("email", event.target.value)}
          placeholder="maria@email.com"
        />

        <Input
          label="CPF"
          required
          inputMode="numeric"
          maxLength={11}
          value={form.cpf}
          onChange={(event) => onChange("cpf", event.target.value)}
          placeholder="Somente 11 números"
        />

        <Input
          label="Telefone"
          inputMode="tel"
          maxLength={11}
          value={form.telefone}
          onChange={(event) => onChange("telefone", event.target.value)}
          placeholder="DDD + número"
        />

        <div className="flex flex-wrap gap-2 md:col-span-2">
          <Button type="submit" loading={salvando}>
            {editando ? "Atualizar cliente" : "Cadastrar cliente"}
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
